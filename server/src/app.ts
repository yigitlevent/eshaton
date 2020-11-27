import path from "path";
import express from "express";
import cors from "cors";

import { router as IndexRouter } from "./routes/index";
import { router as UserRouter } from "./routes/user";

export const DATABASE_URL = process.env.DATABASE_URL || "   "; //TODO
export const PORT = process.env.PORT || 3000;
export const SECRET_KEY = process.env.SECRET_KEY || "test_secret_key";

export const app: express.Application = express();

app.set("publicPath", path.join(__dirname, "../../client/build"));

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(app.get("publicPath")));

app.use("/", IndexRouter);
app.use("/user", UserRouter);