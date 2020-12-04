import { Fragment } from "react";

export function Topbar({ showLogout, toggleMap, userRequest }: topbarprops): JSX.Element {
	return (
		<Fragment>
			<div className="topbar">
				<a className="button github"
					href="https://github.com/yigitlevent/eshaton"
					title="Github Repository">
					<span>Github Link</span>
				</a>
				<a className="button discord"
					href="https://discord.gg/degenesis"
					title="Offical Discord Server">
					<span>Discord Link</span>
				</a>

				<br />

				{(showLogout)
					? <Fragment>
						<input className="button logout" type="button" value="Logout" onClick={() => { userRequest("/user/logout", "logout"); }} />
						{(toggleMap) ? <input className="button map" type="button" value="Map" onClick={() => { toggleMap(); }} /> : null}
					</Fragment>
					: null
				}
			</div>

			<div className="logo" />
			<div className="title">ESHATON</div>
		</Fragment>
	);
}