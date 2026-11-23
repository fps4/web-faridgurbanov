import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/[locale]/page';
import { parseFrontmatter } from '@/lib/frontmatter';
import { locales } from '@/lib/i18n';
import { earlierWork } from '@/lib/site';

// Maestro story art-spqwxpsqc3: the Track record and What I do bands of the home page show the
// approved texts of the site copy ("Home · track record", "Home · What I do") and nothing else, in
// this order, and every link in them leads to a page that exists. The strings below are the
// approved ones: a text added or changed in the page fails here until the copy changes first.

const trackRecord: Record<'en' | 'nl', string[]> = { en: [
  'Track record',
  'Four numbers from my work. Each links to the work behind it.',
  'Many gateways, one platform',
  'One API platform on AWS and Azure. Around 10 teams use it, and they publish an API in minutes instead of days.',
  'Over a billion requests a month',
  'What the API platform handles today.',
  'Under a working day',
  'A new interface on the integration adapter is configuration. The first adapters run in production.',
  '5–10 TB a day',
  'A security data lake for a UK telecom operator. I designed it from the concept and proved it with a demo.',
], nl: [
  'Trackrecord',
  'Vier getallen uit mijn werk. Elk getal leidt naar het werk erachter.',
  'Veel gateways, één platform',
  'Eén API-platform op AWS en Azure. Ongeveer 10 teams gebruiken het, en ze publiceren een API in minuten in plaats van dagen.',
  'Meer dan een miljard verzoeken per maand',
  'Wat het API-platform nu verwerkt.',
  'Binnen één werkdag',
  'Een nieuwe interface op de integratie-adapter is configuratie. De eerste adapters draaien in productie.',
  '5–10 TB per dag',
  'Een security data lake voor een Britse telecomoperator. Ik heb het ontworpen vanaf het concept en bewezen met een demo.',
] };
const trackRecordLinks = ['/work/cloud-gateway', '/work/cloud-gateway', '/work/integration-adapter', '/work#earlier-security-data-lake'];

const whatIDo: Record<'en' | 'nl', string[]> = { en: [
  'What I do',
  'Each line leads to the work that shows it.',
  'API platforms',
  '· one way in for every system that calls another',
  'Cloud gateway',
  'Integration platforms',
  '· an interface via configuration',
  'Integration adapter',
  'Moving off legacy middleware',
  '· from vendor specific products to cloud native ones',
  'Both products',
  'Security of APIs',
  '· OAuth 2 as the standard, and not API keys',
  'Cloud gateway',
  'Getting teams to rely on a platform',
  '· when there is no direct mandate',
  'Simple first',
  'Data platforms, earlier',
  '· Kafka, Cloudera, Snowflake',
  'Earlier work',
], nl: [
  'Wat ik doe',
  'Elke regel leidt naar het werk dat het laat zien.',
  'API-platforms',
  '· één ingang voor elk systeem dat een ander systeem aanroept',
  'Cloud gateway',
  'Integratieplatforms',
  '· een interface via configuratie',
  'Integratie-adapter',
  'Weg van legacy middleware',
  '· van leverancierspecifieke producten naar cloud-native producten',
  'Beide producten',
  "Beveiliging van API's",
  '· OAuth 2 als standaard, en geen API-sleutels',
  'Cloud gateway',
  'Teams laten vertrouwen op een platform',
  '· als er geen direct mandaat is',
  'Eerst eenvoudig',
  'Dataplatforms, eerder',
  '· Kafka, Cloudera, Snowflake',
  'Eerder werk',
] };
const how = { en: ['In my own words.', 'Read more in Practice'], nl: ['In mijn eigen woorden.', 'Lees meer in Praktijk'] };
const whatIDoLinks = [
  '/work/cloud-gateway',
  '/work/integration-adapter',
  '/work',
  '/work/cloud-gateway',
  '/practice/articles/simple-first',
  '/work#earlier-work',
];

async function home(locale: string): Promise<string> {
  return renderToStaticMarkup(await HomePage({ params: Promise.resolve({ locale }) }));
}
function section(html: string, id: string): string {
  const m = html.match(new RegExp(`<section aria-labelledby="${id}"[\\s\\S]*?</section>`));
  expect(m, `the home page has the ${id} section`).not.toBeNull();
  return m![0];
}
const textOf = (html: string) =>
  html
    .replace(/&#x27;/g, "'")
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);
const hrefsOf = (html: string) => [...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]);

// A path under the locale segment is a page of the build, with its fragment on it.
function resolves(path: string): boolean {
  const [page, fragment] = path.split('#');
  const root = process.cwd();
  if (page === '/work') {
    return fragment === undefined || fragment === 'earlier-work' || earlierWork.some((e) => e.id === fragment);
  }
  const m = page.match(/^\/(work|practice\/articles)\/([a-z0-9-]+)$/);
  if (!m) return false;
  const file = join(root, 'content', 'en', m[1] === 'work' ? 'work' : 'practice/articles', `${m[2]}.md`);
  if (!existsSync(file)) return false;
  return parseFrontmatter(readFileSync(file, 'utf8')).data.draft !== true && fragment === undefined;
}

describe.each(locales)('the home page bands, in %s', (l) => {
  it('puts Track record and What I do between the introduction and How I work', async () => {
    const html = await home(l);
    const at = (needle: string) => html.indexOf(needle);
    expect(at('aria-labelledby="track-record"')).toBeGreaterThan(at('<h1'));
    expect(at('aria-labelledby="what-i-do"')).toBeGreaterThan(at('aria-labelledby="track-record"'));
    expect(at('aria-labelledby="how-i-work"')).toBeGreaterThan(at('aria-labelledby="what-i-do"'));
  });

  it('shows Track record as the approved heading, line and four cards, and no other text', async () => {
    expect(textOf(section(await home(l), 'track-record'))).toEqual(trackRecord[l]);
  });

  it('shows What I do as the approved heading, line and six lines, and no other text', async () => {
    expect(textOf(section(await home(l), 'what-i-do'))).toEqual(whatIDo[l]);
  });

  it('leads each card and each line to the work behind it, inside the locale', async () => {
    const html = await home(l);
    expect(hrefsOf(section(html, 'track-record'))).toEqual(trackRecordLinks.map((p) => `/${l}${p}`));
    expect(hrefsOf(section(html, 'what-i-do'))).toEqual(whatIDoLinks.map((p) => `/${l}${p}`));
  });

  it('leads only to pages and anchors that exist', () => {
    for (const p of [...trackRecordLinks, ...whatIDoLinks]) expect(resolves(p), p).toBe(true);
  });

  it('keeps the How I work line and the label of its link to Practice', async () => {
    const part = section(await home(l), 'how-i-work');
    expect(textOf(part)).toContain(how[l][0]);
    expect(textOf(part)).toContain(how[l][1]);
    expect(hrefsOf(part)).toEqual([`/${l}/practice`]);
  });
});

describe('the large text of a case study card', () => {
  it('is the same text as the row of that case study on the Work page', () => {
    for (const [locale, slug, large] of [
      ['en', 'cloud-gateway', 'Many gateways, one platform'],
      ['en', 'integration-adapter', 'Under a working day'],
      ['nl', 'cloud-gateway', 'Veel gateways, één platform'],
      ['nl', 'integration-adapter', 'Binnen één werkdag'],
    ]) {
      const file = join(process.cwd(), 'content', locale, 'work', `${slug}.md`);
      expect(parseFrontmatter(readFileSync(file, 'utf8')).data.large).toBe(large);
    }
  });
});
