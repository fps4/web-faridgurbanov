#!/usr/bin/env node
// `npm run dev`: next dev on :3040 and, next to it, the presenter notes server on :3041
// (scripts/notes-server.mjs). Ctrl-C stops both. When the notes server cannot start (no wiki, port in
// use) the site keeps running and the presenter view says the notes are not available.

import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const notes = spawn(process.execPath, [resolve(root, 'scripts/notes-server.mjs')], { cwd: root, stdio: 'inherit' });
const next = spawn(process.execPath, [resolve(root, 'node_modules/next/dist/bin/next'), 'dev', '-p', '3040', ...process.argv.slice(2)], {
  cwd: root,
  stdio: 'inherit',
});

notes.on('exit', (code) => {
  if (code) console.log('notes server stopped: the presenter view has no notes until `npm run notes:serve`');
});
next.on('exit', (code) => {
  notes.kill();
  process.exit(code ?? 0);
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => next.kill(signal));
