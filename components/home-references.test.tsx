import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/[locale]/page';
import sitemap from '@/app/sitemap';
import { getDictionary } from '@/lib/dictionaries';
import { locales } from '@/lib/i18n';
import { headerNav } from '@/lib/nav';
import { parseReference } from '@/lib/references';
import { site } from '@/lib/site';

// Maestro story art-2ya5at7k1q: the references band of the home page shows the approved texts of the
// site copy ("References on Home") and nothing else: the heading, two quotes in the people's own
// words, the name of each linked to their profile, the line under it, and the link to the
// recommendations. The References page is gone: no nav, footer or sitemap names it. The strings
// below are the approved ones: a text changed in the page or in a reference file fails here until
// the copy changes first.

const heading = 'What people I worked with say';
const cards = [
  {
    name: 'Muktar Bashir',
    profile: 'https://www.linkedin.com/in/muktar-bashir-82069943/',
    quote: [
  "“I had the pleasure of working with Farid Gurbanov […] on the design and delivery of a large-scale Big Data platform. Farid was instrumental in shaping the platform architecture, producing high-quality technical designs, and ensuring complex data and security monitoring requirements were translated into robust, scalable solutions.",
  "Farid combines strong technical depth with a pragmatic delivery mindset. He has an exceptional ability to navigate complex architectural challenges, collaborate effectively across teams, and maintain a relentless focus on quality and business outcomes. [A] colleague who consistently leads by example. I would highly recommend him to any organisation looking for a technology leader and architect.”"
],
    line: "AI & Data Lead, Accenture · worked together on a data platform for a UK telecom operator",
  },
  {
    name: 'Anup Janardhanan',
    profile: 'https://www.linkedin.com/in/anup-janardhanan-97b5b6143/',
    quote: [
  "“[…] From a technical perspective, he has a very strong understanding of cloud technologies, both AWS and Azure. What stands out to me is not just his technical knowledge, but the depth of his architectural thinking. He is someone who takes the time to understand the bigger picture and think through solutions carefully. Can single-handedly design, develop, test and deploy a product. His recent enthusiasm for an AI-driven world is evident in the effective and thoughtful ways he incorporates AI into his work. […]”"
],
    line: "Enterprise Integration Specialist · we work together in the integration platform team",
  },
];
const readIt = 'Read it on LinkedIn';

const home = async (locale: string) => renderToStaticMarkup(await HomePage({ params: Promise.resolve({ locale }) }));
const decode = (s: string) => s.replace(/&amp;/g, '&');
const textOf = (html: string) =>
  decode(html)
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);
function band(html: string): string {
  const m = html.match(/<section id="references"[\s\S]*?<\/section>/);
  expect(m, 'the home page has the references band').not.toBeNull();
  return m![0];
}
const figures = (html: string) => [...html.matchAll(/<figure[\s\S]*?<\/figure>/g)].map((m) => m[0]);

describe.each(locales)('the references band of the home page, in %s', (l) => {
  it('sits after How I work and before Contact, under the id the redirect leads to', async () => {
    const html = await home(l);
    const at = (needle: string) => html.indexOf(needle);
    expect(at('id="references"')).toBeGreaterThan(at('aria-labelledby="how-i-work"'));
    expect(at('id="contact"')).toBeGreaterThan(at('id="references"'));
  });

  it('has the approved heading, no line under it, and no button', async () => {
    const b = band(await home(l));
    const text = textOf(b);
    expect(text[0]).toBe(heading);
    expect(b).toContain('<h2');
    expect(b).not.toContain('<button');
    // After the heading come the two cards and nothing else.
    const inCards = textOf(figures(b).join('\n'));
    expect(text.slice(1)).toEqual(inCards);
  });

  it('shows each quote exactly, with the name linked to the profile and the line under it', async () => {
    const b = band(await home(l));
    const figs = figures(b);
    expect(figs).toHaveLength(2);
    for (const card of cards) {
      const fig = figs.find((f) => f.includes(card.name));
      expect(fig, card.name).toBeDefined();
      expect(textOf(fig!)).toEqual([...card.quote, card.name, card.line, readIt]);
      expect(fig).toContain(`<a href="${card.profile}" rel="noopener" target="_blank"`);
      expect(fig).toContain(`<a href="${site.linkedinRecommendations}" rel="noopener" target="_blank"`);
    }
  });

  it('shows no photo, no initials, no date and no years on a card', async () => {
    const b = band(await home(l));
    expect(b).not.toContain('<img');
    expect(b).not.toContain('aria-hidden');
    expect(textOf(b).join(' ')).not.toMatch(/worked together \d|\b(19|20)\d\d\b/);
  });

  it('lays two cards side by side on a wide screen and stacks them on a narrow one', async () => {
    expect(band(await home(l))).toMatch(/class="grid [^"]*md:grid-cols-2/);
  });
});

describe('the reference files', () => {
  const dir = join(process.cwd(), 'content', 'references');
  it('hold the approved words, whole, with every cut marked', () => {
    for (const [slug, card] of [
      ['muktar-bashir', cards[0]],
      ['anup-janardhanan', cards[1]],
    ] as const) {
      const ref = parseReference(slug, readFileSync(join(dir, `${slug}.md`), 'utf8'))!;
      expect(ref.quote).toBe(card.quote.join('\n\n').replace(/^“/, '').replace(/”$/, ''));
      expect(ref.featured).toBe(true);
      expect(ref.linkedin).toBe(card.profile);
    }
  });

  it('hold no draft of a third person', () => {
    const files = readdirSync(dir).sort();
    expect(files).toEqual(['_template.md', 'anup-janardhanan.md', 'muktar-bashir.md']);
  });
});

describe('no References page', () => {
  it('is named by no header entry', () => {
    expect(JSON.stringify(headerNav())).not.toMatch(/references/i);
  });

  it('is in no sitemap entry', async () => {
    const urls = (await sitemap()).map((e) => e.url);
    expect(urls.length).toBeGreaterThan(0);
    expect(urls.filter((u) => /references/i.test(u))).toEqual([]);
  });
});

describe('the privacy page', () => {
  const p = getDictionary('en').privacy;
  it('carries the approved date and the References sentence', () => {
    expect(p.lastUpdated).toBe('Last updated: 23 November 2026');
    expect(p.body).toContain(
      '**References:** the home page quotes people I have worked with, with their name, their role and a link to LinkedIn. The same words are recommendations on my LinkedIn profile. Each of them agreed to that before it went live, and any of them can have it taken down by emailing me.',
    );
  });

  it('names no References page, no photo and no contact page', () => {
    for (const gone of ['references page', 'photo', 'contact page', 'message box']) expect(p.body).not.toContain(gone);
  });

  it('shows the same English text under /nl until the Dutch is approved', () => {
    expect(getDictionary('nl').privacy).toEqual(p);
  });
});
