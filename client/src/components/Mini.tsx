import { useRef } from "react";

import { Divider } from "../parts/Divider";

export function Mini({ label, rType, char_key, camp_key, close, getLists, userRequest }: miniprops): JSX.Element {
	const ref = useRef({} as HTMLFormElement);

	const getData = (): { key: string; } => {
		let testObject: { [key: string]: string | boolean; } = {};

		for (let i = 0; i < ref.current.length; i++) {
			if ((ref.current[i] as HTMLInputElement).type === "checkbox") {
				testObject[ref.current[i].id] = (ref.current[i] as HTMLInputElement).checked;
			}
			else {
				testObject[ref.current[i].id] = (ref.current[i] as HTMLInputElement).value;
			}
		}
		delete testObject["submit"];
		delete testObject["close"];

		return {
			key: (testObject.key as string)
		};
	};

	const submitMini = (event: React.FormEvent<HTMLInputElement>): void => {
		event.preventDefault();
		let data: any = getData();

		if (char_key) {
			data.char_key = char_key;
			data.camp_key = (label) ? data.key : "";
		}
		else if (camp_key) {
			data.char_key = (label) ? data.key : "";
			data.camp_key = camp_key;
		}
		delete data["key"];

		userRequest(
			(rType === "Add") ? "/char/add" : "/camp/remove",
			(rType === "Add") ? "add_connection" : "remove_connection",
			data
		).then(() => { getLists(); });
	};

	return (
		<form ref={ref} className="mini">
			<Divider>{`${rType} Character ${(rType === "Add") ? "to" : "from"} Campaign`}</Divider>
			<div>
				<div>For: {(char_key) ? char_key : camp_key}</div>
				<br />
				<label>{label}:</label>
				<input className="key" id="key" name="key" type="text" />
				<input className="button" id="submit" name="submit" type="submit" onClick={(event) => { submitMini(event); }} value={rType} />
				<input className="button" id="close" name="close" type="button" onClick={close} value="Close" />
			</div>
		</form>
	);
}