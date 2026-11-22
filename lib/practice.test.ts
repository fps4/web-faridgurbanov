import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { sectionSlugs } from '@/lib/content';
import { parseFrontmatter } from '@/lib/frontmatter';
import { earlierWork } from '@/lib/site';
import {
  parseFrom,
  toArticleMeta,
  validateArticle,
  validateArticleSet,
  type ArticleMeta,
} from '@/lib/practice-model';

// Practice is a short list of the owner's own articles (art-gdp0zjj9fd, ADR-0010 §11). These tests
// check the model, and every real file under content/en/practice/: four published articles, each
// with its first line unchanged from its own text, its reading time, its date and its Where it
// comes from leading where it says; everything else there is a draft and so no page.

const a = (over: Partial<ArticleMeta> = {}): ArticleMeta => ({
  slug: 'simple-first',
  title: 'Simple first',
  summary: 'I advocate simplicity.',
  date: '2026-11-22',
  order: 1,
  read: 'Three-minute read',
  from: [{ label: 'Integration adapter', href: '/en/work/integration-adapter' }],
  ...over,
});

describe('parseFrom', () => {
  it('reads `Label | /en/…` as a link and a bare label as plain text', () => {
    expect(parseFrom(['Integration adapter | /en/work/integration-adapter', 'My daily work'])).toEqual([
      { label: 'Integration adapter', href: '/en/work/integration-adapter' },
      { label: 'My daily work', href: null },
    ]);
  });

  it('is empty when there is none', () => {
    expect(parseFrom(undefined)).toEqual([]);
  });
});

describe('toArticleMeta', () => {
  it('reads the flat frontmatter, a comma inside a value kept whole', () => {
    const { data } = parseFrontmatter(
      '---\ntitle: "A: b"\nsummary: I try, and I go on.\ndate: 2026-11-22\norder: 2\nread: Two-minute read\nfrom: [My own projects]\n---\nbody',
    );
    expect(toArticleMeta('x', data)).toEqual({
      slug: 'x',
      title: 'A: b',
      summary: 'I try, and I go on.',
      date: '2026-11-22',
      order: 2,
      read: 'Two-minute read',
      from: [{ label: 'My own projects', href: null }],
    });
  });
});

describe('validateArticle', () => {
  it('accepts a complete article', () => {
    expect(validateArticle(a(), 'I advocate simplicity. More.')).toEqual([]);
  });

  it('names what is missing or malformed', () => {
    const errors = validateArticle(a({ title: '', summary: '', date: '22 Nov', order: 0, read: '', from: [] })).join('\n');
    for (const word of ['title', 'summary', 'date', 'order', 'read', 'from']) expect(errors).toContain(word);
  });

  it('accepts a case study or an Earlier work entry as a link, and nothing else', () => {
    expect(validateArticle(a({ from: [{ label: 'x', href: '/en/work#earlier-security-data-lake' }] }))).toEqual([]);
    expect(validateArticle(a({ from: [{ label: 'x', href: 'https://example.com' }] })).join()).toContain('is not');
    expect(validateArticle(a({ from: [{ label: 'x', href: '/en/practice/articles/y' }] })).join()).toContain('is not');
  });

  it('rejects a first line that is not the start of the body', () => {
    expect(validateArticle(a(), 'Something else.').join()).toContain('first line');
  });
});

describe('validateArticleSet', () => {
  it('rejects a reused order', () => {
    expect(validateArticleSet([a(), a({ slug: 'b' })]).join()).toContain('order 1 is used twice');
    expect(validateArticleSet([a(), a({ slug: 'b', order: 2 })])).toEqual([]);
  });
});

const ROOT = join(process.cwd(), 'content', 'en', 'practice');
const files = (dir: string) =>
  existsSync(join(ROOT, dir)) ? readdirSync(join(ROOT, dir)).filter((f) => f.endsWith('.md')) : [];
const read = (dir: string, f: string) => parseFrontmatter(readFileSync(join(ROOT, dir, f), 'utf8'));
const meta = (slug: string) => toArticleMeta(slug, read('articles', `${slug}.md`).data);

const PUBLISHED = [
  'simple-first',
  'when-the-security-requirements-do-not-exist-yet',
  'ai-multiplies-an-engineer-who-guides-it',
  'behind-the-steering-wheel',
];

describe('the published practice content', () => {
  it('is exactly four articles, in this order', () => {
    const slugs = files('articles')
      .filter((f) => read('articles', f).data.draft !== true)
      .map((f) => f.replace(/\.md$/, ''));
    expect(slugs.sort((x, y) => meta(x).order - meta(y).order)).toEqual(PUBLISHED);
  });

  it('leaves no page for a draft: the static params are the four published slugs', async () => {
    expect((await sectionSlugs('practice/articles')).sort()).toEqual([...PUBLISHED].sort());
    expect(await sectionSlugs('practice/guidelines')).toEqual([]);
    expect(await sectionSlugs('practice/patterns')).toEqual([]);
  });

  it.each(PUBLISHED)('%s is valid, dated, and its first line is the start of its own text', (slug) => {
    const { body } = read('articles', `${slug}.md`);
    expect(validateArticle(meta(slug), body)).toEqual([]);
    expect(meta(slug).date).toBe('2026-11-22');
  });

  it('gives Behind the steering wheel a two-minute read and the other three a three-minute read', () => {
    for (const s of PUBLISHED) {
      expect(meta(s).read).toBe(s === 'behind-the-steering-wheel' ? 'Two-minute read' : 'Three-minute read');
    }
  });

  it('leads each Where it comes from to the work it names, and leaves the rest as plain text', () => {
    expect(meta('simple-first').from).toEqual([
      { label: 'Integration adapter', href: '/en/work/integration-adapter' },
      { label: 'Cloud gateway', href: '/en/work/cloud-gateway' },
    ]);
    expect(meta('when-the-security-requirements-do-not-exist-yet').from).toEqual([
      { label: 'A security data lake for a UK telecom operator', href: '/en/work#earlier-security-data-lake' },
    ]);
    expect(meta('ai-multiplies-an-engineer-who-guides-it').from).toEqual([{ label: 'My daily work', href: null }]);
    expect(meta('behind-the-steering-wheel').from).toEqual([{ label: 'My own projects', href: null }]);
  });

  it('points every Where it comes from link at a case study or an Earlier work entry that exists', () => {
    for (const slug of PUBLISHED) {
      for (const f of meta(slug).from) {
        if (!f.href) continue;
        const caseStudy = /^\/en\/work\/([a-z0-9-]+)$/.exec(f.href);
        const earlier = /^\/en\/work#(earlier-[a-z0-9-]+)$/.exec(f.href);
        if (caseStudy) expect(existsSync(join(process.cwd(), 'content', 'en', 'work', `${caseStudy[1]}.md`)), f.href).toBe(true);
        else expect(earlierWork.some((e) => e.id === earlier?.[1]), f.href).toBe(true);
      }
    }
  });

  it('names maestro in Behind the steering wheel and does not link it', () => {
    expect(read('articles', 'behind-the-steering-wheel.md').body).toContain('maestro');
  });

  it('carries no link in any article body, so no private repository is linked', () => {
    for (const slug of PUBLISHED) expect(read('articles', `${slug}.md`).body, slug).not.toMatch(/\]\(|https?:\/\//);
  });
});

describe('the unpublished practice pieces', () => {
  it('keeps every guideline, pattern and earlier article in the repository, marked draft', () => {
    const drafts = [
      ...files('guidelines').map((f) => ['guidelines', f]),
      ...files('patterns').map((f) => ['patterns', f]),
      ...files('articles')
        .filter((f) => !PUBLISHED.includes(f.replace(/\.md$/, '')))
        .map((f) => ['articles', f]),
    ];
    expect(drafts.length).toBe(3 + 5 + 10);
    for (const [dir, f] of drafts) expect(read(dir, f).data.draft, `${dir}/${f}`).toBe(true);
  });

  it('has no page route for a guideline or a pattern, and no filter component', () => {
    const app = join(process.cwd(), 'app', '[locale]', 'practice');
    expect(existsSync(join(app, 'guidelines'))).toBe(false);
    expect(existsSync(join(app, 'patterns'))).toBe(false);
    for (const gone of ['practice-list', 'practice-tags', 'practice-entry']) {
      expect(existsSync(join(process.cwd(), 'components', `${gone}.tsx`)), gone).toBe(false);
    }
  });
});

describe('the end of the Integration adapter case study', () => {
  it('links to Simple first, in the words of the approved copy', () => {
    const body = readFileSync(join(process.cwd(), 'content', 'en', 'work', 'integration-adapter.md'), 'utf8').trimEnd();
    expect(body.endsWith('Why I kept it simple: read ["Simple first"](/en/practice/articles/simple-first)')).toBe(true);
  });
});
