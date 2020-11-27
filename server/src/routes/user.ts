import express from "express";
import { check, ValidationError, Result, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { app, SECRET_KEY } from "../app";
import { getDateTime } from "../middleware/datetime";
import { pool } from "../middleware/database";

export const router = express.Router();

router.post("/register",
	[
		check("r_username", "Username cannot be empty. ").trim().escape().not().isEmpty(),
		check("r_email", "Enter a valid E-mail. ").trim().escape().isEmail().normalizeEmail().not().isEmpty(),
		check("r_password", "Password must be at least 6 characters. ").trim().escape().isLength({ min: 6 }),
		check("r_passwordrepeat").trim().escape().isLength({ min: 6 }).custom((value, { req }) => {
			if (value !== req.body.password) { throw new Error("Password confirmation does not match password. "); }
			return true;
		})
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Registration Failed.", errors: errors.array() }); }

		const { r_username, r_email, r_password } = request.body;

		const client = await pool.connect()
			.catch((err: Error) => { throw console.log("Error: 1000"); });

		try {
			const hashedPassword = await bcrypt.hash(r_password, 10)
				.catch((err: Error) => { throw console.log("Error: 1001"); });

			const dateTime = getDateTime();

			const userSave = await client.query(
				"INSERT INTO user_tab (username, email, password, created, isAdmin ) VALUES ($1, $2, $3, $4, $5)",
				[r_username, r_email, hashedPassword, dateTime, false]
			).catch((error: any) => {
				if (error) {
					if (error.code == "23505" && error.constraint == "user_tab_email_key") { console.log({ status: "failure", message: "Email already exist." }); }
					if (error.code == "23505" && error.constraint == "user_tab_username_key") { console.log({ status: "failure", message: "Username already exist." }); }
					if (error.code == "23502") { console.log({ status: "failure", message: "Username can not be empty." }); }
					return response.status(400).json({ status: "failure", message: "Registration Failed.", error });
				}
				else { return response.status(201).json({ status: "success", message: "Registration succesful.", error }); }
			});
		}
		catch (err) { return response.status(500).send({ status: "failure", message: "Unforseen error occured.", error: err }); }
		finally {
			client.release();
		}
	}

);

router.post("/login",
	[
		check("l_username", "Username cannot be empty. ").trim().escape().not().isEmpty(),
		check("l_password", "Password must be at least 6 characters. ").trim().escape().not().isEmpty().isLength({ min: 6 })
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Login unsuccessful.", errors: errors.array() }); }

		const { l_username, l_password } = request.body;
		const client = await pool.connect()
			.catch((err: Error) => { throw console.log("Error: 5000"); });

		try {
			client.query(
				"SELECT * FROM user_tab WHERE username= $1",
				[l_username],
				async (error, results) => {
					if (error) { return response.status(400).json({ status: "failure", message: "Login unsuccessful.", error }); }
					if (results.rows.length < 1) { return response.status(400).json({ status: "failure", message: "Username incorrect.", error }); }
					else if (results.rows[0].status == "pending") { return response.status(400).json({ status: "failure", message: "Email has not been verified." }); }

					if (results.rows[0].username == l_username && await bcrypt.compare(l_password, results.rows[0].password)) {
						const token = jwt.sign(
							{ username: l_username },
							app.get("secretKey"),
							{ expiresIn: "24h" },
						);

						return response.status(201)
							.clearCookie("access_token")
							.cookie("access_token", token, {
								secure: true,
								httpOnly: true,
								sameSite: "strict",
								expires: new Date(Date.now() + 24 * 60 * 60 * 100)
							})
							.json({ status: "success", message: "Login successful." });
					}
					else { return response.status(201).json({ status: "failure", message: "Password incorrect." }); }
				});
		}
		catch (err) { return response.status(500).send({ status: "failure", message: "Unforseen error occured.", error: err }); }
		finally {
			client.release();
		}
	}
);

router.post("/auth",
	[],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ status: "failure", message: "Token expired.", errors: errors.array() }); }

		const access_token: string = request.cookies["access_token"];
		const decoded: any = await jwt.decode(access_token, { complete: true });
		if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

		const _username: string = decoded.payload.username;

		const client = await pool.connect()
			.catch((err: Error) => { throw console.log("Error: 5000"); });

		try {
			client.query(
				"SELECT * FROM user_tab WHERE username= $1",
				[_username],
				async (error, results) => {
					if (error) { return response.status(400).json({ status: "failure", message: "No username has this ID." }); }

					try {
						const isVerified: any = jwt.verify(access_token, SECRET_KEY);
						response.status(200).send({ status: "success", message: "User verified." });
					}
					catch (e) {
						console.error(e);
						response.status(400).clearCookie("access_token").json({ status: "failure", message: "Token expired." });
					}
				}
			);
		}
		catch (err) { return response.status(500).send({ status: "failure", message: "Unforseen error occured.", error: err }); }
		finally {
			client.release();
		}
	}
);

router.post("/logout",
	[],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ errors: errors.array() }); }

		try {
			response.status(200).clearCookie("access_token").send({ status: "success", message: "Logged out succesfully." });
		}
		catch (e) {
			console.error(e);
			response.status(500).clearCookie("access_token").json({ status: "failure", message: "Server error." });
		}
	}
);