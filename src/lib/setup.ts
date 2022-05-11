process.env.NODE_ENV ??= 'development';
import 'reflect-metadata';

import { ApplicationCommandRegistries, container, RegisterBehavior } from '@sapphire/framework';

// Setup Tasks/ Native Function Extensions
import './monitor_pets.js';
import './native_extensions.js';

// Register Plugins
import '@sapphire/plugin-logger/register';

// Read env var
import { config } from 'dotenv-cra';
import { join } from 'node:path';
import { rootDir } from './constants.js';
config({ path: join(rootDir, '.env') });

// Set default inspection depth
import { inspect } from 'node:util';
inspect.defaultOptions.depth = 1;

// Set default Registery behavior on non identical
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

// Enable colorette
import { createColors, Colorette } from 'colorette';
container.colors = createColors({ useColor: true });

declare module '@sapphire/pieces' {
	interface Container {
		colors: Colorette;
	}
}
