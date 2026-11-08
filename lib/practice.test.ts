import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseFrontmatter } from '@/lib/frontmatter';
import {
  ENTRY_KINDS,
  SUMMARY_MAX,
  buildList,
  entriesCiting,
  filterItems,
  filterQuery,
  neighbours,
  parseFilter,
  toEntryMeta,
  toTags,
  usedTags,
  validateEntry,
  validateEntrySet,
  validateTags,
  type EntryKind,
  type EntryMeta,
  type PracticeItem,
} from '@/lib/practice-model';

// Guidelines and patterns are reference pages people link to, so a broken one must fail
// `npm run test` (and the build, which runs the same validators) rather than render without its
// badge, with a dead related link, or with a tag that adds a stray filter chip. The last block
// checks every real file under content/<locale>/practice/.

const e = (over: Partial<EntryMeta> = {}): EntryMeta => ({
  kind: 'guideline',
  slug: 'architecture-documentation',
  id: 'G-01',
  order: 1,
  title: 'Documentation in three layers',
  summary: 'One map, one logbook, and code for the rest.',
  status: 'current',
  revised: '2026-11-08',
  related: [],
  topics: ['architecture'],
  tech: [],
  ...over,
});

const item = (over: Partial<PracticeItem>): PracticeItem => ({
  kind: 'article',
  href: '/practice/articles/x',
  date: '2026-01-01',
  title: 'x',
  summary: 's',
  topics: ['ai'],
  tech: [],
  ...over,
});

describe('toEntryMeta', () => {
  it('reads the flat frontmatter, with no supersedes and empty lists by default', () => {
    const { data } = parseFrontmatter(
      '---\nid: P-01\norder: 1\ntitle: "A: b"\nsummary: s\nstatus: current\nrevised: 2026-11-08\ntopics: [ai]\n---\nbody',
    );
    const meta = toEntryMeta('pattern', 'a', data);
    expect(meta).toMatchObject({ kind: 'pattern', id: 'P-01', title: 'A: b', related: [], topics: ['ai'], tech: [] });
    expect(meta.supersedes).toBeUndefined();
  });
});

describe('validateEntry', () => {
  it('accepts a complete guideline and a complete pattern', () => {
    expect(validateEntry(e())).toEqual([]);
    expect(validateEntry(e({ kind: 'pattern', id: 'P-01' }))).toEqual([]);
  });

  it.each([
    ['id', { id: 'G1' }],
    ['id prefix for the kind', { kind: 'pattern' as EntryKind }],
    ['order', { order: Number.NaN }],
    ['summary', { summary: 'x'.repeat(SUMMARY_MAX + 1) }],
    ['status', { status: 'draft' as EntryMeta['status'] }],
    ['revised', { revised: '8 Nov 2026' }],
    ['supersedes', { supersedes: 'P-01' }],
    ['related', { related: ['portfolio'] }],
    ['missing topic', { topics: [] }],
    ['unknown topic', { topics: ['blockchain' as never] }],
    ['unknown tech', { tech: ['oracle' as never] }],
  ])('rejects a bad %s', (_, over) => {
    expect(validateEntry(e(over))).toHaveLength(1);
  });

  it('accepts related entries of either kind and site pages', () => {
    expect(validateEntry(e({ related: ['G-02', 'P-01', 'work/cloud-gateway', 'practice/articles/who-had-to-say-yes'] }))).toEqual([]);
  });
});

describe('validateEntrySet', () => {
  it('rejects a reused id, and a reused order within a kind', () => {
    const errors = validateEntrySet([e(), e({ slug: 'other' })]);
    expect(errors.some((x) => x.includes('id G-01'))).toBe(true);
    expect(errors.some((x) => x.includes('order 1'))).toBe(true);
  });

  it('lets a guideline and a pattern share an order', () => {
    expect(validateEntrySet([e(), e({ kind: 'pattern', slug: 'p', id: 'P-01' })])).toEqual([]);
  });

  it('rejects a related or superseded id that does not exist, or points at itself', () => {
    expect(validateEntrySet([e({ related: ['P-09'] })])).toEqual(['architecture-documentation: P-09 does not exist']);
    expect(validateEntrySet([e({ supersedes: 'G-01' })])).toEqual(['architecture-documentation: points at itself']);
  });
});

describe('validateTags', () => {
  it('needs a topic, and only known tags', () => {
    expect(validateTags('a', { topics: ['ai'], tech: ['sap'] })).toEqual([]);
    expect(validateTags('a', { topics: [], tech: [] })).toEqual(['a: needs at least one topic']);
  });

  it('reads tags off frontmatter, empty when absent', () => {
    expect(toTags({ topics: ['ai'], tech: ['sap'] })).toEqual({ topics: ['ai'], tech: ['sap'] });
    expect(toTags({})).toEqual({ topics: [], tech: [] });
  });
});

describe('neighbours', () => {
  const list = [{ slug: 'a' }, { slug: 'b' }, { slug: 'c' }];
  it('returns the entries either side, none past the ends', () => {
    expect(neighbours(list, 'b')).toEqual({ prev: { slug: 'a' }, next: { slug: 'c' } });
    expect(neighbours(list, 'a')).toEqual({ prev: undefined, next: { slug: 'b' } });
    expect(neighbours(list, 'x')).toEqual({});
  });
});

describe('buildList', () => {
  it('puts guidelines, then patterns, by order, then articles newest first', () => {
    const list = buildList(
      [e({ kind: 'pattern', slug: 'p2', id: 'P-02', order: 2 }), e({ kind: 'pattern', slug: 'p1', id: 'P-01', order: 1 }), e()],
      [item({ href: '/a/old', date: '2026-01-01' }), item({ href: '/a/new', date: '2026-06-01' })],
    );
    expect(list.map((i) => i.id ?? i.href)).toEqual(['G-01', 'P-01', 'P-02', '/a/new', '/a/old']);
    expect(list[1].href).toBe('/practice/patterns/p1');
  });
});

describe('filtering', () => {
  const items = [
    item({ kind: 'guideline', href: '/g', topics: ['architecture'] }),
    item({ kind: 'pattern', href: '/p', topics: ['governance', 'ai'], tech: ['fabric'] }),
    item({ kind: 'article', href: '/a', topics: ['ai'], tech: ['sap'] }),
  ];

  it('matches every set facet, and everything when none is set', () => {
    expect(filterItems(items, {})).toHaveLength(3);
    expect(filterItems(items, { topic: 'ai' }).map((i) => i.href)).toEqual(['/p', '/a']);
    expect(filterItems(items, { topic: 'ai', kind: 'article' }).map((i) => i.href)).toEqual(['/a']);
    expect(filterItems(items, { tech: 'fabric', kind: 'article' })).toEqual([]);
  });

  it('round-trips through the query string and drops unknown values', () => {
    expect(filterQuery({ topic: 'ai', kind: 'pattern' })).toBe('?kind=pattern&topic=ai');
    expect(filterQuery({})).toBe('');
    expect(parseFilter('?kind=pattern&topic=ai&tech=sap')).toEqual({ kind: 'pattern', topic: 'ai', tech: 'sap' });
    expect(parseFilter('?kind=podcast&topic=blockchain&x=1')).toEqual({});
  });

  it('offers only the tags in use, in vocabulary order', () => {
    expect(usedTags(items)).toEqual({ topics: ['architecture', 'governance', 'ai'], tech: ['sap', 'fabric'] });
  });

  it('finds the entries drawn from an article', () => {
    const drawn = entriesCiting([e({ related: ['practice/articles/x'] }), e({ slug: 'y', id: 'G-02' })], 'practice/articles/x');
    expect(drawn.map((d) => d.id)).toEqual(['G-01']);
  });
});

describe('the published practice content', () => {
  const read = (locale: string, kind: EntryKind) => {
    const dir = join(process.cwd(), 'content', locale, ENTRY_KINDS[kind].section);
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => ({ meta: toEntryMeta(kind, f.replace(/\.md$/, ''), parseFrontmatter(readFileSync(join(dir, f), 'utf8')).data), raw: readFileSync(join(dir, f), 'utf8') }));
  };
  const all = (locale: string) => [...read(locale, 'guideline'), ...read(locale, 'pattern')];
  const en = all('en');
  const nl = all('nl');

  it('has guidelines and patterns in English, and every set is valid', () => {
    expect(en.filter((x) => x.meta.kind === 'guideline').length).toBeGreaterThan(0);
    expect(en.filter((x) => x.meta.kind === 'pattern').length).toBeGreaterThan(0);
    expect(validateEntrySet(en.map((x) => x.meta))).toEqual([]);
    expect(validateEntrySet(nl.map((x) => x.meta))).toEqual([]);
  });

  it('gives a Dutch file the same id, order, status, date, links and tags as its English one', () => {
    for (const { meta: n } of nl) {
      const m = en.find((x) => x.meta.kind === n.kind && x.meta.slug === n.slug)?.meta;
      expect(m, `${n.slug} has no English original`).toBeDefined();
      const keep = (x: EntryMeta) => [x.id, x.order, x.status, x.revised, x.supersedes, x.related, x.topics, x.tech];
      expect(keep(n), n.slug).toEqual(keep(m!));
    }
  });

  it('follows each kind’s template: the required sections, in order', () => {
    const sections: Record<string, Record<EntryKind, string[]>> = {
      en: {
        guideline: ['The rule', 'Why', 'How I apply it', 'Trade-offs', "When I'd bend it"],
        pattern: ['Problem', 'Forces', 'Solution', 'Consequences', 'When not to use it'],
      },
      nl: {
        guideline: ['De regel', 'Waarom', 'Hoe ik het toepas', 'Afwegingen', 'Wanneer ik ervan afwijk'],
        pattern: ['Probleem', 'Krachten', 'Oplossing', 'Gevolgen', 'Wanneer niet'],
      },
    };
    for (const [locale, files] of [['en', en], ['nl', nl]] as const) {
      for (const { meta, raw } of files) {
        const want = sections[locale][meta.kind];
        const headings = [...raw.replace(/```[\s\S]*?```/g, '').matchAll(/^## (.+)$/gm)].map((m) => m[1]);
        expect(headings.slice(0, want.length), `${locale}/${meta.slug}`).toEqual(want);
      }
    }
  });

  it('tags every article with known topics and technologies', () => {
    for (const locale of ['en', 'nl']) {
      const dir = join(process.cwd(), 'content', locale, 'practice', 'articles');
      for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
        const tags = toTags(parseFrontmatter(readFileSync(join(dir, f), 'utf8')).data);
        expect(validateTags(`${locale}/${f}`, tags)).toEqual([]);
      }
    }
  });
});
