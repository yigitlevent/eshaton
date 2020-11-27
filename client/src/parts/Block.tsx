import { useEffect, useRef, useState } from "react";

const BLOCKS: { [key: string]: blockrow[]; } = {
	"main-left": [
		{ name: "Name", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Rank", type: "input", checkboxes: 0, placeholder: true },
		{ name: "empty", type: "empty", checkboxes: 0 },
		{ name: "Relationships", type: "title", checkboxes: 0 },
		{ name: "relation_0", type: "input", checkboxes: 0 },
		{ name: "relation_1", type: "input", checkboxes: 0 },
		{ name: "relation_2", type: "input", checkboxes: 0 },
		{ name: "relation_3", type: "input", checkboxes: 0 },
		{ name: "relation_4", type: "input", checkboxes: 0 },
		{ name: "relation_5", type: "input", checkboxes: 0 }
	],

	"main-center": [
		{ name: "Character Portrait", type: "input", checkboxes: 0, placeholder: true },
		{ name: "empty", type: "empty", checkboxes: 0 },
		{ name: "Age", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Weight", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Sex", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Drafts", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Dinars", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Experience", type: "input", checkboxes: 0, placeholder: true },
	],

	"main-right": [
		{ name: "Visuals", type: "title", checkboxes: 0 },
		{ name: "visual_0", type: "input", checkboxes: 0 },
		{ name: "visual_1", type: "input", checkboxes: 0 },
		{ name: "visual_2", type: "input", checkboxes: 0 },
		{ name: "visual_3", type: "input", checkboxes: 0 },
		{ name: "empty", type: "empty", checkboxes: 0 },
		{ name: "Legacies", type: "title", checkboxes: 0 },
		{ name: "legacy_0", type: "input", checkboxes: 0 },
		{ name: "legacy_1", type: "input", checkboxes: 0 },
		{ name: "legacy_2", type: "input", checkboxes: 0 }
	],

	"culture": [
		{ name: "Culture", type: "title-major", checkboxes: 0 },
		{ name: "culture", type: "logo", checkboxes: 0 },
		{ name: "culture-select", type: "select", checkboxes: 0, selectdata: ["Borca", "Franka", "Pollen", "Balkhan", "Hyprispania", "Purgare", "Africa"] }
	],
	"concept": [
		{ name: "Concept", type: "title-major", checkboxes: 0 },
		{ name: "concept", type: "logo", checkboxes: 0 },
		{ name: "concept-select", type: "select", checkboxes: 0, selectdata: ["0. The Advanturer", "I. The Creator", "II. The Mentor", "III. The Martyr", "IV. The Ruler", "V. The Seeker", "VI. The Healer", "VII. The Traditionalist", "VIII. The Mediator", "IX. The Hermit", "X. The Heretic", "XI. The Conqueror", "XII. The Abomination", "XIII. Destroyer", "XIV. The Chosen", "XV. The Defiler", "XVI. The Protector", "XVII. The Visionary", "XVIII. The Zealot", "XIX. The Disciple", "XX. The Righteous", "XXI. The Traveller"] }
	],
	"cult": [
		{ name: "Cult", type: "title-major", checkboxes: 0 },
		{ name: "cult", type: "logo", checkboxes: 0 },
		{ name: "cult-select", type: "select", checkboxes: 0, selectdata: ["Spitalians", "Chroniclers", "Hellvetics", "Judges", "Clanners", "Scrappers", "Neolibyans", "Scourgers", "Anubians", "Jehammedans", "Apocalyptics", "Anabaptists", "Palers"] }
	],

	"body": [
		{ name: "Body", type: "title", checkboxes: 6 },
		{ name: "Athletics", type: "normal", checkboxes: 6 },
		{ name: "Brawl", type: "normal", checkboxes: 6 },
		{ name: "Force", type: "normal", checkboxes: 6 },
		{ name: "Melee", type: "normal", checkboxes: 6 },
		{ name: "Stamina", type: "normal", checkboxes: 6 },
		{ name: "Toughness", type: "normal", checkboxes: 6 }
	],
	"agility": [
		{ name: "Agility", type: "title", checkboxes: 6 },
		{ name: "Crafting", type: "normal", checkboxes: 6 },
		{ name: "Dexterity", type: "normal", checkboxes: 6 },
		{ name: "Navigation", type: "normal", checkboxes: 6 },
		{ name: "Mobility", type: "normal", checkboxes: 6 },
		{ name: "Projectiles", type: "normal", checkboxes: 6 },
		{ name: "Stealth", type: "normal", checkboxes: 6 }
	],
	"charisma": [
		{ name: "Arts", type: "title", checkboxes: 6 },
		{ name: "Conduct", type: "normal", checkboxes: 6 },
		{ name: "Expression", type: "normal", checkboxes: 6 },
		{ name: "Leadership", type: "normal", checkboxes: 6 },
		{ name: "Negotiation", type: "normal", checkboxes: 6 },
		{ name: "Seduction", type: "normal", checkboxes: 6 },
		{ name: "Stealth", type: "normal", checkboxes: 6 }
	],
	"intellect": [
		{ name: "Intellect", type: "title", checkboxes: 6 },
		{ name: "Artifact Lore", type: "normal", checkboxes: 6 },
		{ name: "Engineering", type: "normal", checkboxes: 6 },
		{ name: "Focus", type: "normal", checkboxes: 6 },
		{ name: "Legends", type: "normal", checkboxes: 6 },
		{ name: "Medicine", type: "normal", checkboxes: 6 },
		{ name: "Science", type: "normal", checkboxes: 6 }
	],
	"psyche": [
		{ name: "Psyche", type: "title", checkboxes: 6 },
		{ name: "Cunning", type: "normal", checkboxes: 6 },
		{ name: "Deception", type: "normal", checkboxes: 6 },
		{ name: "Domination", type: "normal", checkboxes: 6 },
		{ name: "Faith", type: "normal", checkboxes: 6 },
		{ name: "Reaction", type: "normal", checkboxes: 6 },
		{ name: "Willpower", type: "normal", checkboxes: 6 }
	],
	"instinct": [
		{ name: "Instinct", type: "title", checkboxes: 6 },
		{ name: "Empathy", type: "normal", checkboxes: 6 },
		{ name: "Orienteering", type: "normal", checkboxes: 6 },
		{ name: "Perception", type: "normal", checkboxes: 6 },
		{ name: "Primal", type: "normal", checkboxes: 6 },
		{ name: "Survival", type: "normal", checkboxes: 6 },
		{ name: "Taming", type: "normal", checkboxes: 6 }
	],

	"origins": [
		{ name: "Origins", type: "title", checkboxes: 0 },
		{ name: "Allies", type: "normal", checkboxes: 6 },
		{ name: "Authority", type: "normal", checkboxes: 6 },
		{ name: "Network", type: "normal", checkboxes: 6 },
		{ name: "Renown", type: "normal", checkboxes: 6 },
		{ name: "Resource", type: "normal", checkboxes: 6 },
		{ name: "Secrets", type: "normal", checkboxes: 6 }
	],

	"potentials": [
		{ name: "Potentials", type: "title", checkboxes: 0 },
		{ name: "potential_0", type: "input", checkboxes: 3 },
		{ name: "potential_1", type: "input", checkboxes: 3 },
		{ name: "potential_2", type: "input", checkboxes: 3 },
		{ name: "potential_3", type: "input", checkboxes: 3 },
		{ name: "potential_4", type: "input", checkboxes: 3 },
		{ name: "potential_5", type: "input", checkboxes: 3 }
	],

	"scars": [
		{ name: "Scars", type: "title", checkboxes: 0 },
		{ name: "Group Name", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Alignment", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Constellation", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Scars Value", type: "input", checkboxes: 0, placeholder: true },
		{ name: "Infamy", type: "normal", checkboxes: 6 }
	],

	"modifiers": [
		{ name: "Modifiers", type: "title", checkboxes: 0 },
		{ name: "modifier_0", type: "input", checkboxes: 0 },
		{ name: "modifier_1", type: "input", checkboxes: 0 },
		{ name: "modifier_2", type: "input", checkboxes: 0 },
		{ name: "modifier_3", type: "input", checkboxes: 0 },
		{ name: "modifier_4", type: "input", checkboxes: 0 },
		{ name: "modifier_6", type: "input", checkboxes: 0 },
		{ name: "modifier_5", type: "input", checkboxes: 0 }
	],

	"conditions": [
		{ name: "ego", type: "condition", checkboxes: 24 },
		{ name: "Ego", type: "condition-title", checkboxes: 0 },
		{ name: "spore", type: "condition", checkboxes: 24 },
		{ name: "Spore Infestations", type: "condition-title", checkboxes: 0 },
		{ name: "flesh", type: "condition", checkboxes: 24 },
		{ name: "Fleshwounds", type: "condition-title", checkboxes: 0 },
		{ name: "trauma", type: "condition", checkboxes: 12 },
		{ name: "Traumas", type: "condition-title", checkboxes: 0 },
	],

	"complications": [
		{ name: "Complications", type: "title", checkboxes: 0 },
		{ name: "complication_0", type: "input", checkboxes: 0 },
		{ name: "complication_1", type: "input", checkboxes: 0 },
		{ name: "complication_2", type: "input", checkboxes: 0 },
		{ name: "complication_3", type: "input", checkboxes: 0 },
		{ name: "complication_4", type: "input", checkboxes: 0 },
		{ name: "complication_5", type: "input", checkboxes: 0 },
		{ name: "complication_6", type: "input", checkboxes: 0 }
	],
};

export function Block({ datakey }: blockprops): JSX.Element {
	const imgRef: React.MutableRefObject<HTMLImageElement> | React.MutableRefObject<null> = useRef(null);
	const [imgSrc, setImgSrc] = useState(`./assets/icons/empty.svg`);

	const selectChange = (event: React.ChangeEvent<HTMLSelectElement>, rowName: string) => {
		console.log(event.target.value);
		//@ts-ignore
		setImgSrc(`./assets/icons/${rowName}/${event.target.value}.svg`);
	};

	const BLOCKDATA = BLOCKS[datakey];
	const items = BLOCKDATA.map(
		(row) => {
			const checkboxes: JSX.Element[] = [];

			for (let i = 0; i < row.checkboxes; i++) {
				//inputReferences[`${row.name.toLowerCase().replace(/ /g, '')}}_${i}`] = "";

				// TODO STORE REFERENCES?

				checkboxes.push(
					<input
						key={`c_${row.name.toLowerCase().replace(/ /g, '')}_${i}`}
						type="checkbox"
						className="checkbox"
						id={`c_${row.name.toLowerCase().replace(/ /g, '')}_${i}`}
						name={`c_${row.name.toLowerCase().replace(/ /g, '')}_${i}`}
					/>
				);
			}

			return (
				<div key={row.name} className={`row columns-${row.checkboxes} ${row.type}`}>
					{(row.type !== "empty" && row.type !== "condition" && row.type !== "input" && row.type !== "select" && row.type !== "logo")
						? <div className={`${row.type} span-${row.checkboxes + 1}`}>{row.name.toUpperCase()}</div>
						: null
					}

					{(row.type === "input")
						? <input
							className={`${row.type} span-${row.checkboxes + 1}`}
							type="text" id={`c_${row.name.toLowerCase().replace(/ /g, '')}`}
							name={`c_${row.name.toLowerCase().replace(/ /g, '')}`}
							placeholder={(row.placeholder) ? row.name : ""}
						/>
						: null
					}

					{(row.type === "select")
						? <Select row={row} onChange={selectChange} />
						: null
					}

					{(row.type === "logo")
						? <img className={`${row.name}`} ref={imgRef} src={imgSrc} alt="" />
						: null
					}

					{(row.type === "empty")
						? <div className={`${row.name}`} />
						: null
					}

					{checkboxes}
				</div>
			);
		}
	);

	useEffect(() => {
		if (imgRef && imgRef.current) {
			console.log(imgSrc);
			//@ts-ignore
			imgRef.current.src = imgSrc;
		}
	}, [imgRef, imgSrc]);

	return (
		<div className={`block ${datakey}`}>
			{items}
		</div>
	);
}

function Select({ row, onChange }: selectprops): JSX.Element {
	const options = row.selectdata?.map(
		(data) => {
			let split = data.trim().split(" ");
			let val = split[split.length - 1].toLowerCase();

			return (
				<option
					key={val}
					value={val}
				>{data}
				</option>
			);
		}
	);

	return (
		<select
			className={`${row.name}`}
			name={`c_${row.name}`}
			onChange={(e) => { onChange(e, row.name); }}
		>
			{options}
		</select>

	);
}

