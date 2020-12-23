const fs = require('fs');

const fileName = '../inputs/day22_input.txt';

function run() {
	const [deck1, deck2] = parseInput();
	const winnerScore = runGame(deck1, deck2);

	console.log(winnerScore);
}

function parseInput() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\r\n").map(l => l.trim());
	const breakIndex = rl.indexOf("");
	const deck1 = [];
	const deck2 = [];

	for (var i = 1; i < breakIndex; i++) {
		deck1.push(parseInt(rl[i]));
	}

	for (var i = breakIndex + 2; i < rl.length; i++) {
		deck2.push(parseInt(rl[i]));
	}

	return [deck1, deck2];
}

function runGame(deck1, deck2) {
	while (deck1.length > 0 && deck2.length > 0) {
		const deck1Card = deck1.shift();
		const deck2Card = deck2.shift();
		const winner = compareCards(deck1Card, deck2Card);

		if (winner === deck1Card) {
			deck1.push(deck1Card, deck2Card);
		}
		else {
			deck2.push(deck2Card, deck1Card);
		}
	}

	return Math.max(calculateScore(deck1), calculateScore(deck2));
}

function compareCards(cardA, cardB) {
	return cardA > cardB
		? cardA
		: cardB;
}

function calculateScore(deck) {
	let score = 0;

	let i = 1;
	while (deck.length > 0) {
		score += deck.pop() * i;
		i++;
	}

	return score;
}

module.exports.run = run;
this.run();