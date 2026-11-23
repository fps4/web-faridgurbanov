import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/[locale]/page';
import { getDictionary } from '@/lib/dictionaries';
import { locales } from '@/lib/i18n';
import { site } from '@/lib/site';

// Maestro story art-r903t1r2tp: the Contact part of the home page shows the approved texts of the
// site copy ("Contact", and "Texts shown in the design that were missing above") and nothing else.
// The list below is the whole section: a text that is not in it fails, so a row or a line added
// without approval cannot get in.
// What a visitor without JavaScript sees for email: the existing `user [at] domain` fallback of
// ObfuscatedEmail, in a <noscript>. The address itself is never in the markup in clear.
const emailFallback = `${site.email.user} [at] ${site.email.domain}`;
const lede = {
  en: 'Write to me about an integration platform, an API platform, or a move off legacy middleware. A short message about what you are trying to get done is enough. I answer myself.',
  nl: 'Schrijf me over een integratieplatform, een API-platform of een overstap van legacy middleware. Een kort bericht over wat je wilt bereiken is genoeg. Ik antwoord zelf.',
};
// The Dutch is from the approved Dutch copy, "Contact" and "Labels en kleine teksten"; the rows
// "Beschikbaar" and "Cv" are not on the site.
const rows = {
  en: ['Send an email', 'How I contract', 'Freelance, through my own company', 'Based', 'Eindhoven, Netherlands', 'Languages', 'English, Dutch (B1)'],
  nl: ['Stuur een e-mail', 'Contractvorm', 'Freelance, via mijn eigen bedrijf', 'Standplaats', 'Eindhoven, Nederland', 'Talen', 'Engels, Nederlands (B1)'],
};

async function contactSection(locale: string): Promise<string> {
  const html = renderToStaticMarkup(await HomePage({ params: Promise.resolve({ locale }) }));
  const m = html.match(/<section id="contact"[\s\S]*?<\/section>/);
  expect(m, 'the home page has a Contact section').not.toBeNull();
  return m![0];
}
const textOf = (html: string) =>
  html
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);

describe.each(locales)('the Contact part of the home page, in %s', (l) => {
  it('shows the approved text, rows and buttons, and no other text (no Available, Résumé or other row)', async () => {
    expect(textOf(await contactSection(l))).toEqual([
      'Contact',
      lede[l],
      rows[l][0],
      emailFallback,
      'WhatsApp',
      'LinkedIn',
      ...rows[l].slice(1),
    ]);
  });

  it('keeps the email fallback for a visitor without JavaScript, in a noscript', async () => {
    const section = await contactSection(l);
    expect(section).toMatch(/<noscript><span[^>]*>[^<]*\[at\][^<]*<\/span><\/noscript>/);
    expect(section).toContain(emailFallback);
  });

  it('puts the address and the number together in the browser, and links LinkedIn', async () => {
    const section = await contactSection(l);
    expect(section).not.toContain(`${site.email.user}@${site.email.domain}`);
    expect(section).not.toContain('mailto:');
    expect(section).not.toContain('wa.me');
    expect(section).toContain(`href="${site.linkedin}"`);
  });
});

describe('the contact dictionary', () => {
  it('holds only the texts the Contact part shows', () => {
    expect(Object.keys(getDictionary('en').contact).sort()).toEqual(
      [
        'title',
        'lede',
        'contractLabel',
        'contractValue',
        'basedLabel',
        'basedValue',
        'languagesLabel',
        'languagesValue',
        'email',
        'whatsapp',
        'linkedin',
      ].sort(),
    );
  });
});
