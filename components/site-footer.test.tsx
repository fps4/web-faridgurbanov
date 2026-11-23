import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SiteFooter } from '@/components/site-footer';
import { getDictionary } from '@/lib/dictionaries';
import { locales } from '@/lib/i18n';

// Maestro story art-4fzvp6bqm0: the footer holds the approved statement on how AI is used and link
// labels, and no other text.
// Maestro story art-r903t1r2tp: the footer's privacy line, "Privacy · Nothing about you is collected".
const privacyLine = { en: 'Nothing about you is collected', nl: 'Er wordt niets over je verzameld' };
const statement = {
  en: 'How AI is used here. The code and some notes on this site are built with AI assistance. The decisions and the client work are mine.',
  nl: 'Hoe AI hier is gebruikt. De code en een deel van de teksten op deze site zijn gemaakt met hulp van AI. De beslissingen en het werk voor klanten zijn van mij.',
};
const links = { en: ['Work', 'Practice', 'Contact'], nl: ['Werk', 'Praktijk', 'Contact'] };
const footerLabel = { en: 'Footer', nl: 'Voettekst' };

describe('the footer', () => {
  it.each(locales)('renders the approved statement and only link labels besides it, in %s', async (l) => {
    const html = renderToStaticMarkup(await SiteFooter({ locale: l }));
    const text = html
      .replace(/<[^>]+>/g, '\n')
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);
    const approved = [...links[l], 'LinkedIn', 'GitHub', 'Privacy', privacyLine[l], '·'];
    expect(text.filter((t) => t !== statement[l]).every((t) => approved.includes(t))).toBe(true);
    expect(text).toContain(statement[l]);
    expect(html).toContain(`aria-label="${footerLabel[l]}"`);
    for (const gone of ['Farid Gurbanov', 'Site', 'Connect', 'All rights reserved.', '©']) {
      expect(html).not.toContain(gone);
    }
  });

  it.each(locales)('names no References page, in %s', async (l) => {
    const html = renderToStaticMarkup(await SiteFooter({ locale: l }));
    expect(html).not.toMatch(/references/i);
  });

  it.each(locales)('reads the approved privacy line and leads it to the privacy page, in %s', async (l) => {
    const html = renderToStaticMarkup(await SiteFooter({ locale: l }));
    const row = html.match(/<div class="flex items-center gap-2">(.*?)<\/div>/)![1];
    expect(row.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).toBe(`Privacy · ${privacyLine[l]}`);
    expect(row).toContain(`href="/${l}/privacy"`);
  });

  it.each(locales)('leads its Contact link to the Contact part of the home page, in %s', async (l) => {
    const html = renderToStaticMarkup(await SiteFooter({ locale: l }));
    expect(html).toContain(`href="/${l}#contact"`);
    expect(html).not.toContain('/contact"');
  });

  it('keeps no tagline, built-with line, heading or copyright key in the dictionary', () => {
    const shell = getDictionary('en').shell as Record<string, unknown>;
    expect(shell.footerAiStatement).toBe(statement.en);
    for (const k of ['footerTagline', 'builtWith', 'footerNavHeading', 'footerConnectHeading', 'rights']) {
      expect(shell).not.toHaveProperty(k);
    }
  });
});
