import { readFileSync } from 'node:fs';
// eslint-disable-next-line no-eval
eval(readFileSync(`${__dirname}/dist/native_extensions.cjs`, { encoding: 'utf-8' }));

describe('Functions that extend native prototypes', () => {
	test('GIVEN a string RETURN that string in proper case', () => {
		expect('hello world!'.toProperCase()).toBe('Hello World!');
	});

	test('GIVEN a string RETURN that string in snake case', () => {
		expect('hello world!'.toSnakeCase()).toBe('hello_world!');
		expect(' hello world! '.toSnakeCase()).toBe('hello_world!');
	});

	test('GIVEN a string RETURN that string in constant case', () => {
		expect('hello world'.toConstantCase()).toBe('HELLO_WORLD');
	});

	test('GIVEN an array RETURN a random element from that array', () => {
		expect([1, 2, 3].randomElement()).not.toBeNaN();
		expect([].randomElement()).not.toBeDefined();
		expect(
			[
				[1, 2, 3],
				[4, 5, 6]
			].randomElement()
		).toBeInstanceOf(Array);
	});
});
