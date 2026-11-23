import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseFrontmatter } from '@/lib/frontmatter';
import { toArticleMeta, validateArticle } from '@/lib/practice-model';

// Maestro story art-j9e7z77xy0: every published English content file has a Dutch file at the same
// address with the same frontmatter keys, and the Dutch tree holds nothing the English one does not
// (a draft in content/en stays a draft and gets no Dutch file). The Dutch values are the approved
// ones; the page tests (components/dutch-pages.test.tsx) read them.

const SECTIONS = ['work', 'practice/articles'];
const root = (locale: string, section: string) => join(process.cwd(), 'content', locale, section);
const files = (locale: string, section: string) => {
  try {
    return readdirSync(root(locale, section)).filter((f) => f.endsWith('.md')).sort();
  } catch {
    return [];
  }
};
const read = (locale: string, section: string, f: string) => parseFrontmatter(readFileSync(join(root(locale, section), f), 'utf8'));

describe.each(SECTIONS)('content/{en,nl}/%s', (section) => {
  const published = files('en', section).filter((f) => read('en', section, f).data.draft !== true);

  it('has a Dutch file for every published English file, and none for a draft', () => {
    expect(published.length).toBeGreaterThan(0);
    expect(files('nl', section)).toEqual(published);
  });

  it.each(published)('%s has the same frontmatter keys in Dutch, in the same order', (f) => {
    const en = read('en', section, f).data;
    const nl = read('nl', section, f).data;
    expect(Object.keys(nl)).toEqual(Object.keys(en));
  });

  it.each(published)('%s keeps what is not text the same: order, date, next page, draft', (f) => {
    const en = read('en', section, f).data;
    const nl = read('nl', section, f).data;
    for (const key of ['order', 'date', 'next', 'draft']) expect(nl[key], key).toEqual(en[key]);
  });

  it.each(published)('%s has the same headings count and links in its body', (f) => {
    const body = (locale: string) => readFileSync(join(root(locale, section), f), 'utf8').split('\n---\n').slice(1).join('\n---\n');
    const headings = (b: string) => b.split('\n').filter((l) => /^#{1,6} /.test(l)).length;
    const links = (b: string) => [...b.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1].replace(/^\/(en|nl)/, ''));
    expect(headings(body('nl'))).toBe(headings(body('en')));
    expect(links(body('nl'))).toEqual(links(body('en')));
  });
});

describe('the Dutch articles', () => {
  const section = 'practice/articles';
  it.each(files('nl', section))('%s passes the checks of an article, its first line unchanged from its own text', (f) => {
    const { data, body } = read('nl', section, f);
    expect(validateArticle(toArticleMeta(f.replace(/\.md$/, ''), data), body)).toEqual([]);
  });
});
