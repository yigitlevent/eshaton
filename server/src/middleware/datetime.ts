export function getDateTime(): string {
	const today = new Date();
	const datetime = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
	return datetime;
}