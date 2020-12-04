import { Fragment, useCallback, useEffect, useState } from "react";

import { DiceRoller } from "./dashboard/charactersheet/DiceRoller";

import { CharacterSheet } from "./dashboard/CharacterSheet";
import { CampaignSheet } from "./dashboard/CampaignSheet";
import { ListRow } from "./dashboard/ListRow";
import { Map } from "./dashboard/Map";

import { Topbar } from "./shared/Topbar";

export function Dashboard({ userRequest }: basicprops): JSX.Element {
	const [display, setDisplay] = useState(["none", "none", "", {}] as [displayelement, displaytype, string, any]); // el, type, key, data
	const [diceRoller, setDiceRoller] = useState(<Fragment key="a" />);
	const [mapDisplay, setMapDisplay] = useState(false);

	const [listCount, setListCount] = useState(0);

	const [charRows, setCharRows] = useState<JSX.Element[]>([]);
	const [campRows, setCampRows] = useState<JSX.Element[]>([]);


	const toggleMap = () => {
		setMapDisplay((mapDisplay) ? false : true);
	};

	const close = (): void => {
		setDisplay(["none", "none", "", {}]);
		setListCount(l => l + 1);
	};

	const getLists = useCallback(() => {
		setListCount(l => l + 1);
	}, []);

	const closeDiceRoller = (): void => {
		setDiceRoller(<Fragment />);
	};

	const openDiceRoller = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, type: string): void => {
		setDiceRoller(<DiceRoller key="b" type={type} event={event} close={closeDiceRoller} userRequest={userRequest} />);
	};

	useEffect(() => {
		userRequest("/char/list", "list_char")
			.then((val) => {
				setCharRows((val as any[]).map((row: any, index: number) => {
					return <ListRow key={index} rowData={{ data: row, datetime: row.created.split("T"), type: "character" } as rowDataset} setDisplay={setDisplay} />;
				}));
			});

		userRequest("/camp/list", "list_camp")
			.then((val) => {
				setCampRows((val as any[]).map((row: any, index: number) => {
					return <ListRow key={index} rowData={{ data: row, datetime: row.created.split("T"), type: "campaign" } as rowDataset} setDisplay={setDisplay} />;
				}));
			});
	}, [listCount, userRequest]);

	return (
		<div className="main-wrapper">
			<div className="dashboard">
				<Topbar showLogout={true} toggleMap={toggleMap} userRequest={userRequest} />

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

			{(mapDisplay) ? <Map /> : null}

			{(display[0] === "character")
				? <Fragment>
					<CharacterSheet userData={display[3]} displayType={display[1]} close={close} getLists={getLists} userRequest={userRequest} openDiceRoller={openDiceRoller} />
					{diceRoller}
				</Fragment>
				: null}

			{(display[0] === "campaign")
				? <CampaignSheet userData={display[3]} displayType={display[1]} close={close} getLists={getLists} userRequest={userRequest} openDiceRoller={openDiceRoller} />
				: null}
		</div>
	);
}