import {FastifyReply, FastifyRequest} from "fastify";
import {Badge} from "@/providers/badge/badge.class";
import {globalLogger as log} from "@/utils/log";

export async function handleRoute (req: FastifyRequest, res: FastifyReply, source: 'params'|'query' = 'params'): Promise<void> {
	try {
		const badge = new Badge(req[source]);
		
		res.code(200).type("image/svg+xml").send(await badge.materialize())
	} catch (e) {
		log.error('Something went wrong', e);
	}
}