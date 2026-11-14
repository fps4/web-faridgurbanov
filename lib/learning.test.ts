import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  RELEASED,
  courseVideosLive,
  isoDuration,
  plainText,
  transcriptSection,
  videoStructuredData,
  learningPath,
  learningSitemapPaths,
  pagedEpisodes,
  releasedEpisodes,
  series,
  seriesBySlug,
  seriesHasPage,
  seriesIsOpen,
  type Series,
} from '@/lib/learning';
import { headerNav, learningNav } from '@/lib/nav';
import { learningVisible, LEARNING_PUBLISHED } from '@/lib/site';

// The Learning section (FS-0012): the release list, what opens, the routes and the gate.

describe('the release list', () => {
  it('names only courses that exist', () => {
    for (const slug of Object.keys(RELEASED)) expect(seriesBySlug(slug), slug).toBeDefined();
  });

  it('names only episodes the course plans, each once', () => {
    for (const [slug, numbers] of Object.entries(RELEASED)) {
      const s = seriesBySlug(slug)!;
      const planned = new Set(s.episodes.map((e) => e.number));
      for (const n of numbers) expect(planned.has(n), `${slug} episode ${n}`).toBe(true);
      expect(new Set(numbers).size, slug).toBe(numbers.length);
    }
  });

  it('switches an episode on only with its YouTube video and "In this episode" lines', () => {
    for (const s of series) {
      for (const e of releasedEpisodes(s)) {
        expect(e.video, `${s.slug} ${e.number} video`).toBeDefined();
        expect(e.video!.youtubeId, `${s.slug} ${e.number} youtube id`).toMatch(/^[A-Za-z0-9_-]{11}$/);
        if (e.video!.poster) expect(e.video!.poster, `${s.slug} ${e.number} poster`).toMatch(/^\/(?!\/)/);
        expect(e.promise?.length ?? 0, `${s.slug} ${e.number} promise`).toBeGreaterThanOrEqual(2);
        expect(e.video!.uploaded, `${s.slug} ${e.number} upload date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(() => isoDuration(e.video!.duration), `${s.slug} ${e.number} running time`).not.toThrow();
      }
    }
  });

  it('switches an episode on only with its transcript and its poster', () => {
    for (const s of series) {
      for (const e of releasedEpisodes(s)) {
        const file = path.join(process.cwd(), 'content', 'en', transcriptSection(s), `${e.slug}.md`);
        expect(existsSync(file), `${s.slug} ${e.number} transcript at ${file}`).toBe(true);
        const poster = path.join(process.cwd(), 'public', e.video!.poster ?? 'missing');
        expect(existsSync(poster), `${s.slug} ${e.number} poster file`).toBe(true);
      }
    }
  });
});

describe('the structured data', () => {
  it('writes running times in ISO 8601', () => {
    expect(isoDuration('3:07')).toBe('PT3M7S');
    expect(isoDuration('8:00')).toBe('PT8M');
    expect(isoDuration('0:45')).toBe('PT45S');
    expect(isoDuration('1:02:05')).toBe('PT1H2M5S');
    expect(() => isoDuration('3m07')).toThrow();
  });

  it('turns a transcript into plain text, one paragraph per block', () => {
    expect(plainText('\n## The situation\n\nHi.\nSecond line.\n\nNext.')).toBe('The situation\n\nHi. Second line.\n\nNext.');
  });

  it('describes an episode video without loading YouTube, and only with a poster', () => {
    const episode = {
      number: '0',
      slug: 'why',
      title: 'Why',
      line: 'The line.',
      video: { youtubeId: 'ci4eOUho0mM', duration: '3:07', poster: '/media/p.jpg', uploaded: '2026-11-13' },
    };
    const data = videoStructuredData('https://example.org', 'https://example.org/en/x', episode, '## A\n\nSaid.');
    expect(data).toMatchObject({
      '@type': 'VideoObject',
      name: 'Why',
      thumbnailUrl: 'https://example.org/media/p.jpg',
      uploadDate: '2026-11-13',
      duration: 'PT3M7S',
      embedUrl: 'https://www.youtube-nocookie.com/embed/ci4eOUho0mM',
      transcript: 'A\n\nSaid.',
    });
    expect(videoStructuredData('https://example.org', 'x', { ...episode, video: { ...episode.video, poster: undefined } })).toBeUndefined();
  });
});

describe('the plan', () => {
  it('gives every course a unique slug, and every episode a unique number and slug within its course', () => {
    expect(new Set(series.map((s) => s.slug)).size).toBe(series.length);
    for (const s of series) {
      expect(new Set(s.episodes.map((e) => e.number)).size, s.slug).toBe(s.episodes.length);
      expect(new Set(s.episodes.map((e) => e.slug)).size, s.slug).toBe(s.episodes.length);
      for (const e of s.episodes) expect(e.slug, `${s.slug} ${e.number}`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('gives a course card either a list of episodes or a size', () => {
    for (const s of series) expect(s.episodes.length > 0 || Boolean(s.size), s.slug).toBe(true);
  });

  it('links the repo only over https', () => {
    for (const s of series) if (s.repo) expect(s.repo).toMatch(/^https:\/\//);
  });
});

const course: Series = {
  slug: 'test-course',
  title: 'Test course',
  line: 'A course for the tests.',
  episodes: [
    { number: '0', slug: 'intro', title: 'Intro', line: 'The intro.' },
    { number: '1', slug: 'first', title: 'First', line: 'The first.' },
  ],
};

describe('what opens', () => {
  it('keeps a course with nothing switched on closed, and without a page outside the dev server', () => {
    expect(seriesIsOpen(course)).toBe(false);
    expect(seriesHasPage(course, false)).toBe(false);
    expect(pagedEpisodes(course, false)).toEqual([]);
  });

  it('gives every planned episode a page while previewing under the dev server', () => {
    expect(seriesHasPage(course, true)).toBe(true);
    expect(pagedEpisodes(course, true).map((e) => e.number)).toEqual(['0', '1']);
  });

  it('builds the routes from the slugs', () => {
    expect(learningPath.series(course)).toBe('/learning/test-course');
    expect(learningPath.episode(course, course.episodes[1])).toBe('/learning/test-course/first');
  });
});

describe('the gate', () => {
  it('shows the section under the dev server, and in production only once published', () => {
    expect(learningVisible('development')).toBe(true);
    expect(learningVisible('production')).toBe(LEARNING_PUBLISHED);
  });

  it('puts Learning first in the header only while the section shows', () => {
    expect(headerNav(true)[0]).toBe(learningNav);
    expect(headerNav(false)).not.toContain(learningNav);
  });

  it('names the YouTube player on the privacy page only once a video is live', () => {
    expect(courseVideosLive(false)).toBe(false);
    const anyLive = series.some((s) => releasedEpisodes(s).some((e) => e.video));
    expect(courseVideosLive(true)).toBe(anyLive);
  });

  it('lists nothing in the sitemap until the section is published', () => {
    expect(learningSitemapPaths(false)).toEqual([]);
    const published = learningSitemapPaths(true);
    expect(published[0]).toBe('/learning');
    for (const s of series.filter((x) => !seriesIsOpen(x))) {
      expect(published.some((p) => p.startsWith(learningPath.series(s))), s.slug).toBe(false);
    }
  });
});
