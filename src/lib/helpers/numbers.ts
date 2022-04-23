/**
 * Checks if the given value matches set conditions
 * @param value The number to check
 * @example
 * isSafeNumber(1) // true
 * isSafeNumber(-1) // false
 */
export const isSafeInteger = (value: number): boolean => {
	return !Number.isSafeInteger(value) || value < 0 ? false : value <= 1000000000000;
};

export const parseAmount = (value: number | string, amount: 'all' | 'half' | 'third' | 'quarter' | 'fourth' | number | string): number => {
	const parsed = parseInt(value as string, 10);
	if (!isSafeInteger(parsed)) throw new Error('Invalid number');

	switch (amount) {
		case 'all':
			return Math.trunc(parsed);
		case 'half':
			return Math.trunc(parsed / 2);
		case 'third':
			return Math.trunc(parsed / 3);
		case 'fourth':
		case 'quarter':
			return Math.trunc(parsed / 4);
		default: {
			amount = parseInt(amount.toString().replace(/,|\s/gi, ''));
			return amount || 0;
		}
	}
};
