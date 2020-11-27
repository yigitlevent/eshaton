import { Pool, QueryResult } from "pg";

import { DATABASE_URL } from "../app";

export const pool = new Pool({
	connectionString: DATABASE_URL,
	ssl: { rejectUnauthorized: false }
});

pool.on("error", (err: Error) => {
	console.log("idle client error", err.message, err.stack);
});

export async function connect() {
	pool.connect();

	const client = await pool.connect().catch((err: Error) => { throw console.log(err); });

	client.query(`CREATE TABLE IF NOT EXISTS users(
        uid SERIAL PRIMARY KEY,
        username VARCHAR(32) UNIQUE NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) UNIQUE NOT NULL,
		created TIMESTAMP DEFAULT NULL)`)
		.then((res: QueryResult<any>) => { console.log("users table created"); })
		.catch((err: Error) => { throw console.log(err); });

	client.query(`CREATE TABLE IF NOT EXISTS campaigns(
		uid SERIAL PRIMARY KEY,
        name VARCHAR(32) NOT NULL,
		creator VARCHAR(32) NOT NULL,
		secretkey CHAR(16) UNIQUE NOT NULL,
		players VARCHAR[],
		created TIMESTAMP DEFAULT NULL)`)
		.then((res: QueryResult<any>) => { console.log("campaigns table created"); })
		.catch((err: Error) => { throw console.log(err); });

	client.query(`CREATE TABLE IF NOT EXISTS characters(
		uid SERIAL PRIMARY KEY,
        name VARCHAR(32) NOT NULL,
		creator VARCHAR(32) NOT NULL,
		secretkey CHAR(16) UNIQUE NOT NULL,
		data TEXT NOT NULL,
		created TIMESTAMP DEFAULT NULL)`)
		.then((res: QueryResult<any>) => { console.log("characters table created"); })
		.catch((err: Error) => { throw console.log(err); });

	client.release();
}