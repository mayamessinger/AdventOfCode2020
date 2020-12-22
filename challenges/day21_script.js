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
	const allergyFreeIngredients = getAllergyFreeIngredients(possiblePairs, ingredients);

	console.log(getOccurrences(ingredients, allergyFreeIngredients));
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

function getAllergyFreeIngredients(pairs, ingredients) {
	const possibleAllergenicIngredients = new Set();
	pairs.forEach(p => {
		p.forEach(i => {
			possibleAllergenicIngredients.add(i);
		});
	});

	const afis = new Set();
	[...ingredients.keys()].forEach(i => {
		if (!possibleAllergenicIngredients.has(i))
			afis.add(i);
	});

	return afis;
}

function getOccurrences(ingredients, ingredientNames) {
	let occurrences = 0;

	ingredientNames.forEach(i => {
		occurrences += ingredients.get(i).foods.size
	});

	return occurrences;
}

module.exports.run = run;
this.run();