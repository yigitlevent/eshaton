import { useRef } from "react";
import { toast } from "react-toastify";

import { generateNumString } from "../shared/generateNumString";

import { Divider } from "../parts/Divider";
import { Block } from "../parts/Block";
import { Table } from "../parts/Table";
import { capitalize } from "../shared/capitalize";

export function CharacterSheet({ data, type, close, getLists, userRequest }: sheetprops): JSX.Element {
	const ref = useRef({} as HTMLFormElement);
	const importRef = useRef({} as HTMLInputElement);

	const getData = (): { c_name: string, c_secretkey: string, c_data: string; } => {
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
			c_secretkey: (testObject.c_character_id as string),
			c_data: JSON.stringify(testObject)
		};
	};

	const submitChar = (event: React.FormEvent<HTMLInputElement>, type: string): void => {
		event.preventDefault();
		getLists();
		userRequest(`/char/${type}`, `${type}_char` as requests, getData())
			.then((val) => { if (val) close(); });
	};

	const exportChar = (event: React.FormEvent<HTMLInputElement>): void => {
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

	const importTrigger = (): void => {
		importRef.current.click();
	};

	const importChar = (event: React.ChangeEvent<HTMLInputElement>): void => {
		let file = new FileReader();
		file.readAsText((event.target.files as FileList)[0], "UTF-8");

		file.addEventListener("load", (e: any) => {
			const data = JSON.parse(JSON.parse(e.target?.result));
			loadChar(data);
		});
	};

	const loadChar = (data: any): void => {
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

				<input className="extra id" id="c_character_id" name="c_character_id"
					value={(data.secretkey) ? data.secretkey : generateNumString(32)}
					key={generateNumString(32)}
					readOnly
				/>

				<label className="extra label">Campaign ID: </label>
				<input className="extra campaign-id" id="c_campaign_id" name="c_campaign_id" type="text" placeholder="Enter Campaign ID" readOnly />
				<input type="file" id="c_file" name="c_file" style={{ display: "none" }} onChange={(event) => { importChar(event); }} ref={importRef} accept=".degenesis" multiple={false} />

				<input className="extra" type="button" id="c_close" name="c_close" value="Close" onClick={close} />


				{((type !== "view"))
					? <input className="extra" type="submit" id="s_submit" name="s_submit" value={`${(type === "new") ? "Save" : capitalize(type)} Character`}
						onClick={(event) => { submitChar(event, type); }}
					/>
					: null
				}

				<input className="extra" type="button" id="c_export" name="c_export" value="Export Character" onClick={(event) => { exportChar(event); }} />
				<input className="extra" type="button" id="c_import" name="c_import" value="Import Character" onClick={(event) => { importTrigger(); }} />
			</div>

			<Divider>{`ARCHETYPE`}</Divider>
			<div className="wrapper">
				<Block datakey={"main-left"} type={type} data={data} />
				<Block datakey={"main-center"} type={type} data={data} />
				<Block datakey={"main-right"} type={type} data={data} />
			</div>

			<div className="wrapper">
				<Block datakey={"culture"} type={type} data={data} />
				<Block datakey={"concept"} type={type} data={data} />
				<Block datakey={"cult"} type={type} data={data} />
			</div>

			<Divider>{`ATTRIBUTES & SKILLS`}</Divider>
			<div className="wrapper">
				<Block datakey={"body"} type={type} data={data} />
				<Block datakey={"agility"} type={type} data={data} />
				<Block datakey={"charisma"} type={type} data={data} />
				<Block datakey={"intellect"} type={type} data={data} />
				<Block datakey={"psyche"} type={type} data={data} />
				<Block datakey={"instinct"} type={type} data={data} />
			</div>

			<Divider>{`ADVANTAGES`}</Divider>
			<div className="wrapper">
				<Block datakey={"origins"} type={type} data={data} />
				<Block datakey={"potentials"} type={type} data={data} />
				<Block datakey={"scars"} type={type} data={data} />
			</div>

			<Divider>{`CONDITION`}</Divider>
			<div className="wrapper">
				<Block datakey={"modifiers"} type={type} data={data} />
				<Block datakey={"conditions"} type={type} data={data} />
				<Block datakey={"complications"} type={type} data={data} />
			</div>

			<Divider>{`ARSENAL`}</Divider>
			<div className="wrapper">
				<Table datakey={"weapons"} type={type} data={data} />
				<Table datakey={"armors"} type={type} data={data} />
			</div>

			<Divider>{`POSSESSIONS`}</Divider>
			<div className="wrapper">
				<Table datakey={"equipments_1"} type={type} data={data} />
				<Table datakey={"equipments_2"} type={type} data={data} />
				<Table datakey={"equipments_3"} type={type} data={data} />
				<Table datakey={"artifacts"} type={type} data={data} />
			</div>
		</form>
	);
}