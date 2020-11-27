import { useEffect, useState, StrictMode, useCallback } from "react";
import ReactDOM from "react-dom";
import { ToastOptions, ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./style.scss";

import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { CharacterSheet } from "./components/CharacterSheet";

const notificationOptions = {
	position: "top-center",
	autoClose: 3000,
	hideProgressBar: true,
	closeOnClick: false,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
};

function App(): JSX.Element {
	const [no] = useState(false);

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLogin, setIsLogin] = useState(true);

	const [sheet, setSheet] = useState("none" as sheettype);
	const [campaign, setCampaign] = useState("none" as campaigntype);

	const [charRows, setCharRows] = useState([] as any[]);
	const [campRows, setCampRows] = useState([] as any[]);

	const userRequest = (path: string, requestType: requests, data?: any): void => {
		const request = new XMLHttpRequest();
		request.open("POST", path, true); // true = asynchronous
		request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

		if (data) { request.send(JSON.stringify(data)); }
		else { request.send(); }

		request.onreadystatechange = () => {
			if (request.readyState === XMLHttpRequest.DONE) {
				const response = JSON.parse(request.response);

				if (response.status === "failure") {
					if (requestType !== "auth") {
						let errorMsg = [];
						if (response.errors) { errorMsg = response.errors.map((error: any) => { return (error.msg); }); }
						if (response.error) {
							let det = response.error.detail.replace(/\=/g, ' ').replace(/\(|\)/g, '').substring(4);
							errorMsg.push(det.charAt(0).toUpperCase() + det.slice(1));
						}
						toast.error(errorMsg.join(" "), notificationOptions as ToastOptions);
					}
				}
				else {
					if (requestType === "login" || requestType === "auth") {
						toast.success(response.message, notificationOptions as ToastOptions);
						setIsLoggedIn(true);

						userRequest("/char/list", "list_char");
					}
					else if (requestType === "register") {
						toast.success(response.message, notificationOptions as ToastOptions);
						setIsLogin(true);
					}
					else if (requestType === "add_char" || requestType === "add_camp") {
						toast.success(response.message, notificationOptions as ToastOptions);
					}
					else if (requestType === "list_char") {
						setCharRows(response.rows);
						toast.success(response.message, notificationOptions as ToastOptions);
					}
				}
			}
		};
	};

	const startAuth = useCallback(() => { userRequest("/user/auth", "auth"); }, [no]);

	useEffect(() => {
		if (!isLoggedIn) { startAuth(); }

		console.log(charRows);
	}, [startAuth, charRows]);

	return (
		<StrictMode>
			<ToastContainer
				position="top-center"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>

			{(!isLoggedIn)
				? <div className="entrance-wrapper">
					<div className="entrance">
						<div className="logo" />
						<div className="title">ESHATON // ENTRANCE</div>

						{(isLogin)
							? <Login setIsLogin={setIsLogin} userRequest={userRequest} />
							: <Register setIsLogin={setIsLogin} userRequest={userRequest} />
						}
					</div>
				</div>
				: <div className="main-wrapper">

					<div className="dashboard">
						<div className="logo" />
						<div className="title">ESHATON // DASHBOARD</div>

						<div className="my-characters">
							<div className="title">MY CHARACTERS</div>
							<input className="button" type="button" value="Create New Character" onClick={() => { setSheet("new"); }} />
							<div className="list"></div>
						</div>

						<div className="my-campaigns">
							<div className="title">MY CAMPAIGNS</div>
							<input className="button" type="button" value="Create New Campaign" onClick={() => { setCampaign("new"); }} />
							<div className="list"></div>
						</div>
					</div>

					{(sheet !== "none")
						? <CharacterSheet sheet={sheet} userRequest={userRequest} />
						: null
					}

				</div>
			}
		</StrictMode>
	);
}

ReactDOM.render(<App />, document.getElementById("root"));