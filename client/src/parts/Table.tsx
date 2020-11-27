const TABLES: { [key: string]: tabledata; } = {
	"weapons": {
		"rows": 6,
		"columns": ["Weapons", "Handling", "Distance", "Damage", "Mag", "Properties", "Enc", "Tech", "Slots"]
	},
	"armors": {
		"rows": 4,
		"columns": ["Armors", "Value", "Properties", "Enc", "Tech", "Slots"]
	},
	"equipments": {
		"rows": 12,
		"columns": ["Equipments", "Enc"]
	},
	"artifacts": {
		"rows": 4,
		"columns": ["Artifacts", "Activation", "Operation", "Appraisal"]
	}
};

export function Table({ datakey }: tableprops): JSX.Element {
	const TABLEDATA = TABLES[datakey];

	const rows: JSX.Element[] = TABLEDATA.columns.map(
		(column) => {
			return (<div className="title" key={column}>{column}</div>);
		}
	);

	for (let i = 0; i < TABLEDATA.rows; i++) {
		for (let ii = 0; ii < TABLEDATA.columns.length; ii++) {
			rows.push(
				<input
					key={`c_${datakey}_${i}_${TABLEDATA.columns[ii].toLowerCase()}`}
					type="text"
					className="table-input"
					id={`c_${datakey}_${i}_${TABLEDATA.columns[ii].toLowerCase()}`}
					name={`c_${datakey}_${i}_${TABLEDATA.columns[ii].toLowerCase()}`}
				/>
			);
		}
	}

	return (
		<div className={`table ${datakey} columns-${TABLEDATA.columns.length}`}>
			{rows}
		</div>
	);
}