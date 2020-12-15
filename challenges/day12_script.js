const fs = require('fs');

const fileName = '../inputs/day12_input.txt';

const directions = ["E", "S", "W", "N"];
const turns = {
	Left: "L",
	Right: "R"
}

class Location {
	constructor() {
		this.latitude = 0;
		this.longitude = 0;
		this.waypointLatOffset = 10;
		this.waypointLongOffset = 1;
	}

	applyInstruction(instruction) {
		// if a Movement
		if (instruction["dir"]) {
			this.applyMovement(instruction);
		}
		// if a Turn
		else if (instruction["numTurns"])
			this.applyTurn(instruction);
	}

	applyMovement(movement) {
		if (movement.dir === "N") {
			this.waypointLongOffset += movement.distance;
		}
		else if (movement.dir === "S") {
			this.waypointLongOffset -= movement.distance;
		}
		else if (movement.dir === "E") {
			this.waypointLatOffset += movement.distance;
		}
		else if (movement.dir === "W") {
			this.waypointLatOffset -= movement.distance;
		}
		else if (movement.dir === "F") {
			this.latitude += this.waypointLatOffset * movement.distance;
			this.longitude += this.waypointLongOffset * movement.distance;
		}
	}

	applyTurn(turn) {
		for (var i = 0; i < turn.numTurns/90; i++) {
			if (turn.direction === "R") {
				const ogLat = this.waypointLatOffset;
				const ogLong = this.waypointLongOffset;

				if (ogLat >= 0 && ogLong >= 0) {
					this.waypointLatOffset = ogLong;
					this.waypointLongOffset = -ogLat;
				}
				else if (ogLat >= 0 && ogLong < 0) {
					this.waypointLatOffset = ogLong;
					this.waypointLongOffset = -ogLat;
				}
				else if (ogLat < 0 && ogLong < 0) {
					this.waypointLatOffset = ogLong;
					this.waypointLongOffset = -ogLat;
				}
				else if (ogLat < 0 && ogLong >= 0) {
					this.waypointLatOffset = ogLong;
					this.waypointLongOffset = -ogLat;
				}
			}

			if (turn.direction === "L") {
				const ogLat = this.waypointLatOffset;
				const ogLong = this.waypointLongOffset;

				if (ogLat >= 0 && ogLong >= 0) {
					this.waypointLatOffset = -ogLong;
					this.waypointLongOffset = ogLat;
				}
				else if (ogLat < 0 && ogLong >= 0) {
					this.waypointLatOffset = -ogLong;
					this.waypointLongOffset = ogLat;
				}
				else if (ogLat < 0 && ogLong < 0) {
					this.waypointLatOffset = -ogLong;
					this.waypointLongOffset = ogLat;
				}
				else if (ogLat >= 0 && ogLong < 0) {
					this.waypointLatOffset = -ogLong;
					this.waypointLongOffset = ogLat;
				}
			}
		}
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
	constructor(direction, numTurns) {
		this.direction = direction;
		this.numTurns = numTurns;
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

	if (match[1] !== "L" && match[1] !== "R")
		return new Movement(match[1], parseInt(match[2]));

	return new Turn(match[1], parseInt(match[2]));
}

module.exports.run = run;
this.run();