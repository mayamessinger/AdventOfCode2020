const fs = require('fs');

const fileName = '../inputs/day23_input.txt';

function run() {
	const cups = parseInput();
	const finalState = runGame([...cups], 100);
	const puzzleAnswer = getAnswer(finalState);

	console.log(puzzleAnswer);
}

function parseInput() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("");
	let cups = [];

	rl.forEach(i => cups.push(parseInt(i)));

	return cups;
}

function runGame(cups, numMoves) {
	let currCup = cups[0];

	for (var i = 0; i < numMoves; i++) {
		const pickedUp = pickUpCups(cups, currCup);
		const destinationCup = getDestCup(cups, currCup);

		cups.splice(cups.indexOf(destinationCup) + 1, 0, pickedUp[0], pickedUp[1], pickedUp[2]);

		currCup = cups[(cups.indexOf(currCup) + 1) % cups.length];
	}

	return cups;
}

/*
 * Retrieves the cups to pick up and removes those values from cups
 */
function pickUpCups(cups, currCup) {
	let pickedUp = [];

	for (var i = 0; i < 3; i++) {
		const indexToPickUp = (cups.indexOf(currCup) + 1) % cups.length;

		pickedUp.push(cups[indexToPickUp]);
		cups.splice(indexToPickUp, 1);
	}

	return pickedUp;
}

function getDestCup(cups, currCup) {
	let destinationCup = currCup - 1;
	let cupsMax = Math.max.apply(Math, cups);
	let cupsMin = Math.min.apply(Math, cups);

	while (cups.indexOf(destinationCup) === -1) {
		destinationCup--;

		if (destinationCup < cupsMin)
			destinationCup = cupsMax;
	}

	return destinationCup;
}

function getAnswer(cups) {
	let answer = "";

	const oneIndex = cups.indexOf(1);
	for (var i = 1; i < cups.length; i++) {
		answer += cups[(oneIndex + i) % cups.length];
	}

	return answer;
}

module.exports.run = run;
this.run();