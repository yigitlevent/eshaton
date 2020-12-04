import { Fragment, useEffect, useRef, useState } from "react";

import { Select } from "./block/Select";

import { BLOCKS } from "../../../data/blocks";

export function Block({ blockKey, displayType, userData, userRequest, openDiceRoller }: blockprops): JSX.Element {
	const imgRef: React.MutableRefObject<HTMLImageElement> | React.MutableRefObject<null> = useRef(null);
	const [imgSrc, setImgSrc] = useState(`${process.env.PUBLIC_URL}/assets/icons/empty.svg`);

	const selectChange = (event: React.ChangeEvent<HTMLSelectElement>, rowName: string): void => {
		if (event.target.value === "") { setImgSrc(`${process.env.PUBLIC_URL}/assets/icons/empty.svg`); }
		else { setImgSrc(`${process.env.PUBLIC_URL}/assets/icons/${rowName}s/${event.target.value}.svg`); }
	};

	const checkboxPropogation = (event: React.MouseEvent<HTMLInputElement, MouseEvent>): void => {
		let element: HTMLInputElement = (event.target as HTMLInputElement);
		let isPrev = element.previousElementSibling?.classList.contains("checkbox") === true;
		// let isPrevChecked = (isNext) ? (element.previousElementSibling as HTMLInputElement).checked : false;
		let isNext = element.nextElementSibling?.classList.contains("checkbox") === true;
		let isNextChecked = (isNext) ? (element.nextElementSibling as HTMLInputElement).checked : false;

		if (!element.checked && !isPrev && isNext && !isNextChecked) { element.checked = false; }
		else if (element.checked && isPrev) {
			element.checked = true;
			while (element.previousElementSibling && isPrev) {
				element = element.previousElementSibling as HTMLInputElement;
				element.checked = true;
			}
		}
		else {
			element.checked = true;
			while (element.nextElementSibling && isNext) {
				element = element.nextElementSibling as HTMLInputElement;
				element.checked = false;
			}
		}
	};
	const BLOCKDATA = BLOCKS[blockKey];

	const DATA = (userData.data) ? JSON.parse(userData.data.replace(/&quot;/g, '"')) : undefined;

	const items = BLOCKDATA.map((row) => {
		const checkboxes: JSX.Element[] = [];
		const basicKey = row.name.toLowerCase().replace(/ /g, '');

		for (let i = 0; i < row.checkboxes; i++) {
			checkboxes.push(
				<input
					key={`c_${basicKey}_${i} ${userData.name}`}
					type="checkbox"
					className="checkbox"
					id={`c_${basicKey}_${i}`}
					name={`c_${basicKey}_${i}`}
					onClick={checkboxPropogation}
					disabled={(displayType === "view" || displayType === "delete") ? true : false}
					defaultChecked={(DATA && displayType !== "new") ? DATA[`c_${basicKey}_${i}`] : false}
				/>
			);
		}

		return (
			<div key={row.name} className={`row columns-${row.checkboxes} ${row.type}`}>
				{(row.type !== "empty" && row.type !== "condition" && row.type !== "input" && row.type !== "select" && row.type !== "logo")
					? <div
						id={`c_${row.name.toLowerCase()}`}
						className={`${row.type} span-${row.checkboxes + 1} ${(displayType === "view" && row.dice) ? "rollable" : ""}`}
						onClick={(event) => { if (row.dice) { openDiceRoller(event, row.dice); } }}
					>
						{row.name.toUpperCase()}
					</div>
					: null
				}

				{(row.type === "input")
					? <input
						className={`${row.type} span-${row.checkboxes + 1}`}
						type="text" id={`c_${basicKey}`}
						name={`c_${basicKey}`}
						placeholder={(row.placeholder) ? row.name : ""}
						key={`c_${basicKey} ${userData.name}`}
						defaultValue={(DATA && displayType !== "new") ? DATA[`c_${basicKey}`] : null}
						readOnly={(displayType === "view" || displayType === "delete" || (basicKey === "name" && displayType === "edit")) ? true : false}
					/>
					: null
				}

				{(row.type === "select")
					? <Select row={row} displayType={displayType}
						onChange={selectChange}
						value={(DATA) ? DATA[`c_${basicKey}`] : null}
					/>
					: null
				}

				{(row.type === "logo")
					? <img key={`c_${basicKey} ${userData.name}`} className={`icon ${row.name}`} ref={imgRef} src={imgSrc} alt="" />
					: null
				}

				{(row.type === "empty")
					? <div className={`${row.name}`} />
					: null
				}

				{checkboxes}
			</div>
		);
	});

	useEffect(() => {
		if (imgRef && imgRef.current) {
			(imgRef as React.MutableRefObject<HTMLImageElement>).current.src = imgSrc;
		}
	}, [imgRef, imgSrc]);

	return (
		<Fragment>
			<div className={`block ${blockKey}`}>
				{items}
			</div>
		</Fragment>
	);
}
