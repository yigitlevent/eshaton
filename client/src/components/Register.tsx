export function Register({ setIsLogin, userRequest }: entranceprops): JSX.Element {
	const register = (event: React.FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		const target: any = event.target;

		userRequest("/user/register", "register", {
			r_username: (target["0"].value as string),
			r_email: (target["1"].value as string),
			r_password: (target["2"].value as string),
			r_passwordrepeat: (target["3"].value as string)
		});
	};

	return (
		<div className="register">
			<form onSubmit={register}>
				<input className="input-text" type="text" id="r_username" name="r_username" placeholder="username" />
				<input className="input-text" type="email" id="r_email" name="r_email" placeholder="email" />
				<input className="input-text" type="password" id="r_password" name="r_password" placeholder="password" />
				<input className="input-text" type="password" id="r_passwordrepeat" name="r_passwordrepeat" placeholder="repeat password" />
				<input className="input-button" type="submit" value="register" />

				<input className="input-change" type="button" onClick={() => { setIsLogin(true); }} value="Do you want to Login instead?" />
			</form>
		</div>
	);
} 