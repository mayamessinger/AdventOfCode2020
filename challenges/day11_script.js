const fs = require('fs');

const fileName = 'day11_input.txt';
let floorChar = '.';
let emptyChar = 'L';
let occupiedChar = '#';

function run() {
	const initialState = parseRows();
	const finalState = processRounds(initialState);
	const numOccupiedSeats = countSeats(finalState, occupiedChar);

	console.log(numOccupiedSeats);
}

function parseRows() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\n");
	const layout = new Array(rl.length);

	for (var i = 0; i < layout.length; i++) {
		const string = rl[i].trim();
		const arrLen = string.length;
		layout[i] = new Array(arrLen);

		for (let j = 0; j < layout[i].length; j++) {
			layout[i][j] = string.charAt(j);
		}
	}

	return layout;
}

function processRounds(startState) {
	let endState = deepCopy(startState);

	for (let i = 0; i < startState.length; i++) {
		for (let j = 0; j < startState[i].length; j++) {
			let surroundingInfo = surroundingSeats([i, j], startState);

			if (startState[i][j] === emptyChar && surroundingInfo[2] === 0) {
				endState[i][j] = occupiedChar;
			}
			else if (startState[i][j] === occupiedChar && surroundingInfo[2] >= 4) {
				endState[i][j] = emptyChar;
			}
		}
	}

	if (roundsEquivalent(startState, endState)) {
		return endState;
	}
	else {
		return processRounds(deepCopy(endState));
	}
}

function deepCopy(array) {
	let copy = new Array(array.length);

	for (let i = 0; i < array.length; i++) {
		const row = array[i];
		const rowLen = row.length;
		copy[i] = new Array(rowLen);

		for (let j = 0; j < array[i].length; j++) {
			copy[i][j] = row[j];
		}
	}

	return copy;
}

/**
 * returns info about surrounding seats of seat.
 * return values in order of [floor, emptySeat, occupiedSeat]
 */
function surroundingSeats([i, j], allSeats) {
	let surroundingSeats = new Array(3).fill(0);

	for (var k = -1; k <= 1; k++) {
		for (var m = -1; m <= 1; m++) {
			if (allSeats[i + k] !== undefined && allSeats[i + k][j + m] !== undefined) {
				let rowChar = allSeats[i + k][j + m];

				if (k === 0 && m === 0)
					continue; // do not count this place's contents

				if (rowChar === floorChar)
					surroundingSeats[0]++;
				else if (rowChar === emptyChar)
					surroundingSeats[1]++;
				else if (rowChar === occupiedChar)
					surroundingSeats[2]++;
			}
		}
	}

	return surroundingSeats;
}

function roundsEquivalent(before, after) {
	for (let r = 0; r < before.length; r++) {
		for (let c = 0; c < before[r].length; c++) {
			if (before[r][c] !== after[r][c]) {
				return false;
			}
		}
	}

	return true;
}

function countSeats(rowState, seatChar) {
	let seatCount = 0;

	for (var i = 0; i < rowState.length; i++) {
		for (var j = 0; j < rowState[i].length; j++) {
			if (rowState[i][j] === seatChar)
				seatCount++;
		}
	}

	return seatCount;
}

module.exports.run = run;
this.run();