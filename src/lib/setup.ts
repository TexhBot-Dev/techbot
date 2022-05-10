process.env.NODE_ENV ??= 'development';
import 'reflect-metadata';

import { container } from '@sapphire/framework';

// Setup Tasks/ Native Function Extensions
import './monitor_pets';
import './native_extensions';

// Register Plugins
import '@sapphire/plugin-logger/register';

// Read env var
import { config } from 'dotenv-cra';
import { join } from 'node:path';
import { rootDir } from './constants';
config({ path: join(rootDir, '.env') });

// Set default inspection depth
import { inspect } from 'node:util';
inspect.defaultOptions.depth = 1;

// Enable colorette
import { createColors, Colorette } from 'colorette';
container.colors = createColors({ useColor: true });

declare module '@sapphire/pieces' {
	interface Container {
		colors: Colorette;
	}
}
