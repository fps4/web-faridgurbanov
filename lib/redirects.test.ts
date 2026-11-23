import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseFrontmatter } from '@/lib/frontmatter';
import { locales } from '@/lib/i18n';
import { EARLIER_WORK_ANCHOR } from '@/lib/site';

// The earlier Practice pieces are unpublished (decision art-896t5kxfka §11, maestro story
// art-gdp0zjj9fd). The 301s live in infra/docker/nginx.conf; this reads the regex locations out of
// it and checks that every address of an unpublished piece, and every old /writing address (Practice
// was Writing before FS-0013), in both locales and in its trailing-slash and .html forms, lands on
// Practice in the same locale, and that none of the four published articles is redirected. The
// pieces are the files under content/en/practice/ marked `draft: true`, so a file marked draft
// later, or published later, has to be reflected in nginx.conf for this to pass.

const conf = readFileSync(join(process.cwd(), 'infra/docker/nginx.conf'), 'utf8');
const rules = [...conf.matchAll(/location ~ (\S+) \{\s*return 301 (\S+?);/g)].map(([, re, to]) => ({
  re: new RegExp(re),
  to,
}));

function redirect(path: string): string | null {
  for (const { re, to } of rules) {
    const m = re.exec(path);
    // `$is_args$args` carries the query string through; a request has none here, so it is dropped.
    if (m) return to.replace(/\$is_args\$args/g, '').replace(/\$(\d)/g, (_, i) => m[Number(i)]);
  }
  return null;
}

const practiceDir = (kind: string) => join(process.cwd(), 'content', 'en', 'practice', kind);
const slugsIn = (kind: string, draft: boolean) =>
  readdirSync(practiceDir(kind))
    .filter((f) => f.endsWith('.md'))
    .filter((f) => (parseFrontmatter(readFileSync(join(practiceDir(kind), f), 'utf8')).data.draft === true) === draft)
    .map((f) => f.replace(/\.md$/, ''));
const forms = (base: string) => [base, `${base}/`, `${base}.html`];

describe('the unpublished Practice pieces and the old /writing addresses', () => {
  it('finds the rules', () => {
    expect(rules.length).toBeGreaterThanOrEqual(3);
  });

  it('has the four published articles and the ten unpublished earlier ones', () => {
    expect(slugsIn('articles', false)).toHaveLength(4);
    expect(slugsIn('articles', true)).toHaveLength(10);
    expect(slugsIn('guidelines', true)).toHaveLength(3);
    expect(slugsIn('patterns', true)).toHaveLength(5);
    expect(slugsIn('guidelines', false).concat(slugsIn('patterns', false))).toEqual([]);
  });

  it.each(locales)('sends every unpublished article, in every form, to /%s/practice', (l) => {
    for (const slug of slugsIn('articles', true)) {
      for (const old of forms(`/${l}/practice/articles/${slug}`)) expect(redirect(old), old).toBe(`/${l}/practice`);
    }
  });

  it.each(locales)('sends every guideline and pattern, and their old index addresses, in every form, to /%s/practice', (l) => {
    const olds = [
      ...slugsIn('guidelines', true).flatMap((s) => forms(`/${l}/practice/guidelines/${s}`)),
      ...slugsIn('patterns', true).flatMap((s) => forms(`/${l}/practice/patterns/${s}`)),
      ...forms(`/${l}/practice/guidelines`),
      ...forms(`/${l}/practice/patterns`),
    ];
    for (const old of olds) expect(redirect(old), old).toBe(`/${l}/practice`);
  });

  it.each(locales)('sends /%s/writing and every old /writing/<slug>, in every form, to /%s/practice', (l) => {
    const slugs = [...slugsIn('articles', true), ...slugsIn('articles', false)];
    const olds = [...forms(`/${l}/writing`), ...slugs.flatMap((s) => forms(`/${l}/writing/${s}`))];
    for (const old of olds) {
      expect(redirect(old), old).toBe(`/${l}/practice`);
      expect(pageExists(redirect(old)!), old).toBe(true);
    }
  });

  it('lists in nginx.conf exactly the unpublished articles, no more and no fewer', () => {
    const m = /practice\/articles\/\(\?:([a-z0-9|-]+)\)/.exec(conf);
    expect(m, 'the article rule').not.toBeNull();
    expect(m![1].split('|').sort()).toEqual(slugsIn('articles', true).sort());
  });

  it.each(locales)('leaves Practice and the four published articles alone, in %s', (l) => {
    expect(redirect(`/${l}/practice`)).toBeNull();
    for (const slug of slugsIn('articles', false)) {
      for (const kept of forms(`/${l}/practice/articles/${slug}`)) {
        expect(redirect(kept), kept).toBeNull();
        expect(
          existsSync(join(process.cwd(), 'app', '[locale]', 'practice', 'articles', '[slug]', 'page.tsx')),
          kept,
        ).toBe(true);
      }
    }
    for (const kept of ['/practice/guidelines-notes', '/practice/patternsx', '/writing-notes', '/practice/articles/who-had-to-say-yes-too']) {
      expect(redirect(`/${l}${kept}`), kept).toBeNull();
    }
  });

  it('keeps the query string', () => {
    expect(conf).toMatch(/return 301 \/\$1\/practice\$is_args\$args;/);
  });
});

// Learning, Portfolio, Training and Expertise are removed (decision art-896t5kxfka, maestro story
// art-y97cjsakwq). Every old address under the first three goes to Work, every one under Expertise
// to the home page, in the same locale. A redirect that points at a page the export lacks is a live
// 404, so each target is checked against the routes the export is built from: a page exists when
// app/[locale]/<path>/page.tsx does (generateStaticParams of each emits both locales), and a target
// is never itself redirected.
const routeExists = (path: string) =>
  existsSync(join(process.cwd(), 'app', '[locale]', ...path.split('/').filter(Boolean), 'page.tsx'));
const pageExists = (address: string) => {
  const m = /^\/(en|nl)(\/.*)?$/.exec(address);
  return m !== null && (locales as readonly string[]).includes(m[1]) && routeExists(m[2] ?? '');
};

const expertiseSlugs = [
  'ai-and-automation',
  'apis-and-gateways',
  'architecture-decisions',
  'data-and-lakehouse',
  'event-driven-streaming',
  'integration-architecture',
  'stakeholder-alignment',
];
describe('the removed sections', () => {
  it.each(locales)('sends /%s/learning, /portfolio and /training, in every form, to Work', (l) => {
    const olds = [
      ...['learning', 'portfolio', 'training'].flatMap((s) => forms(`/${l}/${s}`)),
      ...forms(`/${l}/learning/hybrid-kafka-on-azure`),
      ...forms(`/${l}/learning/hybrid-kafka-on-azure/why-this-course`),
    ];
    for (const old of olds) {
      expect(redirect(old), old).toBe(`/${l}/work`);
      expect(pageExists(redirect(old)!), old).toBe(true);
    }
  });

  it.each(locales)('sends /%s/expertise and each of its seven pages, in every form, to the home page', (l) => {
    const olds = [...forms(`/${l}/expertise`), ...expertiseSlugs.flatMap((s) => forms(`/${l}/expertise/${s}`))];
    for (const old of olds) {
      expect(redirect(old), old).toBe(`/${l}`);
      expect(pageExists(redirect(old)!), old).toBe(true);
    }
  });

  it('keeps the query string', () => {
    expect(conf).toMatch(/return 301 \/\$1\/work\$is_args\$args;/);
    expect(conf).toMatch(/return 301 \/\$1\$is_args\$args;/);
  });

  it.each(locales)('never redirects a page it keeps, or a target of its own', (l) => {
    for (const kept of ['', '/work', '/work/cloud-gateway', '/work/integration-adapter', '/practice', '/privacy']) {
      expect(redirect(`/${l}${kept}`), kept).toBeNull();
    }
    expect(redirect(`/${l}/learning-notes`)).toBeNull();
    expect(redirect(`/${l}/work`)).toBeNull();
  });

  it('has no route left for a removed section', () => {
    for (const gone of ['learning', 'portfolio', 'training', 'expertise']) expect(routeExists(`/${gone}`), gone).toBe(false);
  });
});

// The Integration platform case study became the Integration adapter (decision art-896t5kxfka,
// maestro story art-dgsmfy8yb8): the old address in every form and locale goes to the new one in
// the same locale, and the new one is a page the export has (the entry's file is its slug).
describe('the renamed Integration adapter case study', () => {
  it.each(locales)('sends /%s/work/integration-platform, in every form, to /work/integration-adapter', (l) => {
    for (const old of forms(`/${l}/work/integration-platform`)) {
      expect(redirect(old), old).toBe(`/${l}/work/integration-adapter`);
    }
    expect(existsSync(join(process.cwd(), 'content', 'en', 'work', 'integration-adapter.md'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'content', 'en', 'work', 'integration-platform.md'))).toBe(false);
  });

  it('keeps the query string', () => {
    expect(conf).toMatch(/return 301 \/\$1\/work\/integration-adapter\$is_args\$args;/);
  });

  it.each(locales)('leaves the other Work addresses alone', (l) => {
    for (const kept of ['/work', '/work/cloud-gateway', '/work/integration-adapter', '/work/integration-platform-notes']) {
      expect(redirect(`/${l}${kept}`), kept).toBeNull();
    }
  });
});

// Contact is a part of the home page, not a page (maestro story art-r903t1r2tp): /contact in every
// form and locale answers 301 to the Contact part of the home page in the same locale, and that
// target is a page the export has. The old page's route is gone and the sitemap no longer lists it.
describe('the removed Contact page', () => {
  it.each(locales)('sends /%s/contact, in every form, to the Contact part of /%s', (l) => {
    for (const old of forms(`/${l}/contact`)) {
      expect(redirect(old), old).toBe(`/${l}#contact`);
      expect(pageExists(redirect(old)!.split('#')[0]), old).toBe(true);
    }
    expect(conf).toMatch(/return 301 \/\$1\$is_args\$args#contact;/);
  });

  it('keeps the query string, before the fragment', () => {
    expect(conf).toMatch(/location ~ \^\/\(en\|nl\)\/contact\S+ \{\s*return 301 \/\$1\$is_args\$args#contact;/);
  });

  it.each(locales)('leaves other addresses starting with contact alone, in %s', (l) => {
    for (const kept of ['/contact-us', '/contacts', '/privacy']) expect(redirect(`/${l}${kept}`), kept).toBeNull();
  });

  it('has no route left for the page, and no sitemap entry', () => {
    expect(routeExists('/contact')).toBe(false);
    expect(readFileSync(join(process.cwd(), 'app', 'sitemap.ts'), 'utf8')).not.toContain("'/contact'");
  });
});

// The three earlier case studies are removed (decision art-896t5kxfka, maestro story art-vvzsw9ap9e).
// Each old address, in every form and locale, answers 301 to the Earlier work list on /work in the
// same locale, with the fragment of the list; the list is a page the export has, with that anchor
// and an entry for the work each old study told.
describe('the removed Cloudera Kafka, SAP to Snowflake and SAP event backbone case studies', () => {
  const removed = ['cloudera-kafka', 'sap-snowflake', 'sap-event-backbone'];

  it.each(locales)('sends /%s/work/<old slug>, in every form, to the Earlier work list', (l) => {
    for (const slug of removed) {
      for (const old of forms(`/${l}/work/${slug}`)) {
        const to = redirect(old);
        expect(to, old).toBe(`/${l}/work#${EARLIER_WORK_ANCHOR}`);
        expect(pageExists(to!.replace(/#.*$/, '')), old).toBe(true);
      }
    }
  });

  it('keeps the query string, before the fragment', () => {
    expect(conf).toMatch(/return 301 \/\$1\/work\$is_args\$args#earlier-work;/);
  });

  it('leaves the pages that stay alone, and similar slugs', () => {
    for (const l of locales) {
      for (const kept of ['/work', '/work/cloud-gateway', '/work/integration-adapter', '/work/sap-snowflake-seam', '/work/cloudera-kafka-notes']) {
        expect(redirect(`/${l}${kept}`), kept).toBeNull();
      }
    }
  });

  it('has no case study file or diagram left, and the Earlier work anchor exists on the page', () => {
    for (const slug of removed) {
      expect(existsSync(join(process.cwd(), 'content', 'en', 'work', `${slug}.md`)), slug).toBe(false);
      expect(existsSync(join(process.cwd(), 'public', 'diagrams', `${slug}-pattern.svg`)), slug).toBe(false);
    }
    const page = readFileSync(join(process.cwd(), 'app', '[locale]', 'work', 'page.tsx'), 'utf8');
    expect(page).toContain('id={EARLIER_WORK_ANCHOR}');
    expect(EARLIER_WORK_ANCHOR).toBe('earlier-work');
  });
});

// The References page is removed (maestro story art-2ya5at7k1q): the references are a band of the
// home page. /references in every form and locale answers 301 to that band in the same locale, and
// the target is a page the export has.
describe('the removed References page', () => {
  it.each(locales)('sends /%s/references, in every form, to the references band of /%s', (l) => {
    for (const old of forms(`/${l}/references`)) {
      expect(redirect(old), old).toBe(`/${l}#references`);
      expect(pageExists(redirect(old)!.split('#')[0]), old).toBe(true);
    }
    expect(conf).toMatch(/return 301 \/\$1\$is_args\$args#references;/);
  });

  it('keeps the query string, before the fragment', () => {
    expect(conf).toMatch(/location ~ \^\/\(en\|nl\)\/references\S+ \{\s*return 301 \/\$1\$is_args\$args#references;/);
  });

  it('leads to an id the home page has', () => {
    const page = readFileSync(join(process.cwd(), 'app', '[locale]', 'page.tsx'), 'utf8');
    expect(page).toContain('id="references"');
  });

  it.each(locales)('leaves other addresses starting with references alone, in %s', (l) => {
    for (const kept of ['/references-list', '/referencesx', '/privacy']) expect(redirect(`/${l}${kept}`), kept).toBeNull();
  });

  it('has no route left for the page', () => {
    expect(routeExists('/references')).toBe(false);
  });
});
