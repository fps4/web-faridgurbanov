import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import HomePage, { generateMetadata as homeMeta } from '@/app/[locale]/page';
import WorkIndex, { generateMetadata as workIndexMeta } from '@/app/[locale]/work/page';
import WorkPage, { generateMetadata as workMeta } from '@/app/[locale]/work/[slug]/page';
import PracticeIndex, { generateMetadata as practiceMeta } from '@/app/[locale]/practice/page';
import ArticlePage, { generateMetadata as articleMeta } from '@/app/[locale]/practice/articles/[slug]/page';
import PrivacyPage, { generateMetadata as privacyMeta } from '@/app/[locale]/privacy/page';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import sitemap from '@/app/sitemap';
import { languageNote } from '@/components/reference-quote';
import { parseReference } from '@/lib/references';

vi.mock('next/navigation', () => ({ usePathname: () => '/nl' }));

// Maestro story art-j9e7z77xy0: every page that has Dutch shows the approved Dutch under /nl, with no
// fallback notice, and the English under /en; the privacy page stays English under /nl, under the
// notice. The Dutch strings below are the approved ones (the approved Dutch copy: Home, Werk, Praktijk
// and "Labels en kleine teksten"): a text changed in a page fails here until the copy changes first.

type Meta = (a: { params: Promise<{ locale: string; slug?: string }> }) => Promise<{ alternates?: unknown }>;
interface Page {
  name: string;
  /** Locale-less path. */
  path: string;
  render: (locale: string) => Promise<string>;
  meta: (locale: string) => Promise<{ alternates?: unknown }>;
  nl: string[];
  en: string[];
}

const html = (node: unknown) => renderToStaticMarkup(node as never);
const slugPage = (
  component: (a: { params: Promise<{ locale: string; slug: string }> }) => Promise<unknown>,
  meta: Meta,
  slug: string,
) => ({
  render: async (locale: string) => html(await component({ params: Promise.resolve({ locale, slug }) })),
  meta: (locale: string) => meta({ params: Promise.resolve({ locale, slug }) }),
});

const pages: Page[] = [
  {
    name: 'Home',
    path: '',
    render: async (locale) => html(await HomePage({ params: Promise.resolve({ locale }) })),
    meta: (locale) => homeMeta({ params: Promise.resolve({ locale }) }),
    nl: ['Platform- en integratiearchitect', 'Neem contact op', 'Bekijk het werk', 'Ik breek een complex probleem op, breng er structuur in'],
    en: ['Platform and Integration Architect', 'Start a conversation', 'See the work', 'I break and structure a complex problem'],
  },
  {
    name: 'Work',
    path: '/work',
    render: async (locale) => html(await WorkIndex({ params: Promise.resolve({ locale }) })),
    meta: (locale) => workIndexMeta({ params: Promise.resolve({ locale }) }),
    nl: [
      'Twee platformproducten die ik vanaf de eerste versie heb gebouwd',
      'Waar het staat:',
      'Eerder werk, kort',
      'Ook gebouwd',
      'Mijn eigen aantekeningen en labs van het leren van hybride Kafka op Azure, module voor module.',
      'Security data lake voor een Britse telecomoperator',
    ],
    en: ['Two platform products that I built from the first version', 'Where it stands:', 'Earlier work, short', 'Also built', 'Security data lake for a UK telecom operator'],
  },
  {
    name: 'Cloud gateway',
    path: '/work/cloud-gateway',
    ...slugPage(WorkPage, workMeta as Meta, 'cloud-gateway'),
    nl: ['Cloud gateway: één API-platform op twee clouds', '← Al het werk', 'Waar het begon', 'Mijn rol', 'Gebouwd met', 'Lijkt dit op jouw situatie?', 'Volgende: Integratie-adapter'],
    en: ['Cloud gateway: one API platform on two clouds', '← All work', 'Where it started', 'My role', 'Built with', 'Does this look like your situation?', 'Next: Integration adapter'],
  },
  {
    name: 'Integration adapter',
    path: '/work/integration-adapter',
    ...slugPage(WorkPage, workMeta as Meta, 'integration-adapter'),
    nl: ['Integratie-adapter: een interface via configuratie', 'Wat het opleverde', 'De belastingtest hield meer dan 100 berichten per seconde vol.', 'Volgende: Cloud gateway'],
    en: ['Integration adapter: an interface via configuration', 'What it gave', 'The load test held more than 100 messages a second.', 'Next: Cloud gateway'],
  },
  {
    name: 'Practice',
    path: '/practice',
    render: async (locale) => html(await PracticeIndex({ params: Promise.resolve({ locale }) })),
    meta: (locale) => practiceMeta({ params: Promise.resolve({ locale }) }),
    nl: ['Hoe ik werk en wat ik ervan vind.', 'Waar het vandaan komt', 'Drie minuten lezen', 'Twee minuten lezen', 'Achter het stuur'],
    en: ['How I work and what I think about it.', 'Where it comes from', 'Three-minute read', 'Two-minute read', 'Behind the steering wheel'],
  },
  {
    name: 'Simple first',
    path: '/practice/articles/simple-first',
    ...slugPage(ArticlePage, articleMeta as Meta, 'simple-first'),
    nl: ['Eerst eenvoudig: waarom ik de adapter niet op een groter integratieproduct heb gebouwd', '← Praktijk', '22 november 2026', 'Hoe het is geschreven', 'Zie je het anders, of heb je hetzelfde probleem?', 'Alles in Praktijk'],
    en: ['Simple first: why I did not build the adapter on a bigger integration product', '← Practice', '22 November 2026', 'Written how', 'Do you see it differently, or do you have the same problem?', 'All of Practice'],
  },
  {
    name: 'When the security requirements do not exist yet',
    path: '/practice/articles/when-the-security-requirements-do-not-exist-yet',
    ...slugPage(ArticlePage, articleMeta as Meta, 'when-the-security-requirements-do-not-exist-yet'),
    nl: ['Als de beveiligingseisen nog niet bestaan', 'Een security data lake voor een Britse telecomoperator', 'Het liep goed af. Beveiliging gaf akkoord.'],
    en: ['When the security requirements do not exist yet', 'A security data lake for a UK telecom operator', 'It did end well. Security signed off.'],
  },
  {
    name: 'AI multiplies an engineer who guides it',
    path: '/practice/articles/ai-multiplies-an-engineer-who-guides-it',
    ...slugPage(ArticlePage, articleMeta as Meta, 'ai-multiplies-an-engineer-who-guides-it'),
    nl: ['AI versterkt een engineer die het stuurt', 'Mijn dagelijks werk', 'En in mijn oplossingen vertrouw ik op deterministische processen en tests, en niet op een LLM.'],
    en: ['AI multiplies an engineer who guides it', 'My daily work', 'And in my solutions I rely on deterministic processes and tests rather than on an LLM.'],
  },
  {
    name: 'Behind the steering wheel',
    path: '/practice/articles/behind-the-steering-wheel',
    ...slugPage(ArticlePage, articleMeta as Meta, 'behind-the-steering-wheel'),
    nl: ['Achter het stuur', 'Mijn eigen projecten', 'Twee minuten lezen'],
    en: ['Behind the steering wheel', 'My own projects', 'Two-minute read'],
  },
];

const decode = (s: string) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const visible = (h: string) => decode(h.replace(/<[^>]+>/g, '\n'));

// The parts of the Dutch copy that the lead listed as not on the site (AC-9). Only the strings that
// would show up in a page are listed; the intro video's place holds no text of its own.
const notOnTheSite = [
  'INTROVIDEO',
  'KOMT LATER',
  'Download cv',
  'Cv: download de pdf',
  'Beschikbaar',
  'door hem gekozen',
  'De citaten blijven in de taal',
  'De Nederlandse teksten zijn vertaald uit het Engels',
];

describe.each(pages)('$name', (page) => {
  it('shows the approved Dutch under /nl and the English under /en', async () => {
    const nl = visible(await page.render('nl'));
    const en = visible(await page.render('en'));
    for (const t of page.nl) expect(nl, t).toContain(t);
    for (const t of page.en) expect(en, t).toContain(t);
    for (const t of page.en.slice(0, 1)) expect(nl, t).not.toContain(t);
  });

  it('has no fallback notice under /nl, and the page text is not marked English', async () => {
    for (const locale of ['nl', 'en']) {
      // A quote of another person keeps the language it was written in, and says so with `lang`.
      const h = (await page.render(locale)).replace(/<blockquote lang="en"/g, '<blockquote');
      expect(h).not.toContain('role="note"');
      expect(h).not.toContain('lang="en"');
      expect(h).not.toContain('Deze pagina is nog niet vertaald');
    }
  });

  it('shows none of what the copy lists as not on the site', async () => {
    const nl = visible(await page.render('nl'));
    for (const t of notOnTheSite) expect(nl, t).not.toContain(t);
  });

  it('is its own page, paired with its English page, in the head of both', async () => {
    for (const locale of ['nl', 'en']) {
      expect((await page.meta(locale)).alternates).toEqual({
        canonical: `/${locale}${page.path}`,
        languages: { en: `/en${page.path}`, nl: `/nl${page.path}`, 'x-default': `/en${page.path}` },
      });
    }
  });

  it('is listed in the sitemap under /en and /nl as a pair', async () => {
    const entries = await sitemap();
    const origin = new URL(entries[0].url).origin;
    for (const locale of ['en', 'nl']) {
      const entry = entries.find((e) => e.url === `${origin}/${locale}${page.path}`);
      expect(entry, `${locale}${page.path}`).toBeDefined();
      expect(entry!.alternates?.languages).toEqual({
        en: `${origin}/en${page.path}`,
        nl: `${origin}/nl${page.path}`,
        'x-default': `${origin}/en${page.path}`,
      });
    }
  });
});

describe('a quote on the Dutch home page', () => {
  it('stays English and is marked as English, with the line under it in Dutch', async () => {
    const h = html(await HomePage({ params: Promise.resolve({ locale: 'nl' }) }));
    expect([...h.matchAll(/<blockquote lang="en"/g)]).toHaveLength(2);
    expect(visible(h)).toContain('I had the pleasure of working with Farid Gurbanov');
    expect(visible(h)).toContain('we werken samen in het integratieplatformteam');
    expect(visible(h)).not.toContain('In het Engels');
  });
});

describe('the language note of a quote on a case study', () => {
  const ref = (extra: string) =>
    parseReference(
      'x',
      `---\nname: A B\nrole: R\ncontext: c\nlinkedin: https://www.linkedin.com/in/x/\ndate: 2026-01-01\nreviewed: 2026-01-01\n${extra}---\n\nquote`,
    )!;

  it('is Dutch under /nl, from the approved labels', () => {
    expect(languageNote(ref('lang: en\n'), 'nl')).toBe('In het Engels.');
    expect(languageNote(ref('lang: en\n'), 'en')).toBeNull();
    expect(languageNote(ref('lang: nl\n'), 'en')).toBe('In Dutch.');
    expect(languageNote(ref('lang: nl\n'), 'nl')).toBeNull();
    expect(languageNote(ref('lang: en\ntranslated_from: de\n'), 'nl')).toBe('Vertaald uit het Duits, met hun goedkeuring.');
  });
});

describe('the labels for screen readers', () => {
  const label = (h: string, l: string) => expect(h).toContain(`aria-label="${l}"`);

  it('are Dutch on a Dutch page and English on an English one', async () => {
    const list = async (locale: string) => html(await PracticeIndex({ params: Promise.resolve({ locale }) }));
    const article = async (locale: string) =>
      html(await ArticlePage({ params: Promise.resolve({ locale, slug: 'simple-first' }) }));
    label(await list('nl'), 'Artikelen');
    label(await list('en'), 'Articles');
    label(await article('nl'), 'Over dit artikel');
    label(await article('en'), 'About this article');
  });
});

describe('the privacy page', () => {
  const render = async (locale: string) => html(await PrivacyPage({ params: Promise.resolve({ locale }) }));

  it('shows the English page under /nl, under the Dutch notice, and marks the text as English', async () => {
    const h = await render('nl');
    const notice = h.match(/<div role="note" lang="nl"[^>]*>([^<]*)<\/div>/);
    expect(notice, 'the notice').not.toBeNull();
    expect(notice![1]).toBe('Deze pagina is nog niet vertaald. Je ziet de Engelse versie.');
    expect(h).toContain('<div lang="en">');
    expect(visible(h)).toContain('This is a static website.');
    expect(visible(h)).toContain('Last updated: 23 November 2026');
  });

  it('shows no notice under /en', async () => {
    expect(await render('en')).not.toContain('role="note"');
  });

  it('points to the English page as the original, with no pair', async () => {
    expect(await privacyMeta({ params: Promise.resolve({ locale: 'nl' }) })).toMatchObject({
      alternates: { canonical: '/en/privacy' },
    });
    expect(((await privacyMeta({ params: Promise.resolve({ locale: 'nl' }) })).alternates as object)).not.toHaveProperty('languages');
    expect((await privacyMeta({ params: Promise.resolve({ locale: 'en' }) })).alternates).toBeUndefined();
  });

  it('is in the sitemap under /en and not under /nl', async () => {
    const urls = (await sitemap()).map((e) => e.url);
    expect(urls.some((u) => u.endsWith('/en/privacy'))).toBe(true);
    expect(urls.filter((u) => u.includes('/nl/privacy'))).toEqual([]);
    const entry = (await sitemap()).find((e) => e.url.endsWith('/en/privacy'));
    expect(entry?.alternates).toBeUndefined();
  });
});

describe('the shell of a Dutch page', () => {
  it('says Werk, Praktijk and Contact in the top bar, and the footer has the Dutch statement and privacy line', async () => {
    const header = visible(html(await SiteHeader({ locale: 'nl' })));
    for (const t of ['Werk', 'Praktijk', 'Contact']) expect(header).toContain(t);
    expect(header).not.toContain('Werkwijze');
    const footer = visible(html(await SiteFooter({ locale: 'nl' })));
    expect(footer).toContain('Er wordt niets over je verzameld');
    expect(footer).toContain('Hoe AI hier is gebruikt.');
  });
});

describe('the sitemap', () => {
  it('lists every translated page twice and the privacy page once', async () => {
    const urls = (await sitemap()).map((e) => e.url);
    expect(urls).toHaveLength(pages.length * 2 + 1);
  });
});
