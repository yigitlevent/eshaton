import express from "express";
import { check, ValidationError, Result, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { getDateTime } from "../shared/datetime";
import { output } from "../shared/output";

import { pool, PRODUCTION, SECRET_KEY } from "../bin/www";

export const router = express.Router();

router.post("/new",
	[
		check("s_name", "Campaign name cannot be empty.").trim().escape()
			.isLength({ min: 3, max: 32 }).withMessage("Campaign name must be between 3 and 32 letters.")
			.not().isEmpty().withMessage("Campaign name cannot be empty.")
			.matches(/^[A-Za-z\s]+$/).withMessage("Campaign name must be alphabetic."),
		check("s_secretkey", "Invalid character secret key.").trim().escape().not().isEmpty().isLength({ min: 32, max: 32 }),
		check("s_discord_enabled", "Invalid value.").trim().escape().not().isEmpty().isBoolean(),
		check("s_discord_server", "Invalid discord server id.").trim().escape(),
		check("s_discord_channel", "Invalid discord channel name.").trim().escape()
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Campaign creation failed.", errors: errors.array() }); };

		const access_token: string = request.cookies["access_token"];

		try {
			const decoded: any = jwt.verify(access_token, (SECRET_KEY as string));
			if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

			const _username: string = decoded.username;
			const { s_name, s_secretkey, s_discord_enabled, s_discord_server, s_discord_channel } = request.body;

			const client = await pool.connect().catch((err: Error) => { throw console.log(err); });
			try {
				const dateTime = getDateTime();

				client.query(
					"INSERT INTO campaigns (name, creator, secretkey, created, discord_enabled, discord_server, discord_channel ) VALUES ($1, $2, $3, $4, $5, $6, $7)",
					[s_name, _username, s_secretkey, dateTime, s_discord_enabled, s_discord_server, s_discord_channel],
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
			return response.status(500).send({ status: "failure", message: "Unauthorized request." });
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
							if (!PRODUCTION) { output(error); };
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
			return response.status(500).send({ status: "failure", message: "Unauthorized request." });
		}
	}
);

router.post("/remove",
	[
		check("c_secretkey", "Invalid character secret key.").trim().escape().not().isEmpty().isLength({ min: 32, max: 32 }),
		check("s_secretkey", "Invalid campaign secret key.").trim().escape().not().isEmpty().isLength({ min: 32, max: 32 })
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Errors.", errors: errors.array() }); };

		const access_token: string = request.cookies["access_token"];

		const client = await pool.connect().catch((err: Error) => { throw console.log(err); });
		try {
			const decoded: any = jwt.verify(access_token, (SECRET_KEY as string));
			if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

			const { c_secretkey, s_secretkey } = request.body;

			let char_name = "";
			let camp_name = "";
			let char_camp_name = "";

			await client.query(
				"(SELECT name FROM characters WHERE secretkey = $1) UNION ALL (SELECT name FROM campaigns WHERE secretkey = $2)",
				[c_secretkey, s_secretkey])
				.then((results) => {
					char_name = results.rows[0].name;
					camp_name = results.rows[1].name;
				});

			await client.query(
				"(SELECT campaign_name FROM characters WHERE secretkey = $1)",
				[c_secretkey])
				.then((results) => {
					char_camp_name = results.rows[0].campaign_name;
				});

			if (char_name && camp_name && char_camp_name === camp_name) {
				await client.query(
					"UPDATE campaigns SET (characters, characters_name) = (array_remove(characters, $1), array_remove(characters_name, $2)) WHERE secretkey = $3",
					[c_secretkey, char_name, s_secretkey]);

				await client.query(
					"UPDATE characters SET (campaign, campaign_name) = (NULL, NULL) WHERE secretkey = $1",
					[c_secretkey]);

				return response.status(201).json({ status: "success", message: "Connection removed." });
			}
			else { return response.status(500).send({ status: "failure", message: "Cannot find character or campaign or character is not in this campaign." }); }
		}
		catch (err) {
			return response.status(500).send({ status: "failure", message: "Unauthorized request." });
		}
		finally {
			client.release();
		}
	}
);

router.post("/add",
	[
		check("c_secretkey", "Invalid character secret key.").trim().escape().not().isEmpty().isLength({ min: 32, max: 32 }),
		check("s_secretkey", "Invalid campaign secret key.").trim().escape().not().isEmpty().isLength({ min: 32, max: 32 })
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Errors.", errors: errors.array() }); };

		const access_token: string = request.cookies["access_token"];

		const client = await pool.connect().catch((err: Error) => { throw console.log(err); });
		try {
			const decoded: any = jwt.verify(access_token, (SECRET_KEY as string));
			if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

			const { c_secretkey, s_secretkey } = request.body;

			let char_name = "";
			let camp_name = "";

			await client.query(
				"(SELECT name FROM characters WHERE secretkey = $1) UNION ALL (SELECT name FROM campaigns WHERE secretkey = $2)",
				[c_secretkey, s_secretkey])
				.then((results) => {
					char_name = results.rows[0].name;
					camp_name = results.rows[1].name;
				});

			await client.query(
				"UPDATE campaigns SET (characters, characters_name) = (array_append(characters, $1), array_append(characters_name, $2)) WHERE secretkey = $3",
				[c_secretkey, char_name, s_secretkey]);

			await client.query(
				"UPDATE characters SET (campaign, campaign_name) = ($1, $2) WHERE secretkey = $3",
				[s_secretkey, camp_name, c_secretkey]);

			return response.status(201).json({ status: "success", message: "Connection created." });
		}
		catch (err) {
			return response.status(500).send({ status: "failure", message: "Unauthorized request." });
		}
		finally {
			client.release();
		}
	}
);

router.post("/delete",
	[
		check("s_secretkey", "Invalid campaign secret key.").trim().escape().not().isEmpty().isLength({ min: 32, max: 32 })
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Errors.", errors: errors.array() }); };

		const access_token: string = request.cookies["access_token"];

		const client = await pool.connect().catch((err: Error) => { throw console.log(err); });
		try {
			const decoded: any = jwt.verify(access_token, (SECRET_KEY as string));
			if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

			const { s_secretkey } = request.body;

			await client.query("DELETE FROM campaigns WHERE secretkey = $1", [s_secretkey]);

			await client.query("UPDATE characters SET (campaign, campaign_name) = (NULL, NULL) WHERE campaign = $1", [s_secretkey]);

			return response.status(201).json({ status: "success", message: "Deleted campaign." });
		}
		catch (err) {
			return response.status(500).send({ status: "failure", message: "Unauthorized request." });
		}
		finally {
			client.release();
		}
	}
);

router.post("/edit",
	[
		check("s_name", "Campaign name cannot be empty.").trim().escape()
			.isLength({ min: 3, max: 32 }).withMessage("Campaign name must be between 3 and 32 letters.")
			.not().isEmpty().withMessage("Campaign name cannot be empty.")
			.matches(/^[A-Za-z\s]+$/).withMessage("Campaign name must be alphabetic."),
		check("s_secretkey", "Invalid character secret key.").trim().escape().not().isEmpty().isLength({ min: 32, max: 32 }),
		check("s_discord_enabled", "Invalid value.").trim().escape().not().isEmpty().isBoolean(),
		check("s_discord_server", "Invalid discord server id.").trim().escape(),
		check("s_discord_channel", "Invalid discord channel name.").trim().escape()
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Campaign edit failed.", errors: errors.array() }); };

		const access_token: string = request.cookies["access_token"];

		try {
			const decoded: any = jwt.verify(access_token, (SECRET_KEY as string));
			if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

			const { s_name, s_discord_enabled, s_discord_server, s_discord_channel, s_secretkey } = request.body;

			const client = await pool.connect().catch((err: Error) => { throw console.log(err); });
			try {
				client.query(
					"UPDATE campaigns SET (name, discord_enabled, discord_server, discord_channel ) = ($1, $2, $3, $4) WHERE secretkey = $5",
					[s_name, s_discord_enabled, s_discord_server, s_discord_channel, s_secretkey],
					async (error, results) => {
						if (error) {
							if (!PRODUCTION) { output(error); };
							return response.status(400).json({ status: "failure", message: "Campaign edit unsuccessful.", error });
						}
						else {
							return response.status(201).json({ status: "success", message: "Campaign edit succesful." });
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
			return response.status(500).send({ status: "failure", message: "Unauthorized request." });
		}
	}
);

router.post("/get",
	[
		check("s_secretkey", "Invalid character secret key.").trim().escape().not().isEmpty().isLength({ min: 32, max: 32 })
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Campaign return failed.", errors: errors.array() }); };

		const access_token: string = request.cookies["access_token"];

		try {
			const decoded: any = jwt.verify(access_token, (SECRET_KEY as string));
			if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

			const { s_secretkey } = request.body;

			const client = await pool.connect().catch((err: Error) => { throw console.log(err); });
			try {
				client.query(
					"SELECT * FROM campaigns WHERE secretkey = $1",
					[s_secretkey],
					async (error, results) => {
						if (error) {
							if (!PRODUCTION) { output(error); };
							return response.status(400).json({ status: "failure", message: "Campaign return unsuccessful.", error });
						}
						else {
							return response.status(201).json({ status: "success", message: "Campaign return succesful.", rows: results.rows });
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
			return response.status(500).send({ status: "failure", message: "Unauthorized request." });
		}
	}
);