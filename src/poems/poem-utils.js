import md5 from 'crypto-js/md5';

export function hashPoem (poem) {
	var string = poem.title + poem.author;
	// Use crypto-js to generate a MD5 hash from the input
	const hash = md5(string).toString();

	// Return the first 16 characters of the hash
	return hash.substring(0, 16);
}
