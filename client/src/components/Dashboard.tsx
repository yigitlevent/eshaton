import { useCallback, useEffect, useState } from "react";

import { ListRow } from "../parts/ListRow";

import { CharacterSheet } from "./CharacterSheet";
import { CampaignSheet } from "./CampaignSheet";
import { Topbar } from "./Topbar";

export function Dashboard({ userRequest }: basicprops): JSX.Element {
	const [display, setDisplay] = useState(["none", "none", "", {}] as [displayelement, displaytype, string, any]); // el, type, key, data

	const [listCount, setListCount] = useState(0);

	const [charRows, setCharRows] = useState<JSX.Element[]>([]);
	const [campRows, setCampRows] = useState<JSX.Element[]>([]);

	const close = (): void => {
		setDisplay(["none", "none", "", {}]);
		setListCount(l => l + 1);
	};

	const getLists = useCallback(() => {
		setListCount(l => l + 1);
	}, []);

	useEffect(() => {
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
	}, [listCount, userRequest]);

	return (
		<div className="main-wrapper">
			<div className="dashboard">
				<Topbar showLogout={true} userRequest={userRequest} />

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
				? <CharacterSheet data={display[3]} type={display[1]} close={close} getLists={getLists} userRequest={userRequest} />
				: null}

			{(display[0] === "campaign")
				? <CampaignSheet data={display[3]} type={display[1]} close={close} getLists={getLists} userRequest={userRequest} />
				: null}
		</div>
	);
}