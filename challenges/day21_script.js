const fs = require('fs');

const fileName = '../inputs/day21_input.txt';

class Ingredient {
	constructor(name) {
		this.name = name;
		this.foods = new Set();
	}
}

class Allergen {
	constructor(name) {
		this.name = name;
		this.foods = new Set();
	}
}

function run() {
	const [ingredients, allergens] = parseInput();
	const possiblePairs = pairAllergens(ingredients, allergens);
	const reducedPairs = reducePairings(possiblePairs);

	console.log(canonize(reducedPairs));
}

function parseInput() {
	const rl = fs.readFileSync(fileName).toString("utf-8").split("\r\n").map(l => l.trim());
	const ingredients = new Map();
	const allergens = new Map();

	rl.forEach((food, index) => {
		const [foodIngredients, foodAllergens] = parseFood(food);
		foodIngredients.forEach(i => {
			const ingr = ingredients.get(i) ?? new Ingredient(i);
			ingr.foods.add(index);

			ingredients.set(i, ingr);
		});

		foodAllergens.forEach(a => {
			const allergen = allergens.get(a) ?? new Allergen(a);
			allergen.foods.add(index);

			allergens.set(a, allergen);
		});
	});

	return [ingredients, allergens];
}

function parseFood(line) {
	const foodRegex = /^([a-z ]+) \(contains ([a-z, ]+)\)$/;
	const ingredients = foodRegex.exec(line)[1].split(" ");
	const allergens = foodRegex.exec(line)[2].split(", ");

	return [ingredients, allergens];
}

function pairAllergens(ingredients, allergens) {
	const pairings = new Map();

	for (const [aName, allergen] of allergens.entries()) {
  		for (const [iName, ingredient] of ingredients.entries()) {
				if ([...allergen.foods].every(a => ingredient.foods.has(a))) {
					let aPairs = pairings.get(aName) ?? new Set();
					aPairs.add(iName);

					pairings.set(aName, aPairs);
				}
		}
	}

	return pairings;
}

function reducePairings(possiblePairs) {
	const lockedInPairs = new Map();

	while (lockedInPairs.size !== possiblePairs.size) {
		possiblePairs.forEach((pairs, allergen) => {
			if (pairs.size === 1) {
				const allergenicIngredient = [...pairs.values()][0];
				lockedInPairs.set(allergen, allergenicIngredient);

				possiblePairs.forEach(p2 => {
					p2.delete(allergenicIngredient);
				});
			}
		});
	}

	return lockedInPairs;
}

function canonize(pairs) {
	const sortedAllergens = [...pairs.keys()].sort();

	let canonicalIngredients = "";
	sortedAllergens.forEach(a => {
		canonicalIngredients += pairs.get(a) + ",";
	});	

	return canonicalIngredients.substring(0, canonicalIngredients.length - 1);
}

module.exports.run = run;
this.run();