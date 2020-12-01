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
		check("c_name").trim().escape()
			.isLength({ min: 3, max: 32 }).withMessage("Character name must be between 3 and 32 characters.")
			.not().isEmpty().withMessage("Character name cannot be empty.")
			.matches(/^[A-Za-z\s]+$/).withMessage("Character name must be alphabetic."),
		check("c_secretkey", "Invalid character secret key.").trim().escape().not().isEmpty().isLength({ min: 32, max: 32 }),
		check("c_data", "Data is invalid.").trim().escape().not().isEmpty()
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Character creation failed.", errors: errors.array() }); };

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
			return response.status(500).send({ status: "failure", message: "Unauthorized request." });
		}
	}
);

router.post("/list",
	[],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Character listing failed.", errors: errors.array() }); };

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
							if (!PRODUCTION) { output(error); };
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
			return response.status(500).send({ status: "failure", message: "Unauthorized request." });
		}
	}
);

router.post("/delete",
	[
		check("c_secretkey", "Invalid character secret key.").trim().escape().not().isEmpty().isLength({ min: 32, max: 32 })
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Errors.", errors: errors.array() }); };

		const access_token: string = request.cookies["access_token"];

		const client = await pool.connect().catch((err: Error) => { throw console.log(err); });
		try {
			const decoded: any = jwt.verify(access_token, (SECRET_KEY as string));
			if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

			const { c_secretkey } = request.body;

			let char_name = "";
			let camp_key = "";

			await client.query("SELECT name FROM characters WHERE secretkey = $1", [c_secretkey])
				.then((results) => { char_name = results.rows[0].name; });

			await client.query("SELECT campaign FROM characters WHERE secretkey = $1", [c_secretkey])
				.then((results) => { camp_key = results.rows[0].campaign; });

			await client.query("DELETE FROM characters WHERE secretkey = $1", [c_secretkey]);

			await client.query(
				"UPDATE campaigns SET (characters, characters_name) = (array_remove(characters, $1), array_remove(characters_name, $2)) WHERE secretkey = $3",
				[c_secretkey, char_name, camp_key]);

			return response.status(201).json({ status: "success", message: "Deleted character." });
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
		check("c_name").trim().escape()
			.isLength({ min: 3, max: 32 }).withMessage("Character name must be between 3 and 32 characters.")
			.not().isEmpty().withMessage("Character name cannot be empty.")
			.matches(/^[A-Za-z\s]+$/).withMessage("Character name must be alphabetic."),
		check("c_secretkey", "Invalid character secret key.").trim().escape().not().isEmpty().isLength({ min: 32, max: 32 }),
		check("c_data", "Data is invalid.").trim().escape().not().isEmpty()
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Character edit failed.", errors: errors.array() }); };

		const access_token: string = request.cookies["access_token"];

		try {
			const decoded: any = jwt.verify(access_token, (SECRET_KEY as string));
			if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

			const { c_name, c_secretkey, c_data } = request.body;

			const client = await pool.connect().catch((err: Error) => { throw console.log(err); });
			try {
				client.query(
					"UPDATE characters SET (name, data) = ($1, $2) WHERE secretkey = $3",
					[c_name, c_data, c_secretkey],
					async (error, results) => {
						if (error) {
							if (!PRODUCTION) { output(error); };
							return response.status(400).json({ status: "failure", message: "Character edit unsuccessful.", error });
						}
						else {
							return response.status(201).json({ status: "success", message: "Character edit succesful." });
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