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

function run() {
	const [fieldRules, myTicket, nearbyTickets] = parseInput();
	const errorRate = invalidateTickets(nearbyTickets, fieldRules);

	console.log(errorRate);
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
	let errorRate = 0;

	tickets.forEach(t => {
		errorRate += ticketError(t, rules);
	});

	return errorRate;
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

module.exports.run = run;
this.run();