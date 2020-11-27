import { useRef } from "react";

import { Divider } from "../parts/Divider";
import { Block } from "../parts/Block";
import { Table } from "../parts/Table";
import { generate } from "../shared/generate";

export function CharacterSheet({ sheet, userRequest }: charactersheetprops): JSX.Element {
	const ref = useRef({} as HTMLFormElement);

	const submit = (event: React.FormEvent<HTMLInputElement>) => {
		event.preventDefault();
		let testObject: { [key: string]: string | boolean; } = {};

		for (let i = 0; i < ref.current.length; i++) {
			if ((ref.current[i] as HTMLInputElement).type === "checkbox") {
				testObject[ref.current[i].id] = (ref.current[i] as HTMLInputElement).checked;
			}
			else {
				testObject[ref.current[i].id] = (ref.current[i] as HTMLInputElement).value;
			}
		}
		delete testObject["c_submit"];

		userRequest("/char/new", "add_char", {
			c_name: testObject.c_name,
			c_secretkey: testObject.c_character_id,
			c_data: JSON.stringify(testObject)
		});
	};

	return (
		<form ref={ref} className="character-sheet" onLoad={() => { if (sheet === "edit") { /* TODO: Do editing load */ } }}>
			<div className="extras">
				<label className="extra label">Character ID: </label>
				<input className="extra id" id="c_character_id" name="c_character_id" value={generate(32)} readOnly />
				<label className="extra label">Campaign ID: </label>
				<input className="extra campaign-id" id="c_campaign_id" name="c_campaign_id" type="text" placeholder="Enter Campaign ID" readOnly />
				<input className="extra" type="submit" id="c_submit" name="c_submit" value="Save Character" onClick={(event) => { submit(event); }} />
			</div>

			<Divider>{`ARCHETYPE`}</Divider>
			<div className="wrapper">
				<Block datakey={"main-left"} />
				<Block datakey={"main-center"} />
				<Block datakey={"main-right"} />
			</div>

			<div className="wrapper">
				<Block datakey={"culture"} />
				<Block datakey={"concept"} />
				<Block datakey={"cult"} />
			</div>

			<Divider>{`ATTRIBUTES & SKILLS`}</Divider>
			<div className="wrapper">
				<Block datakey={"body"} />
				<Block datakey={"agility"} />
				<Block datakey={"charisma"} />
				<Block datakey={"intellect"} />
				<Block datakey={"psyche"} />
				<Block datakey={"instinct"} />
			</div>

			<Divider>{`ADVANTAGES`}</Divider>
			<div className="wrapper">
				<Block datakey={"origins"} />
				<Block datakey={"potentials"} />
				<Block datakey={"scars"} />
			</div>

			<Divider>{`CONDITION`}</Divider>
			<div className="wrapper">
				<Block datakey={"modifiers"} />
				<Block datakey={"conditions"} />
				<Block datakey={"complications"} />
			</div>

			<Divider>{`ARSENAL`}</Divider>
			<div className="wrapper">
				<Table datakey={"weapons"} />
				<Table datakey={"armors"} />
			</div>

			<Divider>{`POSSESSIONS`}</Divider>
			<div className="wrapper">
				<Table datakey={"equipments_1"} />
				<Table datakey={"equipments_2"} />
				<Table datakey={"equipments_3"} />
				<Table datakey={"artifacts"} />
			</div>
		</form>
	);
}