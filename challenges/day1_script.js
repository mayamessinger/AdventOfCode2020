const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('../inputs/day1_input.txt');
let numbers = [];

async function run() {
	await populateInput();

	let [num1, num2, num3] = findSum2020(numbers);
	console.log(num1 * num2 * num3);
}

async function populateInput() {
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});


	for await (const line of rl) {
		numbers.push(parseInt(line));
	}
	rl.close();
}

function findSum2020(numbers) {
	for (var num1 = 0; num1 < numbers.length; num1++) {
		for (var num2 = num1 + 1; num2 < numbers.length; num2++) {
			for (var num3 = num2 + 1; num3 < numbers.length; num3++) {
				if (numbers[num1] + numbers[num2] + numbers[num3] === 2020)
					return [numbers[num1], numbers[num2], numbers[num3]];
			}
		}
	}

	return [0, 0, 0];
}

module.exports.run = run;
this.run();