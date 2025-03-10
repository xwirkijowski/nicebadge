import Fastify, {FastifyRequest} from "fastify";
import FastifyAutoload from "@fastify/autoload";
import FastifyHelmet from "@fastify/helmet";

import { globalLogger as log } from "@/utils/log";

import {v4 as uuid} from "uuid";

import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

declare module 'fastify' {
	interface FastifyReply {
		sendJSON: (req: FastifyRequest['id'], payload: object) => void
	}
}

import config from "@/config";

import NiceBadge from "@/nicebadge";

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

/**
server.addHook('onRequest', (req, res, done) => {
	log.request(req.id,req.url)
	
	done();
})
*/

server.addHook('onResponse', (req, res, done) => {
	log.response(req.id, res.statusCode, `${(res.elapsedTime / 100).toFixed(2)} ms`, req.url)
	
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

// Autoloader for plugins
server.register(FastifyAutoload, {
	dir: join(__dirname, 'plugins')
})

// Autoloader for routes
server.register(FastifyAutoload, {
	dir: join(__dirname, 'routes')
})

// Root endpoint
server.get('/', async (req, res) => {
	res.sendJSON(req.id, {'message': 'Hello World!'});
})

server.listen(({
	port: config.PORT as number,
}), (err, addr) => {
	if (err) { // Exit on error
		log.fatal('Unexpected error while starting fastify server, shutting down...', err);
		process.exit(1);
	}
	
	NiceBadge.setStartup(new Date());
	log.success(`NiceBadge instance listening on port ${config.PORT} (${addr})!`);
})