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

	console.log(accumulator);
}

function runBootCode() {
	const rl = fs.readFileSync("./day8_input.txt").toString("utf-8").split("\n");
	const instructions = rl.map(c => parseInstruction(c));
	const visited = new Array(rl.length).fill(false);

	var instructionIndex = 0;
	while (instructionIndex < instructions.length) {
		if (visited[instructionIndex] === true)
			break;

		visited[instructionIndex] = true;
		instructionIndex += executeInstruction(instructions[instructionIndex]);
	}
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