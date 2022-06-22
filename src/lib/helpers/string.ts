/**
 * Pluralizes a string
 * @param text
 * @param num
 * @param suffix
 */
export const pluralize = (text: string, num: number, suffix = 's'): string => {
	return text + (num === 1 ? '' : suffix);
};

/**
 * Clean a string
 * @param text
 */
export const clean = (text: string): string => {
	return text
		.replace(/@everyone|@here|<@&?(\d{17,19})>/gim, '<mention>')
		.replace(/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/gim, '<link>');
};

/**
 * Mass replaces stuff in text
 * ```
 * const newString = replacer("hello there", {
 * 	"there": "world",
 * 	"hello": "hi"
 * })
 * //Do something with newString....
 * ```
 * @param string The string to replace substrings from.
 * @param object The object containing the replacements. The keys are the substrings or regexps to replace, and the values are the replacements.
 * @param regexFlag The regex flag to use when replacing.
 */
export const replacer = (string: string, replaceType: 'regex' | 'string', object: object, regexFlag = ''): string => {
	for (const [key, value] of Object.entries(object)) {
		const exp = replaceType === 'string' ? key : new RegExp(key, regexFlag);
		string = string.replace(exp, value);
	}
	return string;
};

/**
 * Returns an array of characters which both strings share at the same index.
 * ```
 * getCommonChars('huff', 'puff') //['f', 'f']
 * getCommonChars('rough', 'cough') //['o', 'u', 'g', 'h']
 * ```
 * @param str1 The string to compare to str2.
 * @param str2 The string to compare to str1.
 * @returns string[]
 */
export function getCommonChars(str1: string, str2: string): string[] {
	return str1.split('').filter((char: string, i: number) => char === str2[i]);
}
