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

router.post("/remove",
	[
		check("char_key", "Invalid character secret key.").trim().escape().not().isEmpty().isLength({ min: 32, max: 32 }),
		check("camp_key", "Invalid campaign secret key.").trim().escape().not().isEmpty().isLength({ min: 32, max: 32 })
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Errors.", errors: errors.array() }); };

		const access_token: string = request.cookies["access_token"];

		const client = await pool.connect().catch((err: Error) => { throw console.log(err); });

		try {
			const decoded: any = jwt.verify(access_token, (SECRET_KEY as string));
			if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

			const { char_key, camp_key } = request.body;

			let char_name = "";
			let camp_name = "";
			let char_camp_name = "";

			await client.query(
				"(SELECT name FROM characters WHERE secretkey = $1) UNION ALL (SELECT name FROM campaigns WHERE secretkey = $2)",
				[char_key, camp_key])
				.then((results) => {
					char_name = results.rows[0].name;
					camp_name = results.rows[1].name;
				});

			await client.query(
				"(SELECT campaign_name FROM characters WHERE secretkey = $1)",
				[char_key])
				.then((results) => {
					char_camp_name = results.rows[0].campaign_name;
				});

			if (char_name && camp_name && char_camp_name === camp_name) {
				await client.query(
					"UPDATE campaigns SET (characters, characters_name) = (array_remove(characters, $1), array_remove(characters_name, $2)) WHERE secretkey = $3",
					[char_key, char_name, camp_key]);

				await client.query(
					"UPDATE characters SET (campaign, campaign_name) = (NULL, NULL) WHERE secretkey = $1",
					[char_key]);

				return response.status(201).json({ status: "success", message: "Connection removed." });
			}
			else { return response.status(500).send({ status: "failure", message: "Cannot find character or campaign or character is not in this campaign." }); }
		}
		catch (err) {
			return response.status(500).send({ status: "failure", message: "Unauthorized request. " });
		}
		finally {
			client.release();
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