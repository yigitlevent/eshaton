import { TABLES } from "../../../data/tables";

export function Table({ blockKey, displayType, userData }: tableprops): JSX.Element {
	const TABLEDATA = TABLES[blockKey];

	const rows: JSX.Element[] = TABLEDATA.columns.map(
		(column) => {
			return (<div className="title" key={column}>{column.toUpperCase()}</div>);
		}
	);

	const DATA = (userData.data) ? JSON.parse(userData.data.replace(/&quot;/g, '"')) : undefined;

	for (let i = 0; i < TABLEDATA.rows; i++) {
		for (let ii = 0; ii < TABLEDATA.columns.length; ii++) {
			const name = `${blockKey}_${i}_${TABLEDATA.columns[ii].toLowerCase()}`;

			rows.push(
				<input
					type="text"
					className="table-input"
					id={`c_${name}`}
					name={`c_${name}`}

					key={`c_${name} ${userData.name}`}
					defaultValue={(DATA && displayType !== "new") ? DATA[`c_${name}`] : null}
					readOnly={(displayType === "view" || displayType === "delete") ? true : false}
				/>
			);
		}
	}

	return (
		<div className={`table ${blockKey} columns-${TABLEDATA.columns.length}`}>
			{rows}
		</div>
	);
}