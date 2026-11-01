// The presenter notes format (FS-0010): Farid writes them in the wiki, one `▶ \`step\`` block per
// click in each episode's `<nn>-<slug>.slides.md` (section "## Presenter notes"). A block is a list
// of `- ` bullets; indented lines continue the bullet above.
//
// Plain JavaScript with JSDoc, so the dev-only notes server and the check script run it under Node
// (scripts/notes-server.mjs, scripts/presenter-notes.mjs) and the presenter view bundles the same
// code. Framework-free and unit-tested (lib/decks.test.ts). No node: imports here.

/**
 * @typedef {{ locale: 'en' | 'nl', id: string }} DeckRef
 * @typedef {{ step: string, raw: string, from: number, to: number }} NoteBlock
 *   `raw` is the block's text as written, without the `▶` line; `from`/`to` are the line range it
 *   takes in the file (0-based, `to` exclusive). An empty block has `from === to`.
 */

const STEP_LINE = /^▶ `([\w-]+)`\s*$/;
const BULLET = /^- /;
const CONTINUATION = /^\s{2,}\S/;

/** The deck a .slides.md names in its front matter (`deck: … /en/deck/3-10 …`). */
export function deckOf(markdown) {
  const m = markdown.match(/^deck:.*?\/(en|nl)\/deck\/([\w-]+)/m);
  return m ? /** @type {DeckRef} */ ({ locale: m[1], id: m[2] }) : undefined;
}

/**
 * The `▶` blocks of the "## Presenter notes" section, in file order. A block runs from the line
 * after its `▶` line to its last bullet or continuation line, before the next `▶` or `## `; section
 * labels (**Intro**), rules and blank lines after it stay outside.
 * @param {string} markdown
 * @returns {NoteBlock[]}
 */
export function noteBlocks(markdown) {
  const lines = markdown.split('\n');
  const start = lines.findIndex((l) => /^## Presenter notes[ \t]*$/.test(l));
  if (start < 0) return [];
  let end = lines.findIndex((l, i) => i > start && l.startsWith('## '));
  if (end < 0) end = lines.length;
  /** @type {NoteBlock[]} */
  const blocks = [];
  for (let i = start + 1; i < end; i++) {
    const m = lines[i].match(STEP_LINE);
    if (!m) continue;
    let to = i + 1;
    for (let j = i + 1; j < end && !STEP_LINE.test(lines[j]); j++)
      if (BULLET.test(lines[j]) || CONTINUATION.test(lines[j])) to = j + 1;
    blocks.push({ step: m[1], raw: lines.slice(i + 1, to).join('\n'), from: i + 1, to });
  }
  return blocks;
}

/**
 * A block's text as the presenter view shows it: one string per bullet, continuation lines joined.
 * @param {string} raw
 * @returns {string[]}
 */
export function noteLines(raw) {
  /** @type {string[]} */
  const out = [];
  for (const line of raw.split('\n')) {
    if (BULLET.test(line)) out.push(line.slice(2).trim());
    else if (CONTINUATION.test(line) && out.length) out[out.length - 1] += ` ${line.trim()}`;
  }
  return out;
}

/** The deck a .slides.md names and, per step, its lines. */
export function parsePresenterNotes(markdown) {
  /** @type {Record<string, string[]>} */
  const notes = {};
  for (const b of noteBlocks(markdown)) notes[b.step] = noteLines(b.raw);
  return { deck: deckOf(markdown), notes };
}

/**
 * What is wrong with a block's new text, as sentences; [] when it can go into the file. Every line
 * is a `- ` bullet, an indented continuation or blank, and there is at least one bullet.
 * @param {string} raw
 * @returns {string[]}
 */
export function noteBlockProblems(raw) {
  const problems = [];
  const lines = raw.split('\n');
  if (!lines.some((l) => BULLET.test(l))) problems.push('write at least one line starting with "- "');
  else if (!BULLET.test(lines.find((l) => l.trim()) ?? '')) problems.push('start with a "- " bullet');
  lines.forEach((l, i) => {
    if (l.trim() && !BULLET.test(l) && !CONTINUATION.test(l))
      problems.push(`line ${i + 1}: start with "- ", or indent two spaces to continue the line above`);
  });
  return problems;
}

/** Trailing spaces and blank lines off, so a save does not leave stray whitespace in the wiki. */
export function tidyBlock(raw) {
  return raw
    .split('\n')
    .map((l) => l.trimEnd())
    .join('\n')
    .replace(/^\n+|\n+$/g, '');
}

/**
 * The file with one block's text replaced; the rest of the file stays byte for byte. A step without
 * a block gets one, after the block of `after` (the step before it in the deck). Throws when neither
 * exists.
 * @param {string} markdown
 * @param {string} step
 * @param {string} raw
 * @param {string} [after]
 */
export function replaceNoteBlock(markdown, step, raw, after) {
  const lines = markdown.split('\n');
  const blocks = noteBlocks(markdown);
  const block = blocks.find((b) => b.step === step);
  const text = tidyBlock(raw).split('\n');
  if (block) {
    lines.splice(block.from, block.to - block.from, ...text);
    return lines.join('\n');
  }
  const prev = after === undefined ? undefined : blocks.find((b) => b.step === after);
  if (!prev) throw new Error(`no ▶ \`${step}\` block${after ? ` and no ▶ \`${after}\` block to put it after` : ''}`);
  lines.splice(prev.to, 0, '', `▶ \`${step}\``, ...text);
  return lines.join('\n');
}
