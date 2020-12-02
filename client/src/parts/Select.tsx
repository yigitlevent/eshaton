import { useEffect, useRef } from "react";

export function Select({ row, onChange, type, value }: selectprops): JSX.Element {
	const ref: React.MutableRefObject<HTMLSelectElement> | React.MutableRefObject<null> = useRef(null);

	const options = row.selectdata?.map(
		(data) => {
			let split = data.trim().split(" ");
			let val = split[split.length - 1].toLowerCase();

			return (
				<option key={val} value={val}>
					{data.toUpperCase()}
				</option>
			);
		}
	);

	options?.unshift(<option key={""} value=""></option>);

	useEffect(() => {
		if (ref && ref.current) {
			let event = new Event("change", { bubbles: true });
			// Actually React.MutableRefObject<HTMLSelectElement> but not important at this point
			(ref as any).current.dispatchEvent(event);
		}
	}, [ref, value]);

	return (
		<select
			ref={ref}
			className={`${row.name}`}
			name={`c_${row.name}`}
			id={`c_${row.name}`}
			key={`c_${row.name} ${value}`}
			onChange={(e) => { onChange(e, row.name); }}
			defaultValue={(value && type !== "new") ? value : ""}
			disabled={(type === "view" || type === "delete") ? true : false}
		>
			{options}
		</select>
	);
}

