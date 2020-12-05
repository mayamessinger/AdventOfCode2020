const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('day4_input.txt');
let numValid = 0;

class Passport {
	constructor() {
		this.byr = null;
		this.iyr = null;
		this.eyr = null;
		this.hgt = null;
		this.hcl = null;
		this.ecl = null;
		this.pid = null;
		this.cid = null;
	}

	clear() {
		this.byr = null;
		this.iyr = null;
		this.eyr = null;
		this.hgt = null;
		this.hcl = null;
		this.ecl = null;
		this.pid = null;
		this.cid = null;
	}

	isValid() {
		return this.byr !== null
			&& this.iyr !== null
			&& this.eyr !== null
			&& this.hgt !== null
			&& this.hcl !== null
			&& this.ecl !== null
			&& this.pid !== null;
	}
}

async function run() {
	await checkValidPassports();

	console.log(numValid);
}

async function checkValidPassports() {
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let currentPassport = new Passport();
	for await (const line of rl) {
		if (line) {
			populatePassport(currentPassport, line);
		}
		else {
			validatePassport(currentPassport);
			clearPassport(currentPassport);
		}
	}
	rl.close();
}

function populatePassport(passport, line) {
	const propertySplitChar = " ";
	const valueSplitChar = ":";

	const properties = line.split(propertySplitChar);
	for (var i = 0; i < properties.length; i++) {
		const keyVal = properties[i].split(valueSplitChar);

		passport[keyVal[0]] = keyVal[1];
	}
}

function validatePassport(passport) {
	if (passport.isValid())
		numValid++;
}

function clearPassport(passport) {
	passport.clear();
}

module.exports.run = run;
this.run();