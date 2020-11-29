import { useCallback, useEffect, useState } from "react";

import { CharacterSheet } from "./CharacterSheet";
import { CampaignSheet } from "./CampaignSheet";
import { Mini } from "./Mini";

import { ListRow } from "../parts/ListRow";

export function Dashboard({ userRequest }: basicprops): JSX.Element {
	const [display, setDisplay] = useState("none" as displayelement);
	const [displayType, setDisplayType] = useState("none" as displaytype);

	const [charRows, setCharRows] = useState([] as any[]);
	const [campRows, setCampRows] = useState([] as any[]);

	const [lastCharKey, setLastCharKey] = useState("");
	const [lastCampKey, setLastCampKey] = useState("");

	const [lastCharData, setLastCharData] = useState("" as any);
	const [lastCampData, setLastCampData] = useState("" as any);

	const close = (): void => {
		setDisplay("none");
		setDisplayType("none");
	};

	const getLists = useCallback((): void => {
		userRequest("/char/list", "list_char")
			.then((val) => {
				setCharRows((val as any[]).map((row: any) => {
					return <ListRow row={row} dt={row.created.split("T")} type={"Add"} setDisplay={setDisplay} setLastKey={setLastCharKey} setLastData={setLastCharData} />;
				}));
			});

		userRequest("/camp/list", "list_camp")
			.then((val) => {
				setCampRows((val as any[]).map((row: any) => {
					return <ListRow row={row} dt={row.created.split("T")} type={"Remove"} setDisplay={setDisplay} setLastKey={setLastCampKey} setLastData={setLastCampData} />;
				}));
			});


	}, [userRequest]);

	useEffect(() => {
		getLists();
	}, [getLists]);

	return (
		<div className="main-wrapper">
			<div className="dashboard">
				<div className="logo" />
				<div className="title">ESHATON // DASHBOARD</div>
				<input className="logout" type="button" onClick={() => { userRequest("/user/logout", "logout"); }} value="Logout" />

				<div className="my-characters">
					<div className="title">MY CHARACTERS</div>
					<input className="button" type="button" value="Create New Character" onClick={() => { setDisplayType("new"); setDisplay("character"); }} />
					<div className="list">
						{charRows}
					</div>
				</div>

				<div className="my-campaigns">
					<div className="title">MY CAMPAIGNS</div>
					<input className="button" type="button" value="Create New Campaign" onClick={() => { setDisplayType("new"); setDisplay("campaign"); }} />
					<div className="list">
						{campRows}
					</div>
				</div>
			</div>

			{(display === "character")
				? <CharacterSheet type={displayType} close={close} userRequest={userRequest} />
				: null}

			{(display === "campaign")
				? <CampaignSheet type={displayType} close={close} userRequest={userRequest} />
				: null}

			{(display === "add_connection")
				? <Mini label="Campaign Key" rType="Add" char_key={lastCharKey} close={close} userRequest={userRequest} />
				: null}

			{(display === "remove_connection")
				? <Mini label="Character Name" rType="Remove" camp_key={lastCampKey} close={close} userRequest={userRequest} />
				: null}
		</div>
	);
}