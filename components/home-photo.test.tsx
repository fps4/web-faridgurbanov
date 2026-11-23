import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HomePage from '@/app/[locale]/page';
import { getDictionary } from '@/lib/dictionaries';
import { locales } from '@/lib/i18n';
import { HERO_PHOTO } from '@/lib/site';

// Maestro story art-cxvf6s5t94: a photo stands in the place of the intro video WHILE no video is
// configured. The strings below are the approved ones (site copy, "Home · other labels"): a text
// added or changed in the page fails here until the copy changes first.
const alt = 'Farid Gurbanov';
const place = 'Khinalug, Azerbaijan';
const unesco = { text: 'UNESCO World Heritage site', href: 'https://whc.unesco.org/en/list/1696' };
// The Dutch line under the photo, from the approved Dutch copy: "Khinalug, Azerbeidzjan · UNESCO-werelderfgoed · Wikipedia".
const line = {
  en: [`${place} ·`, unesco.text, '·', 'Wikipedia'],
  nl: ['Khinalug, Azerbeidzjan ·', 'UNESCO-werelderfgoed', '·', 'Wikipedia'],
};
const wikipedia = {
  text: 'Wikipedia',
  href: 'https://en.wikipedia.org/wiki/Khinalug#Addition_to_UNESCO_World_Heritage_List',
};

const render = async (locale: string) =>
  renderToStaticMarkup(await HomePage({ params: Promise.resolve({ locale }) }));
const figureOf = (html: string) => html.match(/<figure[\s\S]*?<\/figure>/)?.[0];
const textOf = (html: string) =>
  html
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);

describe.each(locales)('the photo on the home page, in %s', (l) => {
  it('stands in the hero, served from the site itself, with his name as alternative text', async () => {
    const figure = figureOf(await render(l));
    expect(figure, 'the home page has a photo').toBeDefined();
    const img = figure!.match(/<img[^>]*>/)![0];
    expect(img).toContain(`alt="${alt}"`);
    expect(img).toContain(`src="${HERO_PHOTO.src}"`);
    expect(img).toContain('width="800"');
    expect(img).toContain('height="1000"');
    expect(img).not.toMatch(/src="https?:/);
    expect(img).not.toContain('srcSet="http');
  });

  it('has one line under it with the place and the two links, and nothing else', async () => {
    const figure = figureOf(await render(l))!;
    expect(textOf(figure.replace(/<img[^>]*>/, ''))).toEqual(line[l]);
    expect(figure).toContain(`<a href="${unesco.href}" target="_blank" rel="noopener"`);
    expect(figure).toContain(`<a href="${wikipedia.href}" target="_blank" rel="noopener"`);
    expect((figure.match(/<a /g) ?? []).length).toBe(2);
    expect(figure).not.toMatch(/<(script|iframe|embed)/);
  });

  it('is loaded from nowhere but the site: no other address in the hero besides the two links', async () => {
    const html = await render(l);
    const hero = html.slice(0, html.indexOf('</section>'));
    const external = [...hero.matchAll(/(?:src|srcSet)="(https?:[^"]*)"/g)];
    expect(external).toEqual([]);
  });
});

describe('the photo file and its words', () => {
  it('is in public/media and holds no camera, date or location data', () => {
    const file = join(process.cwd(), 'public', HERO_PHOTO.src);
    expect(existsSync(file)).toBe(true);
    const bytes = readFileSync(file);
    expect(bytes.subarray(0, 2).toString('hex')).toBe('ffd8');
    // Exif and XMP both sit in an APP1 segment; a GPS block is inside Exif.
    expect(bytes.includes(Buffer.from('Exif'))).toBe(false);
    expect(bytes.includes(Buffer.from('http://ns.adobe.com/xap'))).toBe(false);
  });

  it('holds only the four approved texts, and Dutch has its own', () => {
    const t = getDictionary('en').home;
    expect([t.photoAlt, t.photoPlace, t.photoUnesco, t.photoWikipedia]).toEqual([
      alt,
      place,
      unesco.text,
      wikipedia.text,
    ]);
    const nl = getDictionary('nl').home;
    expect([nl.photoAlt, nl.photoPlace, nl.photoUnesco, nl.photoWikipedia]).toEqual([
      'Farid Gurbanov',
      'Khinalug, Azerbeidzjan',
      'UNESCO-werelderfgoed',
      'Wikipedia',
    ]);
  });
});

describe('when an intro video is configured', () => {
  afterEach(() => {
    vi.doUnmock('@/lib/site');
    vi.resetModules();
  });

  it('the video takes the place and the photo and its line are not rendered', async () => {
    vi.resetModules();
    vi.doMock('@/lib/site', async (orig) => ({
      ...(await orig<typeof import('@/lib/site')>()),
      INTRO_VIDEO: {
        src: '/media/intro.mp4',
        poster: '/media/intro-poster.jpg',
        captions: { en: '/media/intro.en.vtt', nl: '/media/intro.nl.vtt' },
        duration: '1:50',
      },
    }));
    const Page = (await import('@/app/[locale]/page')).default;
    const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ locale: 'en' }) }));
    expect(html).toContain('<video');
    // The hero is the first section; the references band further down has figures of its own.
    const hero = html.slice(0, html.indexOf('</section>'));
    expect(hero).not.toContain('<figure');
    expect(html).not.toContain(HERO_PHOTO.src);
    expect(html).not.toContain(unesco.href);
    expect(html).not.toContain(wikipedia.href);
    expect(html).not.toContain(place);
  });
});
