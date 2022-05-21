import { randomUnitInterval } from '../helpers';

describe('random', () => {
	test('RETURN a random a number between 0 and 1', () => {
		expect(randomUnitInterval()).toBeGreaterThan(0);
		expect(randomUnitInterval()).toBeLessThan(1);
	});
});
