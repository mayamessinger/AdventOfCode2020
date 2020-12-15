const fs = require('fs');

const fileName = '../inputs/day13_input.txt';

class Bus {
	constructor(index, id) {
		this.index = index;
		this.id = id;
	}
}

function run() {
	const buses = parseRows();
	const timestampT = getTimestampT(buses);

	console.log(timestampT);
}

function parseRows() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\n");

	const buses = loadBuses(rl[1].trim());

	return buses;
}

function loadBuses(busesStr) {
	const busArr = busesStr.split(",");

	let buses = [];
	for (var i = 0; i < busArr.length; i++) {
		if (busArr[i] !== "x")
			buses.push(new Bus(i, parseInt(busArr[i])));
	}

	return buses;
}

function getTimestampT(buses) {
	let longestRoute = buses.find(b => b.id === Math.max(...buses.map(x => x.id)));

	let timestampT = null;
	let i = Math.floor((100000000000000 + longestRoute.index) / longestRoute.id);
	while(timestampT === null) {
		if (isTimestampT(longestRoute, i, buses)) {
			timestampT = i;
		}                                               
		else {
			i++;
		}
	}

	return i * longestRoute.id - longestRoute.index;
}

function isTimestampT(longestRoute, multiplier, buses) {
	const baseArrival = longestRoute.id * multiplier;

	for (i = 0; i < buses.length; i++) {
		const indexDiff = longestRoute.index - buses[i].index;
		const expectedIValue = baseArrival - indexDiff;

		if (expectedIValue % buses[i].id !== 0)
			return false;
	}

	return true;
}

module.exports.run = run;
this.run();