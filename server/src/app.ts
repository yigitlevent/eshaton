import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

import { router as IndexRouter } from "./routes/index";
import { router as UserRouter } from "./routes/user";
import { router as CharacterRouter } from "./routes/char";
import { router as CampaignRouter } from "./routes/camp";
import { router as DiceRouter } from "./routes/dice";

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
