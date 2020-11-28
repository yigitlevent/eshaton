import express from "express";
import { check, ValidationError, Result, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { PRODUCTION, SECRET_KEY } from "../app";
import { getDateTime } from "../shared/datetime";
import { pool } from "../bin/www";
import { output } from "../shared/output";

export const router = express.Router();

router.post("/new",
	[
		check("s_name", "Campaign name cannot be empty. ").trim().escape().not().isEmpty(),
		check("s_secretkey", "Please get a valid Secret Key.").trim().escape().not().isEmpty()
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Campaign creation failed.", errors: errors.array() }); };

		const access_token: string = request.cookies["access_token"];

		try {
			const decoded: any = jwt.verify(access_token, (SECRET_KEY as string));

			if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

			const _username: string = decoded.username;
			const { s_name, s_secretkey } = request.body;

			const client = await pool.connect().catch((err: Error) => { throw console.log(err); });
			try {
				const dateTime = getDateTime();

				client.query(
					"INSERT INTO campaigns (name, creator, secretkey, created ) VALUES ($1, $2, $3, $4)",
					[s_name, _username, s_secretkey, dateTime],
					async (error, results) => {
						if (error) {
							if (!PRODUCTION) { output(error); };
							return response.status(400).json({ status: "failure", message: "Campaign creation unsuccessful.", error });
						}
						else {
							return response.status(201).json({ status: "success", message: "Campaign creation succesful." });
						}
					}
				);
			}
			catch (err) {
				return response.status(500).send({ status: "failure", message: "Unforseen error occured.", error: err });
			}
			finally {
				client.release();
			}
		}
		catch (err) {
			return response.status(500).send({ status: "failure", message: "Unauthorized request. " });
		}
	}
);

router.post("/list",
	[],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Campaign listing failed.", errors: errors.array() }); };

		const access_token: string = request.cookies["access_token"];

		try {
			const decoded: any = jwt.verify(access_token, (SECRET_KEY as string));

			if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

			const _username: string = decoded.username;

			const client = await pool.connect().catch((err: Error) => { throw console.log(err); });
			try {
				client.query(
					"SELECT * FROM campaigns WHERE creator = $1",
					[_username],
					async (error, results) => {
						if (error) {
							output(error);
							return response.status(400).json({ status: "failure", message: "Campaign listing unsuccessful.", error });
						}
						else {
							return response.status(201).json({ status: "success", message: "Campaign listing succesful.", rows: results.rows });
						}
					}
				);
			}
			catch (err) {
				return response.status(500).send({ status: "failure", message: "Unforseen error occured.", error: err });
			}
			finally {
				client.release();
			}
		}
		catch (err) {
			return response.status(500).send({ status: "failure", message: "Unauthorized request. " });
		}
	}
);

router.post("/get",
	[
		check("s_secretkey", "Invalid key. ").trim().escape().not().isEmpty(),
	],
	async (request: express.Request, response: express.Response) => {


	}
);