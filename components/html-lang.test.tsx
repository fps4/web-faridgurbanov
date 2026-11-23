import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HtmlLang } from '@/components/html-lang';

let pathname = '/nl';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

// Maestro story art-j9e7z77xy0: <html lang> follows the page, not the site: Dutch on a page that has
// Dutch, English on /nl/privacy (the English page under the notice) and on every /en page.
describe('the language of the document', () => {
  afterEach(() => {
    document.documentElement.lang = '';
  });

  it.each([
    ['/nl', 'nl', 'nl'],
    ['/nl/work/cloud-gateway', 'nl', 'nl'],
    ['/nl/practice/articles/simple-first/', 'nl', 'nl'],
    ['/nl/privacy', 'nl', 'en'],
    ['/en/privacy', 'en', 'en'],
    ['/en/work', 'en', 'en'],
  ] as const)('%s is marked %s', (path, locale, lang) => {
    pathname = path;
    render(<HtmlLang locale={locale} />);
    expect(document.documentElement.lang).toBe(lang);
  });
});
