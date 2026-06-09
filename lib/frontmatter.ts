// Filesystem markdown carries a leading YAML frontmatter block (`---\n…\n---`) whose keys
// (title, summary, order, draft, date, …) drive nav, ordering, and draft exclusion (FS-0001,
// US-0003). These helpers are the one shared implementation so the parsing doesn't drift, and
// they stay framework-free (no gray-matter dependency) and unit-tested per AGENTS.md.

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?/;

export type FrontmatterValue = string | number | boolean | string[];
export type Frontmatter = Record<string, FrontmatterValue>;

/** Strip a leading YAML frontmatter block off a markdown doc, leaving the body. */
export function stripFrontmatter(md: string): string {
  const m = FRONTMATTER_RE.exec(md);
  return m ? md.slice(m[0].length) : md;
}

/**
 * Split a markdown doc into its parsed frontmatter and body. Supports the small YAML subset the
 * content uses: `key: value` scalars (string, number, boolean), quoted strings, and inline arrays
 * (`stack: [AWS, Kafka]`). Anything richer is out of scope — keep frontmatter flat.
 */
export function parseFrontmatter(md: string): { data: Frontmatter; body: string } {
  const m = FRONTMATTER_RE.exec(md);
  if (!m) return { data: {}, body: md };

  const data: Frontmatter = {};
  for (const raw of m[1].split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const sep = line.indexOf(':');
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    if (!key) continue;
    data[key] = coerce(line.slice(sep + 1).trim());
  }

  return { data, body: md.slice(m[0].length) };
}

function coerce(value: string): FrontmatterValue {
  if (value === '') return '';
  if (value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => unquote(item.trim()))
      .filter((item) => item.length > 0);
  }
  if (value === 'true') return true;
  if (value === 'false') return false;
  // A bare number (and not e.g. a date like 2026-06-09, which has dashes).
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return unquote(value);
}

function unquote(value: string): string {
  if (value.length >= 2 && (value[0] === '"' || value[0] === "'") && value.at(-1) === value[0]) {
    return value.slice(1, -1);
  }
  return value;
}
