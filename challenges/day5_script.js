const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('day5_input.txt');
const row0 = 'F'; // character that represents binary 0, for row
const row1 = 'B';
const column0 = 'L';
const column1 = 'R';

let highestSeatId = 0;


async function run() {
	await checkPasses();

	console.log(highestSeatId);
}

async function checkPasses() {
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	for await (const line of rl) {
		const row = getRowId(line);
		const column = getColumnId(line);

		const seat = row * 8 + column;
		if (seat > highestSeatId)
			highestSeatId = seat;
	}
	rl.close();
}

function getRowId(input) {
	return convertFromFakeBinary(input, row0, row1);
}

function getColumnId(input) {
	return convertFromFakeBinary(input, column0, column1);
}

function convertFromFakeBinary(input, letterZero, letterOne) {
	const regex = new RegExp("([" + letterZero + "|" + letterOne + "]+)");

	let text = regex.exec(input)[1];
	text = replaceChar(text, letterZero, '0');
	text = replaceChar(text, letterOne, '1');

	return parseInt(text, 2);
}

function replaceChar(input, toReplace, replacement) {
	// return input.replaceAll(toReplace, replacement);
	return input.split(toReplace).join(replacement);
}


module.exports.run = run;
this.run();
