import * as path from "path";
import * as express from "express";

import { app } from "../app";

export const router = express.Router();

router.get("/", (request: express.Request, response: express.Response, next: express.NextFunction) => {
	response.sendFile(path.join(app.get("publicPath"), "index.html"));
});