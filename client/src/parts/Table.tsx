const TABLES: { [key: string]: tabledata; } = {
	"weapons": {
		"rows": 6,
		"columns": ["Weapons", "Handling", "Distance", "Damage", "Mag", "Properties", "Enc", "Tech", "Slots"]
	},
	"armors": {
		"rows": 4,
		"columns": ["Armors", "Value", "Properties", "Enc", "Tech", "Slots"]
	},
	"equipments_1": {
		"rows": 12,
		"columns": ["Equipments", "Enc"]
	},
	"equipments_2": {
		"rows": 12,
		"columns": ["Equipments", "Enc"]
	},
	"equipments_3": {
		"rows": 12,
		"columns": ["Equipments", "Enc"]
	},
	"artifacts": {
		"rows": 4,
		"columns": ["Artifacts", "Activation", "Operation", "Appraisal"]
	}
};

export function Table({ datakey, type, data }: tableprops): JSX.Element {
	const TABLEDATA = TABLES[datakey];

	const rows: JSX.Element[] = TABLEDATA.columns.map(
		(column) => {
			return (<div className="title" key={column}>{column.toUpperCase()}</div>);
		}
	);

	const DATA = (data.data) ? JSON.parse(data.data.replace(/&quot;/g, '"')) : undefined;

	for (let i = 0; i < TABLEDATA.rows; i++) {
		for (let ii = 0; ii < TABLEDATA.columns.length; ii++) {
			const name = `${datakey}_${i}_${TABLEDATA.columns[ii].toLowerCase()}`;

			rows.push(
				<input
					type="text"
					className="table-input"
					id={`c_${name}`}
					name={`c_${name}`}

					key={`c_${name} ${data.name}`}
					defaultValue={(DATA && type !== "new") ? DATA[`c_${name}`] : null}
					readOnly={(type === "view" || type === "delete") ? true : false}
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