import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
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

// The two case studies (art-13yb9kshaw, art-dgsmfy8yb8). Inline lists are split on every comma
// (lib/frontmatter.ts), so each fact must come out whole, and each case leads to the other.
describe('the two case studies', () => {
  const read = (slug: string) => {
    const { data } = parseFrontmatter(readFileSync(join(process.cwd(), 'content/en/work', `${slug}.md`), 'utf8'));
    return caseStudyFrontmatter(data)!;
  };

  it('reads four whole facts from each', () => {
    expect(read('cloud-gateway').facts).toHaveLength(4);
    expect(read('integration-adapter').facts).toEqual([
      { large: 'Under a working day', small: 'for a new interface to be live' },
      { large: 'Half the time', small: 'to deploy an integration' },
      { large: '2–3 times lower', small: 'cost of an integration' },
      { large: '100+ a second', small: 'messages held in the load test' },
    ]);
  });

  it('keeps built_with whole', () => {
    expect(read('integration-adapter').builtWith).toBe('AWS Lambda, SNS/SQS, S3, DynamoDB, JSONata, Terraform, Datadog');
  });

  it('leads each case to the other, to a page that exists', () => {
    expect(read('cloud-gateway').next).toEqual({ slug: 'integration-adapter', label: 'Next: Integration adapter' });
    expect(read('integration-adapter').next).toEqual({ slug: 'cloud-gateway', label: 'Next: Cloud gateway' });
    for (const slug of ['cloud-gateway', 'integration-adapter']) {
      expect(existsSync(join(process.cwd(), 'content/en/work', `${read(slug).next!.slug}.md`))).toBe(true);
    }
  });
});
