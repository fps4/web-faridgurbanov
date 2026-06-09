import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Markdown } from '@/components/markdown';
import { FallbackNotice } from '@/components/fallback-notice';
import { title as fmTitle, type ContentEntry } from '@/lib/content';

// Shared detail-page renderer for the markdown-driven sections (expertise, work, writing). Shows
// the frontmatter title, an optional date/meta line, the EN-fallback notice when the requested
// locale fell back (ADR-0002), the prose body, and a back-link to the section index.
export function ContentArticle({
  entry,
  fallbackMessage,
  backHref,
  backLabel,
  meta,
}: {
  entry: ContentEntry;
  fallbackMessage: string;
  backHref: string;
  backLabel: string;
  meta?: React.ReactNode;
}) {
  return (
    <article className="container max-w-3xl py-16">
      {entry.isFallback ? <FallbackNotice message={fallbackMessage} /> : null}
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{fmTitle(entry.data)}</h1>
      {meta ? <div className="mt-3 text-sm text-muted-foreground">{meta}</div> : null}
      <div className="mt-8">
        <Markdown>{entry.body}</Markdown>
      </div>
      <div className="mt-12 border-t border-border pt-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>
    </article>
  );
}
