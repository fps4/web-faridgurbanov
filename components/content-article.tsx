import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Markdown } from '@/components/markdown';
import { FallbackNotice } from '@/components/fallback-notice';
import { title as fmTitle, type ContentEntry } from '@/lib/content';
import { splitBeforeLastSection } from '@/lib/sections';

// Shared detail-page renderer for the markdown-driven sections (expertise, work, writing). Shows
// the frontmatter title, an optional date/meta line, the EN-fallback notice when the requested
// locale fell back (ADR-0002), the prose body, and a back-link to the section index.
//
// `beforeLastSection` lets a page put something of its own between the body's penultimate and
// final H2 — the case studies use it for a reference (FS-0009) after "Who had to say yes" — without
// the markdown carrying a placeholder. The body is rendered in two halves in that case; each half
// is a self-contained block sequence, so nothing in the prose styling changes.
export function ContentArticle({
  entry,
  fallbackMessage,
  backHref,
  backLabel,
  meta,
  beforeLastSection,
}: {
  entry: ContentEntry;
  fallbackMessage: string;
  backHref: string;
  backLabel: string;
  meta?: React.ReactNode;
  beforeLastSection?: React.ReactNode;
}) {
  const split = beforeLastSection ? splitBeforeLastSection(entry.body) : null;
  return (
    <article className="container max-w-3xl py-16">
      {entry.isFallback ? <FallbackNotice message={fallbackMessage} /> : null}
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{fmTitle(entry.data)}</h1>
      {meta ? <div className="mt-3 text-sm text-muted-foreground">{meta}</div> : null}
      <div className="mt-8">
        {split && split.tail ? (
          <>
            <Markdown>{split.head}</Markdown>
            <div className="my-10">{beforeLastSection}</div>
            <Markdown>{split.tail}</Markdown>
          </>
        ) : (
          <>
            <Markdown>{entry.body}</Markdown>
            {beforeLastSection ? <div className="mt-10">{beforeLastSection}</div> : null}
          </>
        )}
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
