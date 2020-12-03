import { QueryResult } from "pg";

import { output } from "../shared/output";
import { pool } from "../bin/www";

import { PRODUCTION } from "../app";

export async function connect(): Promise<void> {
	const client = await pool.connect().catch((err: Error) => { throw console.log(err); });

	client.query(
		`CREATE TABLE IF NOT EXISTS users(
			uid SERIAL NOT NULL PRIMARY KEY,
			username VARCHAR(32) UNIQUE NOT NULL,
			email VARCHAR(50) UNIQUE NOT NULL,
			password VARCHAR(100) UNIQUE NOT NULL,
			created TIMESTAMP DEFAULT NULL
		)`)
		.then(() => { if (!PRODUCTION) { output("Table 'users' created.", "yellow"); } })
		.catch((err: Error) => { throw console.log(err); });

	client.query(
		`CREATE TABLE IF NOT EXISTS campaigns(
			uid SERIAL NOT NULL PRIMARY KEY,
			name VARCHAR(32) NOT NULL,
			creator VARCHAR(32) NOT NULL,
			secretkey CHAR(32) UNIQUE NOT NULL,
			characters VARCHAR[],
			characters_name VARCHAR[],
			discord_enabled BOOLEAN,
			discord_server VARCHAR,
			discord_channel VARCHAR,
			created TIMESTAMP DEFAULT NULL
		)`)
		.then(() => { if (!PRODUCTION) { output("Table 'campaigns' created.", "yellow"); } })
		.catch((err: Error) => { throw console.log(err); });

	client.query(
		`CREATE TABLE IF NOT EXISTS characters(
			uid SERIAL NOT NULL PRIMARY KEY,
			name VARCHAR(32) NOT NULL,
			creator VARCHAR(32) NOT NULL,
			secretkey CHAR(32) UNIQUE NOT NULL,
			data TEXT NOT NULL,
			campaign VARCHAR(32),
			campaign_name VARCHAR(32),
			created TIMESTAMP DEFAULT NULL
		)`)
		.then(() => { if (!PRODUCTION) { output("Table 'characters' created.", "yellow"); } })
		.catch((err: Error) => { throw console.log(err); });

	client.release();
}