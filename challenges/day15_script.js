const fs = require('fs');

const fileName = '../inputs/day15_input.txt';

function run() {
	const startingNumbers = populateStartingNumbers();
	const goalNumber = runGame(startingNumbers, 30000000);

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

/**
 * numberInfo tracks a number, and the last 2 times it has been said.
 * any time a number is said, update the info about it in numberInfo
 * From there, we can check:
 * a.) if a number has been said before the most recent round
 * b.) the difference between the most recent speakings of a number
 */
function runGame(startingNumbers, numRounds) {
	let numberInfo = new Map();

	for (var i = 0; i < startingNumbers.length; i++) {
		numberInfo.set(startingNumbers[i], [i, undefined]);
	}

	let lastNumber = startingNumbers[startingNumbers.length - 1];
	for (var i = startingNumbers.length; i < numRounds; i++) {
		const age = numberInfo.get(lastNumber);

		if (age === undefined || age[1] === undefined) {
			const zeroInfo = numberInfo.get(0);

			numberInfo.set(0, [i, zeroInfo[0]]);
			lastNumber = 0;
		}
		else {
			const diff = age[0] - age[1];
			const diffInfo = numberInfo.get(diff);

			if (diffInfo === undefined)
				numberInfo.set(diff, [i, undefined]);
			
			else
				numberInfo.set(diff, [i, diffInfo[0]]);

			lastNumber = diff;

		}
	}

	return lastNumber;
}

module.exports.run = run;
this.run();