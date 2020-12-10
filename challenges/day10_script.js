const fs = require('fs');

const fileName = 'day10_input.txt';

function run() {
	const differences = sortJoltage();

	console.log(differences[1] * differences[3]);
}

function sortJoltage() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\n");
	const chargers = rl.map(x => parseInt(x));
	chargers.sort(function(a, b) {return a-b});
	chargers.splice(0, 0, 0);
	chargers.splice(chargers.length, 0, chargers[chargers.length - 1] + 3);

	let differences = new Array(4).fill(0);
	for (var i = 1; i < chargers.length; i++) {
		const difference = chargers[i] - chargers[i - 1];

		differences[difference]++;
	}

	return differences;
}

module.exports.run = run;
this.run();