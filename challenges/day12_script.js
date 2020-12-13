const fs = require('fs');

const fileName = 'day12_input.txt';

const directions = ["E", "S", "W", "N"];
const turns = {
	Left: "L",
	Right: "R"
}

class Location {
	constructor() {
		this.latitude = 0;
		this.longitude = 0;
		this.orientation = "E";
	}

	applyInstruction(instruction) {
		// if a Movement
		if (instruction["dir"]) {
			this.applyMovement(instruction);
		}
		// if a Turn
		else if (instruction["orientation"])
			this.applyTurn(instruction);
	}

	applyMovement(movement) {
		if (movement.dir === "N")
			this.latitude += movement.distance;
		else if (movement.dir === "S")
			this.latitude -= movement.distance;
		else if (movement.dir === "E")
			this.longitude += movement.distance;
		else if (movement.dir === "W")
			this.longitude -= movement.distance;
	}

	applyTurn(turn) {
		this.orientation = turn.orientation;
	}

	getDistance() {
		return Math.abs(this.latitude) + Math.abs(this.longitude);
	}
}

class Movement {
	constructor(direction, distance) {
		this.dir = direction;
		this.distance = distance;
	}
}

class Turn {
	constructor(orientation) {
		this.orientation = orientation;
	}
}

function run() {
	const finalOrientation = parseInstructions();
	const finalDistance = finalOrientation.getDistance();

	console.log(finalOrientation, finalDistance);
}

function parseInstructions() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\n");
	let instructions = [];

	let currLoc = new Location();
	for (var i = 0; i < rl.length; i++) {
		const instruction = parseInstruction(rl[i], currLoc);

		currLoc.applyInstruction(instruction);
	}

	return currLoc;
}

function parseInstruction(instrStr, location) {
	const instructionRegex = /^([NESWLRF])([0-9]+)$/;
	const match = instructionRegex.exec(instrStr.trim());

	const dir = getDir(match[1], location);
	if (dir !== null)
		return new Movement(dir, parseInt(match[2]));

	const orientation = getOrientation(match, location);
	return new Turn(orientation);
}

function getDir(dirOrTurn, location) {
	if (dirOrTurn === "F") {
		return location.orientation;
	}
	else if (directions.indexOf(dirOrTurn) !== -1) {
		return dirOrTurn;
	}

	return null;
}

function getOrientation(turn, location) {
	let turnDir = turn[1];
	let turnAmt = parseInt(turn[2]);
	let posTurnAmt = turnDir === "R"
		? turnAmt
		: turnAmt * -1 + 360;
	let addIndex = (posTurnAmt % 360) / 90;

	let newIndex = (directions.indexOf(location.orientation) + addIndex) % 4;

	return directions[newIndex];
}

module.exports.run = run;
this.run();