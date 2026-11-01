import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

// An episode's sources (FS-0012): every source the episode uses, in the order it uses them, grouped
// by the part of the episode, shown on the episode page. The owner says in the video that they are
// there. One file per episode, content/sources/<module>-<episode>.yaml (3.1 → 3-1.yaml), locale-less:
// titles stay in the language they were published in. Server-only (node:fs), like lib/decks/text.ts;
// `sourcesProblems` is pure, for the tests.

export const SOURCE_KINDS = {
  law: 'Law',
  paper: 'Peer-reviewed',
  preprint: 'Preprint',
  'model-card': 'Model card',
  dataset: 'Dataset',
  report: 'Industry report',
  vendor: 'Vendor survey',
  news: 'News',
  docs: 'Documentation',
  encyclopedia: 'Encyclopedia',
} as const;

export type SourceKind = keyof typeof SOURCE_KINDS;

export interface Source {
  title: string;
  /** Author(s) or organisation, as cited: 'Riley et al.', 'OpenAI'. */
  who: string;
  /** Year of publication, or the date when the day matters. */
  year: string;
  url: string;
  kind: SourceKind;
}

export interface SourceGroup {
  /** The part of the episode, e.g. 'The case'. */
  part: string;
  items: Source[];
}

export const SOURCES_ROOT = path.join(process.cwd(), 'content', 'sources');

/** The file an episode's sources live in: '3.1' → content/sources/3-1.yaml. */
export function sourcesFile(episode: string): string {
  return path.join('content', 'sources', `${episode.replace('.', '-')}.yaml`);
}

/** What is wrong with a parsed sources file, as sentences; [] when it is fine. */
export function sourcesProblems(doc: unknown): string[] {
  if (!Array.isArray(doc) || doc.length === 0) return ['the file must be a list of parts, each with `part` and `items`'];
  const problems: string[] = [];
  doc.forEach((group, g) => {
    const where = `part ${g + 1}`;
    if (!group || typeof group !== 'object') return void problems.push(`${where} is not a mapping`);
    const { part, items } = group as Record<string, unknown>;
    if (typeof part !== 'string' || !part.trim()) problems.push(`${where} needs a \`part\` name`);
    if (!Array.isArray(items) || items.length === 0) return void problems.push(`${where} needs at least one item`);
    items.forEach((item, i) => {
      const at = `${typeof part === 'string' ? part : where}, item ${i + 1}`;
      if (!item || typeof item !== 'object') return void problems.push(`${at} is not a mapping`);
      const s = item as Record<string, unknown>;
      for (const field of ['title', 'who', 'year', 'url', 'kind'] as const)
        if (typeof s[field] !== 'string' && typeof s[field] !== 'number') problems.push(`${at} needs \`${field}\``);
      if (typeof s.url === 'string' && !/^https:\/\//.test(s.url)) problems.push(`${at}: \`url\` must start with https://`);
      if (typeof s.kind === 'string' && !(s.kind in SOURCE_KINDS))
        problems.push(`${at}: unknown \`kind\` "${s.kind}" (one of ${Object.keys(SOURCE_KINDS).join(', ')})`);
    });
  });
  return problems;
}

/** The episode's sources, or undefined when it has no file. Throws, naming the file, on a malformed one. */
export function readSources(episode: string): SourceGroup[] | undefined {
  const full = path.join(process.cwd(), sourcesFile(episode));
  if (!existsSync(full)) return undefined;
  const file = sourcesFile(episode);
  let doc: unknown;
  try {
    doc = parse(readFileSync(full, 'utf8'));
  } catch (err) {
    throw new Error(`${file}: not valid YAML: ${(err as Error).message}`);
  }
  const problems = sourcesProblems(doc);
  if (problems.length) throw new Error(`${file}:\n- ${problems.join('\n- ')}`);
  return (doc as SourceGroup[]).map((g) => ({ part: g.part, items: g.items.map((s) => ({ ...s, year: String(s.year) })) }));
}
