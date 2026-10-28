#!/usr/bin/env node
// The presenter notes server (FS-0010), for `npm run dev` only: never part of the site, which stays a
// static export (ADR-0001). The presenter view at localhost:3040 reads each step's notes from here and
// saves an edit back into the wiki's `.slides.md`, so the wiki stays the one place the notes live and
// the published decks carry none. A save rewrites only that step's `▶` block; committing stays manual.
//
//   npm run notes:serve          # on its own; `npm run dev` starts it next to `next dev`
//
//   GET /notes/<locale>/<deck>          → { file, version, steps: { <step>: "<block text>" } }
//   PUT /notes/<locale>/<deck>/<step>   ← { base, text, after? }   409 when the block is no longer `base`
//   GET /events/<locale>/<deck>         → server-sent events: the same payload after each change
//
// Listens on 127.0.0.1 only and answers the dev site's origin only. The wiki is the sibling checkout
// (../wiki); WIKI_DIR overrides it, NOTES_PORT the port.

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync, watch, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deckOf, noteBlockProblems, noteBlocks, replaceNoteBlock } from '../lib/decks/presenter-notes.mjs';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const WIKI = resolve(ROOT, process.env.WIKI_DIR ?? '../wiki');
const PUBLISHING = join(WIKI, 'publishing');
const PORT = Number(process.env.NOTES_PORT ?? 3041);
const ORIGINS = ['http://localhost:3040', 'http://127.0.0.1:3040'];
const HOSTS = [`127.0.0.1:${PORT}`, `localhost:${PORT}`];

/** Every .slides.md under publishing/ that names a deck, by `<locale>/<id>`; the archive is skipped. */
function index() {
  /** @type {Map<string, string>} */
  const found = new Map();
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (name === 'archive' || name.startsWith('.')) continue;
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.slides.md')) {
        const deck = deckOf(readFileSync(p, 'utf8'));
        if (deck) found.set(`${deck.locale}/${deck.id}`, p);
      }
    }
  };
  if (existsSync(PUBLISHING)) walk(PUBLISHING);
  return found;
}

function payload(file) {
  const text = readFileSync(file, 'utf8');
  return {
    file: relative(WIKI, file),
    version: createHash('sha1').update(text).digest('hex'),
    steps: Object.fromEntries(noteBlocks(text).map((b) => [b.step, b.raw])),
  };
}

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((ok, fail) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 100_000) req.destroy(new Error('body too large'));
    });
    req.on('end', () => ok(body));
    req.on('error', fail);
  });
}

async function handle(req, res) {
  const origin = req.headers.origin;
  // Another site in the same browser must not read or write the notes, nor reach this server under a
  // name of its own (DNS rebinding): the dev site's origin and this host only.
  if (!HOSTS.includes(req.headers.host ?? '')) return send(res, 403, { error: 'unknown host' });
  if (origin && !ORIGINS.includes(origin)) return send(res, 403, { error: 'unknown origin' });
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Methods': 'GET, PUT', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' });
    return res.end();
  }

  const [kind, locale, id, step] = (req.url ?? '').split('?')[0].split('/').filter(Boolean).map(decodeURIComponent);
  const file = locale && id ? index().get(`${locale}/${id}`) : undefined;
  if (!file) return send(res, 404, { error: `no .slides.md in ${relative(ROOT, PUBLISHING)} names /${locale}/deck/${id}` });

  if (req.method === 'GET' && kind === 'notes' && !step) return send(res, 200, payload(file));

  if (req.method === 'GET' && kind === 'events' && !step) {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    // A first line now: until the body starts, the headers stay unsent and the view never hears that
    // the stream is open, which is when it reads the notes.
    res.write(': open\n\n');
    let last = payload(file).version;
    let timer;
    // The directory, not the file: an editor that saves by renaming a new file over the old one
    // would end a watch on the file itself.
    const watcher = watch(resolve(file, '..'), (_event, name) => {
      if (name && !file.endsWith(`/${name}`)) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!existsSync(file)) return;
        const now = payload(file);
        if (now.version === last) return;
        last = now.version;
        res.write(`data: ${JSON.stringify(now)}\n\n`);
      }, 100);
    });
    const ping = setInterval(() => res.write(': ping\n\n'), 30_000);
    req.on('close', () => {
      watcher.close();
      clearInterval(ping);
      clearTimeout(timer);
    });
    return;
  }

  if (req.method === 'PUT' && kind === 'notes' && step) {
    if (!origin) return send(res, 403, { error: 'saves come from the presenter view only' });
    let body;
    try {
      body = JSON.parse(await readBody(req));
    } catch {
      return send(res, 400, { error: 'send JSON: { base, text, after? }' });
    }
    if (typeof body?.text !== 'string' || (typeof body?.base !== 'string' && body?.base !== null))
      return send(res, 400, { error: 'send JSON: { base, text, after? }' });
    const problems = noteBlockProblems(body.text);
    if (problems.length) return send(res, 422, { error: problems.join('; '), problems });
    // `base` is the block as the editor opened it (null: there was none). Only a change to this block
    // since then is a conflict; an edit elsewhere in the file stays, as the save replaces this block only.
    const current = payload(file);
    if ((current.steps[step] ?? null) !== body.base)
      return send(res, 409, { error: `▶ ${step} changed in ${current.file} since the editor opened it`, ...current });
    let next;
    try {
      next = replaceNoteBlock(readFileSync(file, 'utf8'), step, body.text, typeof body.after === 'string' ? body.after : undefined);
    } catch (err) {
      return send(res, 404, { error: /** @type {Error} */ (err).message });
    }
    writeFileSync(file, next);
    console.log(`✎ ${relative(WIKI, file)} ▶ ${step}`);
    return send(res, 200, payload(file));
  }

  send(res, 405, { error: `${req.method} ${req.url} is not something this server does` });
}

const server = createServer((req, res) => {
  handle(req, res).catch((err) => {
    console.error(err);
    if (!res.headersSent) send(res, 500, { error: String(err?.message ?? err) });
  });
});
server.on('error', (err) => {
  console.error(`notes server: ${err.code === 'EADDRINUSE' ? `port ${PORT} is in use (another \`npm run dev\`?)` : err.message}`);
  process.exit(1);
});
server.listen(PORT, '127.0.0.1', () => {
  const decks = index().size;
  console.log(
    existsSync(PUBLISHING)
      ? `notes server on http://127.0.0.1:${PORT}: ${decks} decks with presenter notes in ${relative(ROOT, PUBLISHING)}`
      : `notes server on http://127.0.0.1:${PORT}: no wiki at ${WIKI} (set WIKI_DIR); the presenter view will show no notes`,
  );
});
