import { useRef } from "react";
import { Divider } from "../parts/Divider";

export function Mini({ title, label, char_key, camp_key, rType, close, userRequest }: miniprops): JSX.Element {
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
		delete testObject["submit"];
		delete testObject["close"];

		return {
			key: (testObject.key as string)
		};
	};

	const submitMini = (event: React.FormEvent<HTMLInputElement>) => {
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

		/*userRequest(
			(rType === "add") ? "/shared/add" : "/shared/remove",
			(rType === "add") ? "add_char_to" : "remove_char_from",
			data
		);*/
	};

	return (
		<form ref={ref} className="mini">
			<Divider>{title}</Divider>
			<div>
				<label style={{ display: (label) ? "initial" : "none" }}>{label}:</label>
				<input className="key" id="key" name="key" type="text" style={{ display: (label) ? "initial" : "none" }} />
				<input className="button" id="submit" name="submit" type="submit" onClick={(event) => { submitMini(event); }} value={(rType === "add") ? "Add" : "Remove"} />
				<input className="button" id="close" name="close" type="button" onClick={close} value="Close" />
			</div>
		</form>
	);
}