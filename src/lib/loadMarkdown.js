import path from 'path';
import fs from 'fs/promises';
import matter from 'gray-matter';

import { CONFIG } from 'src/global-config';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export async function loadMarkdown({ lang, slugSegments = [] }) {
  if (!lang) {
    throw new Error('Language is required to load markdown content.');
  }

  const segments = Array.isArray(slugSegments) ? slugSegments : [slugSegments];
  const filePath = path.join(CONTENT_ROOT, lang, ...segments);
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(raw);

  return { content, frontMatter: data ?? {}, filePath };
}

export function resolvePageTitle(frontMatter) {
  const overrideTitle = frontMatter?.pagetitle ?? frontMatter?.pageTitle;
  if (overrideTitle) {
    return overrideTitle;
  }

  const rawTitle = frontMatter?.title;
  if (!rawTitle) {
    return CONFIG.appNameShort;
  }

  return `${rawTitle} - ${CONFIG.appNameShort}`;
}

export function resolvePageDescription(frontMatter) {
  return frontMatter?.metaDescription ?? frontMatter?.subtitle ?? undefined;
}

export function resolveHeading(frontMatter) {
  return frontMatter?.heading ?? frontMatter?.title ?? '';
}
