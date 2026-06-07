import { describe, expect, it } from 'vitest';
import { stripFrontmatter } from '@/lib/frontmatter';

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
