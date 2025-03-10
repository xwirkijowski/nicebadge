import {FastifyReply, FastifyRequest} from "fastify";
import {Badge} from "@/badge/badge.class";
import {globalLogger as log} from "@/utils/log";

export async function handleRoute (req: FastifyRequest, res: FastifyReply, withIcon: boolean = true): Promise<void> {
	try {
		const badge = new Badge(req.params);
		
		if (withIcon) {
			await badge.resolveIcon();
		}
		
		res.code(200).type("image/svg+xml").send(badge.toSVG())
	} catch (e) {
		log.error('Something went wrong', e);
	}
}