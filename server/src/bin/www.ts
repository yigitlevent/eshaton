import { createServer } from "http";
import { Pool } from "pg";
import { Client, Intents } from "discord.js";

import { connect } from "../middleware/database";

import { output } from "../shared/output";

import { app } from "../app";

export const PRODUCTION = (process.env.ENV as string === "production") || false;
export const SECRET_KEY = (process.env.SECRET_KEY as string) || "test_secret_key";
const PORT = normalizePort(process.env.PORT || 4000);
const DATABASE_URL = (process.env.DATABASE_URL as string) || "postgresql://testuser:testpassword@localhost:5432/eshaton_test";
const DISCORD_API_TOKEN = (process.env.DISCORD_API_TOKEN as string) || "lmao";

if (!PRODUCTION) {
	output(PRODUCTION, "yellow");
	output(SECRET_KEY, "yellow");
	output(PORT, "yellow");
	output(DATABASE_URL, "yellow");
	output(DISCORD_API_TOKEN, "yellow");
}

function normalizePort(val: any): number | boolean {
	const port = parseInt(val, 10);
	if (isNaN(port)) { return val; }
	if (port >= 0) { return port; }
	return false;
}

// DATABASE
export const pool = new Pool({ connectionString: DATABASE_URL, ssl: (PRODUCTION) ? { rejectUnauthorized: false } : false });
pool.on("error", (err: Error): void => { console.log("idle client error", err.message, err.stack); });
connect();

// DISCORD BOT
const intents = new Intents([Intents.NON_PRIVILEGED, "GUILD_MEMBERS"]);
export const discordClient = new Client({ ws: { intents: intents } });
discordClient.once("ready", () => { console.log("discord ready"); });
if (PRODUCTION) { discordClient.login(DISCORD_API_TOKEN); }

// SERVER
const server = createServer(app);
if (PRODUCTION) { server.listen((PORT as number)); }
else { server.listen((PORT as number), "localhost"); }

server.on("listening", onListening);
server.on("error", onError);

function onListening(): void {
	let addr: any = server.address();
	output(`Server listening at http://${addr.address}:${addr.port} (${addr.family})`, "cyan");
}

function onError(error: any): void {
	if (error.syscall !== "listen") { throw error; }
	// handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			console.error(PORT + " requires elevated privileges");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(PORT + " is already in use");
			process.exit(1);
			break;
		default:
			throw error;
	}
}