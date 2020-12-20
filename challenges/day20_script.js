const fs = require('fs');

const fileName = '../inputs/day20_input.txt';

class Tile {
	constructor() {
		this.lines = [];
	}

	static sideA(lines) { // top
		return lines[0];
	}

	static sideB(lines) { // left
		return lines.map(l => l.charAt(0)).join("");
	}

	static sideC(lines) { // right
		return lines.map(l => l.charAt(l.length - 1)).join("");
	}

	static sideD(lines) { // bottom
		return lines[lines.length - 1];
	}

	sides() {
		return [Tile.sideA(this.lines), Tile.sideB(this.lines), Tile.sideC(this.lines), Tile.sideD(this.lines)];
	}

	/*
	 * very specific order based on current state
	 */
	static rotate(lines) {
		const dimension = lines.length;
		let newLines = new Array(dimension).fill("");
		newLines = newLines.map(l => new Array(dimension));

		for (var i = 0; i < dimension; i++) {
			for (var j = 0; j < dimension; j++) {
				newLines[j][dimension - 1 - i] = lines[i].charAt(j);
			}
		}

		return newLines.map(n => n.splice("").join(""));
	}

	static flip(lines) {
		const dimension = lines.length;
		const newLines = new Array(dimension);

		for (var i = 0; i < dimension; i++) {
			newLines[dimension - i - 1] = lines[i];
		}

		return newLines;
	}

	static orient(lines, i) {
		if (i === 3)
			return Tile.flip(lines);

		return Tile.rotate(lines);
	}

	/*
	 * rotate and/or flip tile until string1 matches Tile[side1](this.lines)
	 * (and string2 matches Tile[side2](this.lines))
	 */
	orientToMatch(string1, side1, string2 = undefined, side2 = undefined) {
		let newOrientation = [...this.lines];

		var i = 0;
		if (string2 === undefined)
			while (string1 !== Tile[side1](newOrientation)) {
				newOrientation = Tile.orient(newOrientation, i);
				i++;
			}
		else
			while ((string1 !== Tile[side1](newOrientation) && reverse(string1) !== Tile[side1](newOrientation))
				|| (string2 !== Tile[side2](newOrientation) && reverse(string2) !== Tile[side2](newOrientation))) {
				newOrientation = Tile.orient(newOrientation, i);
				i++;
			}

		this.lines = newOrientation;
	}

	/*
	 * removes borders - top and bottom rows, and first and last char of remaining rows
	 */
	imageContents() {
		let imageArray = [...this.lines];
		imageArray.shift();
		imageArray.splice(imageArray.length - 1, 1);
		imageArray = imageArray.map(i => i.slice(1, -1));

		return imageArray;
	}
}

class Match {
	constructor(matchId, matchString) {
		this.matchId = matchId;
		this.matchString = matchString;
	}
}

function run() {
	const tiles = parseInput();
	const matches = findMatches(tiles);
	const image = prepareImage(tiles, matches);
	const [finalImage, monsters] = orientAndFindMonsters(image);
	const puzzleAnswer = getPuzzleAnswer(finalImage, monsters);

	console.log(puzzleAnswer);
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

						if (s === s1)
							tileMatches.push(new Match(t1.id, s1));
						else if (s === reverse(s1))
							tileMatches.push(new Match(t1.id, reverse(s1)));
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

function prepareImage(tiles, matches) {
	let tileOrder = seedTileOrder(tiles, matches);

	fillInTileOrder(tiles, matches, tileOrder);
	
	return constructImageFromPlacement(tiles, tileOrder);
}

function seedTileOrder(tiles, matches) {
	let tileOrder = new Array(Math.sqrt(matches.size)).fill(""); // fill just to not be undefined
	tileOrder = tileOrder.map(t => []);

	const cornerId = getFirstCorner(matches);
	tileOrder[0][0] = cornerId;

	const cornerTile = tiles.get(cornerId);
	const cornerSides = remainingSides(cornerId, matches, tileOrder.flat());

	// rotate corner to correct position (matches are on sideC and sideD)
	cornerTile.orientToMatch(cornerSides[0].matchString, "sideC", cornerSides[1].matchString, "sideD");

	return tileOrder;
}

function getFirstCorner(matches) {
	for (const [key, value] of matches.entries()) {
		if (value.length === 2)
			return key;
	}
}

function fillInTileOrder(tiles, matches, tileOrder) {
	while (tileOrder.flat().length !== tiles.size) {
		const tileToMatchIndex = chooseExistingTileToMatch(tileOrder);
		const tileToMatch = tiles.get(tileOrder[tileToMatchIndex[0]][tileToMatchIndex[1]]);

		const [nextTileIndex, prevTileSide, nextTileSide] = nextEmptyTileInfo(tileOrder);
		// get info based on tileToMatch's matches - choose the match for the correct side
		const tileToAddInfo = remainingSides(tileToMatch.id, matches, tileOrder.flat())
			.filter(s => s.matchString === Tile[prevTileSide](tileToMatch.lines)
				|| reverse(s.matchString) === Tile[prevTileSide](tileToMatch.lines))[0];
		const nextTile = tiles.get(tileToAddInfo.matchId);

		tileOrder[nextTileIndex[0]][nextTileIndex[1]] = nextTile.id;
		nextTile.orientToMatch(Tile[prevTileSide](tileToMatch.lines), nextTileSide);
	}
}

function chooseExistingTileToMatch(tileOrder) {
	const flatIndex = tileOrder.flat().filter(i => i !== []).length - 1;
	const rowIndex = Math.floor(flatIndex / tileOrder.length);
	const colIndex = flatIndex % tileOrder.length;

	if (colIndex === tileOrder.length - 1)
		return [rowIndex, 0];
	else
		return [rowIndex, colIndex];
}

function nextEmptyTileInfo(tileOrder) {
	const flatIndex = tileOrder.flat().filter(i => i !== []).length;
	const rowIndex = Math.floor(flatIndex / tileOrder.length);
	const colIndex = flatIndex % tileOrder.length;

	let prevTileSide;
	let nextTileSide;
	if (colIndex === 0) { // match prev tile w/ top
		prevTileSide = "sideD";
		nextTileSide = "sideA";
	}
	else { // match prev tile w/ left
		prevTileSide = "sideC";
		nextTileSide = "sideB";
	}

	return [
		[rowIndex, colIndex],
		prevTileSide,
		nextTileSide
	];
}

function remainingSides(tile, matches, lockedIn) {
	const allMatches = matches.get(tile);
	const remainingMatches = allMatches.filter(m => !lockedIn.includes(m.matchId));

	return remainingMatches;
}

function constructImageFromPlacement(tiles, tileOrder) {
	let imageArray = new Array(tileOrder.length).fill("");
	imageArray = imageArray.map(i => []);

	for (var i = 0; i < tileOrder.length; i++) {
		for (var j = 0; j < tileOrder[i].length; j++) {
			const tile = tiles.get(tileOrder[i][j]);

			imageArray[i].push(tile.imageContents());
		}
	}

	const imageLinesLength = tiles.get(tileOrder[0][0]).imageContents().length;
	const image = new Array(imageArray.length * imageLinesLength).fill("");

	for (var i = 0; i < imageArray.length; i++) {
		for (var j = 0; j < imageArray[i].length; j++) {
			for (var k = 0; k < imageLinesLength; k++) {
				image[i * imageLinesLength + k] += imageArray[i][j][k];
			}
		}
	}

	return image;
}

function orientAndFindMonsters(imageLines) {
	let imageTile = new Tile();
	imageTile.lines = imageLines;
	
	let monsters = findMonsters(imageTile.lines, parseMonsterImage());

	let i = 0;
	while (monsters.length === 0) {
		imageTile.lines = Tile.orient(imageTile.lines, i);

		monsters = findMonsters(imageTile.lines, parseMonsterImage());
		i++;
	}

	return [imageTile.lines, monsters];
}

/*
 * returns a list of monsters, in format [head line, bodyStart]
 * i.e. 3 x 20 block of "monster" starts at [0], at character [1]
 */
function findMonsters(imageLines, monsterTemplate) {
	let monsters = [];

	for (var i = 0; i < imageLines.length - 2; i++) {
		const line = imageLines[i];

		for (var j = 0; j < line.length; j++) {
			if (matchesLine(line.substring(j), monsterTemplate[0])
				&& matchesLine(imageLines[i + 1].substring(j), monsterTemplate[1])
				&& matchesLine(imageLines[i + 2].substring(j), monsterTemplate[2])
				&& monsters.every(m => m[0] !== i || m[1] < j - 20)) {
					monsters.push([i, j]);
			}
		}
	}

	return monsters;
}

function parseMonsterImage() {
	const image = [
		'                  # ',
		'#    ##    ##    ###',
 		' #  #  #  #  #  #   '
	]

	let indices = new Array(image.length);

	for (var i = 0; i < image.length; i++) {
		indices[i] = [];

		const imageLine = image[i];
		for (var j = 0; j < imageLine.length; j++) {
			if (imageLine.charAt(j) === "#")
				indices[i].push(j);
		}
	}

	return indices;
}

function matchesLine(line, indices) {
	for (var i = 0; i < indices.length; i++) {
		if (line.charAt(indices[i]) !== "#")
			return false;
	}

	return true;
}

function getPuzzleAnswer(image, monsters) {
	let numHashes = 0;

	for (var i = 0; i < image.length; i++) {
		const line = image[i];

		for (var j = 0; j < line.length; j++) {
			if (line.charAt(j) === "#")
				numHashes++;
		}
	}

	const numHashesInMonster = parseMonsterImage().flat().length;

	return numHashes - (numHashesInMonster * monsters.length);
}

module.exports.run = run;
this.run();