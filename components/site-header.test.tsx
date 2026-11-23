import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { SiteHeader } from '@/components/site-header';
import { locales } from '@/lib/i18n';

vi.mock('next/navigation', () => ({ usePathname: () => '/en' }));

// Maestro story art-26rhtzey62: the top bar takes the design's sizes. The name is 19px semibold in
// the heading typeface; Work, Practice and Contact are 17px medium in the page text colour, each a
// target at least 44px high; the language link is 15px.
describe('the header', () => {
  it.each(locales)('renders the name and the three links with the design sizes, in %s', (l) => {
    const html = renderToStaticMarkup(SiteHeader({ locale: l }));

    const name = html.match(/<a [^>]*class="([^"]*)"[^>]*aria-label="Farid Gurbanov[^"]*"/)!;
    expect(name[1]).toContain('text-[19px]');
    expect(name[1]).toContain('font-semibold');
    expect(name[1]).toContain('font-heading');

    const nav = html.match(/<nav aria-label="Primary"[^>]*class="([^"]*)">(.*?)<\/nav>/)!;
    expect(nav[1]).toContain('text-base');
    const links = [...nav[2].matchAll(/<a [^>]*class="([^"]*)"[^>]*>(.*?)<\/a>/g)];
    expect(links).toHaveLength(3);
    for (const [, cls] of links) {
      expect(cls).toContain('font-medium');
      expect(cls).toContain('text-foreground');
      expect(cls).not.toContain('text-muted-foreground');
      expect(cls).toContain('py-[11px]');
    }

    const lang = html.match(/<nav aria-label="Language"[^>]*class="([^"]*)"/)!;
    expect(lang[1]).toContain('text-[15px]');
  });
});
