/**
 * Determines if a provided integer is safe
 * @param value
 *
 * @example
 * isSafeInteger(1) // true
 *
 * @example
 * isSafeInteger(-1) // false
 */
export const isSafeInteger = (value: number): boolean => {
	value = Math.floor(value);

	if (!Number.isSafeInteger(value)) {
		return false;
	}
	if (value < 0) {
		return false;
	}
	return value <= 1000000000000;
};
