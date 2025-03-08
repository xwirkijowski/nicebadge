import express, {NextFunction, Request, Response} from "express";
import {context} from "@/main";

const router = express.Router({
	caseSensitive: false,
	strict: true
});

router.get('/', function (req: Request, res: Response) {
	res.status(200).jsonFull(
		process.memoryUsage()
	)
})

router.get('/statistics', function (req: Request, res: Response) {
	res.status(200).jsonFull(context);
})

export {router};