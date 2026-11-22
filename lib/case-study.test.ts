import { describe, expect, it } from 'vitest';
import { parseFrontmatter } from '@/lib/frontmatter';
import { caseStudyFrontmatter } from '@/lib/case-study';

describe('caseStudyFrontmatter', () => {
  it('is null for an entry on the earlier shape, which has no intro', () => {
    expect(caseStudyFrontmatter({ title: 'T', role: 'R', client: 'C' })).toBeNull();
  });

  it('reads the fields of an entry on the case-study shape', () => {
    const { data } = parseFrontmatter(
      '---\ntitle: A: b\nintro: Intro line.\nsmall: Small line.\nfacts: [One | small one, Two words | small two, Three]\nrole: R.\nclient: C\nbuilt_with: X, Y, Z\n---\nbody',
    );
    expect(caseStudyFrontmatter(data)).toEqual({
      intro: 'Intro line.',
      small: 'Small line.',
      facts: [
        { large: 'One', small: 'small one' },
        { large: 'Two words', small: 'small two' },
        { large: 'Three', small: '' },
      ],
      role: 'R.',
      client: 'C',
      builtWith: 'X, Y, Z',
      next: null,
    });
  });

  it('leaves out what the entry does not carry', () => {
    const c = caseStudyFrontmatter({ intro: 'Intro.' });
    expect(c).toEqual({ intro: 'Intro.', small: null, facts: [], role: null, client: null, builtWith: null, next: null });
  });

  it('shows a next link only when both its slug and its label are set', () => {
    expect(caseStudyFrontmatter({ intro: 'I', next: 'other' })?.next).toBeNull();
    expect(caseStudyFrontmatter({ intro: 'I', next: 'other', next_label: 'Next: Other' })?.next).toEqual({
      slug: 'other',
      label: 'Next: Other',
    });
  });
});
