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

const trackRecord = [
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
];
const trackRecordLinks = ['/work/cloud-gateway', '/work/cloud-gateway', '/work/integration-adapter', '/work#earlier-security-data-lake'];

const whatIDo = [
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
];
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
    expect(textOf(section(await home(l), 'track-record'))).toEqual(trackRecord);
  });

  it('shows What I do as the approved heading, line and six lines, and no other text', async () => {
    expect(textOf(section(await home(l), 'what-i-do'))).toEqual(whatIDo);
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
    const how = section(await home(l), 'how-i-work');
    expect(textOf(how)).toContain('In my own words.');
    expect(textOf(how)).toContain('Read more in Practice');
    expect(hrefsOf(how)).toEqual([`/${l}/practice`]);
  });
});

describe('the large text of a case study card', () => {
  it('is the same text as the row of that case study on the Work page', () => {
    for (const [slug, large] of [
      ['cloud-gateway', 'Many gateways, one platform'],
      ['integration-adapter', 'Under a working day'],
    ]) {
      const file = join(process.cwd(), 'content', 'en', 'work', `${slug}.md`);
      expect(parseFrontmatter(readFileSync(file, 'utf8')).data.large).toBe(large);
    }
  });
});
