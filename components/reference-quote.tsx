import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatMonth } from '@/lib/dates';
import { getDictionary } from '@/lib/dictionaries';
import { languageName, type Reference } from '@/lib/references';
import { site } from '@/lib/site';
import type { Locale } from '@/lib/i18n';

// One reference (FS-0009): the person's words, then who they are. Three placements share it —
// `home` (two side by side, no frame), `article` (a framed block inside a case study, so the
// other person's words are visibly not the owner's prose), and `page` (a row on the references
// page, attribution beside the quote). Semantics are the same everywhere: <figure> holding a
// <blockquote> and a <figcaption>, so a screen reader hears "quote" and then the attribution.
//
// The photo is a plain file under public/references/ — never hotlinked from LinkedIn, whose media
// URLs are signed and expire — and a reference without one shows initials rather than a broken
// image. No LinkedIn script or badge: that would put their cookies on the page (FS-0007).

export type ReferenceVariant = 'home' | 'article' | 'page';

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

function Avatar({ reference, size }: { reference: Reference; size: number }) {
  const cls = 'shrink-0 rounded-full border border-border';
  if (reference.photo) {
    return (
      <Image
        src={reference.photo}
        alt=""
        width={size}
        height={size}
        className={`${cls} object-cover`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${cls} flex items-center justify-center bg-muted text-sm font-medium text-muted-foreground`}
      style={{ width: size, height: size }}
    >
      {initials(reference.name)}
    </span>
  );
}

/** The "In English." / "Translated from German, with their approval." note, or null when the quote is in the page's language. */
export function languageNote(reference: Reference, locale: Locale): string | null {
  const t = getDictionary(locale).references;
  if (reference.translatedFrom) {
    return t.translatedFrom.replace('{language}', languageName(reference.translatedFrom, locale));
  }
  if (reference.lang !== locale) {
    return t.inLanguage.replace('{language}', languageName(reference.lang, locale));
  }
  return null;
}

function ProfileLink({ reference, locale }: { reference: Reference; locale: Locale }) {
  const t = getDictionary(locale).references;
  return (
    <a
      href={reference.linkedin}
      rel="noopener"
      target="_blank"
      className="inline-flex items-center gap-0.5 text-[13px] font-normal text-muted-foreground underline underline-offset-4 hover:text-foreground"
      aria-label={`${reference.name} — ${t.linkedin}`}
    >
      {t.linkedin}
      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
    </a>
  );
}

function VerifiedLink({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).references;
  return (
    <a
      href={site.linkedinRecommendations}
      rel="noopener"
      target="_blank"
      className="inline-flex items-center gap-0.5 underline underline-offset-4 hover:text-foreground"
    >
      {t.alsoOnLinkedIn}
      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
    </a>
  );
}

export function ReferenceQuote({
  reference,
  locale,
  variant,
  workLabel,
  workHref,
}: {
  reference: Reference;
  locale: Locale;
  variant: ReferenceVariant;
  /** The case study's short title and href, shown on the home band so the quote lands somewhere. */
  workLabel?: string;
  workHref?: string;
}) {
  const t = getDictionary(locale).references;
  const roleLine = `${reference.role[locale]} · ${t.workedTogether} ${reference.years}`;
  const note = languageNote(reference, locale);
  const quote = <blockquote className="m-0 text-lg leading-[1.6]">“{reference.quote}”</blockquote>;

  if (variant === 'page') {
    return (
      <figure className="m-0 grid gap-6 border-b border-border py-8 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:gap-12">
        <figcaption className="flex items-start gap-4">
          <Avatar reference={reference} size={56} />
          <span className="flex flex-col gap-1">
            <span className="text-[15px] font-medium leading-5">{reference.name}</span>
            <span className="text-sm text-muted-foreground">{reference.role[locale]}</span>
            <span className="text-sm text-muted-foreground">
              {t.workedTogether} {reference.years}
            </span>
            <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
              <ProfileLink reference={reference} locale={locale} />
              {reference.verified ? <VerifiedLink locale={locale} /> : null}
              <span>{formatMonth(reference.date, locale)}</span>
              {note ? <span>{note}</span> : null}
            </span>
          </span>
        </figcaption>
        {quote}
      </figure>
    );
  }

  if (variant === 'article') {
    return (
      <figure className="not-prose m-0 flex flex-col gap-6 rounded-lg border border-border px-8 py-7">
        {quote}
        <figcaption className="flex flex-wrap items-center gap-4">
          <Avatar reference={reference} size={48} />
          <span className="flex min-w-0 flex-grow flex-col gap-0.5">
            <span className="flex items-baseline gap-2.5 text-[15px] font-medium leading-5">
              {reference.name}
              <ProfileLink reference={reference} locale={locale} />
            </span>
            <span className="text-sm text-muted-foreground">{roleLine}</span>
          </span>
          <span className="flex flex-col gap-0.5 text-[13px] text-muted-foreground sm:items-end sm:text-right">
            <span>{formatMonth(reference.date, locale)}</span>
            {reference.verified ? <VerifiedLink locale={locale} /> : null}
            {note ? <span>{note}</span> : null}
          </span>
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="m-0 flex flex-col gap-6">
      {quote}
      <figcaption className="flex items-center gap-3.5">
        <Avatar reference={reference} size={44} />
        <span className="flex flex-col gap-0.5">
          <span className="flex items-baseline gap-2.5 text-[15px] font-medium leading-5">
            {reference.name}
            <ProfileLink reference={reference} locale={locale} />
          </span>
          <span className="text-sm text-muted-foreground">
            {roleLine}
            {workLabel && workHref ? (
              <>
                {' · '}
                <Link href={workHref} className="underline underline-offset-4 hover:text-foreground">
                  {workLabel}
                </Link>
              </>
            ) : null}
            {note ? ` · ${note}` : null}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
