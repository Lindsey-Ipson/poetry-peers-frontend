import md5 from 'crypto-js/md5';
import BackendApi from '../common/backendApi.js';

export function hashPoem(poem) {
	let string = poem.title + poem.author;
	// Use crypto-js to generate a MD5 hash from the input
	const hash = md5(string).toString();

	// Return the first 16 characters of the hash
	return hash.substring(0, 16);
}

export async function getOrAddPoemToDb(poem) {
	let hashedId = hashPoem(poem);
	poem.id = hashedId;

	try {
		let response = await BackendApi.getPoemById(poem.id);

		if (response.title) {
			let poemInDb = response;
			let poemTags = await BackendApi.getTagsByPoemId(poem.id);
			poemInDb.tags = poemTags;

			poem = poemInDb;
		}
	} catch (error) {
		console.error(error);
		if (
			error.indexOf('No such poem with id') !== -1 ||
			error.some((element) => {
				return element.includes('No such poem with id');
			})
		) {
			// Change linecount property from external API to camelCase
			poem.lineCount = poem.lineCount || poem.lines.length;
			delete poem.linecount;
			const newPoemInDb = await BackendApi.addPoem(poem);
			newPoemInDb.tags = [];
			// Set poem to newly added poem
			poem = newPoemInDb;
		}
	}
	return poem;
}

export function capitalizeWords (phrase) {
  // Split the phrase into words
  const words = phrase.toLowerCase().split(' ');

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words back into a phrase
  return capitalizedWords.join(' ');
}

export const lightColors = [
	'MediumPurple',
	'ForestGreen',
	'Tomato',
	'DodgerBlue',
	'MediumBlue',
	'MediumVioletRed',
	'MediumAquaMarine',
	'Maroon',
	'LightCoral',
	'SlateBlue',
	'ForestGreen',
	'CornflowerBlue',
	'DarkSlateBlue',
	'DarkCyan',
	'DarkRed',
	'DarkGreen',
	'DarkOrchid',
	'DarkOrange',
	'DarkSeaGreen',
	'DarkSlateBlue',
	'DarkTurquoise',
	'DarkViolet',
	'Blue',
	'Green',
	'OrangeRed',
	'Purple',
	'Fuchsia',
	'Olive',
	'Navy',
	'Red',
	'Teal',
	'BlueViolet',
	'Brown',
	'DarkBlue',
	'BurlyWood',
	'CadetBlue',
	'Chartreuse',
	'Chocolate',
	'Coral',
	'Crimson',
	'Cyan',
	'DeepPink',
	'DeepSkyBlue',
	'FireBrick',
	'Fuchsia',
	'Gold',
	'GoldenRod',
	'Green',
	'GreenYellow',
	'HotPink',
	'IndianRed',
	'Indigo',
	'LawnGreen',
	'LightBlue',
	'LightGreen',
	'LightPink',
	'LightSalmon',
	'LightSeaGreen',
	'LightSkyBlue',
	'LightSlateGray',
	'LightSteelBlue',
	'Lime',
	'LimeGreen',
	'Magenta',
	'MediumOrchid',
	'MediumSeaGreen',
	'MediumSlateBlue',
	'MediumSpringGreen',
	'MediumTurquoise',
	'Navy',
	'Olive',
	'OliveDrab',
	'Orange',
	'OrangeRed',
	'Orchid',
	'PaleGreen',
	'PaleTurquoise',
	'PaleVioletRed',
	'Peru',
	'Pink',
	'Plum',
	'PowderBlue',
	'Purple',
	'RebeccaPurple',
	'Red',
	'RosyBrown',
	'RoyalBlue',
	'SaddleBrown',
	'Salmon',
	'SandyBrown',
	'SeaGreen',
	'Sienna',
	'SkyBlue',
	'SpringGreen',
	'SteelBlue',
	'Tan',
	'Teal',
	'Thistle',
	'Turquoise',
	'Violet',
	'YellowGreen',
	'DarkSalmon',
];