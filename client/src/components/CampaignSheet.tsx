import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { generateNumString } from "../shared/generateNumString";
import { capitalizeFirstLetter } from "../shared/capitalizeFirstLetter";

export function CampaignSheet({ data, type, close, getLists, userRequest }: sheetprops): JSX.Element {
	const refForm = useRef({} as HTMLFormElement);
	const refAdd = useRef({} as HTMLFormElement);
	const refRem = useRef({} as HTMLFormElement);

	const [listCount, setListCount] = useState(0);
	const [charRows, setCharRows] = useState<JSX.Element[]>([]);

	const getLocalLists = useCallback(() => {
		setListCount(l => l + 1);
	}, []);

	const getData = (ref: any): { s_name: string; s_secretkey: string; c_secretkey: string; s_discord_enabled: boolean; s_discord_server: string; s_discord_channel: string; } => {
		let testObject: { [key: string]: string | boolean; } = {};

		for (let i = 0; i < ref.current.length; i++) {
			if ((ref.current[i] as HTMLInputElement).type === "checkbox") {
				testObject[ref.current[i].id] = (ref.current[i] as HTMLInputElement).checked;
			}
			else {
				testObject[ref.current[i].id] = (ref.current[i] as HTMLInputElement).value;
			}
		}
		delete testObject["s_submit"];
		delete testObject["s_close"];

		return {
			s_name: (testObject.s_campaign_name as string),
			s_secretkey: (testObject.s_campaign_id as string),
			c_secretkey: (testObject.key as string),
			s_discord_enabled: (testObject.s_discord_enabled as boolean),
			s_discord_server: (testObject.s_discord_server as string),
			s_discord_channel: (testObject.s_discord_channel as string)
		};
	};

	const submitCamp = (event: React.FormEvent<HTMLInputElement>, type: string): void => {
		event.preventDefault();
		getLists();
		userRequest(`/camp/${type}`, `${type}_camp` as requests, getData(refForm))
			.then((val) => { if (val) close(); });
	};

	const submitMini = (event: React.FormEvent<HTMLInputElement>, type: "add" | "remove"): void => {
		event.preventDefault();
		const data: any = getData((type === "add") ? refAdd : refRem);
		userRequest(
			(type === "add") ? "/camp/add" : "/camp/remove",
			(type === "add") ? "add_connection" : "remove_connection",
			data
		).then(() => { getLists(); getLocalLists(); });
	};

	useEffect(() => {
		userRequest("/camp/get", "get_camp", { s_secretkey: data.secretkey })
			.then((val: any) => {
				if (val && val[0] && val[0].characters) {
					setCharRows((val[0].characters as []).map((character: string, index: number) => {
						return (
							<div className="row characters-list" key={val[0].characters_name[index]}>
								<input className="button secretkey" type="button" onClick={() => { toast.info(`Secret Key: ${character}`); }} value="" />
								<span className="name">{val[0].characters_name[index]}</span>
							</div>
						);
					}));
				}
				else { setCharRows([]); }
			});
	}, [listCount, data.secretkey, userRequest]);

	return (
		<Fragment>
			<form ref={refForm} className="campaign-sheet">
				<div className="extras">
					<label className="extra label">Campaign ID: </label>
					<input className="extra id" id="s_campaign_id" name="s_campaign_id"
						value={(data.secretkey) ? data.secretkey : generateNumString(32)}
						key={generateNumString(32)}
						readOnly
					/>

					<input className="extra" type="button" id="s_close" name="s_close" value="Close" onClick={close} />

					{((type !== "view"))
						? <input className="extra" type="submit" id="s_submit" name="s_submit"
							value={`${(type === "new") ? "Save" : capitalizeFirstLetter(type)} Campaign`}
							onClick={(event) => { submitCamp(event, type); }}
						/>
						: null
					}
				</div>

				<div className="wrapper">
					<label className="extra">Campaign Name:</label>
					<input className="extra" type="text" id="s_campaign_name" name="s_campaign_name"
						key={data.name}
						defaultValue={(data && type !== "new") ? data.name : null}
						readOnly={(type !== "new") ? true : false}
					/>
				</div>

				<div className="wrapper">
					<label className="extra">Discord Bot Integration Enabled:</label>
					<input className="extra" type="checkbox" id="s_discord_enabled" name="s_discord_enabled"
						key={data.discord_enabled}
						defaultChecked={(data && type !== "new") ? data.discord_enabled : false}
						disabled={(type === "view" || type === "delete") ? true : false}
					/>
				</div>

				<div className="wrapper">
					<label className="extra">Discord Server ID:</label>
					<input className="extra" type="text" id="s_discord_server" name="s_discord_server"
						key={data.discord_server}
						defaultValue={(data && type !== "new") ? data.discord_server : null}
						readOnly={(type === "view" || type === "delete") ? true : false}
					/>
				</div>

				<div className="wrapper">
					<label className="extra">Discord Channel Name:</label>
					<input className="extra" type="text" id="s_discord_channel" name="s_discord_channel"
						key={data.s_discord_channel}
						defaultValue={(data && type !== "new") ? data.discord_channel : null}
						readOnly={(type === "view" || type === "delete") ? true : false}
					/>
				</div>

				<div className="title">CHARACTERS</div>
				<div className="list">
					{charRows}
				</div>
			</form>

			{(type !== "edit") ? <form ref={refAdd} className="campaign-sheet">
				<div className="title">ADD CHARACTER</div>
				<div className="wrapper">
					<input className="extra id hide" id="s_campaign_id" name="s_campaign_id"
						value={(data.secretkey) ? data.secretkey : generateNumString(32)}
						key={generateNumString(32)}
						readOnly
					/>

					<div className="block">
						<label>Character Key:</label>
						<input className="key" id="key" name="key" type="text" />
						<input className="button" id="submit" name="submit" type="submit" value="Submit" onClick={(event) => { submitMini(event, "add"); }} />
					</div>
				</div>
			</form> : null}

			{(type === "edit") ? <form ref={refRem} className="campaign-sheet">
				<div className="title">REMOVE CHARACTER</div>
				<div className="wrapper">
					<input className="extra id hide" id="s_campaign_id" name="s_campaign_id"
						value={(data.secretkey) ? data.secretkey : generateNumString(32)}
						key={generateNumString(32)}
						readOnly
					/>

					<div className="block">
						<label>Character Key:</label>
						<input className="key" id="key" name="key" type="text" />
						<input className="button" id="submit" name="submit" type="submit" value="Submit" onClick={(event) => { submitMini(event, "remove"); }} />
					</div>
				</div>
			</form> : null}
		</Fragment>
	);
}