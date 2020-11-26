const BLOCKS = [
	["BODY", "ATHLETICS", "BRAWL", "FORCE", "MELEE", "STAMINA", "TOUGHNESS"],
	["AGILITY", "CRAFTING", "DEXTERITY", "NAVIGATION", "MOBILITY", "PROJECTILES", "STEALTH"],
	["CHARISMA", "ARTS", "CONDUCT", "EXPRESSION", "LEADERSHIP", "NEGOTIATION", "SEDUCTION"],
	["INTELLECT", "ARTIFACT LORE", "ENGINEERING", "FOCUS", "LEGENDS", "MEDICINE", "SCIENCE"],
	["PSYCHE", "CUNNING", "DECEPTION", "DOMINATION", "FAITH", "REACTION", "WILLPOWER"],
	["INSTINCT", "EMPATHY", "ORIENTEERING", "PERCEPTION", "PRIMAL", "SURVIVAL", "TAMING"]
];

export function AttributeBlocks(): JSX.Element[] {

	const attributeItems = BLOCKS.map(
		(block) => {
			const rowItems = block.map(
				(row, index) => {
					return (
						<div className="row" key={row}>
							<div className={(index === 0) ? "attribute" : "skill"}>{row}</div>
							<input type="checkbox"></input>
							<input type="checkbox"></input>
							<input type="checkbox"></input>
							<input type="checkbox"></input>
							<input type="checkbox"></input>
							<input type="checkbox"></input>
						</div>
					);
				}
			);

			return (
				<div className="group" key={block[0]}>
					{rowItems}
				</div>
			);
		}
	);

	return (attributeItems);
}