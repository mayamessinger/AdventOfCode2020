const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('day7_input.txt');

class Bag {
	/**
	 * color: string
	 * contents: [] Content
	 */
	 constructor(color, contents) {
	 	this.color = color;
	 	this.contents = contents;
	 }
}

class Content {
	/**
	 * bagColor: string
	 * count: number
	 */
	 constructor(count, bagColor) {
	 	this.count = count;
	 	this.bagColor = bagColor;
	 }
}

async function run() {
	const bagRules = await parseRules();
	const goldBagWrappers = getBagWrappers("shiny gold", bagRules); // can have duplicates, if some parent bags share parents
	const uniqueBagWrappers = goldBagWrappers.filter(filterUnique);

	console.log(uniqueBagWrappers.length);
}

async function parseRules() {
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let bagRules = [];
	for await (const line of rl) {
		bagColor = getBagColor(line);
		contents = getContents(line);

		bagRules.push(new Bag(bagColor, contents));
	}
	rl.close();

	return bagRules;
}

function getBagColor(line) {
	const regex = /^([a-z ]+) bags/;

	return regex.exec(line)[1];
}

function getContents(line) {
	let contents = [];

	if (line.includes("no other bags"))
		return contents;

	const contentsRegex = /contain (.+)\.$/;
	const contentsStringArray = contentsRegex.exec(line)[1].split(", ");

	contentsStringArray.forEach(contentString => {
		const quantityRegex = /^([0-9]+)/;
		const colorRegex = /[0-9]+ ([a-z ]+) bags?$/;

		const quantity = quantityRegex.exec(contentString)[1];
		const color = colorRegex.exec(contentString)[1];

		contents.push(new Content(parseInt(quantity), color));
	});

	return contents;
}

/**
 * recursively checks rules.
 * for each bag that can directly hold a bag of color, check what bags can hold it (directly + indirectly).
 * does not filter for uniqueness in results in any way.
 */
function getBagWrappers(color, bagRules) {
	let colorHolders = [];
	bagRules.filter(bag => bag.contents.some(c => c.bagColor === color)).forEach(bag => {
		colorHolders.push(bag.color);
		getBagWrappers(bag.color, bagRules).forEach(b => colorHolders.push(b));
	});

	return colorHolders;
}

function filterUnique(value, index, self) {
	  return self.indexOf(value) === index;
	}

module.exports.run = run;
this.run();