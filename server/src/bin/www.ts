import http from "http";
import { Pool } from "pg";

import { connect } from "../middleware/database";
import { output } from "../shared/output";

import { app, PRODUCTION, HOST, PORT, DATABASE_URL, SECRET_KEY } from "../app";

output(PRODUCTION, "yellow");
output(HOST, "yellow");
output(PORT, "yellow");
output(DATABASE_URL, "yellow");
output(SECRET_KEY, "yellow");

const server = http.createServer(app);

export const pool = new Pool({
	connectionString: DATABASE_URL,
	ssl: (PRODUCTION) ? { rejectUnauthorized: false } : false
});

pool.on("error", (err: Error) => {
	console.log("idle client error", err.message, err.stack);
});

connect();

server.listen((PORT as number), HOST);
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
