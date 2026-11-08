import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseFrontmatter } from '@/lib/frontmatter';
import {
  neighbours,
  SUMMARY_MAX,
  toGuidelineMeta,
  validateGuideline,
  validateGuidelineSet,
  type GuidelineMeta,
} from '@/lib/guidelines';

// A guideline is a reference page people link to, so a broken one must fail `npm run test` (and
// the build, which runs the same validators) rather than render without its badge or with a dead
// related link. The last block checks every real file under content/<locale>/practice/guidelines/.

const g = (over: Partial<GuidelineMeta> = {}): GuidelineMeta => ({
  slug: 'architecture-documentation',
  id: 'G-01',
  order: 1,
  title: 'Architecture documentation',
  summary: 'One map, one logbook, and code for the rest.',
  status: 'current',
  revised: '2026-11-08',
  related: [],
  ...over,
});

describe('toGuidelineMeta', () => {
  it('reads the flat frontmatter, with no supersedes and an empty related list by default', () => {
    const { data } = parseFrontmatter('---\nid: G-01\norder: 1\ntitle: "A: b"\nsummary: s\nstatus: current\nrevised: 2026-11-08\nrelated: []\n---\nbody');
    const meta = toGuidelineMeta('a', data);
    expect(meta).toMatchObject({ id: 'G-01', order: 1, title: 'A: b', status: 'current', revised: '2026-11-08', related: [] });
    expect(meta.supersedes).toBeUndefined();
  });
});

describe('validateGuideline', () => {
  it('accepts a complete guideline', () => {
    expect(validateGuideline(g())).toEqual([]);
  });

  it.each([
    ['id', { id: 'G1' }],
    ['order', { order: Number.NaN }],
    ['summary', { summary: 'x'.repeat(SUMMARY_MAX + 1) }],
    ['status', { status: 'draft' as GuidelineMeta['status'] }],
    ['revised', { revised: '8 Nov 2026' }],
    ['supersedes', { supersedes: 'ADR-1' }],
    ['related', { related: ['portfolio'] }],
  ])('rejects a bad %s', (_, over) => {
    expect(validateGuideline(g(over))).toHaveLength(1);
  });

  it('accepts related guidelines and site pages', () => {
    expect(validateGuideline(g({ related: ['G-02', 'work/cloud-gateway', 'practice/articles/who-had-to-say-yes'] }))).toEqual([]);
  });
});

describe('validateGuidelineSet', () => {
  it('rejects a reused id or order', () => {
    const errors = validateGuidelineSet([g(), g({ slug: 'other' })]);
    expect(errors.some((e) => e.includes('id G-01'))).toBe(true);
    expect(errors.some((e) => e.includes('order 1'))).toBe(true);
  });

  it('rejects a related or superseded id that does not exist, or points at itself', () => {
    expect(validateGuidelineSet([g({ related: ['G-09'] })])).toEqual(['architecture-documentation: G-09 does not exist']);
    expect(validateGuidelineSet([g({ supersedes: 'G-01' })])).toEqual(['architecture-documentation: points at itself']);
  });
});

describe('neighbours', () => {
  const list = [{ slug: 'a' }, { slug: 'b' }, { slug: 'c' }];
  it('returns the guidelines either side, none past the ends', () => {
    expect(neighbours(list, 'b')).toEqual({ prev: { slug: 'a' }, next: { slug: 'c' } });
    expect(neighbours(list, 'a')).toEqual({ prev: undefined, next: { slug: 'b' } });
    expect(neighbours(list, 'c')).toEqual({ prev: { slug: 'b' }, next: undefined });
    expect(neighbours(list, 'x')).toEqual({});
  });
});

describe('the published guidelines', () => {
  const read = (locale: string) => {
    const dir = join(process.cwd(), 'content', locale, 'practice', 'guidelines');
    return readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .map((f) => toGuidelineMeta(f.replace(/\.md$/, ''), parseFrontmatter(readFileSync(join(dir, f), 'utf8')).data));
  };
  const en = read('en');
  const nl = read('nl');

  it('has at least one English guideline, and every set is valid', () => {
    expect(en.length).toBeGreaterThan(0);
    expect(validateGuidelineSet(en)).toEqual([]);
    expect(validateGuidelineSet(nl)).toEqual([]);
  });

  it('gives a Dutch file the same id, order, status and date as its English one', () => {
    for (const n of nl) {
      const e = en.find((x) => x.slug === n.slug);
      expect(e, `${n.slug} has no English original`).toBeDefined();
      expect([n.id, n.order, n.status, n.revised, n.supersedes, n.related]).toEqual([e!.id, e!.order, e!.status, e!.revised, e!.supersedes, e!.related]);
    }
  });

  it('follows the guideline template: the five required sections, in order', () => {
    const sections = { en: ['The rule', 'Why', 'How I apply it', 'Trade-offs', "When I'd bend it"], nl: ['De regel', 'Waarom', 'Hoe ik het toepas', 'Afwegingen', 'Wanneer ik ervan afwijk'] };
    for (const [locale, want] of Object.entries(sections)) {
      const dir = join(process.cwd(), 'content', locale, 'practice', 'guidelines');
      for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
        const headings = [...readFileSync(join(dir, f), 'utf8').matchAll(/^## (.+)$/gm)].map((m) => m[1]);
        expect(headings.slice(0, want.length), `${locale}/${f}`).toEqual(want);
      }
    }
  });
});
