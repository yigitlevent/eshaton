import { Fragment, useRef } from "react";

import { capitalize } from "../shared/capitalize";
import { roll } from "../shared/roll";

import { attributes } from "../data/abilities";
import { toast } from "react-toastify";

export function DiceRoller({ type, event, close, userRequest }: dicerollerprops): JSX.Element {
	const diceRef = useRef({} as HTMLFormElement);

	const getData = (): { attribute: string; modifier: number; difficulty: number; } => {
		let testObject: { [key: string]: string | boolean; } = {};

		for (let i = 0; i < diceRef.current.length; i++) {
			if ((diceRef.current[i] as HTMLInputElement).type === "checkbox") {
				testObject[diceRef.current[i].id] = (diceRef.current[i] as HTMLInputElement).checked;
			}
			else {
				testObject[diceRef.current[i].id] = (diceRef.current[i] as HTMLInputElement).value;
			}
		}
		delete testObject["close"];
		delete testObject["roll"];

		return {
			attribute: testObject.attribute as string,
			modifier: parseInt(testObject.modifier as string),
			difficulty: parseInt(testObject.difficulty as string),
		};
	};

	const rollDice = (rollEvent: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const element = (rollEvent.target as HTMLInputElement);

		let firstNumber = 0;
		let secondNumber = 0;
		let modifier = 0;
		let isSkillRoll = false;

		let next = (element.nextElementSibling as HTMLInputElement);
		let isNext = next.classList.contains("checkbox") === true;

		while (isNext) {
			if (next.checked === true) { firstNumber++; }
			next = next.nextElementSibling as HTMLInputElement;
			isNext = next.nextElementSibling?.classList.contains("checkbox") === true;
		}

		const data = getData();

		if (data.modifier) {
			modifier = data.modifier | 0;
		}

		if (data.attribute) {
			isSkillRoll = true;
			let attr = data.attribute;
			let attrEl = document.getElementById(attr);

			let next = (attrEl?.nextElementSibling as HTMLInputElement);
			let isNext = next.classList.contains("checkbox") === true;

			while (isNext) {
				if (next.checked === true) { secondNumber++; }
				next = next.nextElementSibling as HTMLInputElement;
				isNext = next.nextElementSibling?.classList.contains("checkbox") === true;
			}
		}

		const charName = (document.getElementById("c_name") as any).value;
		const totalDice = firstNumber + secondNumber + modifier;
		let resultMessage = `rolled ${(data.attribute) ? `${capitalize(data.attribute.substring(2))}+` : ""}${capitalize(element.innerText.toLowerCase())}. `;

		if (totalDice < 1) {
			resultMessage += `Action number is zero, no dice has been rolled.`;
		}
		else {
			const results = roll(totalDice);

			resultMessage += `Results: ${results.results.join(", ")}. `;

			let countText = "";
			if (results.countSuccesses === 0 && results.countOnes > 0) {
				countText = `Botch with ${results.countOnes} one${(results.countOnes > 1) ? "s" : ""}.`;
			}
			else if (results.countSuccesses < data.difficulty) {
				countText = `Failed with ${results.countSuccesses} success${(results.countSuccesses > 1) ? "es" : ""} against a difficulty of ${data.difficulty}.`;
			}
			else if (results.countSuccesses == data.difficulty) {
				countText = `Tied with ${results.countSuccesses} success${(results.countSuccesses > 1) ? "es" : ""} against a difficulty of ${data.difficulty}.`;
			}
			else if (results.countSuccesses >= data.difficulty) {
				countText = `Succeeded with ${results.countSuccesses} success${(results.countSuccesses > 1) ? "es" : ""} against a difficulty of ${data.difficulty}.`;
			}
			else { countText = "Something went very wrong."; }

			resultMessage += `${countText}`;
		}

		userRequest("/dice/roll", "dice_roll", { d_charname: charName, d_message: resultMessage, d_display_name: charName })
			.then(() => { toast.success(resultMessage, { autoClose: false, closeOnClick: false }); });
	};

	const attr = attributes.map((att) => {
		return <option value={`c_${att}`}>{capitalize(att)}</option>;
	});

	return (
		<div className="dice-roller-wrapper">
			<div className="background" onClick={() => { close(); }} />
			<form className="dice-roller" ref={diceRef}>
				<div className="inner">
					<div className="title">{`Roll ${capitalize((event.target as any).innerText.toLowerCase())}`}</div>

					{(type === "skill")
						? <Fragment>
							<label>Select Attribute:</label>
							<select className="attribute" name="attribute" id="attribute" defaultValue="body">{attr}</select>
						</Fragment>
						: <Fragment><div></div><div></div></Fragment>}

					<label>Modifier:</label>
					<input type="number" className="modifier" name="modifier" id="modifier" defaultValue={0} min={-10} max={10} />

					<label>Difficulty:</label>
					<input type="number" className="difficulty" name="difficulty" id="difficulty" defaultValue={2} min={1} max={20} />

					<input type="button" className="close" name="close" id="close" value="Close" onClick={() => { close(); }} />
					<input type="button" className="roll" name="roll" id="roll" value="Roll" onClick={() => { rollDice(event); }} />
				</div>
			</form>
		</div>
	);
}