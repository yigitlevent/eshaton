const BLOCKS = [
	["ALLIES", "AUTHORITY", "NETWORK", "RENOWN", "RESOURCE", "SECRETS"]
];

export function PotentialsBlock(): JSX.Element[] {

	const potentialItems = BLOCKS.map(
		(block) => {
			const rowItems = block.map(
				(row, index) => {
					return (
						<div className="row" key={row}>
							<input className={"potential"} type="text" id={`c_potential_${index}`} name={`c_potential_${index}`} />
							<input type="checkbox"></input>
							<input type="checkbox"></input>
							<input type="checkbox"></input>
						</div>
					);
				}
			);

			return (
				<div className="group" key={block[0]}>
					<div className="row">
						<div className={"title"}>POTENTIALS</div>
					</div>
					{rowItems}
				</div>
			);
		}
	);

	return (potentialItems);
}