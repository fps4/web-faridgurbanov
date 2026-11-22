'use client';

import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { localizeHref, type Locale } from '@/lib/i18n';

// Render filesystem markdown in-app (ADR-0001 content pipeline; US-0003 wires the loader).
// GFM for tables/task-lists; styled via Tailwind `prose`. With a `locale`, a link written as `/en/…`
// stays inside that locale (localizeHref), so a page that falls back to English keeps its visitor on
// the Dutch addresses.
export function Markdown({ children, locale }: { children: string; locale?: Locale }) {
  return (
    <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:underline-offset-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={(url) => defaultUrlTransform(locale ? localizeHref(url, locale) : url)}
      >{children}</ReactMarkdown>
    </article>
  );
}
