const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('../inputs/day7_input.txt');

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
	const goldBagContentsCount = getContentsCount("shiny gold", bagRules);

	console.log(goldBagContentsCount);
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
 * for each bag (that can hold other bags), check what bags it can hold and what bags those bags can hold.
 */
function getContentsCount(color, bagRules) {
	let contentsCount = 0;
	bagRules.filter(bag => bag.color === color).forEach(bag => {
		contentsCount += bag.contents.reduce((total, content) => total + content.count, 0);
		bag.contents.forEach(c => contentsCount += c.count * getContentsCount(c.bagColor, bagRules));
	});

	return contentsCount;
}

module.exports.run = run;
this.run();