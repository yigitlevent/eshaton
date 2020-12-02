import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import { router as IndexRouter } from "./routes/index";
import { router as UserRouter } from "./routes/user";
import { router as CharacterRouter } from "./routes/char";
import { router as CampaignRouter } from "./routes/camp";
import { router as DiceRouter } from "./routes/dice";

export const PRODUCTION = (process.env.ENV as string === "production") || false;
export const PORT = normalizePort(process.env.PORT) || normalizePort(3000);
export const DATABASE_URL = (process.env.DATABASE_URL as string) || "postgresql://testuser:testpassword@localhost:5432/eshaton_test";
export const SECRET_KEY = (process.env.SECRET_KEY as string) || "test_secret_key";
export const DISCORD_API_TOKEN = (process.env.DISCORD_API_TOKEN as string) || "lmao";

export const app: express.Application = express();

app.set("publicPath", path.join(__dirname, "../../client/build"));

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(app.get("publicPath")));

app.use("/", IndexRouter);
app.use("/user", UserRouter);
app.use("/char", CharacterRouter);
app.use("/camp", CampaignRouter);
app.use("/dice", DiceRouter);

function normalizePort(val: any): number | boolean {
	const port = parseInt(val, 10);
	if (isNaN(port)) { return val; }
	if (port >= 0) { return port; }
	return false;
}