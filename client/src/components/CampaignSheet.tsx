import { useRef } from "react";

import { Divider } from "../parts/Divider";
import { generate } from "../shared/generate";

export function CampaignSheet({ type, close, userRequest }: sheetprops): JSX.Element {
	const ref = useRef({} as HTMLFormElement);

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
		delete testObject["s_submit"];
		delete testObject["s_close"];

		console.log(testObject);

		return {
			s_name: (testObject.s_campaign_name as string),
			s_secretkey: testObject.s_campaign_id
		};
	};

	const submitCamp = (event: React.FormEvent<HTMLInputElement>) => {
		event.preventDefault();
		userRequest("/camp/new", "new_camp", getData());
	};

	return (
		<form ref={ref} className="campaign-sheet">
			<div className="extras">
				<label className="extra label">Campaign ID: </label>
				<input className="extra id" id="s_campaign_id" name="s_campaign_id" value={generate(32)} readOnly />

				<input className="extra" type="button" id="s_close" name="s_close" value="Close" onClick={close} />
				<input className="extra" type="submit" id="s_submit" name="s_submit" value="Save Campaign" onClick={(event) => { submitCamp(event); }} />

				<br />

				<label className="extra">Campaign Name: </label>
				<input className="extra" type="text" id="s_campaign_name" name="s_campaign_name" />
			</div>
		</form>
	);
}