import { useState } from "react";

import { Login } from "./Login";
import { Register } from "./Register";

export function Entrance({ userRequest }: basicprops): JSX.Element {
	const [isLogin, setIsLogin] = useState<boolean>(true);

	return (
		<div className="entrance-wrapper">
			<div className="entrance">
				<div className="logo" />
				<div className="title">ESHATON // ENTRANCE</div>

				{(isLogin)
					? <Login setIsLogin={setIsLogin} userRequest={userRequest} />
					: <Register setIsLogin={setIsLogin} userRequest={userRequest} />
				}
			</div>
		</div>
	);
}