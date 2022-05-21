import { isSafeInteger } from '../helpers';

describe('numbers', () => {
	test("GIVEN a number RETURN whether it's safe or not.", () => {
		expect(isSafeInteger(-1)).toBeFalsy();
		expect(isSafeInteger(1)).toBeTruthy();
		expect(isSafeInteger(1000000000001)).toBeFalsy();
		expect(isSafeInteger(10.190273)).toBeFalsy();
	});
});
