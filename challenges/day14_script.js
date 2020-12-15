const fs = require('fs');

const fileName = 'day14_input.txt';

class Command {
	constructor(memAddr, value) {
		this.memoryAddress = memAddr;
		this.binaryValue = this.createBinary(value);
	}

	createBinary(value) {
		let x = value.toString(2);

		return x.padStart(36, '0');
	}
}

function run() {
	const memory = parseRows();
	const sumMemoryValues = addValues(memory);

	console.log(sumMemoryValues);
}

function parseRows() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\n");
	let memory = new Array();

	let currMask = "";
	for (var i = 0; i < rl.length; i++) {
		const line = rl[i].trim();

		if (isMask(line)) {
			currMask = parseMask(line);
		}
		else {
			let command = parseCommand(line);
			maskCommand(command, currMask);

			memory[command.memoryAddress] = command.binaryValue;
		}
	}

	return memory;
}

function isMask(line) {
	if (line.indexOf("mask") !== -1)
		return true;

	return false;
}

function parseMask(line) {
	const maskRegex = /^mask = ([01X]+)$/;

	return maskRegex.exec(line)[1];
}

function parseCommand(line) {
	const addrRegex = /^mem\[([0-9]+)\]/;
	const valueRegex = /= ([0-9]+)/;

	const memAddr = parseInt(addrRegex.exec(line)[1]);
	const value = parseInt(valueRegex.exec(line)[1]);
	return new Command(memAddr, value);
}

function maskCommand(command, mask) {
	let maskedValue = command.binaryValue;

	for (var i = 0; i < command.binaryValue.length; i++) {
		const maskChar = mask.charAt(i);

		if (maskChar !== "X")
			maskedValue = replace(maskedValue, i, maskChar);
	}

	command.binaryValue = maskedValue;
}

function replace(value, index, newChar) {
	return value.substring(0, index) + newChar + value.substring(index + 1);
}

function addValues(memory) {
	const values = memory.filter(m => m !== null);

	let sum = 0;
	values.forEach(v => sum += parseInt(v, 2));

	return sum;
}

module.exports.run = run;
this.run();