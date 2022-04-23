process.env.NODE_ENV ??= 'development';

// import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
import * as colorette from 'colorette';
import { config } from 'dotenv-cra';
import { join } from 'path';
import { inspect } from 'util';
import { rootDir } from './constants';
import { randomUnitInterval } from './helpers/random';

// Read env var
config({ path: join(rootDir, '.env') });

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
colorette.createColors({ useColor: true });

declare global {
	interface String {
		toProperCase(): string;
		toSnakeCase(): string;
		toConstantCase(): string;
		remove(strsToRemove: string[] | string): string;
	}
	interface Array<T> {
		randomElement(): any;
	}
}

String.prototype.toSnakeCase = function () {
	return (
		this.split(' ')
			.map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
			.join(' ') ?? this
	);
};

String.prototype.remove = function (stringsToRemove) {
	if (!Array.isArray(stringsToRemove)) return this.replaceAll(stringsToRemove, '') || '';
	let newStr = this;
	for (let i = 0; stringsToRemove.length !== i; i++) {
		newStr = this.replaceAll(stringsToRemove[i], '');
	}
	return String(newStr) || '';
};

String.prototype.toProperCase = function () {
	return String(
		this.replaceAll('_', ' ')
			.toLowerCase()
			.replace(/\b(\w)/g, (s) => s.toUpperCase())
	);
};

String.prototype.toConstantCase = function () {
	return this.replace(/\s/g, '_').toLocaleUpperCase();
};

Array.prototype.randomElement = function (): any {
	return this[Math.floor(randomUnitInterval() * this.length)];
};
