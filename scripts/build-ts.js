import { execSync } from 'child_process';
import fs from 'fs';

// Build the JavaScript files using CRA's build script
if (!fs.existsSync('./dist')) {
  execSync('yarn build', { stdio: 'inherit' });
}

// Build the TypeScript declaration files
execSync('tsc --emitDeclarationOnly --declaration --outDir dist/typings', { stdio: 'inherit' });

// Optionally, adjust import paths in declaration files if necessary (using tscpaths)
execSync('tscpaths -p tsconfig.json -s ./src -o ./dist/typings', { stdio: 'inherit' });
