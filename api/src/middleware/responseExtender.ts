import {NextFunction, Request, Response} from "express";

export default function ResponseExtender (req: Request, res: Response, next: NextFunction) {
	res.jsonFull = (data: object): Response => res.json({
		status: res.statusCode,
		data,
		meta: {
			requestId: req.requestId,
			timestamp: req.timestamp.toJSON(),
		},
	});
	
	next();
}