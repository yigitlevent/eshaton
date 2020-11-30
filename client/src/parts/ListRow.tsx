import { toast } from "react-toastify";

export function ListRow({ rowData, setDisplay }: listrowprops): JSX.Element {
	const d = rowData.datetime[0].split("-");

	return (
		<div className="row">
			<span className="button created" title={`Created At: ${rowData.datetime[1].split(".")[0]} ${d[2]}:${d[1]}:${d[0]}`} />
			<input className="button secretkey" type="button" onClick={() => { toast.info(`Secret Key: ${rowData.data.secretkey}`); }} value="" />

			<span className="name">{rowData.data.name}</span>

			<input
				type="button" value=""
				className={`button ${(rowData.type === "character") ? "add" : "remove"}`}
				title={`${(rowData.type === "character") ? "Add" : "Remove"} Character ${(rowData.type === "character") ? "to" : "from"} Campaign`}
				onClick={() => {
					setDisplay(["none", "none", "", {}]);
					setDisplay([
						`${(rowData.type === "character") ? "add" : "remove"}_connection` as displayelement,
						"none",
						rowData.data.secretkey,
						rowData.data
					]);
				}}
			/>

			<div />

			{(rowData.data.campaign_name && rowData.data.campaign_name.length > 0) ? <div />
				: <input className="button edit" title="Edit" type="button" value=""
					onClick={() => {
						setDisplay(["none", "none", "", {}]);
						setDisplay([rowData.type, "edit", rowData.data.secretkey, rowData.data]);
					}}
				/>
			}

			<input className="button view" title="View" type="button" value=""
				onClick={() => {
					setDisplay(["none", "none", "", {}]);
					setDisplay([rowData.type, "view", rowData.data.secretkey, rowData.data]);
				}}
			/>

			<input className="button delete" title="Delete" type="button" value=""
				onClick={() => {
					setDisplay(["none", "none", "", {}]);
					setDisplay([rowData.type, "delete", rowData.data.secretkey, rowData.data]);
				}}
			/>

			<span className="creator">{rowData.data.creator}</span>
			<span className="data">{JSON.stringify(rowData.data)}</span>
			<span className="other">
				{(rowData.data.campaign_name) ? rowData.data.campaign_name : ""}
				{(rowData.data.characters_name) ? rowData.data.characters_name.join(", ") : ""}
			</span>
		</div>
	);
}