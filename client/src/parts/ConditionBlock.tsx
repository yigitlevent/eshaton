const BLOCKS: [string, number][] = [
	["EGO", 24],
	["SPORE_INFESTATIONS", 24],
	["FLESHWOUNDS", 24],
	["TRAUMA", 12],
];

export function ConditionBlock(): JSX.Element {

	const conditionItems = BLOCKS.map(
		(block, index) => {
			const rowItems = [];
			for (let i = 0; i < block[1]; i++) {
				rowItems.push(
					<input
						type="checkbox"
						className="condition-box"
						id={`c_${block[0].toLowerCase()}_${i}`}
						name={`c_${block[0].toLowerCase()}_${i}`}
						key={`c_${block[0].toLowerCase()}_${i}`}
					/>
				);
			}
			rowItems.push(<div className="condition" key={block[0]}>{block[0].replace('_', ' ')}</div>);

			return (
				(index === 3)
					? <div className="condition-row-mini" key={block[0]}>{rowItems}</div>
					: <div className="condition-row" key={block[0]}>{rowItems}</div>
			);
		}
	);

	return (
		<div className="group">
			{conditionItems}
		</div>
	);
}