import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getDictionary } from '@/lib/dictionaries';
import { copyLocale } from '@/lib/i18n';

// US-0002: until the Dutch copy is approved, every Dutch address shows the English page under the
// fallback notice. The Dutch story removes or rewrites these tests when it brings the copy back.

describe('Dutch while its copy is unapproved', () => {
  it('has no Dutch dictionary text but the fallback notice', () => {
    const en = getDictionary('en');
    const nl = getDictionary('nl');
    expect({ ...nl, fallback: en.fallback }).toEqual(en);
    expect(nl.fallback.notice).not.toBe(en.fallback.notice);
  });

  it('holds no files under content/nl', () => {
    const dir = join(process.cwd(), 'content', 'nl');
    expect(existsSync(dir) ? readdirSync(dir) : []).toEqual([]);
  });

  it('shows English copy under /nl and leaves English alone', () => {
    expect(copyLocale('nl')).toBe('en');
    expect(copyLocale('en')).toBe('en');
  });
});
