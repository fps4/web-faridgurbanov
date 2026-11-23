import { describe, expect, it } from 'vitest';
import { getDictionary } from '@/lib/dictionaries';
import { copyLocale, hasDutch, localelessPath, localizeHref } from '@/lib/i18n';

// Maestro story art-j9e7z77xy0: Dutch is on for every page that has Dutch, and the privacy page stays
// English under the notice. The Dutch texts are the approved ones; every key of the English
// dictionary has a Dutch value, and the texts that no page shows today are the only English ones.
describe('the Dutch dictionary', () => {
  const en = getDictionary('en');
  const nl = getDictionary('nl');

  const keys = (o: unknown, prefix = ''): string[] =>
    typeof o === 'object' && o !== null
      ? Object.entries(o).flatMap(([k, v]) => keys(v, `${prefix}${prefix ? '.' : ''}${k}`))
      : [prefix];

  it('has the same keys as the English one', () => {
    expect(keys(nl).sort()).toEqual(keys(en).sort());
  });

  it('carries the approved Dutch for the chrome, the labels and the screen-reader labels', () => {
    expect(nl.shell.aria).toEqual({
      primary: 'Hoofdmenu',
      footer: 'Voettekst',
      language: 'Taal',
      articles: 'Artikelen',
      aboutArticle: 'Over dit artikel',
    });
    expect(nl.shell.skipToContent).toBe('Naar de inhoud');
    expect(nl.shell.themeToggle).toBe('Thema wisselen');
    expect(nl.home.primaryContact).toBe('Neem contact op');
    expect(nl.home.primaryWork).toBe('Bekijk het werk');
    expect(nl.references.readOnLinkedIn).toBe('Lees het op LinkedIn');
    expect(nl.references.inLanguage).toBe('In het {language}.');
    expect(nl.references.translatedFrom).toBe('Vertaald uit het {language}, met hun goedkeuring.');
    expect(nl.practice.back).toBe('← Praktijk');
    expect(nl.practice.comesFrom).toBe('Waar het vandaan komt');
    expect(nl.practice.barAll).toBe('Alles in Praktijk');
  });

  it('names English and Dutch only, with Dutch at the level the copy gives', () => {
    expect(nl.contact.languagesValue).toBe('Engels, Nederlands (B1)');
  });

  it('leaves out what the copy lists as not on the site', () => {
    const text = JSON.stringify(nl);
    for (const absent of ['INTROVIDEO', 'Download cv', 'Beschikbaar', 'door hem gekozen', 'De citaten blijven', 'vertaald uit het Engels']) {
      expect(text).not.toContain(absent);
    }
  });

  it('keeps the privacy page English, under the Dutch notice', () => {
    expect(nl.privacy).toEqual(en.privacy);
    expect(nl.fallback.notice).not.toBe(en.fallback.notice);
  });
});

describe('which pages have Dutch', () => {
  it('is every page but the privacy page', () => {
    for (const path of ['', '/work', '/work/cloud-gateway', '/practice', '/practice/articles/simple-first']) {
      expect(hasDutch(path), path).toBe(true);
      expect(copyLocale('nl', path), path).toBe('nl');
    }
    expect(hasDutch('/privacy')).toBe(false);
    expect(copyLocale('nl', '/privacy')).toBe('en');
  });

  it('shows English under /nl for a content page whose Dutch file is missing, and leaves English alone', () => {
    expect(copyLocale('nl', '/work/x', true)).toBe('en');
    expect(copyLocale('en', '/work/x')).toBe('en');
    expect(copyLocale('en', '/privacy')).toBe('en');
  });

  it('reads the locale-less path off a pathname', () => {
    expect(localelessPath('/nl')).toBe('');
    expect(localelessPath('/nl/')).toBe('');
    expect(localelessPath('/nl/privacy')).toBe('/privacy');
    expect(localelessPath('/en/work/cloud-gateway/')).toBe('/work/cloud-gateway');
    expect(localelessPath('/nl/work.html')).toBe('/work');
  });
});

describe('links written for the English pages', () => {
  it('stay inside the locale they are served under', () => {
    expect(localizeHref('/en/work/integration-platform', 'nl')).toBe('/nl/work/integration-platform');
    expect(localizeHref('/en/work#top', 'nl')).toBe('/nl/work#top');
    expect(localizeHref('/en', 'nl')).toBe('/nl');
    expect(localizeHref('/en/work/x', 'en')).toBe('/en/work/x');
  });

  it('leave other links alone', () => {
    for (const href of ['https://example.com/en/x', '/english', '/diagrams/a.svg', '#x', '/nl/work']) {
      expect(localizeHref(href, 'nl')).toBe(href);
    }
  });
});

// Maestro story art-9947n0hg99: the home page shows approved copy only. A text added here has to be
// approved in the site copy first, so a new key fails this test until the list is changed on purpose.
describe('home dictionary', () => {
  it('holds only the texts the home page shows', () => {
    expect(Object.keys(getDictionary('en').home).sort()).toEqual(
      [
        'heroEyebrow',
        'heroTitle',
        'heroIntro',
        'primaryContact',
        'primaryWork',
        'trackHeading',
        'trackLine',
        'trackCards',
        'whatHeading',
        'whatLine',
        'whatLines',
        'howHeading',
        'howLine',
        'howBody',
        'howCta',
        // art-cxvf6s5t94: the photo's alternative text and the line under it.
        'photoAlt',
        'photoPlace',
        'photoUnesco',
        'photoWikipedia',
      ].sort(),
    );
  });

  it('carries none of the withdrawn figures', () => {
    const text = JSON.stringify(getDictionary('en').home);
    for (const withdrawn of ['18–20', '250', '1.5B', '0.03', 'IBM API Connect']) {
      expect(text).not.toContain(withdrawn);
    }
  });
});
