import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { locales } from '@/lib/i18n';
import { EARLIER_WORK_ANCHOR } from '@/lib/site';

// Writing moved under Practice (FS-0013). The 301s live in infra/docker/nginx.conf; this reads the
// regex locations out of it and checks that every old /writing URL, the index and each published
// article in both locales, lands on a page the export has. The slugs are the article files under
// content/<locale>/practice/articles/, which moved there from content/<locale>/writing/ unchanged.

const conf = readFileSync(join(process.cwd(), 'infra/docker/nginx.conf'), 'utf8');
const rules = [...conf.matchAll(/location ~ (\S+) \{\s*return 301 (\S+?);/g)].map(([, re, to]) => ({
  re: new RegExp(re),
  to,
}));

function redirect(path: string): string | null {
  for (const { re, to } of rules) {
    const m = re.exec(path);
    // `$is_args$args` carries the query string through; a request has none here, so it is dropped.
    if (m) return to.replace('$is_args$args', '').replace(/\$(\d)/g, (_, i) => m[Number(i)]);
  }
  return null;
}

// A locale with no file of its own shows the English one (ADR-0002; maestro story art-bf5tq4788n: Dutch has none for
// now), so its articles are the English slugs.
const articles = (locale: string) =>
  readdirSync(
    join(process.cwd(), 'content', existsSync(join(process.cwd(), 'content', locale)) ? locale : 'en', 'practice', 'articles'),
  )
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));

describe('the /writing redirects', () => {
  it('finds the rules', () => {
    expect(rules.length).toBeGreaterThanOrEqual(2);
  });

  it.each(locales)('sends /%s/writing (and its trailing-slash and .html forms) to the Practice landing', (l) => {
    for (const old of [`/${l}/writing`, `/${l}/writing/`, `/${l}/writing.html`]) expect(redirect(old)).toBe(`/${l}/practice`);
  });

  it.each(locales)('sends every /%s/writing/<slug> to /practice/articles/<slug>', (l) => {
    const slugs = articles(l);
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      expect(redirect(`/${l}/writing/${slug}`)).toBe(`/${l}/practice/articles/${slug}`);
    }
  });

  it('leaves the new URLs alone', () => {
    expect(redirect('/en/practice')).toBeNull();
    expect(redirect('/en/practice/articles/who-had-to-say-yes')).toBeNull();
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
const forms = (base: string) => [base, `${base}/`, `${base}.html`];

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
    for (const kept of ['', '/work', '/work/cloud-gateway', '/work/integration-adapter', '/practice', '/contact', '/privacy', '/references']) {
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
