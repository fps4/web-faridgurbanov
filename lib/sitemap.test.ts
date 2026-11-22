import { describe, expect, it } from 'vitest';
import { fallbackCanonical } from '@/lib/canonical';
import { siteOrigin, sitemapEntries } from '@/lib/sitemap';

describe('siteOrigin', () => {
  it('prefers the deploy URL and drops a trailing slash, else uses the domain', () => {
    expect(siteOrigin('https://staging.example.com/', 'faridgurbanov.com')).toBe('https://staging.example.com');
    expect(siteOrigin(undefined, 'faridgurbanov.com')).toBe('https://faridgurbanov.com');
  });
});

const paths = ['', '/practice/guidelines/architecture-documentation'];

describe('sitemapEntries while Dutch shows the English page', () => {
  const entries = sitemapEntries('https://x.test', paths);

  it('lists the English addresses only, with no alternates', () => {
    expect(entries).toEqual([
      { url: 'https://x.test/en' },
      { url: 'https://x.test/en/practice/guidelines/architecture-documentation' },
    ]);
  });
});

describe('sitemapEntries when both locales have their own copy', () => {
  const entries = sitemapEntries('https://x.test', paths, ['en', 'nl']);

  it('lists every path once per locale', () => {
    expect(entries.map((e) => e.url)).toEqual([
      'https://x.test/en',
      'https://x.test/nl',
      'https://x.test/en/practice/guidelines/architecture-documentation',
      'https://x.test/nl/practice/guidelines/architecture-documentation',
    ]);
  });

  it('pairs each URL with its other-language version and an English x-default', () => {
    expect(entries[3].alternates?.languages).toEqual({
      en: 'https://x.test/en/practice/guidelines/architecture-documentation',
      nl: 'https://x.test/nl/practice/guidelines/architecture-documentation',
      'x-default': 'https://x.test/en/practice/guidelines/architecture-documentation',
    });
  });
});

describe('fallbackCanonical', () => {
  it('points a Dutch page at its English twin, and leaves an English page alone', () => {
    expect(fallbackCanonical('nl', '/work/cloud-gateway')).toEqual({ alternates: { canonical: '/en/work/cloud-gateway' } });
    expect(fallbackCanonical('nl', '')).toEqual({ alternates: { canonical: '/en' } });
    expect(fallbackCanonical('en', '/work')).toEqual({});
  });
});
