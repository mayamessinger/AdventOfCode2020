const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('day2_input.txt');
let numValid = 0;

async function run() {
	await checkLine();

	console.log(numValid);
}

async function checkLine() {
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});


	for await (const line of rl) {
		if (isValid(line))
			numValid++;
	}
	rl.close();
}

function isValid(line) {
	const minRegex = /^([0-9]+)-/;
	const maxRegex = /-([0-9]+) /;
	const letterRegex = / ([a-z]):/;
	const passwordRegex = / ([a-z]+)$/;

	const minCount = parseInt(captureGroup(minRegex, line));
	const maxCount = parseInt(captureGroup(maxRegex, line));
	const letter = captureGroup(letterRegex, line).charAt(0);
	const password = captureGroup(passwordRegex, line);

	var ocurrences = countOccurrences(letter, password);
	return ocurrences >= minCount && ocurrences <= maxCount;
}

function captureGroup(regex, line) {
	return regex.exec(line)[1]
}

function countOccurrences(letter, password) {
	var count = 0;

	for (var i = 0; i < password.length; i++) {
		if (password.charAt(i) == letter)
			count++;
	}

	return count;
}

module.exports.run = run;
this.run();