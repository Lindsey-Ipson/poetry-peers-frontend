import md5 from 'crypto-js/md5';
import backendApi from '../common/backendApi.js';

export function hashPoem (poem) {
	var string = poem.title + poem.author;
	// Use crypto-js to generate a MD5 hash from the input
	const hash = md5(string).toString();

	// Return the first 16 characters of the hash
	return hash.substring(0, 16);
}

export async function getOrAddPoemToDb (poem) {
	let hashedId = hashPoem(poem);
	poem.id = hashedId;

	try {
		let response = await backendApi.getPoemById(poem.id);
	
		if (response.title) {
				let poemInDb = response;
				let poemTags = await backendApi.getTagsByPoemId(poem.id);
				poemInDb.tags = poemTags;
	
				if (poemTags.length) {
					for (let tag of poemTags) {
						let tagComments = await backendApi.getCommentsByTag(tag.themeName, tag.poemId, tag.highlightedLines);
						// console.log(tagComments, 'tagComments')
						tag.comments = tagComments;
					}
				}
				// Set poem to retrieved poem from database
				poem = poemInDb;
		}
	} catch (error) {
		console.log(error, 'errorhere')
		if (error.indexOf('No such poem with id') !== -1 || (error.some(element => {
			return element.includes('No such poem with id');
		}))) {
			// Change linecount property from external API to camelCase
			poem.lineCount = poem.lineCount || poem.lines.length;
			delete poem.linecount;
			const newPoemInDb = await backendApi.addPoem(poem);
			newPoemInDb.tags = [];
			// Set poem to newly added poem
			poem = newPoemInDb;
		}
	}
	return poem;
};

export const lightColors = ['Blue','Green', 'OrangeRed', 'Purple', 'Fuchsia', 'Lime', 'Olive', 'Yellow', 'Navy', 'Red', 'Teal', 'Aqua', 'AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'Black', 'BlanchedAlmond', 'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Maroon', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson', 'Cyan', 'DeepPink', 'DeepSkyBlue', 'DimGray', 'DimGrey', 'DodgerBlue', 'FireBrick', 'FloralWhite', 'ForestGreen', 'Fuchsia', 'Gainsboro',, 'Gold', 'GoldenRod', 'Gray', 'Grey', 'Green', 'GreenYellow', 'HoneyDew', 'HotPink', 'IndianRed', 'Indigo', 'Ivory', 'Khaki', 'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue', 'LightCoral', 'LightCyan', 'LightGoldenRodYellow', 'LightGray', 'LightGrey', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray', 'LightSlateGrey', 'LightSteelBlue', 'LightYellow', 'Lime', 'LimeGreen', 'Linen', 'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen', 'MediumTurquoise', 'MediumVioletRed', 'MidnightBlue', 'MintCream', 'MistyRose', 'Moccasin', 'Navy', 'OldLace', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'RebeccaPurple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver', 'SkyBlue', 'SlateBlue', 'SlateGray', 'SlateGrey', 'Snow', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle', 'Tomato', 'Turquoise', 'Violet', 'Wheat', 'Yellow', 'YellowGreen'];
