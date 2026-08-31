const { execSync } = require('child_process');
const path = require('path');

// Execute modern Resvg-based PWA icon generator
const scriptPath = path.join(__dirname, 'generate-pwa-icons.mjs');
console.log('Generating high-precision PWA PNG icons via Resvg...');
execSync(`node "${scriptPath}"`, { stdio: 'inherit' });

