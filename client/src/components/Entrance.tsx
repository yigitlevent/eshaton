import { useState } from "react";

import { Login } from "./entrance/Login";
import { Register } from "./entrance/Register";
import { Topbar } from "./shared/Topbar";

export function Entrance({ userRequest }: basicprops): JSX.Element {
	const [isLogin, setIsLogin] = useState<boolean>(true);

	return (
		<div className="entrance-wrapper">
			<div className="entrance">
				<Topbar showLogout={false} userRequest={userRequest} />

				{(isLogin)
					? <Login setIsLogin={setIsLogin} userRequest={userRequest} />
					: <Register setIsLogin={setIsLogin} userRequest={userRequest} />
				}
			</div>
		</div>
	);
}