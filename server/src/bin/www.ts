import http from "http";
import { Pool } from "pg";
import Discord, { Channel, TextChannel } from "discord.js";

import { connect } from "../middleware/database";
import { output } from "../shared/output";

import { app, PRODUCTION, PORT, DATABASE_URL, SECRET_KEY, DISCORD_API_TOKEN } from "../app";

if (!PRODUCTION) {
	output(PRODUCTION, "yellow");
	output(PORT, "yellow");
	output(DATABASE_URL, "yellow");
	output(SECRET_KEY, "yellow");
}

const server = http.createServer(app);

// DATABASE STUFF
export const pool = new Pool({ connectionString: DATABASE_URL, ssl: (PRODUCTION) ? { rejectUnauthorized: false } : false });

pool.on("error", (err: Error): void => { console.log("idle client error", err.message, err.stack); });

connect();

// DISCORD BOT STUFF
export const discordClient = new Discord.Client();

discordClient.once("ready", () => { console.log("discord ready"); });

if (PRODUCTION) { discordClient.login(DISCORD_API_TOKEN); }

export function sendRollResult(guildID: string, channelName: string, message: string): void {
	console.log("1");
	console.log(guildID);
	console.log(channelName);
	console.log(message);
	const guild = discordClient.guilds.cache.get(guildID);
	console.log(guild);
	if (guild) {

		console.log("2");
		console.log(guild.name);

		const channel = guild.channels.cache.find((channel: Channel) => { return (channel as TextChannel).name === channelName; });
		console.log(channel);

		if (channel && channel.type === "text") {
			console.log("2");
			console.log(channel.name);
			(channel as TextChannel).send(message).then((value) => { console.log("then"); console.log(value); }).catch((reason) => { console.log("reason"); console.log(reason); });
		}
	}
}

// ACTUALLY IMPORTANT STUFF
if (PRODUCTION) { server.listen((PORT as number)); }
else { server.listen((PORT as number), "localhost"); }

server.on("error", onError);
server.on("listening", onListening);

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

function onListening(): void {
	let addr: any = server.address();
	output(`Server listening at http://${addr.address}:${addr.port} (${addr.family})`, "cyan");
}