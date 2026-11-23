import Image from 'next/image';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';
import { HERO_PHOTO, INTRO_VIDEO } from '@/lib/site';

// The photo in the place of the intro video (maestro story art-cxvf6s5t94, UC-01 extension 3a).
// It stands in the right column of the hero WHILE INTRO_VIDEO in lib/site.ts is null; once a video
// is configured the video takes the place (components/intro-video.tsx) and neither the photo nor
// its line is rendered. The page asks `heroPhotoShown()` so the grid and the photo cannot disagree.
//
// Self-hosted, with its size given, so the page does not move when it loads. The two links are
// ordinary links: the other site is contacted only when the visitor follows one.
export function heroPhotoShown(): boolean {
  return INTRO_VIDEO === null;
}

export function HeroPhoto({ locale }: { locale: Locale }) {
  if (!heroPhotoShown()) return null;
  const t = getDictionary(locale).home;

  return (
    <figure className="m-0 w-full max-w-[420px] lg:justify-self-end">
      <Image
        src={HERO_PHOTO.src}
        alt={t.photoAlt}
        width={HERO_PHOTO.width}
        height={HERO_PHOTO.height}
        sizes="(min-width: 1024px) 420px, 100vw"
        priority
        unoptimized
        className="aspect-[4/5] h-auto w-full rounded-lg object-cover"
      />
      <figcaption className="mt-3 text-sm text-muted-foreground">
        {t.photoPlace} ·{' '}
        <a
          href={HERO_PHOTO.unescoHref}
          target="_blank"
          rel="noopener"
          className="underline underline-offset-4"
        >
          {t.photoUnesco}
        </a>{' '}
        ·{' '}
        <a
          href={HERO_PHOTO.wikipediaHref}
          target="_blank"
          rel="noopener"
          className="underline underline-offset-4"
        >
          {t.photoWikipedia}
        </a>
      </figcaption>
    </figure>
  );
}
