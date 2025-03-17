import {FastifyReply, FastifyRequest} from "fastify";
import {Badge} from "@/providers/badge/badge.class";
import {globalLogger as log} from "@/utils/log";

export async function handleRoute (req: FastifyRequest, res: FastifyReply, source: 'params'|'query' = 'params'): Promise<void> {
	try {
		const badge = new Badge(req[source]);
		const badgeMaterialized: string|null = await badge.materialize();
		
		if (!badgeMaterialized) {
			res.code(500).json({'message': "Unexpected error occurred during rendering"});
		}
		
		res.code(200).type("image/svg+xml").send(badgeMaterialized);
	} catch (e) {
		log.error('Something went wrong', e);
		
		// @todo: res
	}
}