import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";
import {v4 as uuid} from "uuid";
import Fastify, {FastifyRequest} from "fastify";
import FastifyAutoload from "@fastify/autoload";
import FastifyHelmet from "@fastify/helmet";
import config, {configPerformance, configTimeStamp} from "@/config";
import NiceBadge from "@/nicebadge";
import { globalLogger as log } from "@/utils/log";

declare module 'fastify' {
	interface FastifyReply {
		sendJSON: (req: FastifyRequest['id'], payload: object) => void
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

server.addHook('onResponse', (req, res, done) => {
	log.response(req.id, res.statusCode, `${(res.elapsedTime / 100).toFixed(2)} ms`, req.url);
	
	done();
})

// @todo: Switch to hook
server.decorateReply("sendJSON", function (requestId: FastifyRequest['id'], payload: object) {
	this.status(200);
	this.type("application/json");
	this.send({
		status: this.statusCode,
		data: payload,
		metadata: {
			requestId,
		}
	});
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
server.get('/', async (req, res) => {
	res.sendJSON(req.id, {'message': 'Hello World!'});
})

NiceBadge.registerIconProviders();

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