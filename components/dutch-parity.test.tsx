import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import HomePage from '@/app/[locale]/page';
import WorkIndex from '@/app/[locale]/work/page';
import WorkPage from '@/app/[locale]/work/[slug]/page';
import PracticeIndex from '@/app/[locale]/practice/page';
import ArticlePage from '@/app/[locale]/practice/articles/[slug]/page';

vi.mock('next/navigation', () => ({ usePathname: () => '/nl' }));

// Maestro story art-j9e7z77xy0, AC-2: a Dutch page gives the same facts, figures and links, in the
// same order, as its English page. Two checks over every translated page, run as
//   npx vitest run components/dutch-parity.test.tsx
// 1. The links (`href`) of the Dutch page are the links of the English page in the same order, with
//    `/en` written `/nl`; an external link is the same.
// 2. The numbers (groups of digits) in the visible text of the Dutch page are those of the English
//    page, in the same order. A number written as a word in one of them is not a digit group and is
//    left to the page tests, which read the approved text.

type Render = (locale: string) => Promise<string>;
const params = (locale: string, slug?: string) => ({ params: Promise.resolve({ locale, slug: slug as string }) });
const html = (node: unknown) => renderToStaticMarkup(node as never);

const pages: [string, Render][] = [
  ['Home', async (l) => html(await HomePage(params(l)))],
  ['Work', async (l) => html(await WorkIndex(params(l)))],
  ['Cloud gateway', async (l) => html(await WorkPage(params(l, 'cloud-gateway')))],
  ['Integration adapter', async (l) => html(await WorkPage(params(l, 'integration-adapter')))],
  ['Practice', async (l) => html(await PracticeIndex(params(l)))],
  ['Simple first', async (l) => html(await ArticlePage(params(l, 'simple-first')))],
  ['When the security requirements do not exist yet', async (l) => html(await ArticlePage(params(l, 'when-the-security-requirements-do-not-exist-yet')))],
  ['AI multiplies an engineer who guides it', async (l) => html(await ArticlePage(params(l, 'ai-multiplies-an-engineer-who-guides-it')))],
  ['Behind the steering wheel', async (l) => html(await ArticlePage(params(l, 'behind-the-steering-wheel')))],
];

const hrefs = (h: string) => [...h.matchAll(/<a [^>]*?href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
const toNl = (href: string) => href.replace(/^\/en(?=$|[/#?])/, '/nl');
const decode = (s: string) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const numbers = (h: string) => decode(h.replace(/<[^>]+>/g, ' ')).match(/\d+(?:[.,]\d+)?/g) ?? [];

// The block skeleton of a page: the heading levels h1 to h3 in order, and the counts of sections,
// paragraphs, list items, figures and links. It says the Dutch page has the same parts as the English one.
function skeleton(h: string) {
  const count = (re: RegExp) => (h.match(re) ?? []).length;
  return {
    headings: [...h.matchAll(/<h([1-3])[\s>]/g)].map((m) => Number(m[1])),
    sections: count(/<section[\s>]/g),
    paragraphs: count(/<p[\s>]/g),
    listItems: count(/<li[\s>]/g),
    figures: count(/<figure[\s>]/g),
    links: count(/<a\s/g),
  };
}
// The one difference the approved copy makes: under "Wat het opleverde" it splits into two
// paragraphs what the English page has as one ("What it gave").
const extraDutchParagraphs: Record<string, number> = { 'Integration adapter': 1 };

describe.each(pages)('%s, Dutch against English', (_name, render) => {
  it('has the same links in the same order, `/en` written `/nl`, external links identical', async () => {
    const en = hrefs(await render('en'));
    const nl = hrefs(await render('nl'));
    expect(en.length).toBeGreaterThan(0);
    expect(nl).toEqual(en.map(toNl));
    for (const [i, href] of en.entries()) if (/^https?:/.test(href)) expect(nl[i]).toBe(href);
  });

  it('has the same block skeleton: headings, sections, paragraphs, list items, figures, links', async () => {
    const en = skeleton(await render('en'));
    const nl = skeleton(await render('nl'));
    expect(en.headings.length).toBeGreaterThan(0);
    expect(nl).toEqual({ ...en, paragraphs: en.paragraphs + (extraDutchParagraphs[_name] ?? 0) });
  });

  it('has the same numbers in the same order', async () => {
    const en = numbers(await render('en'));
    const nl = numbers(await render('nl'));
    expect(nl).toEqual(en);
  });
});
