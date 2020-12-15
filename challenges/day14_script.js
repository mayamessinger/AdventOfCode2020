const fs = require('fs');

const fileName = '../inputs/day14_input.txt';

class Command {
	constructor(memAddr, value) {
		this.memoryAddress = this.createBinary(memAddr);
		this.value = value;
	}

	createBinary(value) {
		let x = value.toString(2);

		return x.padStart(36, '0');
	}
}

function run() {
	const memory = populateMemory();
	const sumMemoryValues = addValues(memory);

	console.log(sumMemoryValues);
}

function populateMemory() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\n");
	let memory = new Map();

	let currentMask = "";
	for (var i = 0; i < rl.length; i++) {
		const line = rl[i].trim();

		if (isMask(line)) {
			currentMask = parseMask(line);
		}
		else {
			let command = parseCommand(line);
			let addresses = applyMask(command.memoryAddress, currentMask);

			addresses.forEach(addr => memory.set(parseInt(addr, 2), command.value));
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

function applyMask(binary, mask) {
	let maskedValue = binary;
	for (var i = 0; i < mask.length; i++) {
		if (mask[i] === "1")
			maskedValue = replace(maskedValue, i, "1");
		else if (mask[i] === "X")
			maskedValue = replace(maskedValue, i, "X");
	}

	return handleFloating(maskedValue);
}

function replace(value, index, newChar) {
	return value.substring(0, index) + newChar + value.substring(index + 1);
}

function handleFloating(binary) {
	let newBinaries = new Array();

	const i = binary.indexOf("X");
	if (i === -1) {
		newBinaries.push(binary);
		return newBinaries;
	}
	
	let newBinary0 = replace(binary, i, "0");
	let newBinary1 = replace(binary, i, "1");

	newBinaries = newBinaries.concat(handleFloating(newBinary0));
	newBinaries = newBinaries.concat(handleFloating(newBinary1));

	return newBinaries;
}

function addValues(map) {
	let sum = 0;
	map.forEach(v => sum += v);

	return sum;
}

module.exports.run = run;
this.run();