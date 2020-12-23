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
	const prevRounds = new Set();

	while (deck1.length > 0 && deck2.length > 0) {
		if (duplicateRound(deck1, deck2, prevRounds)) {
			return [0, 0];
		}

		prevRounds.add(stringifyDecks(deck1, deck2));

		const deck1Card = deck1.shift();
		const deck2Card = deck2.shift();
		const winner = compareCards(deck1Card, deck2Card, deck1, deck2);

		if (winner === deck1Card) {
			deck1.push(deck1Card, deck2Card);
		}
		else {
			deck2.push(deck2Card, deck1Card);
		}
	}

	const winnerScore = deck1.length > 0 ? calculateScore(deck1) : calculateScore(deck2);
	return [deck1.length > 0 ? 0 : 1, winnerScore];
}

function duplicateRound(deck1, deck2, prevRounds) {
	const stringified = stringifyDecks(deck1, deck2);

	let duplicate = false;
	prevRounds.forEach(p => {
		if (p === stringified) {
			duplicate = true;
		}
	});

	return duplicate;
}

function stringifyDecks(deck1, deck2) {
	return deck1.join() + "|" + deck2.join();
}

function compareCards(cardA, cardB, deckA, deckB) {
	if (deckA.length >= cardA && deckB.length >= cardB) {
		const winner = runGame(deckA.slice(0, cardA), deckB.slice(0, cardB))[0];

		return winner === 0
			? cardA
			: cardB;
	}
	else {
		return cardA > cardB
			? cardA
			: cardB;
	}
}

function calculateScore(deck) {
	let deckCopy = [...deck];
	let score = 0;

	let i = 1;
	while (deckCopy.length > 0) {
		score += deckCopy.pop() * i;
		i++;
	}

	return score;
}

module.exports.run = run;
this.run();