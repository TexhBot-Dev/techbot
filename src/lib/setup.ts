process.env.NODE_ENV ??= 'development';

import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
import * as colorette from 'colorette';
import { config } from 'dotenv-cra';
import { join } from 'path';
import { inspect } from 'util';
import { rootDir } from './constants';

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
	}
}

Reflect.defineProperty(String.prototype, 'toProperCase', {
	value: (str: string) => str.replace(/\w\S*/g, (txt: string): string => txt.charAt(0).toLocaleUpperCase() + txt.substring(1).toLocaleLowerCase())
});

Reflect.defineProperty(String.prototype, 'toSnakeCase', {
	value: (str: string) => str.toLocaleUpperCase().replaceAll(' ', '_')
});

Reflect.defineProperty(String.prototype, 'toConstantCase', {
	value: (str: string) => str.replace(/\s/g, '_').toLocaleUpperCase()
});
