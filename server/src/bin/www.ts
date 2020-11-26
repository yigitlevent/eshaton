import http from "http";

import { app } from "../app";
import { connect } from "../middleware/database";

app.set("port", normalizePort(process.env.PORT || "3000"));

const server = http.createServer(app);

connect();

server.listen(app.get("port"), () => { console.log("Server listening at http://" + app.get("host") + ":" + app.get("port")); });
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val: any): number | boolean {
	const port = parseInt(val, 10);
	if (isNaN(port)) { return val; }
	if (port >= 0) { return port; }
	return false;
}

function onError(error: any): void {
	if (error.syscall !== "listen") { throw error; }
	// handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			console.error(app.get("port") + " requires elevated privileges");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(app.get("port") + " is already in use");
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function onListening(): void {
	const addr = server.address();
	//@ts-ignore
	const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
	//debug("Listening on " + bind);
	console.log("Listening on " + bind);
}
