import { describe, expect, it } from 'vitest';
import {
  RELEASED,
  deckIsReleased,
  episodeSlug,
  learningPath,
  moduleIsOpen,
  openModules,
  releasedEpisodes,
  releasedInSeries,
  series,
  seriesBySlug,
  seriesIsOpen,
} from '@/lib/learning';
import { headerNav } from '@/lib/nav';
import { learningVisible } from '@/lib/site';

describe('the switched-on list (RELEASED)', () => {
  it('names only series that exist', () => {
    for (const slug of Object.keys(RELEASED)) expect(seriesBySlug(slug), slug).toBeDefined();
  });

  it('names only episodes their series plans, each once', () => {
    for (const [slug, numbers] of Object.entries(RELEASED)) {
      const planned = seriesBySlug(slug)!.modules.flatMap((m) => m.episodes.map((e) => e.number));
      for (const n of numbers) expect(planned, `${slug} has no episode ${n}`).toContain(n);
      expect(new Set(numbers).size, `${slug} lists an episode twice`).toBe(numbers.length);
    }
  });

  it('switches on only episodes that have their opening lines and card written', () => {
    for (const s of series)
      for (const { episode } of releasedInSeries(s)) {
        expect(episode.promise, `${episode.number} needs its "In this episode" lines`).toBeDefined();
        expect(episode.takeaway, `${episode.number} needs its closing card`).toBeDefined();
      }
  });
});

describe('what opens', () => {
  const design = seriesBySlug('ai-product-design')!;
  const delivery = seriesBySlug('ai-product-delivery')!;

  it('opens a module, and its series, once one of its episodes is switched on', () => {
    const data = design.modules.find((m) => m.number === 3)!;
    expect(moduleIsOpen(design, data)).toBe(true);
    expect(releasedEpisodes(design, data).map((e) => e.number)).toEqual(['3.1']);
    expect(openModules(design).map((m) => m.number)).toEqual([3]);
    expect(seriesIsOpen(design)).toBe(true);
  });

  it('keeps a series with nothing switched on closed', () => {
    expect(seriesIsOpen(delivery)).toBe(false);
    expect(releasedInSeries(delivery)).toEqual([]);
  });

  it('serves a deck in production only for a switched-on episode', () => {
    expect(deckIsReleased('3-1')).toBe(true);
    expect(deckIsReleased('3-2')).toBe(false);
  });
});

describe('the routes', () => {
  it('gives every episode a unique slug within its module', () => {
    for (const s of series)
      for (const m of s.modules) {
        const slugs = m.episodes.map(episodeSlug);
        expect(new Set(slugs).size, `${s.slug}/${m.slug}`).toBe(slugs.length);
        for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      }
  });

  it('builds the episode path from series, module and title', () => {
    const design = seriesBySlug('ai-product-design')!;
    const data = design.modules.find((m) => m.number === 3)!;
    const episode = data.episodes.find((e) => e.number === '3.1')!;
    expect(learningPath.episode(design, data, episode)).toBe('/learning/ai-product-design/data-and-model-requirements/data-requirements');
  });
});

describe('the gate', () => {
  it('shows the section under next dev and hides it in a production build while unpublished', () => {
    expect(learningVisible('development')).toBe(true);
    expect(learningVisible('production')).toBe(false);
    expect(headerNav(true)[0]?.href).toBe('/learning');
    expect(headerNav(false).some((item) => item.href === '/learning')).toBe(false);
  });
});
