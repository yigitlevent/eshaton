import { Fragment } from "react";

export function Shared({ showLogout, userRequest }: sharedprops): JSX.Element {
	return (
		<Fragment>
			<div className="topbar">
				<a className="button github" href="https://github.com/yigitlevent/eshaton" type="button" title="Github Repository"></a>
				<a className="button discord" href="https://discord.gg/degenesis" type="button" title="Offical Discord Server"></a>
				{(showLogout) ? <input className="button logout" type="button" value="Logout" onClick={() => { userRequest("/user/logout", "logout"); }} /> : null}
			</div>

			<div className="logo" />
			<div className="title">ESHATON</div>
		</Fragment>
	);
}