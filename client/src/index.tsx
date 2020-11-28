import { useEffect, useState, StrictMode, useCallback, Fragment } from "react";
import ReactDOM from "react-dom";
import { ToastContainer, toast, Slide } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./style.scss";

import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { CharacterSheet } from "./components/CharacterSheet";
import { CampaignSheet } from "./components/CampaignSheet";
import { Mini } from "./components/Mini";
import { ListRow } from "./parts/ListRow";

function App(): JSX.Element {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLogin, setIsLogin] = useState(true);

	const [display, setDisplay] = useState("none" as displayelement);
	const [displaying, setDisplaying] = useState({} as JSX.Element);
	const [displayType, setDisplayType] = useState("none" as displaytype);

	const [charRows, setCharRows] = useState([] as any[]);
	const [campRows, setCampRows] = useState([] as any[]);

	const [lastCharKey, setLastCharKey] = useState("");
	const [lastCampKey, setLastCampKey] = useState("");

	const [lastCharData, setLastCharData] = useState("" as any);
	const [lastCampData, setLastCampData] = useState("" as any);

	const close = () => {
		setDisplay("none");
		setDisplayType("none");
	};

	const refreshLists = useCallback(() => {
		userRequest("/char/list", "list_char");
		userRequest("/camp/list", "list_camp");
	}, []);

	const userRequest = useCallback((path: string, requestType: requests, data?: any): void => {
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

						if (response.errors) {
							errorMsg.push(...(response.errors.map((error: any) => { return (error.msg); })));
						}

						if (response.error) {
							let det = response.error.detail.replace(/=/g, ' ').replace(/\(|\)/g, '').substring(4);
							errorMsg.push(det.charAt(0).toUpperCase() + det.slice(1));
						}

						toast.error(errorMsg.join(" "));
					}
				}
				else {
					if (requestType === "login" || requestType === "auth") {
						toast.success(response.message);
						setIsLoggedIn(true);
						refreshLists();
					}
					else if (requestType === "register") {
						toast.success(response.message);
						setIsLogin(true);
					}
					else if (requestType === "add_char" || requestType === "add_camp") {
						toast.success(response.message);
						refreshLists();
					}
					else if (requestType === "list_char") {
						setCharRows(response.rows);
						// toast.success(response.message);
					}
					else if (requestType === "list_camp") {
						setCampRows(response.rows);
						// toast.success(response.message);
					}
				}
			}
		};
	}, [refreshLists]);

	const startAuth = useCallback(() => { userRequest("/user/auth", "auth"); }, [userRequest]);

	const charRowElements = charRows.map(
		(row) => { return <ListRow row={row} dt={row.created.split("T")} type={"character"} setDisplay={setDisplay} setLastKey={setLastCharKey} setLastData={setLastCharData} />; }
	);

	const campRowElements = campRows.map(
		(row) => { return <ListRow row={row} dt={row.created.split("T")} type={"campaign"} setDisplay={setDisplay} setLastKey={setLastCampKey} setLastData={setLastCampData} />; }
	);

	const checkDisplaying = useCallback(() => {
		switch (display) {
			case "character":
				return <CharacterSheet type={displayType} close={close} userRequest={userRequest} />;
			case "campaign":
				return <CampaignSheet type={displayType} close={close} userRequest={userRequest} />;
			case "add_to_campaign":
				return <Mini title="Add a Character to Campaign" label="Character Key" camp_key={lastCampKey} rType="add" close={close} userRequest={userRequest} />;
			case "remove_from_campaign":
				return <Mini title="Remove a Character from Campaign" label="Character Name" camp_key={lastCampKey} rType="remove" close={close} userRequest={userRequest} />;
			case "add_to_character":
				return <Mini title="Add Character to a Campaign" label="Campaign Key" char_key={lastCharKey} rType="add" close={close} userRequest={userRequest} />;
			case "remove_from_character":
				return <Mini title="Remove Character from Campaign" char_key={lastCharKey} rType="remove" close={close} userRequest={userRequest} />;
			default:
			case "none":
				return <Fragment />;
		}
	}, [display, displayType, lastCampKey, lastCharKey, userRequest]);

	useEffect(() => {
		if (!isLoggedIn) { startAuth(); }

		setDisplaying(checkDisplaying());
	}, [lastCampKey, lastCharKey, charRows, campRows, isLoggedIn, checkDisplaying, startAuth]);

	return (
		<StrictMode>
			<ToastContainer
				position="top-center"
				autoClose={3000}
				transition={Slide}
				hideProgressBar={true}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable={false}
				pauseOnHover={true}
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
							<input className="button" type="button" value="Create New Character" onClick={() => { setDisplayType("new"); setDisplay("character"); }} />
							<div className="list">
								{charRowElements}
							</div>
						</div>

						<div className="my-campaigns">
							<div className="title">MY CAMPAIGNS</div>
							<input className="button" type="button" value="Create New Campaign" onClick={() => { setDisplayType("new"); setDisplay("campaign"); }} />
							<div className="list">
								{campRowElements}
							</div>
						</div>
					</div>

					{displaying}
				</div>
			}
		</StrictMode>
	);
}

ReactDOM.render(<App />, document.getElementById("root"));