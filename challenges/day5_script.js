const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('day5_input.txt');
const row0 = 'F'; // character that represents binary 0, for row
const row1 = 'B';
const column0 = 'L';
const column1 = 'R';

let seats = [];


async function run() {
	await checkPasses();

	seats.sort(function(a,b) {return a-b});

	let mySeat = findMySeat();
	console.log(mySeat);
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
		seats.push(parseInt(seat));
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

/*
 * if next taken seat is not seatId + 1, then seatId + 1 is not taken, and is my seat
*/
function findMySeat() {
	for (i = 0; i < seats.length - 2; i++) {
		if (seats[i+1] !== seats[i] + 1)
			return seats[i] + 1;
	}
}

module.exports.run = run;
this.run();
