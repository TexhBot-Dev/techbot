import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// @ts-ignore This is false it builds to ESM
const __filename = fileURLToPath(import.meta.url);

export const rootDir = join(dirname(__filename), '..', '..');
export const srcDir = join(rootDir, 'src');
