import { describe, expect, it } from 'vitest';
import { locales } from '@/lib/i18n';
import { headerNav, hrefFor } from '@/lib/nav';

// The header is Work, Practice, Contact, in that order, in both locales (decision art-896t5kxfka §5,
// maestro story art-y97cjsakwq). Header and footer read headerNav(), so this guards both.
describe('the header navigation', () => {
  it('is exactly Work, Practice, Contact, in that order', () => {
    expect(headerNav().map((i) => i.href)).toEqual(['/work', '/practice', '/contact']);
    expect(headerNav().map((i) => i.label.en)).toEqual(['Work', 'Practice', 'Contact']);
  });

  it.each(locales)('links /%s/work, /%s/practice and /%s/contact', (l) => {
    expect(headerNav().map((i) => hrefFor(l, i.href))).toEqual([`/${l}/work`, `/${l}/practice`, `/${l}/contact`]);
  });
});
