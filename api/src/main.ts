import express, {NextFunction, Request, Response} from "express";

import {router as badge} from '@/routes/badge';
import {router as health} from '@/routes/health';
import RequestExtender from "@/middleware/requestExtender";
import ResponseExtender from "@/middleware/responseExtender";

const config = {
	port: 3000,
}

export const statistics = {
	requests: 0,
}

export type TContext = {
	startup?: Date,
	statistics: object
}

export const context: TContext = {
	startup: undefined,
	statistics
}

import NiceBadge from "@/nicebadge";

import FontList from "./assets/fonts";
import IconList from "./assets/icons";

NiceBadge.setupFonts(FontList);
NiceBadge.applyIcons(IconList);

// Create the server instance
const app = express();

app.use(RequestExtender);
app.use(ResponseExtender);

// Default route
app.get("/", (req: Request, res: Response) => {
	res.status(200).jsonFull({'message': 'Hello World!'});
})

app.use("/badge", badge); // Apply badge router
app.use("/health", health); // Apply badge router

// Start the server
app.listen(config.port, function () {
	context.startup = new Date();
	console.log(`App listening on port ${config.port}`);
});