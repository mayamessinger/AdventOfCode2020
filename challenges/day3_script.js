const fs = require('fs');
const readline = require('readline');

let numTrees = 0;
let numTreesPerRun = [];

let lineLength = 0;
const slopesHoriz = [1, 3, 5, 7, 1];
const slopesVert = [1, 1, 1, 1, 2];
let currentHoriz = 0; // to be updated, track current position
let currentVert = 0;

async function run() {
	for (var i = 0; i < slopesHoriz.length; i++) {
		await checkLine(slopesHoriz[i], slopesVert[i]);
		logAndReset();
	}

	console.log(numTreesPerRun);
	let multResult = 1;
	for (var i = 0; i < numTreesPerRun.length; i++) {
		multResult *= numTreesPerRun[i];
	}
	console.log(multResult);
}

async function checkLine(slopeHoriz, slopeVert) {
	const fileStream = fs.createReadStream('../inputs/day3_input.txt');
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		if (currentVert % slopeVert !== 0) {
			currentVert++;
			continue;
		}

		if (lineLength === 0) {
			lineLength = line.length;
		}

		if (isTree(line))
			numTrees++;

		currentHoriz += slopeHoriz;
		currentVert += 1;
	}
	rl.close();
}

function isTree(line) {
	var treeChar = '#';
	let remainderHoriz = currentHoriz % lineLength;

	if (line.charAt(remainderHoriz) === treeChar)
		return true;

	return false;
}

function logAndReset() {
	numTreesPerRun.push(numTrees);
	numTrees = 0;
	currentHoriz = 0;
	currentVert = 0;
}

module.exports.run = run;
this.run();