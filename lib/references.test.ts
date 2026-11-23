import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  FEATURED_MAX,
  earlierWorkOf,
  languageName,
  parseReference,
  sortReferences,
  validateReference,
  validateReferenceSet,
  wordCount,
} from '@/lib/references';

// A reference is another person's words and face on a public page, so a malformed one must fail
// `npm run test` (and the build) rather than render a half-filled card. The unit tests pin the
// parser and the rules; the last block validates every real file under content/references/.

const quote = (n: number) => Array.from({ length: n }, (_, i) => `word${i}`).join(' ');

const valid = `---
name: First Last
role: Product owner, API platform
role_nl: Product owner, API-platform
context: worked together on an API platform for a retailer
linkedin: https://www.linkedin.com/in/handle/
work: cloud-gateway
date: 2026-03-01
lang: en
reviewed: 2026-09-17
---

${quote(40)}
`;

describe('parseReference', () => {
  it('reads the flat frontmatter and the body as the quote', () => {
    const ref = parseReference('first-last', valid);
    expect(ref).not.toBeNull();
    expect(ref!.name).toBe('First Last');
    expect(ref!.role).toEqual({ en: 'Product owner, API platform', nl: 'Product owner, API-platform' });
    expect(ref!.quote).toBe(quote(40));
    expect(ref!.featured).toBe(false);
    expect(ref!.verified).toBe(false);
    expect(ref!.photo).toBeNull();
    expect(ref!.translatedFrom).toBeNull();
    expect(validateReference(ref!)).toEqual([]);
  });

  it('falls the Dutch role line back to the English one', () => {
    const ref = parseReference('x', valid.replace('role_nl: Product owner, API-platform\n', ''));
    expect(ref!.role.nl).toBe('Product owner, API platform');
  });

  it('returns null for a draft', () => {
    expect(parseReference('x', valid.replace('---\n\n', 'draft: true\n---\n\n'))).toBeNull();
  });
});

describe('validateReference', () => {
  const withQuote = (n: number, featured = false) => {
    const ref = parseReference('x', valid.replace(quote(40), quote(n)))!;
    return { ...ref, featured };
  };

  it('holds every quote to one budget, 30–120 words, featured or not', () => {
    for (const featured of [false, true]) {
      expect(validateReference(withQuote(29, featured))).toHaveLength(1);
      expect(validateReference(withQuote(30, featured))).toEqual([]);
      expect(validateReference(withQuote(93, featured))).toEqual([]);
      expect(validateReference(withQuote(120, featured))).toEqual([]);
      expect(validateReference(withQuote(121, featured))).toHaveLength(1);
    }
  });

  it('requires how they worked together, and no longer asks for years', () => {
    const ref = parseReference('x', valid)!;
    expect(ref.context).toBe('worked together on an API platform for a retailer');
    expect(validateReference({ ...ref, context: '' })).toEqual(['context is required']);
    expect(ref).not.toHaveProperty('years');
    expect(validateReference(parseReference('x', valid.replace('context:', 'years: 2021–2023\ncontext:'))!)).toEqual([]);
  });

  it('leaves the work optional', () => {
    const ref = parseReference('x', valid.replace('work: cloud-gateway\n', ''))!;
    expect(ref.work).toBeNull();
    expect(validateReference(ref)).toEqual([]);
  });

  it('requires a public LinkedIn profile URL', () => {
    const ref = parseReference('x', valid)!;
    expect(validateReference({ ...ref, linkedin: 'https://linkedin.com/in/handle' })).toEqual([]);
    expect(validateReference({ ...ref, linkedin: 'https://www.linkedin.com/company/acme/' })).toHaveLength(1);
    expect(validateReference({ ...ref, linkedin: 'https://example.com/in/handle/' })).toHaveLength(1);
    expect(validateReference({ ...ref, linkedin: '' })).toHaveLength(1);
  });

  it('allows paragraphs and keeps the photo under public/references/', () => {
    const ref = parseReference('x', valid)!;
    expect(validateReference({ ...ref, quote: `${quote(20)}\n\n${quote(20)}` })).toEqual([]);
    expect(validateReference({ ...ref, photo: '/references/first-last.jpg' })).toEqual([]);
    expect(validateReference({ ...ref, photo: 'https://media.licdn.com/x.jpg' })).toHaveLength(1);
  });

  it('names every missing field at once', () => {
    const ref = parseReference('x', '---\n---\n\nshort')!;
    const problems = validateReference(ref);
    expect(problems.join('\n')).toMatch(/name/);
    expect(problems.join('\n')).toMatch(/role/);
    expect(problems.join('\n')).toMatch(/linkedin/);
    expect(problems.join('\n')).toMatch(/context/);
    expect(problems.join('\n')).not.toMatch(/work|years/);
    expect(problems.join('\n')).toMatch(/date/);
    expect(problems.join('\n')).toMatch(/reviewed/);
    expect(problems.join('\n')).toMatch(/quote/);
  });
});

describe('the set', () => {
  it(`allows at most ${FEATURED_MAX} featured references and unique slugs`, () => {
    const ref = parseReference('a', valid)!;
    const featured = { ...ref, featured: true };
    expect(validateReferenceSet([featured, { ...featured, slug: 'b' }])).toEqual([]);
    expect(validateReferenceSet([featured, { ...featured, slug: 'b' }, { ...featured, slug: 'c' }])).toHaveLength(1);
    expect(validateReferenceSet([ref, ref])).toHaveLength(1);
  });

  it('sorts newest first, then by name', () => {
    const ref = parseReference('a', valid)!;
    const sorted = sortReferences([
      { ...ref, slug: 'b', name: 'B', date: '2026-01-01' },
      { ...ref, slug: 'c', name: 'C', date: '2026-03-01' },
      { ...ref, slug: 'a', name: 'A', date: '2026-01-01' },
    ]);
    expect(sorted.map((r) => r.slug)).toEqual(['c', 'a', 'b']);
  });
});

describe('helpers', () => {
  it('counts words', () => {
    expect(wordCount('  one two\nthree ')).toBe(3);
  });

  it('names a language in the reader’s locale', () => {
    expect(languageName('en', 'nl')).toBe('Engels');
    expect(languageName('de', 'en')).toBe('German');
  });
});

describe('a reference about an Earlier work entry', () => {
  it('finds the entry by its id and leaves a case-study slug alone', () => {
    expect(earlierWorkOf('earlier-security-data-lake')?.id).toBe('earlier-security-data-lake');
    expect(earlierWorkOf('cloud-gateway')).toBeUndefined();
    expect(earlierWorkOf('cloudera-kafka')).toBeUndefined();
  });

  it('passes the checks like one about a case study', () => {
    const ref = parseReference('first-last', valid.replace('work: cloud-gateway', 'work: earlier-security-data-lake'))!;
    expect(ref.work).toBe('earlier-security-data-lake');
    expect(validateReference(ref)).toEqual([]);
  });
});

describe('content/references/', () => {
  const dir = join(process.cwd(), 'content', 'references');
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')) : [];
  const refs = files
    .map((f) => parseReference(f.replace(/\.md$/, ''), readFileSync(join(dir, f), 'utf8')))
    .filter((r): r is NonNullable<typeof r> => r !== null);

  it('ships the template as a draft', () => {
    expect(files).toContain('_template.md');
    expect(parseReference('_template', readFileSync(join(dir, '_template.md'), 'utf8'))).toBeNull();
  });

  it.each(refs.map((r) => [r.slug, r] as const))('%s is fit to publish', (_slug, ref) => {
    expect(validateReference(ref)).toEqual([]);
    // The work, when one is named: a case study (content/en/work/<slug>.md) or an Earlier work entry
    // on /work (art-vvzsw9ap9e).
    if (ref.work) {
      expect(
        earlierWorkOf(ref.work) !== undefined || existsSync(join(process.cwd(), 'content', 'en', 'work', `${ref.work}.md`)),
      ).toBe(true);
    }
    if (ref.photo) expect(existsSync(join(process.cwd(), 'public', ref.photo))).toBe(true);
  });

  it('is consistent as a set', () => {
    expect(validateReferenceSet(refs)).toEqual([]);
  });
});
