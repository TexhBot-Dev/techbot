/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
	displayName: 'unit test',
	preset: 'ts-jest',
	testMatch: ['**/**/*.test.ts'],
	globals: {
		'ts-jest': {
			tsconfig: './tsconfig.base.json'
		}
	},
	reporters: ['default', 'github-actions']
};

export default config;
