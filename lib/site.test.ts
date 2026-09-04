import { describe, expect, it } from 'vitest';
import { locales } from '@/lib/i18n';
import { repos } from '@/lib/site';

// The portfolio cards render side by side in a three-column grid (FS-0005), so their bodies have to
// stay comparable in length: one long card makes its neighbours look thin and nobody reads any of
// them. The budget is deliberately a range rather than a ceiling — a one-line card is as wrong as an
// essay. See the doc comment on `Repo.proves` for the shape that fits.
const PROVES_MIN_WORDS = 35;
const PROVES_MAX_WORDS = 75;

const words = (s: string) => s.trim().split(/\s+/).length;

describe('portfolio repo cards', () => {
  it.each(repos.map((repo) => [repo.slug, repo] as const))('%s stays within the copy budget', (_slug, repo) => {
    for (const locale of locales) {
      const count = words(repo.proves[locale]);
      expect(count).toBeGreaterThanOrEqual(PROVES_MIN_WORDS);
      expect(count).toBeLessThanOrEqual(PROVES_MAX_WORDS);
    }
  });

  it('keeps the cards comparable to each other', () => {
    for (const locale of locales) {
      const counts = repos.map((repo) => words(repo.proves[locale]));
      // No card may be more than twice the length of the shortest one.
      expect(Math.max(...counts)).toBeLessThanOrEqual(2 * Math.min(...counts));
    }
  });

  it('has a unique slug per repo', () => {
    expect(new Set(repos.map((repo) => repo.slug)).size).toBe(repos.length);
  });
});
