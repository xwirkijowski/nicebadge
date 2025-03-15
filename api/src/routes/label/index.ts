import {FastifyInstance, RouteOptions, RouteShorthandOptions} from "fastify";

import {globalLogger as log} from "@/utils/log";
import {handleRoute} from "@/controllers/staticGeneration.controller";

const routerConfig: RouteShorthandOptions = {
	helmet: {
		crossOriginResourcePolicy: {policy: "cross-origin"},
	}
};

async function routes (fastify: FastifyInstance) {
	interface IParams {
		label: string;
		labelColor?: string;
		labelBg?: string;
	}
	
	log.info('Loaded label routes.');
	
	/**
	 * Builds label-only badge
	 */
	fastify.get<{Params: IParams;}>('/:label', routerConfig, async (req, res) => handleRoute(req, res));
	fastify.get<{Params: IParams;}>('/:label/:labelBg', routerConfig, async (req, res) => handleRoute(req, res));
	fastify.get<{Params: IParams;}>('/:label/:labelBg/:labelColor', routerConfig, async (req, res) => handleRoute(req, res));
}

export default routes;