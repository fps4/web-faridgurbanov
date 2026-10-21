#!/usr/bin/env node
// Copy the kit downloads the episode decks show into content/kit/ (FS-0010, ADR-0010). The kit
// (fps4/ai-product-design-kit) is the source of every download; the site keeps a snapshot of the
// few files a deck renders as artifact slides, so the static build needs no network and the slide
// always shows the text of the download it points to. Run it after a kit change, then commit.
//
//   node scripts/sync-kit.mjs                     # kit checked out next to this repo
//   KIT_DIR=/path/to/ai-product-design-kit node scripts/sync-kit.mjs
//
// It copies every Markdown download under the kit's parts/, so any deck can show any download;
// lib/decks.test.ts fails when a deck names a file or a row that is not in the snapshot.

import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const kit = resolve(process.env.KIT_DIR ?? join(process.cwd(), '..', 'ai-product-design-kit'));
const out = join(process.cwd(), 'content', 'kit');

const FILES = [];
for (const dir of (await readdir(join(kit, 'parts'), { withFileTypes: true })).filter((d) => d.isDirectory())) {
  for (const name of await readdir(join(kit, 'parts', dir.name))) {
    if (name.endsWith('.md') && name !== 'README.md') FILES.push(`parts/${dir.name}/${name}`);
  }
}
FILES.sort();

for (const file of FILES) {
  const target = join(out, file);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(join(kit, file), target);
  console.log(`synced ${file}`);
}
