import Fastify, {FastifyRequest} from "fastify";
import FastifyAutoload from "@fastify/autoload";

import {v4 as uuid} from "uuid";

import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const config = {
	port: 3000,
}

declare module 'fastify' {
	interface FastifyReply {
		sendJSON: (req: FastifyRequest['id'], payload: object) => void
	}
}

import NiceBadge from "@/nicebadge";
import FontList from "./assets/fonts";
import IconList from "./assets/icons";

NiceBadge.setupFonts(FontList);
NiceBadge.applyIcons(IconList);

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

// Autoloader for routes
server.register(FastifyAutoload, {
	dir: join(__dirname, 'routes')
})

// Autoloader for plugins
server.register(FastifyAutoload, {
	dir: join(__dirname, 'plugins')
})

server.addHook('onRequest', (req, res, done) => {
	console.log(`[${new Date().toISOString()}] [>] ${req.id} ${req.url}`)
	
	done();
})

server.addHook('onResponse', (req, res, done) => {
	console.log(`[${new Date().toISOString()}] [<] ${req.id} ${req.url}`)
	
	done();
})

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

// Root endpoint
server.get('/', async (req, res) => {
	res.sendJSON(req.id, {'message': 'Hello World!'});
})

server.listen(({
	port: config.port,
}), (err, addr) => {
	if (err) { // Exit on error
		console.error('Failed to start server!', err);
		process.exit(1);
	}
	
	NiceBadge.setStartup(new Date());
	console.log(`App listening on port ${config.port} (${addr})!`);
})