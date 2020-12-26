const fs = require('fs');

const fileName = '../inputs/day25_input.txt';

function run() {
	const [cardPublicKey, doorPublicKey] = parseInput();
	const [cardLoop, doorLoop] = getLoops(cardPublicKey, doorPublicKey);
	const encrytionKey = getEncryptionKey(cardPublicKey, doorLoop);

	console.log(encrytionKey);
}

function parseInput() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\r\n").map(i => i.trim());
	let cardPublicKey = parseInt(rl[0]);
	let doorPublicKey = parseInt(rl[1]);

	return [cardPublicKey, doorPublicKey];
}

function getLoops(cardPublicKey, doorPublicKey) {
	const cardLoop = findKeyLoop(cardPublicKey);
	const doorLoop = findKeyLoop(doorPublicKey);

	return [cardLoop, doorLoop];
}

function findKeyLoop(publicKey) {
	const subjectNumber = 7;

	let value = 1;
	let loopCount = 0;
	while (value !== publicKey) {
		value = transform(value, subjectNumber, 20201227);
		loopCount++;
	}

	return loopCount;
}

function transform(value, subjectNumber, divisor) {
	value *= subjectNumber;

	return value % divisor;
}

function getEncryptionKey(publicKey, loop) {
	let value = 1;
	for (var i = 0; i < loop; i++) {
		value = transform(value, publicKey, 20201227);
	}

	return value;
}


module.exports.run = run;
this.run();