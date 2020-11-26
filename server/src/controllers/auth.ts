import * as express from "express";
import * as jwt from "jsonwebtoken";

export function auth(request: express.Request, response: express.Response, next: express.NextFunction): string | boolean {
	const access_token: string = request.cookies["access_token"];
	
	if (!access_token) {
		response.status(400).json({ status: "failure", message: "No cookies exist." });
		return false;
	}

	try {
		const isVerified: any = jwt.verify(access_token, process.env.SECRET_KEY as string);
		const decoded: any = jwt.decode(access_token, { complete: true });
		response.status(200).send({ status: "success", message: "User verified." });
		return decoded.payload.username;
	}
	catch (e) {
		console.error(e);
		response.status(500).send({ message: "Invalid Token" });
		return false;
	}
};