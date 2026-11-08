import { describe, expect, it } from 'vitest';
import { siteOrigin, sitemapEntries } from '@/lib/sitemap';

describe('siteOrigin', () => {
  it('prefers the deploy URL and drops a trailing slash, else uses the domain', () => {
    expect(siteOrigin('https://staging.example.com/', 'faridgurbanov.com')).toBe('https://staging.example.com');
    expect(siteOrigin(undefined, 'faridgurbanov.com')).toBe('https://faridgurbanov.com');
  });
});

describe('sitemapEntries', () => {
  const entries = sitemapEntries('https://x.test', ['', '/practice/guidelines/architecture-documentation']);

  it('lists every path once per locale', () => {
    expect(entries.map((e) => e.url)).toEqual([
      'https://x.test/en',
      'https://x.test/nl',
      'https://x.test/en/practice/guidelines/architecture-documentation',
      'https://x.test/nl/practice/guidelines/architecture-documentation',
    ]);
  });

  it('pairs each URL with its other-language version and an English x-default', () => {
    expect(entries[3].alternates.languages).toEqual({
      en: 'https://x.test/en/practice/guidelines/architecture-documentation',
      nl: 'https://x.test/nl/practice/guidelines/architecture-documentation',
      'x-default': 'https://x.test/en/practice/guidelines/architecture-documentation',
    });
  });
});
