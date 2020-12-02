export function roll(amount: number, type: "d6" = "d6"): { results: number[], countSuccesses: number, countOnes: number, } {
	let results: number[] = [];

	for (let i = 0; i < amount; i++) {
		results.push(randomNumber(1, parseInt(type.substring(1))));
	}

	results.sort();

	const countSuccesses = results.reduce((n, x) => n + ((x > 3) ? 1 : 0), 0);
	const countOnes = results.reduce((n, x) => n + ((x === 1) ? 1 : 0), 0);

	return { results: results, countSuccesses: countSuccesses, countOnes: countOnes, };
}

function randomNumber(min: number, max: number) {
	return (min - 1) + Math.ceil(Math.random() * (max - min + 1));
}
