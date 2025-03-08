import {NextFunction, Request, Response} from "express";
import {ulid} from "ulid";

export default function (req: Request, _: Response, next: NextFunction): void {
	req.requestId = ulid();
	req.timestamp = new Date();
	
	next();
};