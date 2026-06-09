import { describe, expect, it } from 'vitest';
import { parseFrontmatter, stripFrontmatter } from '@/lib/frontmatter';

describe('stripFrontmatter', () => {
  it('removes a leading YAML frontmatter block', () => {
    const md = '---\ntitle: Hello\norder: 1\n---\n# Body\n';
    expect(stripFrontmatter(md)).toBe('# Body\n');
  });

  it('leaves a doc without frontmatter untouched', () => {
    const md = '# Body only\n';
    expect(stripFrontmatter(md)).toBe(md);
  });

  it('does not strip a `---` that is not at the very start', () => {
    const md = '# Body\n\n---\n';
    expect(stripFrontmatter(md)).toBe(md);
  });
});

describe('parseFrontmatter', () => {
  it('parses scalars, coercing numbers and booleans', () => {
    const md = '---\ntitle: Hello\norder: 2\ndraft: true\n---\n# Body\n';
    const { data, body } = parseFrontmatter(md);
    expect(data).toEqual({ title: 'Hello', order: 2, draft: true });
    expect(body).toBe('# Body\n');
  });

  it('strips surrounding quotes from string values', () => {
    const md = '---\ntitle: "Hello: World"\nsummary: \'a quote\'\n---\nbody';
    const { data } = parseFrontmatter(md);
    expect(data.title).toBe('Hello: World');
    expect(data.summary).toBe('a quote');
  });

  it('parses inline arrays and keeps date-like strings as strings', () => {
    const md = '---\nstack: [AWS, Kafka, Terraform]\ndate: 2026-06-09\n---\nbody';
    const { data } = parseFrontmatter(md);
    expect(data.stack).toEqual(['AWS', 'Kafka', 'Terraform']);
    expect(data.date).toBe('2026-06-09');
  });

  it('returns empty data and the whole doc when there is no frontmatter', () => {
    const md = '# Body only\n';
    expect(parseFrontmatter(md)).toEqual({ data: {}, body: md });
  });
});
