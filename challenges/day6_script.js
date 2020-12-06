const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('day6_input.txt');
const possibleYeses = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
	"n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

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

	let currentGroupYeses = possibleYeses;
	for await (const line of rl) {
		if (line) {
			currentGroupYeses = checkPersonYesesWithGroup(line, currentGroupYeses);
		}
		else {
			sumGroupYeses += currentGroupYeses.length;
			currentGroupYeses = possibleYeses;
			continue;
		}
	}
	// handle group that ends file
	sumGroupYeses += currentGroupYeses.length;

	rl.close();
}

function checkPersonYesesWithGroup(line, groupYeses) {
	var lineArray = line.split("");

	return groupYeses.filter(letter => lineArray.includes(letter));
}

module.exports.run = run;
this.run();