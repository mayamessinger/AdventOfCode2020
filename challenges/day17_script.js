const fs = require('fs');

const fileName = '../inputs/day17_input.txt';

class Tube {
	constructor(x, y, z, w, value) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		this.value = value;
	}
}

class MapInfo {
	constructor(xMin, xMax, yMin, yMax, zMin, zMax, wMin, wMax) {
		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;
		this.zMin = zMin;
		this.zMax = zMax;
		this.wMin = wMin;
		this.wMax = wMax;
	}

	increment() {
		this.xMin--;
		this.xMax++;
		this.yMin--;
		this.yMax++;
		this.zMin--;
		this.zMax++;
		this.wMin--;
		this.wMax++;
	}
}

function run() {
	const [tubes, info] = parseInput();
	const endState = cycle(tubes, 6, info);
	const numActive = getActive(endState);

	console.log(numActive);
}

function parseInput() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\r\n");
	let tubes = new Map();

	for (var i = 0; i < rl.length; i++) {
		for (var j = 0; j < rl[i].length; j++) {
			tubes.set(getKey(i, j, 0, 0), new Tube(i, j, 0, 0, rl[i].charAt(j)));
		}
	}

	const info = new MapInfo(0, rl.length - 1, 0, rl[0].length - 1, 0, 0, 0, 0);

	return [tubes, info];
}

function getKey(x, y, z, w) {
	return x + "." + y + "." + z + "." + w;
}

/*
 * Runs the simulation for given # of rounds.
 * Continuously updates state of existing tubes, and adds tubes to map if
 * they are within range of simulation (if their values matter to simulation)
 */
function cycle(tubes, rounds, mapInfo) {
	if (rounds === 0)
		return tubes;

	endState = deepCopy(tubes);

	for (var x = mapInfo.xMin; x <= mapInfo.xMax; x++) {
		for (var y = mapInfo.yMin; y <= mapInfo.yMax; y++) {
			for (var z = mapInfo.zMin; z <= mapInfo.zMax; z++) {
				for (var w = mapInfo.wMin; w <= mapInfo.wMax; w++) {
					const currTube = tubes.get(getKey(x, y, z, w));

					const neighbors = getAndAddNeighbors(currTube, tubes, endState);

					const newState = getNewState(currTube, neighbors);
					endState.get(getKey(x, y, z, w)).value = getNewState(currTube.value, neighbors);
				}
			}
		}
	}

	mapInfo.increment();
	return cycle(endState, rounds - 1, mapInfo);
}

function deepCopy(mapWithTubes) {
	let copy = new Map();

	for (const [key, value] of mapWithTubes.entries()) {
	  	copy.set(key, new Tube(value.x, value.y, value.z, value.w, value.value));
	}

	return copy;
}

/*
 * Returns an array of the existing Tubes around given tube.
 * If nextRound map is provided, also adds not-yet-mapped tubes to nextRound tubes
 */
function getAndAddNeighbors(tube, tubes, nextRound = undefined) {
	let neighbors = [];

	for (var x = tube.x - 1; x <= tube.x + 1; x++) {
		for (var y = tube.y - 1; y <= tube.y + 1; y++) {
			for (var z = tube.z - 1; z <= tube.z + 1; z++) {
				for (var w = tube.w - 1; w <= tube.w + 1; w++) {
					if (x === tube.x && y === tube.y && z === tube.z && w === tube.w)
						continue;

					const neighbor = tubes.get(getKey(x, y, z, w));
					if (neighbor !== undefined) {
						neighbors.push(neighbor);
					}
					// add neightbor with correct value to next round Tubes
					else if (nextRound !== undefined) {
						let newNeighbor = new Tube(x, y, z, w, undefined);
						let newNeighborNeighbors = getAndAddNeighbors(newNeighbor, tubes);
						newNeighbor.value = getNewState(".", newNeighborNeighbors);

						nextRound.set(getKey(x, y, z, w), newNeighbor);
					}
				}
			}
		}
	}

	return neighbors;
}

function getNewState(tubeValue, neighbors) {
	const activeNeighbors = neighbors.filter(n => n.value === "#").length;

	if (tubeValue === "#" && !(activeNeighbors === 2 || activeNeighbors === 3))
		return ".";

	if (tubeValue === "." && activeNeighbors === 3)
		return "#";

	return tubeValue;
}

function getActive(tubes) {
	let numActive = 0;

	for (const [key, value] of tubes.entries()) {
	  	if (value.value === "#")
  			numActive++;
	}

	return numActive;
}

module.exports.run = run;
this.run();