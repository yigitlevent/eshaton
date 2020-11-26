const BLOCKS = [
	["ALLIES", "AUTHORITY", "NETWORK", "RENOWN", "RESOURCE", "SECRETS"]
];

export function OriginsBlock(): JSX.Element[] {

	const originItems = BLOCKS.map(
		(block) => {
			const rowItems = block.map(
				(row) => {
					return (
						<div className="row" key={row}>
							<div className={"origin"}>{row}</div>
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
					<div className="row">
						<div className={"title"}>ORIGINS</div>
					</div>
					{rowItems}
				</div>
			);
		}
	);

	return (originItems);
}