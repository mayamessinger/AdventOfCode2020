const fs = require('fs');

const fileName = '../inputs/day15_input.txt';

function run() {
	const startingNumbers = populateStartingNumbers();
	const goalNumber = runGame(startingNumbers, 2020);

	console.log(goalNumber);
}

function populateStartingNumbers() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split(",");

	let startingNumbers = [];
	for (var i = 0; i < rl.length; i++) {
		startingNumbers.push(parseInt(rl[i].trim()));
	}

	return startingNumbers;
}

function runGame(startingNumbers, numRounds) {
	let reversedNumbers = [];

	for (var i = 0; i < startingNumbers.length; i++) {
		reversedNumbers.unshift(startingNumbers[i]);
	}

	for (var i = 0; i < numRounds - startingNumbers.length; i++) {
		const age = reversedNumbers.indexOf(reversedNumbers[0], 1);

		if (age === -1)
			reversedNumbers.unshift(0);
		else
			reversedNumbers.unshift(age);
	}

	return reversedNumbers[0];
}

module.exports.run = run;
this.run();