const fs = require('fs');

const fileName = '../inputs/day9_input.txt';

const weakNumber = 15690279;

function run() {
	runXmas();
}

function runXmas() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\n");
	const xmasCode = rl.map(x => parseInt(x));

	var sumStartIndex = 0;
	var sumValue = 0;
	for (var i = 0; i < xmasCode.length; i++) {
		sumValue += xmasCode[i];

		while (sumValue >= weakNumber) {
			if (sumValue === weakNumber) {
				console.log(sumStartIndex, i);
				let answer = determinePuzzleAnswer(xmasCode, sumStartIndex, i);
				console.log(answer);
				return;
			}

			sumValue -= xmasCode[sumStartIndex];
			sumStartIndex++;
		}
	}
}

function determinePuzzleAnswer(xmasCode, sumStartIndex, i) {
	const sumNumbers = xmasCode.splice(sumStartIndex, i - sumStartIndex);
	const sorted = sumNumbers.sort(function(a, b) {return a - b});

	return sorted[0] + sorted[sumNumbers.length - 1];
}

module.exports.run = run;
this.run();