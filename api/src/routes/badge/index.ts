import express, {NextFunction, Request, Response} from "express";

import {Badge} from "@/controllers/badge/badge.class";

const router = express.Router({
	caseSensitive: false,
	strict: true
});

router.get('/', function (req: Request, res: Response) {
	const badge = new Badge(req.query);
	
	console.log(req.query)
	
	res.status(200)
		.setHeader("Content-Type", "image/svg+xml")
		.send(badge.toSVG());
})

export {router};