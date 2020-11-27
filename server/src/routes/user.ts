import express from "express";
import { check, ValidationError, Result, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { DATABASE_URL, PRODUCTION, SECRET_KEY } from "../app";
import { getDateTime } from "../middleware/datetime";
import { pool } from "../bin/www";
import { output } from "../shared/output";

export const router = express.Router();

router.post("/register",
	[
		check("r_username", "Username cannot be empty and must be at most 25 characters long. ").trim().escape().isLength({ max: 25 }).not().isEmpty(),
		check("r_email", "Enter a valid E-mail. ").trim().escape().isEmail().normalizeEmail().not().isEmpty(),
		check("r_password", "Password must be at least 6 characters. ").trim().escape().isLength({ min: 6 }),
		check("r_passwordrepeat").trim().escape().isLength({ min: 6 }).custom((value, { req }) => {
			if (value !== req.body.r_password) { throw new Error("Password confirmation does not match password. "); }
			return true;
		})
	],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) {
			output(errors);
			return response.status(400).json({ status: "failure", message: "Registration failed.", errors: errors });
		}

		const { r_username, r_email, r_password } = request.body;

		const client = await pool.connect().catch((err: Error) => { throw console.log(err); });

		try {
			const hashedPassword = await bcrypt.hash(r_password, 10).catch((err: Error) => { throw console.log("Error: 1001"); });

			const dateTime = getDateTime();

			const userSave = await client.query(
				"INSERT INTO users (username, email, password, created) VALUES ($1, $2, $3, $4)",
				[r_username, r_email, hashedPassword, dateTime]
			).catch((error: any) => {
				if (error) { return response.status(400).json({ status: "failure", message: "Registration Failed.", error }); }
			});

			return response.status(201).json({ status: "success", message: "Registration successful. Please login." });
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
		if (!errors.isEmpty()) {
			output(errors);
			return response.status(400).json({ status: "failure", message: "Login unsuccessful.", errors: errors });
		}

		const { l_username, l_password } = request.body;

		const client = await pool.connect().catch((err: Error) => { throw console.log(err); });

		try {
			client.query(
				"SELECT * FROM users WHERE username = ($1)",
				[l_username],
				async (error, results) => {
					if (error) {
						output(error);
						return response.status(400).json({ status: "failure", message: "Login unsuccessful.", error });
					}
					if (results.rows.length < 1) {
						output("Username incorrect.");
						return response.status(400).json({ status: "failure", message: "Username incorrect.", error });
					}

					if (results.rows[0].username == l_username && await bcrypt.compare(l_password, results.rows[0].password)) {
						const token = jwt.sign(
							{ username: l_username },
							SECRET_KEY,
							{ expiresIn: "24h" },
						);

						return response.status(201)
							.clearCookie("access_token")
							.cookie("access_token", token, {
								secure: PRODUCTION,
								httpOnly: PRODUCTION,
								sameSite: (PRODUCTION) ? "strict" : "none",
								expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
							})
							.json({ status: "success", message: "Login successful." });
					}
					else {
						output("Password incorrect.");
						return response.status(201).json({ status: "failure", message: "Password incorrect." });
					}
				});
		}
		catch (err) {
			output(err);
			return response.status(500).send({ status: "failure", message: "Unforseen error occured.", error: err });
		}
		finally {
			client.release();
		}
	}
);

router.post("/auth",
	[],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) {
			output(errors);
			return response.status(400).json({ status: "failure", message: "Login unsuccessful.", errors: errors });
		}

		const access_token: string = request.cookies["access_token"];
		const decoded: any = await jwt.decode(access_token, { complete: true });
		if (!decoded) { return response.status(400).json({ status: "failure", message: "No cookies exist." }); }

		const _username: string = decoded.payload.username;

		const client = await pool.connect();

		try {
			client.query(
				"SELECT * FROM users WHERE username = $1",
				[_username],
				async (error, results) => {
					if (error) { return response.status(400).json({ status: "failure", message: "No username has this ID." }); }

					try {
						const isVerified: any = jwt.verify(access_token, SECRET_KEY);
						return response.status(200).send({ status: "success", message: "User verified." });
					}
					catch (e) {
						console.error(e);
						return response.status(400).clearCookie("access_token").json({ status: "failure", message: "Token expired." });
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

/*router.post("/logout",
	[],
	async (request: express.Request, response: express.Response) => {
		const errors: Result<ValidationError> = validationResult(request);
		if (!errors.isEmpty()) { return response.status(400).json({ errors: errors }); }

		try {
			response.status(200).clearCookie("access_token").send({ status: "success", message: "Logged out succesfully." });
		}
		catch (e) {
			console.error(e);
			response.status(500).clearCookie("access_token").json({ status: "failure", message: "Server error." });
		}
	}
);*/