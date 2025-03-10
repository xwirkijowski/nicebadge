import { globalLogger as log } from "@/utils/log";

import {Badge} from "@/badge/badge.class";
import {FastifyInstance, RouteOptions} from "fastify";

async function routes (fastify: FastifyInstance, options: RouteOptions) {
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
	
	log.info('Loaded badge routes.')
	
	fastify.get<{
		Querystring: IQuerystring,
	}>('/', {
		helmet: {
			crossOriginResourcePolicy: {policy: "cross-origin"},
		}
	}, async (req, res): Promise<any> => {
		const query = req.query;
		const badge = new Badge(query)
		await badge.resolveIcon();
		
		return res.code(200).type("image/svg+xml").send(badge.toSVG());
	})
}

export default routes;