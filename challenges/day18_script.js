const fs = require('fs');

const fileName = '../inputs/day18_input.txt';

function run() {
	const sum = getSum();

	console.log(sum);
}

function getSum() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\r\n");
	let sum = 0;

	rl.forEach(l => { sum += simplifyLine(l) });

	return sum;
}

function simplifyLine(line) {
	const parens = getOuterParens(line);

	// expression is already simplified
	if (parens.length === 0)
		return evaluateSimpleExpression(line);

	let newLine = line.substring(0, parens[0][0]);
	for (var i = 0; i < parens.length; i++) {
		const p = parens[i];

		newLine += simplifyLine(line.substring(p[0] + 1, p[1]));

		if (i !== parens.length - 1) {
			newLine += simplifyLine(line.substring(p[1], parens[i + 1][0]));
		}
	}
	newLine += line.substring(parens[parens.length - 1][1]);

	return evaluateSimpleExpression(newLine);
}

function getOuterParens(line) {
	let parens = [];

	if (line.indexOf("(") === -1)
		return parens;

	let counter = 0;
	for (var i = 0; i < line.length; i++) {
		const char = line.charAt(i);

		if (char === "(") {
			if (counter === 0)
				parens.push([i, undefined]);

			counter++;
		}
		else if (char === ")") {
			counter--;

			if (counter === 0)
				parens[parens.length - 1][1] = i;
		}
	}

	return parens;
}

/*
 * returns a number if expression can be fully evaluated into a number
 * returns a string if expression cannot be evaluated by itself (contains leading operators)
 */
function evaluateSimpleExpression(expression) {
	if (typeof expression === "number")
		return expression;

	expression = expression.replace(/\)/g, "").replace(/\(/g, "").replace(/ /g, "");
	const numbers = expression.split(/[+*]/).filter(n => n.length !== 0);
	const operators = expression.split(/[0-9]+/).filter(o => o.length !== 0);

	if (expression.startsWith(operators[0]))
		return expression;

	let value = 0;
	let operator = "+";
	for (var i = 0; i < numbers.length; i++) {
		const num = parseInt(numbers[i]);

		if (operator === "+")
			value += num;
		else if (operator === "*")
			value *= num;

		operator = operators.length > i
			? operators[i]
			: "";
	}

	return value;
}

module.exports.run = run;
this.run();