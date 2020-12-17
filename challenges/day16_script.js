const fs = require('fs');

const fileName = '../inputs/day16_input.txt';

class Field {
	constructor(name, rangeA, rangeB) {
		this.name = name;
		this.rangeA = new Range(rangeA);
		this.rangeB = new Range(rangeB);
	}
}

class Range {
	constructor(rangeArr) {
		this.low = rangeArr[0];
		this.high = rangeArr[1];
	}
}

class Ticket {
	constructor(values) {
		this.values = values;
	}
}

class FieldIndex {
	constructor(index, name) {
		this.index = index;
		this.name = name;
	}
}

function run() {
	const [fieldRules, myTicket, nearbyTickets] = parseInput();
	const goodTickets = invalidateTickets(nearbyTickets, fieldRules);
	const fieldIndices = determineFieldIndices(goodTickets, fieldRules);
	const puzzleAnswer = getAnswer(myTicket, fieldIndices, 'departure');

	console.log(puzzleAnswer);
}

function parseInput() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\r\n");
	let fieldRules = [];
	let myTicket;
	let nearbyTickets = [];

	let i = 0; // rules section
	while (rl[i]) {
		const rule = parseFieldRule(rl[i]);
		fieldRules.push(rule);
		i++;
	}

	i += 2; // my ticket contents
	myTicket = parseTicket(rl[i]);

	i += 3; // first nearby ticket contents
	while (rl[i]) {
		nearbyTicket = parseTicket(rl[i]);
		nearbyTickets.push(nearbyTicket);
		i++;
	}

	return [fieldRules, myTicket, nearbyTickets];
}

function parseFieldRule(line) {
	let fieldRegex = /^([a-z ]+): ([0-9]+)-([0-9]+) or ([0-9]+)-([0-9]+)$/;
	const fieldMatches = fieldRegex.exec(line);

	const name = fieldMatches[1];
	const rangeALow = parseInt(fieldMatches[2]);
	const rangeAHigh = parseInt(fieldMatches[3]);
	const rangeBLow = parseInt(fieldMatches[4]);
	const rangeBHigh = parseInt(fieldMatches[5]);

	return new Field(name, [rangeALow, rangeAHigh], [rangeBLow, rangeBHigh]);
}

function parseTicket(line) {
	return new Ticket(line.split(",").map(i => parseInt(i)));
}

function invalidateTickets(tickets, rules) {
	let badTickets = [];

	tickets.forEach(t => {
		if (ticketError(t, rules) !== 0)
			badTickets.push(t);
	});

	return tickets.filter(t => badTickets.indexOf(t) === -1);
}

function ticketError(ticket, rules) {
	for (var i = 0; i < ticket.values.length; i++) {
		const v = ticket.values[i];
		if (isValidValue(v, rules) !== 0)
			return v;
	}

	return 0;
}

function isValidValue(value, rules) {
	for (var i = 0; i < rules.length; i++) {
		const r = rules[i];

		if (r.rangeA.low <= value && value <= r.rangeA.high ||
			r.rangeB.low <= value && value <= r.rangeB.high) {
			return 0;
		}
	}
	return value;
}

function determineFieldIndices(validTickets, rules) {
	let possiblePairs = new Map();

	for (var ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
		const rule = rules[ruleIndex];

		for (var ticketIndex = 0; ticketIndex < validTickets[0].values.length; ticketIndex++) {
			let valuesAtIndex = validTickets.map(t => t.values[ticketIndex]);

			if (valuesAtIndex.every(v => isValidValue(v, [rule]) === 0)) {
				let existingpairs = possiblePairs.get(ticketIndex);

				if (existingpairs)
					existingpairs.add(rule.name);
				else {
					let pairs = new Set([rule.name]);
					possiblePairs.set(ticketIndex, pairs);
				}
			}
		}
	}

	return reconcilePairs(possiblePairs);
}

/**
 * given a list of possible ticket index-rule pairings,
 * use elimination to determine which indices must correspond to which rules.
 * in order for there to be a 1:1 indiex-rule pairing, we must have some starting info
 * (some indices only fit with one specific rule). lock those known pairings in,
 * and prevent the locked-in rules from being paired again.
 * continue iterating until all pairings are locked in at a 1:1 index:rule ratio.
 */
function reconcilePairs(reconcilePairs) {
	let arrayOneToMany = Array.from(reconcilePairs, ([key, fieldNamePairs]) => ({key, fieldNamePairs}));
	let lockedInValues = new Set();

	while (arrayOneToMany.some(m => m.fieldNamePairs.size > 1)) {
		for (var i = 0; i < arrayOneToMany.length; i++) {
			const match = arrayOneToMany[i];

			if (match.fieldNamePairs.size === 1) {
				let lockedInField = match.fieldNamePairs.values().next().value;

				lockedInValues.add(new FieldIndex(match.key, lockedInField));
				arrayOneToMany.forEach(m => m.fieldNamePairs.delete(lockedInField));
			}
		}
	}

	return lockedInValues;
}

function getAnswer(ticket, fieldIndices, phrase) {
	let answer = 1;

	fieldIndices.forEach(fi => {
		if (fi.name.startsWith(phrase))
			answer *= ticket.values[fi.index];
	});

	return answer;
}

module.exports.run = run;
this.run();