// server.js
// Hostinger Node.js Application Startup File (CommonJS format)
// This file acts as a reliable bridge to launch the compiled CJS server under Phusion Passenger / Hostinger.

const fs = require('fs');
const path = require('path');

const compiledServerPath = path.join(__dirname, 'dist', 'server.cjs');

if (fs.existsSync(compiledServerPath)) {
  console.log('Launching compiled production server from: ' + compiledServerPath);
  require(compiledServerPath);
} else {
  console.log('Compiled server not found. Attempting to build production assets...');
  try {
    const { execSync } = require('child_process');
    console.log('Running npm run build...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Build completed successfully. Launching production server...');
    require(compiledServerPath);
  } catch (err) {
    console.error('Failed to automatically build the application. Make sure to run "npm run build" first! Error:', err);
    process.exit(1);
  }
}
