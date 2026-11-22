import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getDictionary } from '@/lib/dictionaries';
import { copyLocale, localizeHref } from '@/lib/i18n';

// Maestro story art-bf5tq4788n: until the Dutch copy is approved, every Dutch address shows the English page under the
// fallback notice. The Dutch story removes or rewrites these tests when it brings the copy back.

describe('Dutch while its copy is unapproved', () => {
  it('has no Dutch dictionary text but the fallback notice', () => {
    const en = getDictionary('en');
    const nl = getDictionary('nl');
    expect({ ...nl, fallback: en.fallback }).toEqual(en);
    expect(nl.fallback.notice).not.toBe(en.fallback.notice);
  });

  it('holds no files under content/nl', () => {
    const dir = join(process.cwd(), 'content', 'nl');
    expect(existsSync(dir) ? readdirSync(dir) : []).toEqual([]);
  });

  it('shows English copy under /nl and leaves English alone', () => {
    expect(copyLocale('nl')).toBe('en');
    expect(copyLocale('en')).toBe('en');
  });
});

describe('links written for the English pages', () => {
  it('stay inside the locale they are served under', () => {
    expect(localizeHref('/en/work/integration-platform', 'nl')).toBe('/nl/work/integration-platform');
    expect(localizeHref('/en/work#top', 'nl')).toBe('/nl/work#top');
    expect(localizeHref('/en', 'nl')).toBe('/nl');
    expect(localizeHref('/en/work/x', 'en')).toBe('/en/work/x');
  });

  it('leave other links alone', () => {
    for (const href of ['https://example.com/en/x', '/english', '/diagrams/a.svg', '#x', '/nl/work']) {
      expect(localizeHref(href, 'nl')).toBe(href);
    }
  });
});

// Maestro story art-9947n0hg99: the home page shows approved copy only. A text added here has to be
// approved in the site copy first, so a new key fails this test until the list is changed on purpose.
describe('home dictionary', () => {
  it('holds only the texts the home page shows', () => {
    expect(Object.keys(getDictionary('en').home).sort()).toEqual(
      [
        'heroEyebrow',
        'heroTitle',
        'heroIntro',
        'primaryContact',
        'primaryWork',
        'howHeading',
        'howLine',
        'howBody',
        'howCta',
      ].sort(),
    );
  });

  it('carries none of the withdrawn figures', () => {
    const text = JSON.stringify(getDictionary('en').home);
    for (const withdrawn of ['18–20', '250', '1.5B', '0.03', 'IBM API Connect']) {
      expect(text).not.toContain(withdrawn);
    }
  });
});
