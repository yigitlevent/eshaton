import { useCallback, useEffect, useState } from "react";

import { ListRow } from "../parts/ListRow";

import { CharacterSheet } from "./CharacterSheet";
import { CampaignSheet } from "./CampaignSheet";
import { Mini } from "./Mini";
import { Shared } from "./Shared";

export function Dashboard({ userRequest }: basicprops): JSX.Element {
	const [display, setDisplay] = useState(["none", "none", "", {}] as [displayelement, displaytype, string, any]); // el, type, key, data

	const [charRows, setCharRows] = useState([] as any[]);
	const [campRows, setCampRows] = useState([] as any[]);

	const close = (): void => {
		setDisplay(["none", "none", "", {}]);
	};

	const getLists = useCallback((): void => {
		userRequest("/char/list", "list_char")
			.then((val) => {
				setCharRows((val as any[]).map((row: any) => {
					return <ListRow rowData={{ data: row, datetime: row.created.split("T"), type: "character" } as rowDataset} setDisplay={setDisplay} />;
				}));
			});

		userRequest("/camp/list", "list_camp")
			.then((val) => {
				setCampRows((val as any[]).map((row: any) => {
					return <ListRow rowData={{ data: row, datetime: row.created.split("T"), type: "campaign" } as rowDataset} setDisplay={setDisplay} />;
				}));
			});
	}, [userRequest]);

	useEffect(() => {
		getLists();
	}, [getLists]);

	return (
		<div className="main-wrapper">
			<div className="dashboard">
				<Shared showLogout={true} userRequest={userRequest} />

				<div className="my-characters">
					<div className="title">MY CHARACTERS</div>
					<input className="button" type="button" value="Create New Character" onClick={() => { setDisplay(["character", "new", "", {}]); }} />
					<div className="list">
						{charRows}
					</div>
				</div>

				<div className="my-campaigns">
					<div className="title">MY CAMPAIGNS</div>
					<input className="button" type="button" value="Create New Campaign" onClick={() => { setDisplay(["campaign", "new", "", {}]); }} />
					<div className="list">
						{campRows}
					</div>
				</div>
			</div>

			{(display[0] === "character")
				? <CharacterSheet data={display[3]} type={display[1]} close={close} userRequest={userRequest} />
				: null}

			{(display[0] === "campaign")
				? <CampaignSheet data={display[3]} type={display[1]} close={close} userRequest={userRequest} />
				: null}

			{(display[0] === "add_connection")
				? <Mini label="Campaign Key" rType="Add" char_key={display[2]} close={close} userRequest={userRequest} />
				: null}

			{(display[0] === "remove_connection")
				? <Mini label="Character Name" rType="Remove" camp_key={display[2]} close={close} userRequest={userRequest} />
				: null}
		</div>
	);
}