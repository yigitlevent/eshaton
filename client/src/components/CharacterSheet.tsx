import { useRef } from "react";
import { toast } from "react-toastify";

import { Divider } from "../parts/Divider";
import { Block } from "../parts/Block";
import { Table } from "../parts/Table";
import { generate } from "../shared/generate";

export function CharacterSheet({ type, close, userRequest }: sheetprops): JSX.Element {
	const ref = useRef({} as HTMLFormElement);
	const importRef = useRef({} as HTMLInputElement);

	const getData = () => {
		let testObject: { [key: string]: string | boolean; } = {};

		for (let i = 0; i < ref.current.length; i++) {
			if ((ref.current[i] as HTMLInputElement).type === "checkbox") {
				testObject[ref.current[i].id] = (ref.current[i] as HTMLInputElement).checked;
			}
			else {
				testObject[ref.current[i].id] = (ref.current[i] as HTMLInputElement).value;
			}
		}
		delete testObject["c_close"];
		delete testObject["c_submit"];
		delete testObject["c_export"];
		delete testObject["c_file"];
		delete testObject["c_import"];

		return {
			c_name: (testObject.c_name as string),
			c_secretkey: testObject.c_character_id,
			c_data: JSON.stringify(testObject)
		};
	};

	const submitChar = (event: React.FormEvent<HTMLInputElement>) => {
		event.preventDefault();
		userRequest("/char/new", "add_char", getData());
	};

	const exportChar = (event: React.FormEvent<HTMLInputElement>) => {
		event.preventDefault();

		let data = getData();
		if (data.c_name.length > 0) {
			let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data.c_data));
			let downloadAnchorNode = document.createElement("a");
			downloadAnchorNode.setAttribute("href", dataStr);
			downloadAnchorNode.setAttribute("download", `${data.c_name.replace(/ /g, '')}.degenesis`);
			document.body.appendChild(downloadAnchorNode); // required for firefox
			downloadAnchorNode.click();
			downloadAnchorNode.remove();
		}
		else { toast.error("Please enter a valid character name."); }
	};

	const importTrigger = () => {
		importRef.current.click();
	};

	const importChar = (event: React.ChangeEvent<HTMLInputElement>) => {
		let file = new FileReader();
		file.readAsText((event.target.files as FileList)[0], "UTF-8");

		file.addEventListener("load", (e: any) => {
			const data = JSON.parse(JSON.parse(e.target?.result));
			loadChar(data);
		});
	};

	const loadChar = (data: any) => {
		for (let key in data) {
			let el = document.querySelector(`#${key}`);

			if (el?.tagName === "INPUT" && (el as HTMLInputElement).type !== "checkbox") {
				(el as HTMLInputElement).value = data[key];
			}
			else if (el?.tagName === "INPUT" && (el as HTMLInputElement).type === "checkbox") {
				(el as HTMLInputElement).checked = data[key];
			}
			else if (el?.tagName === "SELECT") {
				(el as HTMLSelectElement).value = data[key];
				el.dispatchEvent(new Event("change", { bubbles: true }));
			}
		}
	};

	return (
		<form ref={ref} className="character-sheet">
			<div className="extras">
				<label className="extra label">Character ID: </label>
				<input className="extra id" id="c_character_id" name="c_character_id" value={generate(32)} readOnly />
				<label className="extra label">Campaign ID: </label>
				<input className="extra campaign-id" id="c_campaign_id" name="c_campaign_id" type="text" placeholder="Enter Campaign ID" readOnly />

				<input type="file" id="c_file" name="c_file" style={{ display: "none" }} onChange={(event) => { importChar(event); }} ref={importRef} accept=".degenesis" multiple={false} />

				<input className="extra" type="button" id="c_close" name="c_close" value="Close" onClick={close} />
				<input className="extra" type="submit" id="c_submit" name="c_submit" value="Save Character" onClick={(event) => { submitChar(event); }} />
				<input className="extra" type="button" id="c_export" name="c_export" value="Export Character" onClick={(event) => { exportChar(event); }} />
				<input className="extra" type="button" id="c_import" name="c_import" value="Import Character" onClick={(event) => { importTrigger(); }} />
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