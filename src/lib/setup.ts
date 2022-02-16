// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-api/register';
import '@sapphire/plugin-editable-commands/register';
import * as colorette from 'colorette';
import { config } from 'dotenv-cra';
import { join } from 'path';
import { inspect } from 'util';
import { srcDir } from './constants';
// Setup TypeORM
import { createConnection } from 'typeorm';

// Read env var
config({ path: join(srcDir, '.env') });

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
colorette.createColors({ useColor: true });

/*
	type: process.env.DB_TYPE as 'better-sqlite3' | 'mariadb',
	host: process.env.DB_HOST,
	port: process.env.DB_PORT as unknown as number,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	synchronize: true,
 */
//	entities: [
//		path.join(__dirname + '/entities_die/**/*.{ts,js}'),
//path.join(__dirname + '/entities_die/*.{ts,js}')
//]
export const connection = createConnection({
	type: process.env.DB_TYPE as any,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT as unknown as number,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	synchronize: true,
	entities: [
		join(__dirname, '.', 'entities/**/*.{ts,js}'),
		join(__dirname, '.', 'entities/*.{ts,js}')
	]
});
declare global {
	interface String {
		toProperCase(): string;

		owoify(): string;
	}
}


String.prototype.toProperCase = function(): string {
	return this.replace(/\w\S*/g, (txt: string): string => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

String.prototype.owoify = function(): string {
	return this.replace(/r/g, 'w').replace(/R/g, 'W').replace(/l/g, 'w').replace(/L/g, 'W').replace(/n/g, 'ny').replace(/N/g, 'Ny').replace(/\?/g, '？').replace(/!/g, '！').replace(/\s/g, '  ');
};