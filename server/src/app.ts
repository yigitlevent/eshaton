import path from "path";
import express from "express";
import cors from "cors";

import { router as IndexRouter } from "./routes/index";
import { router as UserRouter } from "./routes/user";

import { connect } from "./middleware/database";

export const app: express.Application = express();

app.set("publicPath", path.join(__dirname, "../../client/build"));

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(app.get("publicPath")));

app.use("/", IndexRouter);
app.use("/user", UserRouter);

declare global {
	namespace Express {
		interface Response {
			rowCount: number;
			rows: any[];
		}
		interface Request {
			decoded: any;
		}
	}
}