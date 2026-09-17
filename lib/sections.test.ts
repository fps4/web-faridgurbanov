import { describe, expect, it } from 'vitest';
import { splitBeforeLastSection } from '@/lib/sections';

describe('splitBeforeLastSection', () => {
  it('splits at the last level-2 heading', () => {
    const body = '## Context\n\nA.\n\n## Who had to say yes\n\nB.\n\n## Role & stack\n\nC.\n';
    const { head, tail } = splitBeforeLastSection(body);
    expect(head).toBe('## Context\n\nA.\n\n## Who had to say yes\n\nB.\n');
    expect(tail).toBe('## Role & stack\n\nC.\n');
  });

  it('ignores headings inside fenced code blocks', () => {
    const body = '## One\n\ntext\n\n```md\n## not a heading\n```\n\n## Two\n\nend\n';
    const { head, tail } = splitBeforeLastSection(body);
    expect(tail).toBe('## Two\n\nend\n');
    expect(head).toContain('## not a heading');
  });

  it('leaves deeper headings alone', () => {
    const body = '## One\n\n### Sub\n\ntext\n';
    const { head, tail } = splitBeforeLastSection(body);
    expect(head).toBe('');
    expect(tail).toBe(body);
  });

  it('returns the whole body as head when there is no H2', () => {
    const body = '# Title\n\nJust prose.\n';
    expect(splitBeforeLastSection(body)).toEqual({ head: body, tail: '' });
  });

  it('round-trips: head + newline + tail reproduces the body', () => {
    const body = '## A\n\nx\n\n## B\n\ny';
    const { head, tail } = splitBeforeLastSection(body);
    expect(`${head}\n${tail}`).toBe(body);
  });
});
