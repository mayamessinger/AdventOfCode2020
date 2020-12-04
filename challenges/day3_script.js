const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('day3_input.txt');
let numTrees = 0;

let lineLength = 0;
const slopeHoriz = 3;
const slopeVert = 1;
let currentHoriz = 0; // to be updated, track current position
let currentVert = 0;

async function run() {
	await checkLine();

	console.log(numTrees);
}

async function checkLine() {
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		if (lineLength === 0) {
			lineLength = line.length;
		}

		if (isTree(line))
			numTrees++;

		currentHoriz += slopeHoriz;
		currentVert += slopeVert;
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

module.exports.run = run;
this.run();