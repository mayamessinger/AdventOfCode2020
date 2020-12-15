const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('../inputs/day4_input.txt');
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
		return Passport.birthYearValid(this.byr)
			&& Passport.issueYearValid(this.iyr)
			&& Passport.expYearValid(this.eyr)
			&& Passport.heightValid(this.hgt)
			&& Passport.hairColorValid(this.hcl)
			&& Passport.eyeColorValid(this.ecl)
			&& Passport.passportIdValid(this.pid);
	}

	static birthYearValid(year) {
		return year !== null
			&& year.length === 4
			&& parseInt(year) >= 1920
			&& parseInt(year) <= 2002;
	}

	static issueYearValid(year) {
		return year !== null
			&& year.length === 4
			&& parseInt(year) >= 2010
			&& parseInt(year) <= 2020;
	}

	static expYearValid(year) {
		return year !== null
			&& year.length === 4
			&& parseInt(year) >= 2020
			&& parseInt(year) <= 2030;
	}

	static heightValid(height) {
		var formatRegex = /^([0-9]+)(cm|in)$/;

		var exec = formatRegex.exec(height);
		if (exec !== null) {
			var num = parseInt(exec[1]);

			if (exec[2] === "cm")
				return num >= 150 && num <= 193;
			else if (exec[2] === "in")
				return num >= 59 && num <= 76;
		}

		return false;
	}

	static hairColorValid(color) {
		var regex = /^#[0-9a-f]{6}$/;

		return color !== null
			&& regex.exec(color) !== null;
	}

	static eyeColorValid(color) {
		const validColors = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];

		return color !== null
			&& validColors.indexOf(color) !== -1;
	}

	static passportIdValid(pid) {
		var regex = /^[0-9]{9}$/;

		return pid !== null
			&& regex.exec(pid) !== null;
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