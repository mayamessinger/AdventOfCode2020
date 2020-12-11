const fs = require('fs');

const fileName = 'day10_input.txt';

class Node {
	constructor(value) {
		this.value = value;
		this.before = new Set();
		this.after = new Set();
	}
}

function run() {
	const nodes = sortJoltage();
	const totalOptions = getTotalOptions(nodes);

	console.log(totalOptions);
}

function sortJoltage() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\n");
	const threshold = 3;

	const chargers = rl.map(x => parseInt(x));
	chargers.sort(function(a, b) {return a-b});
	chargers.splice(0, 0, 0);
	chargers.splice(chargers.length, 0, chargers[chargers.length - 1] + 3);

	let nodes = new Array(chargers.length);
	for (var i = 0; i < chargers.length; i++) {
		var thisNode = nodes[i] ? nodes[i] : new Node(chargers[i]);

		for (var j = i + 1; chargers[j] <= chargers[i] + threshold; j++) {
			let newNode = nodes[j] ? nodes[j] : new Node(chargers[j]);

			if (chargers[j] >= chargers[i] - threshold) {
				thisNode.after.add(newNode);
				newNode.before.add(thisNode);
				nodes[j] = newNode;
			}
		}

		nodes[i] = thisNode;
	}

	return nodes;
}

// function getTotalOptions(nodes) {
// 	return countPaths(nodes[0], nodes[nodes.length - 1], 0);
// }

// function countPaths(nodeA, nodeB, pathCount) {
// 	if (nodeA.value === nodeB.value)
// 		pathCount++;
// 	else {
// 		nodeA.connected.forEach(c => pathCount = countPaths(c, nodeB, pathCount));
// 	}

// 	return pathCount;
// }

function getTotalOptions(nodes) {
	console.log(nodes);

	let routes = new Array(nodes.length).fill(0);
	routes[0] = 1;
	for (var i = 0; i < nodes.length; i++) {
		for (var j = i + 1; j <= i + 3; j++) {
			if (nodes[i].after.has(nodes[j]))
				routes[j] += routes[i];
		}
	}

	return routes[nodes.length - 1];
}

module.exports.run = run;
this.run();