// server.js
// Hostinger Node.js Application Startup File
// This file acts as a bridge to launch the compiled server.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compiledServerPath = path.join(__dirname, 'dist', 'server.cjs');

if (fs.existsSync(compiledServerPath)) {
  console.log('Launching compiled production server...');
  // Dynamic import of the CJS bundle
  await import('./dist/server.cjs');
} else {
  console.log('Compiled server not found. Attempting to build production assets...');
  try {
    const { execSync } = await import('child_process');
    console.log('Running npm run build...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build completed successfully. Launching production server...');
    await import('./dist/server.cjs');
  } catch (err) {
    console.error('Failed to automatically build the application. Make sure to run "npm run build" first!');
    process.exit(1);
  }
}
