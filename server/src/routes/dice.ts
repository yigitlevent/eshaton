import express from "express";
import { check, ValidationError, Result, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { SECRET_KEY } from "../app";
import { discordClient, pool } from "../bin/www";
import { sendRollResult } from "../shared/bot";

export const router = express.Router();

router.post("/roll",
	[
		check("d_charname", "Character name cannot be empty.").trim().escape()
			.isLength({ min: 3, max: 32 }).withMessage("Character name must be between 3 and 32 letters.")
			.not().isEmpty().withMessage("Character name cannot be empty.")
			.matches(/^[A-Za-z\s]+$/).withMessage("Character name must be alphabetic."),
		check("d_message").trim().escape().not().isEmpty().withMessage("Message cannot be empty.")
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Dice roll failed.", errors: errors.array() }); };

		const access_token: string = request.cookies["access_token"];

		try {
			const decoded: any = jwt.verify(access_token, (SECRET_KEY as string));
			if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

			const { d_charname, d_message } = request.body;

			const client = await pool.connect().catch((err: Error) => { throw console.log(err); });
			try {
				let camp_secretkey = "";

				await client.query(
					"SELECT campaign FROM characters WHERE name = $1",
					[d_charname])
					.then((results) => {
						if (results.rows[0].campaign) {
							client.query(
								"SELECT * FROM campaigns WHERE secretkey = $1",
								[results.rows[0].campaign])
								.then((results) => {
									if (results.rows[0].discord_enabled && discordClient.readyAt) {
										sendRollResult(
											results.rows[0].discord_server,
											results.rows[0].discord_channel,
											d_message
										);
										return response.status(200).json({ status: "success", message: "Dice result sent." });
									}
									else {
										return response.status(500).send({ status: "failure", message: "Discord bot is offline." });
									}
								});
						}
						else {
							return response.status(500).send({ status: "failure", message: "Character does not belong to a campaign." });
						}
					});
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