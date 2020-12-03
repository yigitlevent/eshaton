import { useState } from "react";

import { Login } from "./Login";
import { Register } from "./Register";
import { Topbar } from "./Topbar";

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