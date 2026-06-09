'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Render filesystem markdown in-app (ADR-0001 content pipeline; US-0003 wires the loader).
// GFM for tables/task-lists; styled via Tailwind `prose`.
export function Markdown({ children }: { children: string }) {
  return (
    <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:underline-offset-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </article>
  );
}
