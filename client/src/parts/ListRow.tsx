import { toast } from "react-toastify";

export function ListRow({ row, dt, type, setDisplay, setLastKey, setLastData }: listrowprops): JSX.Element {
	let d = dt[0].split("-");
	
	return (
		<div className="row">
			<span className="button created" title={`Created At: ${dt[1].split(".")[0]} ${d[2]}:${d[1]}:${d[0]}`} />
			<input className="button secretkey" type="button" onClick={() => { toast.info(`Secret Key: ${row.secretkey}`); }} value="" />

			<span className="name">{row.name}</span>
			{/*<span className="other">{(row.campaign_name) ? row.campaign_name : (row.characters_name) ? row.characters_name.join(", ") : ""}</span>*/}

			<input className={`button ${type.toLowerCase()}`} title={`${type} Character ${(type === "Add") ? "to" : "from"} Campaign`} type="button"
				onClick={() => { setDisplay(`${type.toLowerCase()}_connection` as displayelement); setLastKey(row.secretkey); }} value=""
			/>

			<div />

			<input className="button view" title="View" type="button" onClick={() => { /* TODO: view func */ setLastData(row.data); }} value="" />
			<input className="button edit" title="Edit" type="button" onClick={() => { /* TODO: edit func */ setLastData(row.data); }} value="" />
			<input className="button delete" title="Delete" type="button" onClick={() => { /* TODO: delete func */ setLastKey(row.secretkey); }} value="" />

			<span className="creator">{row.creator}</span>
			<span className="data">{row.data}</span>
		</div>
	);
}