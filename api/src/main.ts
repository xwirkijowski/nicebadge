import express, {NextFunction, Request, Response} from "express";

import {router as badge} from '@/routes/badge';
import RequestExtender from "@/middleware/requestExtender";
import ResponseExtender from "@/middleware/responseExtender";

const config = {
	port: 3000,
}

// Create the server instance
const app = express();

app.use(RequestExtender);
app.use(ResponseExtender);

// Default route
app.get("/", (req: Request, res: Response) => {
	res.status(200).jsonFull({'message': 'Hello World!'});
})

app.use(badge); // Apply badge router

// Start the server
app.listen(config.port, function () {
	console.log(`App listening on port ${config.port}`);
});