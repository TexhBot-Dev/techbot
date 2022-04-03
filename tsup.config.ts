import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	dts: false,
	entry: ['src/**/*.ts', '!src/**/*.d.ts'],
	minify: false,
	skipNodeModulesBundle: true,
	sourcemap: true,
	target: 'esnext',
	tsconfig: './tsconfig.json',
	bundle: false,
	shims: false,
	keepNames: true,
	splitting: false
});