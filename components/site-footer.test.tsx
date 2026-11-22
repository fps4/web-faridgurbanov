import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SiteFooter } from '@/components/site-footer';
import { getDictionary } from '@/lib/dictionaries';
import { locales } from '@/lib/i18n';

// Maestro story art-4fzvp6bqm0: the footer holds the approved statement on how AI is used and link
// labels, and no other text.
// Maestro story art-r903t1r2tp: the footer's privacy line, "Privacy · Nothing about you is collected".
const privacyLine = 'Nothing about you is collected';
const statement =
  'How AI is used here. The code and some notes on this site are built with AI assistance. The decisions and the client work are mine.';

describe('the footer', () => {
  it.each(locales)('renders the approved statement and only link labels besides it, in %s', async (l) => {
    const html = renderToStaticMarkup(await SiteFooter({ locale: l }));
    const text = html
      .replace(/<[^>]+>/g, '\n')
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);
    const links = ['Work', 'Practice', 'Contact', 'References', 'LinkedIn', 'GitHub', 'Privacy'];
    const approved = [...links, privacyLine, '·'];
    expect(text.filter((t) => t !== statement).every((t) => approved.includes(t))).toBe(true);
    expect(text).toContain(statement);
    for (const gone of ['Farid Gurbanov', 'Site', 'Connect', 'All rights reserved.', '©']) {
      expect(html).not.toContain(gone);
    }
  });

  it.each(locales)('reads the approved privacy line and leads it to the privacy page, in %s', async (l) => {
    const html = renderToStaticMarkup(await SiteFooter({ locale: l }));
    const row = html.match(/<div class="flex items-center gap-2">(.*?)<\/div>/)![1];
    expect(row.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).toBe('Privacy · Nothing about you is collected');
    expect(row).toContain(`href="/${l}/privacy"`);
  });

  it.each(locales)('leads its Contact link to the Contact part of the home page, in %s', async (l) => {
    const html = renderToStaticMarkup(await SiteFooter({ locale: l }));
    expect(html).toContain(`href="/${l}#contact"`);
    expect(html).not.toContain('/contact"');
  });

  it('keeps no tagline, built-with line, heading or copyright key in the dictionary', () => {
    const shell = getDictionary('en').shell as Record<string, unknown>;
    expect(shell.footerAiStatement).toBe(statement);
    for (const k of ['footerTagline', 'builtWith', 'footerNavHeading', 'footerConnectHeading', 'rights']) {
      expect(shell).not.toHaveProperty(k);
    }
  });
});
