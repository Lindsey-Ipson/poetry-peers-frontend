import md5 from 'crypto-js/md5';

export function hashPoem (poem) {
	var string = poem.title + poem.author;
	// Use crypto-js to generate a MD5 hash from the input
	const hash = md5(string).toString();

	// Return the first 16 characters of the hash
	return hash.substring(0, 16);
}

export function getTagsAndCommentsForPoem (poem) {

}

export function createAnalyzePoemObject (poemfromExternalApi) {
	let poemId = hashPoem(poem);
	poem.id = poemId;



}





const routeToPoem = async (poem) => {
	let analysisId = hashPoem(poem);
	poem.id = analysisId;


	try {
		let response = await backendApi.getPoemById(analysisId);

		if (response.title) {
				let poemInDb = response;
				let poemTags = await backendApi.getTagsByPoemId(analysisId);
				poemInDb.tags = poemTags;

				if (poemTags.length) {
					for (let tag of poemTags) {
						let tagComments = await backendApi.getCommentsByTag(tag.themeName, tag.poemId, tag.highlightedLines);
						tag.comments = tagComments;
					}
				}
		}
} catch (error) {
		if (error.some(element => {
			return element.includes('No such poem with id');
		})) {
			const newPoemInDb = await backendApi.addPoem(poem);

		}
}






	navigate(`/poems/${analysisId}`, { state: { data: poem } });
};