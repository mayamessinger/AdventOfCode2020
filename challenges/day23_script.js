const fs = require('fs');

const fileName = '../inputs/day23_input.txt';

function run() {
	const [firstCup, cups] = parseInput();
	const finalState = runGame([...cups], firstCup, 10000000);
	const puzzleAnswer = getAnswer(finalState);

	console.log(puzzleAnswer);
}

function parseInput() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("").map(i => parseInt(i));
	let cups = new Array(1000000);

	for (var i = 0; i < rl.length; i++) {
		cups[rl[i]] = i === rl.length - 1
			? 10
			: rl[i + 1];
	}
	for (var i = 10; i <= 1000000; i++) {
		cups[i] = i === 1000000
			? rl[0]
			: i+1;
	}

	return [rl[0], cups];
}

function runGame(cups, firstCup, numMoves) {
	const cupsMax = 1000000;
	const cupsMin = 1;

	let currCup = firstCup;
	for (var i = 0; i < numMoves; i++) {
		const pickedUp = pickUpCups(cups, currCup);
		const destinationCup = getDestCup(pickedUp, cupsMax, cupsMin, currCup);

		insertCups(cups, destinationCup, pickedUp);

		currCup = cups[currCup];
	}

	return cups;
}

/*
 * Retrieves the cups to pick up and closes the linked list to exclude them
 */
function pickUpCups(cups, currCup) {
	let pickedUp = [];

	let focusedCup = currCup;
	for (var i = 0; i < 3; i++) {
		pickedUp.push(cups[focusedCup]);
		focusedCup = cups[focusedCup];
	}

	cups[currCup] = cups[focusedCup];

	return pickedUp;
}

function getDestCup(pickedUp, cupsMax, cupsMin, currCup) {
	let destinationCup = currCup - 1;

	while (pickedUp.includes(destinationCup) || destinationCup === 0) {
		destinationCup = destinationCup <= cupsMin
			? cupsMax
			: destinationCup - 1;
	}

	return destinationCup;
}

function insertCups(cups, destination, toInsert) {
	const nextCup = cups[destination];

	cups[destination] = toInsert[0];
	cups[toInsert[2]] = nextCup;
}

function getAnswer(cups) {
	return cups[1] * cups[cups[1]];
}

module.exports.run = run;
this.run();