const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('day6_input.txt');
let sumGroupYeses = 0;

async function run() {
	await countYeses();

	console.log(sumGroupYeses);
}

async function countYeses() {
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let currentGroupYeses = [];
	for await (const line of rl) {
		if (line) {
			countPersonYeses(line, currentGroupYeses);
		}
		else {
			sumGroupYeses += currentGroupYeses.length;
			currentGroupYeses = [];
			continue;
		}
	}
	// handle group that ends file
	sumGroupYeses += currentGroupYeses.length;

	rl.close();
}

/**
 * Adds any unique answers of an individual (letters in this line)
 * to groupYeses. Skips answers that already exist in groupYeses
*/
function countPersonYeses(line, groupYeses) {
	for (var i = 0; i < line.length; i++) {
		if (groupYeses.indexOf(line[i]) === -1)
			groupYeses.push(line[i]);
	}
}

module.exports.run = run;
this.run();