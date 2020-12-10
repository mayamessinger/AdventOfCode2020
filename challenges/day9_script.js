const fs = require('fs');

const fileName = 'day9_input.txt';

const preambleLength = 25;

function run() {
	runXmas();
}

function runXmas() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\n");
	const xmasCode = rl.map(x => parseInt(x));
	let validArgs = new Array(25).fill(0);

	for (var i = 0; i < rl.length; i++) {
		if (i >= 25) {
			const valid = isValid(xmasCode[i], validArgs);

			if (!valid) {
				console.log(i, xmasCode[i]);
				break;
			}
		}

		editValidArgs(i, xmasCode[i], validArgs);
	}
}

function isValid(value, validArgs) {
	for (var i = 0; i < preambleLength; i++) {
		for (var j = 0; j < preambleLength; j++) {
			if (validArgs[i] + validArgs[j] === value && i !== j) {
				return true;
			}
		}
	}

	return false;
}

function editValidArgs(index, value, validArgs) {
	const argsIndex = index % preambleLength;

	validArgs[argsIndex] = value;
}

module.exports.run = run;
this.run();