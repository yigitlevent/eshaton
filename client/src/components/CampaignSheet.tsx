import { useRef } from "react";

import { generateNumString } from "../shared/generateNumString";

export function CampaignSheet({ data, type, close, userRequest }: sheetprops): JSX.Element {
	const ref = useRef({} as HTMLFormElement);

	const getData = (): { s_name: string, s_secretkey: string; } => {
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
			s_secretkey: (testObject.s_campaign_id as string)
		};
	};

	const submitCamp = (event: React.FormEvent<HTMLInputElement>, type: string): void => {
		event.preventDefault();
		userRequest(`/camp/${type}`, `${type}_camp` as requests, getData());
	};

	return (
		<form ref={ref} className="campaign-sheet">
			<div className="extras">
				<label className="extra label">Campaign ID: </label>
				<input className="extra id" id="s_campaign_id" name="s_campaign_id" value={generateNumString(32)} readOnly />

				<input className="extra" type="button" id="s_close" name="s_close" value="Close" onClick={close} />

				{(type === "new")
					? <input className="extra" type="submit" id="s_submit" name="s_submit" value="Save Campaign" onClick={(event) => { submitCamp(event, "new"); }} />
					: null}

				{(type === "edit")
					? <input className="extra" type="submit" id="s_submit" name="s_submit" value="Edit Campaign" onClick={(event) => { submitCamp(event, "edit"); }} />
					: null}

				{(type === "delete")
					? <input className="extra" type="submit" id="s_submit" name="s_submit" value="Delete Campaign" onClick={(event) => { submitCamp(event, "delete"); }} />
					: null}

				<br />

				<label className="extra">Campaign Name: </label>
				<input className="extra" type="text" id="s_campaign_name" name="s_campaign_name"
					key={data.name}
					defaultValue={(data && type !== "new") ? data.name : null}
					readOnly={(type === "view" || type === "delete") ? true : false}
				/>
			</div>
		</form>
	);
}