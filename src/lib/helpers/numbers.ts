/**
 * Checks if the given value matches set conditions
 * @param value The number to check
 * @example
 * isSafeNumber(1) // true
 * isSafeNumber(-1) // false
 */
export const isSafeInteger = (value: number): boolean => {
	return !Number.isSafeInteger(value) || value < 0 ? false : value <= 1_000_000_000_000;
};

export const parseAmount = (coins: number, amount: 'all' | 'half' | 'third' | 'quarter' | 'fourth' | number | string): number => {
	if (!isSafeInteger(coins)) throw new Error('Invalid number');

	switch (amount) {
		case 'all':
			return Math.trunc(coins);
		case 'half':
			return Math.trunc(coins / 2);
		case 'third':
			return Math.trunc(coins / 3);
		case 'fourth':
		case 'quarter':
			return Math.trunc(coins / 4);
		default:
			return parseInt(amount.toString().replace(/,|\s/gi, ''), 10) || 0;
	}
};
