const fs = require('fs');

const fileName = '../inputs/day20_input.txt';

class Tile {
	constructor() {
		this.lines = [];
	}

	sideA() { // top
		return this.lines[0];
	}

	sideB() { // left
		return this.lines.map(l => l.charAt(0)).join("");
	}

	sideC() { // right
		return this.lines.map(l => l.charAt(l.length - 1)).join("");
	}

	sideD() { // bottom
		return this.lines[this.lines.length - 1];
	}

	sides() {
		return [this.sideA(), this.sideB(), this.sideC(), this.sideD()];
	}
}

function run() {
	const tiles = parseInput();
	const matches = findMatches(tiles);
	const corners = getCorners(matches);

	console.log(multiply(corners));
}

function parseInput() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\r\n").map(l => l.trim());
	let tiles = new Map();

	let currentTile = new Tile();
	for (var i = 0; i < rl.length; i++) {
		const line = rl[i];

		if (line !== "") {
			if (line.startsWith("Tile"))
				currentTile.id = parseInt(/([0-9]+)/.exec(line)[1]);
			else {
				currentTile.lines.push(line);
			}

		}
		else {
			tiles.set(currentTile.id, currentTile);
			currentTile = new Tile();
		}
	}

	tiles.set(currentTile.id, currentTile);

	return tiles;
}

function findMatches(tiles) {
	let matches = new Map();

	tiles.forEach(t => {
		let tileMatches = [];
		const tSides = t.sides();

		tiles.forEach(t1 => {
			const t1Sides = t1.sides();

			if (t !== t1) {
				for (var i = 0; i < tSides.length; i++) {
					const s = tSides[i];

					for (var j = 0; j < t1Sides.length; j++) {
						const s1 = t1Sides[j];

						if (s === s1 || s === reverse(s1))
							tileMatches.push([t1.id, j]);
					}
				}
			}
		});

		matches.set(t.id, tileMatches);
	});

	return matches;
}

function reverse(str) {
	return str.split("").reverse().join("");
}

function getCorners(matches) {
	let corners = [];

	for (const [key, value] of matches.entries()) {
		if (value.length === 2)
			corners.push(key);
	}

	return corners;
}

function multiply(arr) {
	let product = 1;

	arr.forEach(i => product *= i);

	return product;
}

module.exports.run = run;
this.run();