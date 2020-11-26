import { useEffect, useState, StrictMode } from "react";
import ReactDOM from "react-dom";

import "./style.scss";

import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { AttributeBlocks } from "./parts/AttributeBlocks";
import { OriginsBlock } from "./parts/OriginsBlock";
import { PotentialsBlock } from "./parts/PotentialsBlock";
import { ConditionBlock } from "./parts/ConditionBlock";

function App(): JSX.Element {
	const [isLoggedIn, setIsLoggedIn] = useState(true);
	const [isLogin, setIsLogin] = useState(true);

	const [sheet, setSheet] = useState("none" as sheettype);
	const [campaign, setCampaign] = useState("none" as campaigntype);

	const userRequest = (path: string, requestType: requests, data?: registrationform | loginform): void => {
		const request = new XMLHttpRequest();
		request.open("POST", path, true); // true = asynchronous
		request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

		if (data) { request.send(JSON.stringify(data)); }
		else { request.abort(); }

		request.onreadystatechange = () => {
			if (request.readyState === XMLHttpRequest.DONE) {
				const response = JSON.parse(request.response);

				if (response.status === "failure") {
					console.log(response.message);
				}
				else if (requestType === "login" && response.status === "success") {
					console.log(response.message);
					setIsLoggedIn(true);
					// TODO: Login successful.
					// TODO: Load user campaigns and characters
				}
				else if (requestType === "register" && response.status === "success") {
					console.log(response.message);
					setIsLogin(true);
					// TODO: Registration successful, please login.
				}
			}
		};
	};

	useEffect(() => {

	}, []);

	return (
		<StrictMode>
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
						? <div className="character-sheet" onLoad={() => { if (sheet === "edit") { /* TODO: Do editing load */ } }}>
							<hr />

							<input className="basic-text" type="text" id="c_name" name="c_name" placeholder="Name"></input>
							<input className="basic-text" type="text" id="c_rank" name="c_rank" placeholder="Rank"></input>
							<input className="basic-text-mini" type="text" id="c_age" name="c_age" placeholder="Age"></input>
							<input className="basic-text-mini" type="text" id="c_weight" name="c_weight" placeholder="Weight"></input>
							<input className="basic-text-mini" type="text" id="c_height" name="c_height" placeholder="Height"></input>
							<input className="basic-text-mini" type="text" id="c_sex" name="c_sex" placeholder="Sex"></input>
							<input className="basic-text-mini" type="text" id="c_exp" name="c_exp" placeholder="Experience"></input>

							<hr />

							<div className="culture">
								<div className="title">CULTURE</div>
								<div className="logo"></div>
								<input type="text" id="c_culture" name="c_culture" placeholder="Culture"></input>
							</div>

							<div className="concept">
								<div className="title">CONCEPT</div>
								<div className="logo"></div>
								<input type="text" id="c_concept" name="c_concept" placeholder="Concept"></input>
							</div>

							<div className="cult">
								<div className="title">CULT</div>
								<div className="logo"></div>
								<input type="text" id="c_cult" name="c_cult" placeholder="Cult"></input>
							</div>

							<hr />

							{AttributeBlocks()}

							<hr />

							{OriginsBlock()}

							{ConditionBlock()}

							{PotentialsBlock()}

							<hr />

						</div>
						: null
					}

				</div>
			}
		</StrictMode>
	);
}

ReactDOM.render(<App />, document.getElementById("root"));