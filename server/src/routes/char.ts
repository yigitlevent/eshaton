import express from "express";
import { check, ValidationError, Result, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { getDateTime } from "../shared/datetime";
import { pool } from "../bin/www";
import { PRODUCTION, SECRET_KEY } from "../app";
import { output } from "../shared/output";

export const router = express.Router();

router.post("/new",
	[
		check("c_name", "Character name cannot be empty. ").trim().escape().not().isEmpty(),
		check("c_secretkey", "Please get a valid Secret Key.").trim().escape().not().isEmpty(),
		check("c_data", "Password must be at least 6 characters. ").trim().escape().not().isEmpty()
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Character creation failed.", errors: errors }); };

		const access_token: string = request.cookies["access_token"];

		try {
			const decoded: any = jwt.verify(access_token, (SECRET_KEY as string));

			if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

			const _username: string = decoded.username;
			const { c_name, c_secretkey, c_data } = request.body;

			const client = await pool.connect().catch((err: Error) => { throw console.log(err); });
			try {
				const dateTime = getDateTime();

				client.query(
					"INSERT INTO characters (name, creator, secretkey, data, created ) VALUES ($1, $2, $3, $4, $5)",
					[c_name, _username, c_secretkey, c_data, dateTime],
					async (error, results) => {
						if (error) {
							if (!PRODUCTION) { output(error); };
							return response.status(400).json({ status: "failure", message: "Character creation unsuccessful.", error });
						}
						else {
							return response.status(201).json({ status: "success", message: "Character creation succesful." });
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
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Character listing failed.", errors: errors }); };

		const access_token: string = request.cookies["access_token"];

		try {
			const decoded: any = jwt.verify(access_token, (SECRET_KEY as string));

			if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

			const _username: string = decoded.username;

			const client = await pool.connect().catch((err: Error) => { throw console.log(err); });
			try {
				client.query(
					"SELECT * FROM characters WHERE creator = $1",
					[_username],
					async (error, results) => {
						if (error) {
							output(error);
							return response.status(400).json({ status: "failure", message: "Character listing unsuccessful.", error });
						}
						else {
							return response.status(201).json({ status: "success", message: "Character listing succesful.", rows: results.rows });
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
		check("c_secretkey", "Invalid key. ").trim().escape().not().isEmpty(),
	],
	async (request: express.Request, response: express.Response) => {


	}
);