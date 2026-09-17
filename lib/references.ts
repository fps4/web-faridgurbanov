import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parseFrontmatter, type Frontmatter } from '@/lib/frontmatter';
import { defaultLocale, type Locale } from '@/lib/i18n';

// References (FS-0009, ADR-0009): people the owner worked with, quoted in their own words and
// linked to their public LinkedIn profile. Each one is a markdown file under content/references/
// — locale-less, because a quote is never translated (only the role line is) — with the person's
// details in flat frontmatter and the quote as the body. Curated by hand: there is no LinkedIn
// API for other members' profiles, hotlinked photos expire, and the badge script would put
// LinkedIn's cookies on every page (FS-0007), so the role and photo are a dated snapshot of the
// engagement, reviewed by hand (`reviewed:`), and the profile link carries whatever they do now.
//
// `loadReferences` touches the filesystem, so it is server-only like lib/content.ts. The parse and
// validation helpers are pure and unit-tested; lib/references.test.ts also validates every real
// file, so a bad reference fails `npm run test` before it can fail the build.

const REFERENCES_DIR = path.join(process.cwd(), 'content', 'references');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

export interface Reference {
  slug: string;
  name: string;
  /** Role during the engagement, per locale (`role_nl` falls back to `role`). Never a current title. */
  role: Record<Locale, string>;
  /** The years worked together, as written, e.g. '2021–2023'. */
  years: string;
  /** Their public profile: https://www.linkedin.com/in/<handle>/ */
  linkedin: string;
  /** The case-study slug (content/{en,nl}/work/<slug>.md) this reference is about. */
  work: string;
  /** ISO date the reference was written. */
  date: string;
  /** Language of the quote as shown (BCP-47: 'en', 'nl', 'de' …). */
  lang: string;
  /** Set when the quote shown is a translation approved by the person; the original's language. */
  translatedFrom: string | null;
  /** Path under public/, e.g. '/references/first-last.jpg'; null renders initials instead. */
  photo: string | null;
  /** Featured references also appear on the home page (at most FEATURED_MAX). */
  featured: boolean;
  /** True when the same text is a recommendation on the owner's LinkedIn profile. */
  verified: boolean;
  /** ISO date the role, photo and link were last checked against the person. */
  reviewed: string;
  /** The quote, verbatim, one paragraph. */
  quote: string;
}

// Quote budgets. Every reference reads as a block on the case study and the references page;
// the featured ones also sit side by side on the home page, so they follow the tile budget from
// AGENTS.md (35–75 words). The wider band is for the person's own words — trim only with their OK.
export const QUOTE_MIN_WORDS = 30;
export const QUOTE_MAX_WORDS = 90;
export const FEATURED_MIN_WORDS = 35;
export const FEATURED_MAX_WORDS = 75;
/** The home band is two columns; a third featured card would wrap onto a row of its own. */
export const FEATURED_MAX = 2;

const LINKEDIN_PROFILE = /^https:\/\/(www\.)?linkedin\.com\/in\/[^/\s?#]+\/?$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const LANG_TAG = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;

export const wordCount = (s: string): number => s.trim().split(/\s+/).filter(Boolean).length;

function str(data: Frontmatter, key: string): string {
  const v = data[key];
  return typeof v === 'string' ? v.trim() : '';
}

/** Parse one reference file. Returns null for a draft (the template ships as one). */
export function parseReference(slug: string, raw: string): Reference | null {
  const { data, body } = parseFrontmatter(raw);
  if (data.draft === true) return null;
  const role = str(data, 'role');
  return {
    slug,
    name: str(data, 'name'),
    role: { en: role, nl: str(data, 'role_nl') || role },
    years: str(data, 'years'),
    linkedin: str(data, 'linkedin'),
    work: str(data, 'work'),
    date: str(data, 'date'),
    lang: str(data, 'lang') || 'en',
    translatedFrom: str(data, 'translated_from') || null,
    photo: str(data, 'photo') || null,
    featured: data.featured === true,
    verified: data.verified === true,
    reviewed: str(data, 'reviewed'),
    quote: body.trim(),
  };
}

/** Everything wrong with a reference, as messages; empty when it is fit to publish. */
export function validateReference(ref: Reference): string[] {
  const problems: string[] = [];
  if (!ref.name) problems.push('name is required');
  if (!ref.role.en) problems.push('role is required');
  if (!ref.years) problems.push('years is required');
  if (!LINKEDIN_PROFILE.test(ref.linkedin)) {
    problems.push('linkedin must be a public profile URL (https://www.linkedin.com/in/<handle>/)');
  }
  if (!ref.work) problems.push('work must name a case-study slug');
  if (!ISO_DATE.test(ref.date)) problems.push('date must be YYYY-MM-DD');
  if (!ISO_DATE.test(ref.reviewed)) problems.push('reviewed must be YYYY-MM-DD');
  if (!LANG_TAG.test(ref.lang)) problems.push('lang must be a language tag such as en, nl or de');
  if (ref.translatedFrom !== null && !LANG_TAG.test(ref.translatedFrom)) {
    problems.push('translated_from must be a language tag');
  }
  if (ref.photo !== null && !/^\/references\/[\w.-]+\.(jpe?g|png|webp)$/.test(ref.photo)) {
    problems.push('photo must be a file under public/references/, e.g. /references/first-last.jpg');
  }
  const words = wordCount(ref.quote);
  const [min, max] = ref.featured
    ? [FEATURED_MIN_WORDS, FEATURED_MAX_WORDS]
    : [QUOTE_MIN_WORDS, QUOTE_MAX_WORDS];
  if (words < min || words > max) {
    problems.push(`quote is ${words} words; ${ref.featured ? 'a featured' : 'a'} reference needs ${min}–${max}`);
  }
  if (/\n\s*\n/.test(ref.quote)) problems.push('quote must be a single paragraph');
  return problems;
}

/** Problems across the whole set: the home band's column count, and slug uniqueness. */
export function validateReferenceSet(refs: Reference[]): string[] {
  const problems: string[] = [];
  const featured = refs.filter((r) => r.featured);
  if (featured.length > FEATURED_MAX) {
    problems.push(`${featured.length} references are featured; the home band holds ${FEATURED_MAX}`);
  }
  const slugs = new Set(refs.map((r) => r.slug));
  if (slugs.size !== refs.length) problems.push('reference slugs must be unique');
  return problems;
}

/** Sort newest first, then by name, so the order is stable and needs no `order:` field. */
export function sortReferences(refs: Reference[]): Reference[] {
  return [...refs].sort((a, b) => b.date.localeCompare(a.date) || a.name.localeCompare(b.name));
}

/**
 * A language name in the reader's locale, for the "In English." note shown when a quote is not in
 * the page's language. Falls back to the tag itself if ICU has no name for it.
 */
export function languageName(tag: string, locale: Locale): string {
  try {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(tag) ?? tag;
  } catch {
    return tag;
  }
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Every published reference, validated and sorted. WHILE the folder holds only drafts (or does
 * not exist) this resolves to [] and every surface that shows references renders nothing —
 * the same "ships dark" pattern as INTRO_VIDEO. Throws on an invalid file so the build fails
 * with the reason rather than publishing a half-filled card.
 */
export async function loadReferences(): Promise<Reference[]> {
  let files: string[];
  try {
    files = (await fs.readdir(REFERENCES_DIR)).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }
  const refs: Reference[] = [];
  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = await fs.readFile(path.join(REFERENCES_DIR, file), 'utf8');
    const ref = parseReference(slug, raw);
    if (!ref) continue;
    const problems = validateReference(ref);
    if (ref.photo && !(await exists(path.join(PUBLIC_DIR, ref.photo)))) {
      problems.push(`photo ${ref.photo} is not in public/`);
    }
    // EN is the required locale; NL may fall back to it (ADR-0002), so only EN is checked.
    if (!(await exists(path.join(process.cwd(), 'content', defaultLocale, 'work', `${ref.work}.md`)))) {
      problems.push(`work "${ref.work}" has no case study`);
    }
    if (problems.length) throw new Error(`content/references/${file}: ${problems.join('; ')}`);
    refs.push(ref);
  }
  const setProblems = validateReferenceSet(refs);
  if (setProblems.length) throw new Error(`content/references: ${setProblems.join('; ')}`);
  return sortReferences(refs);
}

export const featuredReferences = (refs: Reference[]) => refs.filter((r) => r.featured);
export const referencesFor = (refs: Reference[], work: string) => refs.filter((r) => r.work === work);
