export function Divider({ children }: dividerprops): JSX.Element {
	return (
		<div className="divider">
			<div className="border" />
			{(children) ? <span className="content">{children}</span> : null}
			<div className="border" />
		</div>
	);
};