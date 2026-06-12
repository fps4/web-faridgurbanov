import { promises as fs } from 'node:fs';
import path from 'node:path';
import { defaultLocale, locales, type Locale } from '@/lib/i18n';
import { parseFrontmatter, type Frontmatter } from '@/lib/frontmatter';

// Build-time markdown loader (FS-0001, US-0003). Reads files under content/{en,nl}/<section>/ and
// turns them into styled pages — frontmatter drives title, summary, ordering, and draft exclusion.
// This module touches the filesystem (node:fs), so it is server-only: import it from server
// components / generateStaticParams, never from a `'use client'` module.

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export interface ContentEntry {
  slug: string;
  data: Frontmatter;
  body: string;
  /** True when the requested locale had no file and we fell back to the default locale (ADR-0002). */
  isFallback: boolean;
}

export interface ContentMeta {
  slug: string;
  data: Frontmatter;
}

function str(data: Frontmatter, key: string): string {
  const v = data[key];
  return typeof v === 'string' ? v : '';
}

function num(data: Frontmatter, key: string): number {
  const v = data[key];
  return typeof v === 'number' ? v : Number.MAX_SAFE_INTEGER;
}

export const title = (data: Frontmatter) => str(data, 'title');
export const summary = (data: Frontmatter) => str(data, 'summary');
export const isDraft = (data: Frontmatter) => data.draft === true;

// The detail-page template (ContentArticle) already renders the frontmatter title as the page
// <h1>. Authored bodies conventionally repeat that title as a leading `# Heading`, which renders
// a second, duplicate <h1>. Drop a leading level-1 heading when its text matches the frontmatter
// title so the title appears exactly once. A body whose first heading differs is left untouched.
function stripDuplicateTitle(body: string, frontTitle: string): string {
  const m = body.match(/^\s*#\s+(.+?)[ \t]*\r?\n/);
  if (m && m[1].trim().toLowerCase() === frontTitle.trim().toLowerCase()) {
    return body.slice(m[0].length).replace(/^\s*\r?\n/, '');
  }
  return body;
}

async function readDir(section: string, locale: Locale): Promise<string[]> {
  try {
    const files = await fs.readdir(path.join(CONTENT_ROOT, locale, section));
    return files.filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
  } catch {
    return [];
  }
}

async function readFile(section: string, slug: string, locale: Locale): Promise<string | null> {
  try {
    return await fs.readFile(path.join(CONTENT_ROOT, locale, section, `${slug}.md`), 'utf8');
  } catch {
    return null;
  }
}

/** Every slug that exists for a section in any locale — the set for generateStaticParams. */
export async function sectionSlugs(section: string): Promise<string[]> {
  const perLocale = await Promise.all(locales.map((l) => readDir(section, l)));
  return [...new Set(perLocale.flat())];
}

/**
 * Load one entry, falling back to the default locale when the requested locale has no file
 * (ADR-0002 — never a silent 404). Returns null only when no locale has the file or it is a draft.
 */
export async function getEntry(
  section: string,
  slug: string,
  locale: Locale,
): Promise<ContentEntry | null> {
  let isFallback = false;
  let raw = await readFile(section, slug, locale);
  if (raw === null && locale !== defaultLocale) {
    raw = await readFile(section, slug, defaultLocale);
    isFallback = raw !== null;
  }
  if (raw === null) return null;

  const { data, body } = parseFrontmatter(raw);
  if (isDraft(data)) return null;
  return { slug, data, body: stripDuplicateTitle(body, title(data)), isFallback };
}

/**
 * List a section's entries for an index page, drafts excluded, sorted by `order` then `date`
 * (newest first) then title. Each entry resolves with the same locale fallback as getEntry.
 */
export async function listSection(section: string, locale: Locale): Promise<ContentMeta[]> {
  const slugs = await sectionSlugs(section);
  const entries = await Promise.all(slugs.map((slug) => getEntry(section, slug, locale)));
  return entries
    .filter((e): e is ContentEntry => e !== null)
    .map(({ slug, data }) => ({ slug, data }))
    .sort((a, b) => {
      const byOrder = num(a.data, 'order') - num(b.data, 'order');
      if (byOrder !== 0) return byOrder;
      const byDate = str(b.data, 'date').localeCompare(str(a.data, 'date'));
      if (byDate !== 0) return byDate;
      return title(a.data).localeCompare(title(b.data));
    });
}
