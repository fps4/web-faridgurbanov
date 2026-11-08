import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { locales } from '@/lib/i18n';

// Writing moved under Practice (FS-0013). The 301s live in infra/docker/nginx.conf; this reads the
// regex locations out of it and checks that every old /writing URL, the index and each published
// article in both locales, lands on a page the export has. The slugs are the article files under
// content/<locale>/practice/articles/, which moved there from content/<locale>/writing/ unchanged.

const conf = readFileSync(join(process.cwd(), 'infra/docker/nginx.conf'), 'utf8');
const rules = [...conf.matchAll(/location ~ (\S+) \{\s*return 301 (\S+?)(?:\$is_args\$args)?;/g)].map(([, re, to]) => ({
  re: new RegExp(re),
  to,
}));

function redirect(path: string): string | null {
  for (const { re, to } of rules) {
    const m = re.exec(path);
    if (m) return to.replace(/\$(\d)/g, (_, i) => m[Number(i)]);
  }
  return null;
}

const articles = (locale: string) =>
  readdirSync(join(process.cwd(), 'content', locale, 'practice', 'articles'))
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
