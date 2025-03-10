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
		icon: string;
		iconColor?: string;
		labelBg?: string;
	}
	
	log.info('Loaded icon routes.');
	
	/**
	 * Builds label-only badge
	 */
	
	fastify.get<{Params: IParams;}>('/:icon', routerConfig, async (req, res) => handleRoute(req, res));
	fastify.get<{Params: IParams;}>('/:icon/:labelBg/:iconColor?', routerConfig, async (req, res) => handleRoute(req, res));
}

export default routes;