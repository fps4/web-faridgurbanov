import { describe, expect, it } from 'vitest';
import { pageAlternates } from '@/lib/canonical';
import { ownLocalesOf, siteOrigin, sitemapEntries } from '@/lib/sitemap';

describe('siteOrigin', () => {
  it('prefers the deploy URL and drops a trailing slash, else uses the domain', () => {
    expect(siteOrigin('https://staging.example.com/', 'faridgurbanov.com')).toBe('https://staging.example.com');
    expect(siteOrigin(undefined, 'faridgurbanov.com')).toBe('https://faridgurbanov.com');
  });
});

describe('ownLocalesOf', () => {
  it('is both locales for a page with Dutch, and English alone for the privacy page', () => {
    expect(ownLocalesOf('')).toEqual(['en', 'nl']);
    expect(ownLocalesOf('/work/cloud-gateway')).toEqual(['en', 'nl']);
    expect(ownLocalesOf('/privacy')).toEqual(['en']);
  });

  it('is English alone for a content page whose Dutch file is missing', () => {
    expect(ownLocalesOf('/work/x', true)).toEqual(['en']);
  });
});

describe('sitemapEntries', () => {
  const entries = sitemapEntries('https://x.test', [
    { path: '', own: ownLocalesOf('') },
    { path: '/practice/articles/simple-first', own: ownLocalesOf('/practice/articles/simple-first') },
    { path: '/privacy', own: ownLocalesOf('/privacy') },
  ]);

  it('lists a page with Dutch once per locale, and the privacy page under /en alone', () => {
    expect(entries.map((e) => e.url)).toEqual([
      'https://x.test/en',
      'https://x.test/nl',
      'https://x.test/en/practice/articles/simple-first',
      'https://x.test/nl/practice/articles/simple-first',
      'https://x.test/en/privacy',
    ]);
    expect(entries.filter((e) => e.url.includes('/nl/privacy'))).toEqual([]);
  });

  it('pairs each URL with its other-language version and an English x-default', () => {
    for (const i of [2, 3]) {
      expect(entries[i].alternates?.languages).toEqual({
        en: 'https://x.test/en/practice/articles/simple-first',
        nl: 'https://x.test/nl/practice/articles/simple-first',
        'x-default': 'https://x.test/en/practice/articles/simple-first',
      });
    }
  });

  it('gives the privacy page no pair', () => {
    expect(entries[4].alternates).toBeUndefined();
  });
});

describe('pageAlternates', () => {
  it('gives a page with Dutch a canonical link to itself and the pair, in both locales', () => {
    for (const locale of ['en', 'nl']) {
      expect(pageAlternates(locale, '/work/cloud-gateway')).toEqual({
        alternates: {
          canonical: `/${locale}/work/cloud-gateway`,
          languages: { en: '/en/work/cloud-gateway', nl: '/nl/work/cloud-gateway', 'x-default': '/en/work/cloud-gateway' },
        },
      });
    }
    expect(pageAlternates('nl', '').alternates?.canonical).toBe('/nl');
  });

  it('points the Dutch privacy page at the English original, with no pair, and leaves the English one alone', () => {
    expect(pageAlternates('nl', '/privacy')).toEqual({ alternates: { canonical: '/en/privacy' } });
    expect(pageAlternates('en', '/privacy')).toEqual({});
  });

  it('treats a content page whose Dutch file is missing like a page without Dutch', () => {
    expect(pageAlternates('nl', '/work/x', true)).toEqual({ alternates: { canonical: '/en/work/x' } });
    expect(pageAlternates('en', '/work/x', true)).toEqual({});
  });
});
