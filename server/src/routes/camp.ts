import express from "express";
import { check, ValidationError, Result, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { getDateTime } from "../shared/datetime";
import { pool } from "../bin/www";

export const router = express.Router();

router.post("/new",
	[
		check("c_name", "Character name cannot be empty. ").trim().escape().not().isEmpty(),
		check("c_secretkey", "Please get a valid Secret Key.").trim().escape().not().isEmpty()
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Campaign creation failed.", errors: errors }); };

		const access_token: string = request.cookies["access_token"];
		const decoded: any = await jwt.decode(access_token, { complete: true });
		if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

		const _username: string = decoded.payload.username;
		const { c_name, c_secretkey } = request.body;
	}
);