import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { releasedInSeries, series } from '@/lib/learning';
import { SOURCES_ROOT, readSources, sourcesProblems } from '@/lib/sources';

describe('episode sources', () => {
  it('reads every sources file without a problem', () => {
    for (const file of readdirSync(SOURCES_ROOT).filter((f) => f.endsWith('.yaml'))) {
      const episode = file.replace('.yaml', '').replace('-', '.');
      expect(() => readSources(episode), file).not.toThrow();
    }
  });

  it('names only episodes the plan has', () => {
    const planned = new Set(series.flatMap((s) => s.modules.flatMap((m) => m.episodes.map((e) => e.number))));
    for (const file of readdirSync(SOURCES_ROOT).filter((f) => f.endsWith('.yaml')))
      expect(planned.has(file.replace('.yaml', '').replace('-', '.')), file).toBe(true);
  });

  it('gives every switched-on episode with a deck its sources', () => {
    for (const s of series)
      for (const { episode } of releasedInSeries(s))
        if (episode.deck) expect(readSources(episode.number), `${episode.number} needs content/sources/${episode.deck}.yaml`).toBeDefined();
  });

  it('names what is wrong with a malformed file', () => {
    expect(sourcesProblems({})).toEqual(['the file must be a list of parts, each with `part` and `items`']);
    const problems = sourcesProblems([{ part: 'The case', items: [{ title: 'x', who: 'y', year: 2024, url: 'http://a', kind: 'blog' }] }]);
    expect(problems).toContain('The case, item 1 needs `note`');
    expect(problems).toContain('The case, item 1: `url` must start with https://');
    expect(problems.some((p) => p.includes('unknown `kind` "blog"'))).toBe(true);
  });
});
