export function generateNumString(n: number): string {
	let add = 1;
	let max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

	if (n > max) { return generateNumString(max) + generateNumString(n - max); }

	max = Math.pow(10, n + add);
	var min = max / 10; // Math.pow(10, n) basically
	var number = Math.floor(Math.random() * (max - min + 1)) + min;

	return ("" + number).substring(add);
}