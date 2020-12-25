const fs = require('fs');

const fileName = '../inputs/day24_input.txt';

class Tile {
	constructor(x, y, isBlack = false) {
		this.x = x;
		this.y = y;
		this.isBlack = isBlack;
	}

	flip() {
		this.isBlack = !this.isBlack;
	}
}

function run() {
	const tiles = parseInput();
	const numBlack = getBlackTiles(tiles);

	console.log(numBlack);
}

function parseInput() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\r\n").map(i => i.trim());
	const tiles = new Map();

	rl.forEach(l => {
		const tileCoords = parsePath(l);
		const tile = tiles.get(getKey(tileCoords)) ?? new Tile(tileCoords[0], tileCoords[1]);

		tile.flip();

		tiles.set(getKey(tileCoords), tile);
	});

	return tiles;
}

/*
 * Uses the odd-r coordinate system described https://www.redblobgames.com/grids/hexagons/#coordinates
 * to represent tile locations.
 * The reference tile from which paths start will be (0,0)
 */
function parsePath(path) {
	let currX = 0;
	let currY = 0;

	const regex = /(e|se|sw|w|w|nw|ne)/g;
	const results = [...path.matchAll(regex)];

	results.forEach(r => {
		switch (r[0]) {
			case "e":
				currX++;
				break;
			case "w":
				currX--;
				break;
			case "se":
				if (currY % 2 !== 0)
					currX++;

				currY--;
				break;
			case "sw":
				if (currY % 2 === 0)
					currX--;

				currY--;
				break;
			case "nw":
				if (currY % 2 === 0)
					currX--;

				currY++;
				break;
			case "ne":
				if (currY % 2 !== 0)
					currX++;

				currY++;
				break;
		}
	});

	return [currX, currY];
}

function getKey(tuple) {
	return tuple[0] + "." + tuple[1];
}

function getBlackTiles(tiles) {
	let numBlack = 0;

	tiles.forEach(t => {
		if (t.isBlack)
			numBlack++;
	});

	return numBlack;
}

module.exports.run = run;
this.run();