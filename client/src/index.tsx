import { StrictMode, useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ToastContainer, Slide, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./style.scss";

import { Spinner } from "./parts/Spinner";
import { Entrance } from "./components/Entrance";
import { Dashboard } from "./components/Dashboard";

function App(): JSX.Element {
	const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null);
	const [mainEl, setMainEl] = useState(<Spinner />);

	const userRequest = useCallback((path: string, requestType: requests, data?: any): Promise<any[] | boolean> => {
		return new Promise<any>((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.open("POST", path, true); // true = asynchronous
			request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

			if (data) { request.send(JSON.stringify(data)); }
			else { request.send(); }

			request.onreadystatechange = () => {
				if (request.readyState === XMLHttpRequest.DONE && request.response) {
					const response = JSON.parse(request.response);

					if (response.status === "failure") {
						if (requestType !== "auth" && requestType !== "dice_roll") {
							let errorMsg = [response.message];

							if (response.errors) {
								errorMsg.push(...(response.errors.map((error: any) => { return (error.msg); })));
							}

							if (response.error) {
								let det = response.error.detail.replace(/=/g, ' ').replace(/\(|\)/g, '').substring(4);
								errorMsg.push(det.charAt(0).toUpperCase() + det.slice(1));
							}

							toast.error(errorMsg.join(" "));
						}
						else if (requestType === "dice_roll") { }
						else {
							setIsLoggedIn(false);
						}
						resolve(false);
					}
					else {
						if (requestType === "list_char" || requestType === "list_camp" || requestType === "get_camp") {
							resolve(response.rows as any[]);
						}
						else if (requestType === "logout") {
							setIsLoggedIn(false);
							resolve(false);
						}
						else if (requestType === "auth" || requestType === "login") {
							setIsLoggedIn(true);
						}
						else {
							toast.success(response.message);
						}
						resolve(true);
					}
				}
			};
		}
		);
	}, []);

	useEffect(() => {
		userRequest("/user/auth", "auth").then((val) => { setIsLoggedIn(val as boolean); });

		if (isLoggedIn === true) { setMainEl(<Dashboard userRequest={userRequest} />); }
		else if (isLoggedIn === false) { setMainEl(<Entrance userRequest={userRequest} />); }
	}, [isLoggedIn, userRequest]);

	return (
		<StrictMode>
			<ToastContainer
				position="top-center" autoClose={3000} transition={Slide}
				hideProgressBar={true} pauseOnFocusLoss={true} pauseOnHover={true}
				newestOnTop={false} closeOnClick={false} rtl={false} draggable={false}
			/>
			{mainEl}
		</StrictMode>
	);
}

ReactDOM.render(<App />, document.getElementById("root"));