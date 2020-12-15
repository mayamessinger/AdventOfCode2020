const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('../inputs/day2_input.txt');
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
	const indexARegex = /^([0-9]+)-/;
	const indexBRegex = /-([0-9]+) /;
	const letterRegex = / ([a-z]):/;
	const passwordRegex = / ([a-z]+)$/;

	const indexA = parseInt(captureGroup(indexARegex, line));
	const indexB = parseInt(captureGroup(indexBRegex, line));
	const letter = captureGroup(letterRegex, line).charAt(0);
	const password = captureGroup(passwordRegex, line);

	var isAtA = isPresentAtIndex(indexA, letter, password);
	var isAtB = isPresentAtIndex(indexB, letter, password);

	return (isAtA || isAtB) && !(isAtA && isAtB);
}

function captureGroup(regex, line) {
	return regex.exec(line)[1]
}

function isPresentAtIndex(index, letter, password) {
	if (password.charAt(index - 1) == letter)
		return true;

	return false;
}

module.exports.run = run;
this.run();