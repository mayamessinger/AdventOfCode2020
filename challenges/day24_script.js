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
	let tiles = parseInput();
	tiles = flipDaily(tiles, 100);
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

function flipDaily(tiles, numDays) {
	for (var i = 1; i <= numDays; i++) {

		const newDayTiles = new Map();

		// pretty bad to hard-code floor bounds, but I figured it's actually more efficient
		// than finding array max coordinates every day. It did take trial and error,
		// have to increase bounds until final answer does not change
		for (var j = -65; j <= 65; j++) {
			for (var k = -65; k <= 65; k++) {
				const tile = tiles.get(getKey([j, k])) ?? new Tile(j, k);
				const blackNeighbors = getBlackNeighbors(tiles, tile);
				const willBeBlack = wilLBeBlack(tile, blackNeighbors);

				newDayTiles.set(getKey([j, k]), new Tile(tile.x, tile.y, willBeBlack));
			}
		}

		tiles = newDayTiles;
	}

	return tiles;
}

function getBlackNeighbors(tiles, tile) {
	const neighborCoords = getNeighborCoords(tile);

	let blackNeighbors = 0;
	neighborCoords.forEach(c => {
		if (tiles.get(getKey(c)) !== undefined && tiles.get(getKey(c)).isBlack)
			blackNeighbors++;
	});

	return blackNeighbors;
}

function getNeighborCoords(tile) {
	return tile.y % 2 === 0
		? [
			[tile.x + 1, tile.y],
			[tile.x, tile.y - 1],
			[tile.x - 1, tile.y - 1],
			[tile.x - 1, tile.y],
			[tile.x - 1, tile.y + 1],
			[tile.x, tile.y + 1]
		]
		: [
			[tile.x + 1, tile.y],
			[tile.x + 1, tile.y - 1],
			[tile.x, tile.y - 1],
			[tile.x - 1, tile.y],
			[tile.x, tile.y + 1],
			[tile.x + 1, tile.y + 1]
		];
}

function wilLBeBlack(tile, blackNeighbors) {
	if (tile.isBlack && blackNeighbors === 0 || blackNeighbors > 2)
		return false;
	if (!tile.isBlack && blackNeighbors === 2)
		return true;

	return tile.isBlack;
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