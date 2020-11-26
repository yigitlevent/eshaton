export function Login({ setIsLogin, userRequest }: entranceprops): JSX.Element {
	const login = (event: React.FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		const target: any = event.target;

		userRequest("/user/login", "login", {
			l_username: (target["0"].value as string),
			l_password: (target["1"].value as string),
		});
	};

	return (
		<div className="login">
			<form onSubmit={login}>
				<input className="input-text" type="text" id="l_username" name="l_username" placeholder="username" />
				<input className="input-text" type="password" id="l_password" name="l_password" placeholder="password" />
				<input className="input-button" type="submit" value="login" />

				<input className="input-change" type="button" onClick={() => { setIsLogin(false); }} value="Do you want to Register instead?" />
			</form>
		</div>
	);
} 