import { describe, expect, it } from 'vitest';
import { stripComments } from '@/lib/content';

describe('stripComments', () => {
  it('cuts an editor note and the line it stood on, leaving the prose', () => {
    expect(stripComments('\n<!-- NEEDS HUMAN REVIEW: draft -->\n\n## De regel\n')).toBe('\n\n## De regel\n');
  });

  it('cuts a comment spanning lines, and leaves a body without one unchanged', () => {
    expect(stripComments('a\n<!-- one\ntwo -->\nb')).toBe('a\nb');
    expect(stripComments('## The rule\n\nText.')).toBe('## The rule\n\nText.');
  });
});
