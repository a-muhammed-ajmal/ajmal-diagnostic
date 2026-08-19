/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS hook script, run directly by node */
const fs = require('fs');
const { spawnSync } = require('child_process');

let raw;
try {
  raw = fs.readFileSync(0, 'utf8');
} catch {
  process.exit(0);
}

let input;
try {
  input = JSON.parse(raw);
} catch {
  process.exit(0);
}

const filePath = (input.tool_input && input.tool_input.file_path) || '';
if (/\.(ts|tsx)$/.test(filePath)) {
  spawnSync('npx', ['eslint', filePath], { stdio: 'inherit', shell: true });
}

process.exit(0);
