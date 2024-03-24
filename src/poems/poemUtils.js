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

			// if (poemTags.length) {
			// 	for (let tag of poemTags) {
			// 		let tagComments = await BackendApi.getCommentsByTag(
			// 			tag.themeName,
			// 			tag.poemId,
			// 			tag.highlightedLines
			// 		);
			// 		tag.comments = tagComments;
			// 	}
			// }
			// Set poem to retrieved poem from database
			poem = poemInDb;
		}
	} catch (error) {
		console.log(error);
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

export const darkenColor = (color, amount = 0.7) => {
  let [r, g, b] = color.match(/\d+/g).map(Number);
  r = Math.floor(r * amount);
  g = Math.floor(g * amount);
  b = Math.floor(b * amount);
  return `rgb(${r}, ${g}, ${b})`;
};
