const fs = require('fs');

const fileName = '../inputs/day19_input.txt';

class Rule {
	constructor(id, regex, patterns) {
		this.id = id;
		this.regex = regex;
		this.patterns = patterns;
	}
}

function run() {
	const sum = parseInput();

	console.log(sum);
}

function parseInput() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\r\n").map(l => l.trim());
	const inputBreak = rl.indexOf(""); // where rules stop

	let rules = new Map();

	// rules
	rl.slice(0, inputBreak).forEach(l => {
		let rule = parseRule(l);
		rules.set(rule.id, rule);
	});

	compileRuleRegex(rules, 0);

	// messages
	let matches = 0;
	rl.slice(inputBreak + 1).forEach(l => {
		const regex = new RegExp("^" + rules.get(0).regex + "$");
		if (regex.exec(l) !== null)
			matches++;
	});

	return matches;
}

function parseRule(line) {
	const idRegex = /^([0-9]+):/;
	const patternRegex = /: ([0-9| ]+)$/;
	const valueRegex = /: \"([a-z+])\"/;

	const id = parseInt(idRegex.exec(line)[1]);
	const patternExists = patternRegex.exec(line);
	const pattern = patternExists !== null ? parsePatterns(patternExists[1]) : undefined;
	const valueExists = valueRegex.exec(line);
	const regex = valueExists !== null ? buildRegex(valueExists[1]) : undefined;

	return new Rule(id, regex, pattern);
}

function parsePatterns(string) {
	const patterns = new Set();

	string.split("|").filter(s => s !== "").forEach(s => {
		const numStrings = s.split(" ").filter(s => s !== "");
		patterns.add(numStrings.map(n => parseInt(n)));
	});

	return patterns;
}

function buildRegex(raw) {
	return raw + "{1}";
}

function compileRuleRegex(rules, ruleId) {
	const rule = rules.get(ruleId);

	if (rule.regex)
		return rule.regex;

	let regex = "";
	rule.patterns.forEach(p => {
		p.forEach(r => {
			if (r === ruleId) {
				if (r === 8) {
					regex += "(";
					regex += compileRuleRegex(rules, 42);
					regex += "){1,}";
				}
				else if (r === 11) { // hard-code mirroring
					for (var i = 1; i <= 3; i++) {
						regex += "(";
						regex += "(" + compileRuleRegex(rules, 42) + "){" + i + "}";
						regex += "(" + compileRuleRegex(rules, 31) + "){" + i + "}";
						regex += ")|";
					}
				}
			}
			else {
				regex += compileRuleRegex(rules, r);
			}
		});

		regex += "|";
	});
	regex = "(" + regex.slice(0, -1) + ")"; // remove trailing |

	rule.regex = regex;

	return rule.regex;
}

module.exports.run = run;
this.run();