import {FastifyInstance, RouteOptions, RouteShorthandOptions} from "fastify";

import {globalLogger as log} from "@/utils/log";
import {handleRoute} from "@/controllers/staticGeneration.controller";

const routerConfig: RouteShorthandOptions = {
	helmet: {
		crossOriginResourcePolicy: {policy: "cross-origin"},
	}
};

async function routes (fastify: FastifyInstance) {
	interface IQuerystring {
		icon?: string;
		iconSVG?: string;
		iconColor?: string;
		label?: string;
		labelColor?: string;
		labelBg?: string;
		msg?: string;
		msgColor?: string;
		msgBg?: string;
		font?: string;
		size?: string;
	}
	
	interface IParams {
		label: string;
		labelColor?: string;
		labelBg?: string;
		msg?: string;
		msgColor?: string;
		msgBg?: string;
	}
	
	log.info('Loaded badge routes.')
	
	/**
	 * Builds fully customizable badges based on query parameters
	 */
	fastify.get<{
		Querystring: IQuerystring,
	}>('/', routerConfig, async (req, res): Promise<any> => handleRoute(req, res));

	/**
	 * Builds basic badges with only text, background color options
	 */
	fastify.get<{Params: IParams;}>('/:label/:msg?', routerConfig, async (req, res) => handleRoute(req, res));
	fastify.get<{Params: IParams;}>('/:label/:msg/:msgBg/:labelBg?', routerConfig, async (req, res) => handleRoute(req, res));
}

export default routes;