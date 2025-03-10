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
	
	fastify.get<{
		Querystring: IQuerystring,
	}>('', async (req, res): Promise<any> => {
		const query = req.query;
		const badge = new Badge(query)
		return res.code(200).type("image/svg+xml").send(badge.toSVG());
	})
}

export default routes;