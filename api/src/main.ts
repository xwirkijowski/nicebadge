import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";
import {v4 as uuid} from "uuid";
import Fastify from "fastify";
import FastifyAutoload from "@fastify/autoload";
import FastifyHelmet from "@fastify/helmet";
import config, {configPerformance, configTimeStamp} from "@/config";
import NiceBadge from "@/nicebadge";
import { globalLogger as log } from "@/utils/log";

declare module 'fastify' {
	interface FastifyReply {
		json: (payload: object) => void
	}
}

const server = Fastify({
	// http2: true,
	ignoreTrailingSlash: true,
	ignoreDuplicateSlashes: true,
	maxParamLength: 64,
	requestIdHeader: false,
	genReqId: (_): string => uuid(),
	logger: false, // @todo: Implement custom logger
});

const __dirname: string = dirname(fileURLToPath(import.meta.url));

// Helmet.js plugin
server.register(FastifyHelmet, {
	global: true,
})

server.addHook('onSend', function (req, res, payload, done) {
	const type = res.getHeader("Content-Type") as string;
	
	// @todo: Replace with a more efficient solution, maybe go back to decorate
	if (type.includes('application/json')) {
		const newPayload = {
			status: res.statusCode,
			data: JSON.parse(payload as string),
			metadata: {
				requestId: req.id
			}
		}
		done(null, JSON.stringify(newPayload));
	}
	done()
});

server.addHook('onRequest', (req, _, done) => {
	log.request(req.id, req.url);
	done();
})

server.addHook('onResponse', (req, res, done) => {
	log.response(req.id, res.statusCode, `${(res.elapsedTime / 100).toFixed(2)} ms`);
	done();
})

// @todo: Switch to hook
server.decorateReply("json", function (payload: object) {
	this.type("application/json");
	this.send(payload);
})

// Autoloader for plugins
/**
server.register(FastifyAutoload, {
	dir: join(__dirname, 'plugins')
})
**/

// Autoloader for routes
server.register(FastifyAutoload, {
	dir: join(__dirname, 'routes')
})

// Root endpoint
server.get('/', async (_, res): Promise<void> => {
	res.status(200).json({'message': 'Hello World!'});
})

await NiceBadge.registerIconProviders();

server.listen(({
	port: config.PORT as number,
}), (err, addr) => {
	if (err) { // Exit on error
		log.fatal('Unexpected error while starting fastify server, shutting down...', err);
		process.exit(1);
	}
	
	NiceBadge.setStartTimestamp(configTimeStamp);
	NiceBadge.setListenTimestamp(new Date());
	log.success(`NiceBadge instance listening on port ${config.PORT} (${addr})! Started in ${(performance.now() - configPerformance).toFixed(2)} ms.`);
});