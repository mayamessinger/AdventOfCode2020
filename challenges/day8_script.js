const fs = require('fs');

const fileStream = fs.createReadStream('day8_input.txt');

let accumulator = 0;

class Instruction {
	constructor(op, arg) {
		this.operation = op;
		this.argument = arg;
	}
}

const operations = {
	NOP: "nop",
	ACC: "acc",
	JMP: "jmp"
};

function run() {
	runBootCode();
}

function runBootCode() {
	const rl = fs.readFileSync("./day8_input.txt").toString("utf-8").split("\n");

	for (var i = 0; i < rl.length; i++) {
		accumulator = 0;
		const instructions = rl.map(c => parseInstruction(c));

		if (instructions[i].operation === operations.NOP) {
			instructions[i].operation = operations.JMP;
		}
		else if (instructions[i].operation === operations.JMP) {
			instructions[i].operation = operations.NOP;
		}

		if (instructions[i].operation !== operations.ACC && runWithoutLoop(instructions)) {
			console.log("changed instruction _ to _", i, instructions[i]);
			console.log("accumulator", accumulator);
			return;
		}
	}
}

function runWithoutLoop(instructions) {
	const visited = new Array(instructions.length).fill(false);

	var instructionIndex = 0;
	while (instructionIndex < instructions.length) {
		if (visited[instructionIndex] === true)
			return false;

		visited[instructionIndex] = true;
		instructionIndex += executeInstruction(instructions[instructionIndex]);
	}

	return true;
}

function parseInstruction(instructionString) {
	var op = /^(nop|acc|jmp) /.exec(instructionString.trim())[1];
	var arg = parseInt(/ ([+-][0-9]+)$/.exec(instructionString.trim())[1]);

	return new Instruction(op, arg);
}

function executeInstruction(instruction) {
	switch (instruction.operation) {
		case operations.NOP:
			return 1;
		case operations.ACC:
			accumulator += instruction.argument;
			return 1;
		case operations.JMP:
			return instruction.argument;
	}
}

module.exports.run = run;
this.run();