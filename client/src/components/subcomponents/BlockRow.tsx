const BLOCKS: { [key: string]: blockrowtype[]; } = {
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

	"conditions": [
		{ name: "condition_0", type: "condition", checkboxes: 24 },
		{ name: "Ego", type: "condition-title", checkboxes: 0 },
		{ name: "condition_2", type: "condition", checkboxes: 24 },
		{ name: "Spore Infestations", type: "condition-title", checkboxes: 0 },
		{ name: "condition_4", type: "condition", checkboxes: 24 },
		{ name: "Fleshwounds", type: "condition-title", checkboxes: 0 },
		{ name: "condition_6", type: "condition", checkboxes: 12 },
		{ name: "Traumas", type: "condition-title", checkboxes: 0 },
	]
};

interface blockrowtype {
	name: string;
	type: "normal" | "title" | "input" | "condition" | "condition-title";
	checkboxes: 0 | 3 | 6 | 12 | 24;
}

interface blockprops {
	key: string;
}
interface blockrowprops {
	row: blockrowtype;
}

export function Block({ key }: blockprops): JSX.Element {
	const BLOCKDATA = BLOCKS[key];

	const items = BLOCKDATA.map((row) => { return BlockRow({ row }); });

	return (
		<div className="block">
			{items}
		</div>
	);
}

function BlockRow({ row }: blockrowprops): JSX.Element {
	const checkboxes: JSX.Element[] = [];

	for (let i = 0; i < row.checkboxes; i++) {
		checkboxes.push(
			<input
				type="checkbox"
				className="condition-box"
				id={`c_${row.name.toLowerCase().replace(/ /g, '')}_${i}`}
				name={`c_${row.name.toLowerCase().replace(/ /g, '')}_${i}`}
				key={`c_${row.name.toLowerCase().replace(/ /g, '')}_${i}`}
			/>
		);
	}

	//if (row.type === "normal") {
	return (
		<div className={`row cbox-${checkboxes}`}>
			<div className={`${row.type}`}>{row.name}</div>
			{checkboxes}
		</div>
	);
	//}
}