const fs = require('fs');

const fileName = 'day13_input.txt';

function run() {
	const [myArrival, buses] = parseRows();
	const earliestBus = getEarliestBus(myArrival, buses);
	const puzzleAnswer = getPuzzleAnswer(myArrival, earliestBus);

	console.log(puzzleAnswer);
}

function parseRows() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\n");

	const myArrival = parseInt(rl[0].trim());
	const buses = loadBuses(rl[1].trim());

	return [myArrival, buses];
}

function loadBuses(busesStr) {
	const busArr = busesStr.split(",");

	let buses = [];
	for (var i = 0; i < busArr.length; i++) {
		if (busArr[i] !== "x")
			buses.push(parseInt(busArr[i]));
	}

	return buses;
}

function getEarliestBus(arrival, buses) {
	let closestStopTimes = new Array(buses.length);
	for (var i = 0; i < buses.length; i++) {
		// closest bus stop round after arrival
		let busRound = Math.floor(arrival/buses[i]) + 1;

		closestStopTimes[i] = [buses[i], busRound * buses[i]];
	}

	closestStopTimes.sort(function(a, b) { return (a[1] - arrival) - (b[1] - arrival) });

	return closestStopTimes[0][0];
}

function getPuzzleAnswer(arrival, bus) {
	// get earliest time at which someone arriving at arrival can get on bus bus
	let busIncrement = Math.floor(arrival/bus) + 1;

	// wait time * bus id
	return (busIncrement * bus - arrival) * bus;
}

module.exports.run = run;
this.run();