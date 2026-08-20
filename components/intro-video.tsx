import { site, INTRO_VIDEO } from '@/lib/site';
import type { Locale } from '@/lib/i18n';

// Home-page intro video (FS-0002/US-0017). Self-hosted <video>, no third-party player: an embedded
// YouTube/Vimeo frame would place a processor and its cookies on the highest-traffic page and break
// the privacy page's "nothing is collected" claim (FS-0007). Renders nothing WHILE INTRO_VIDEO is
// null, so the feature ships dark and turns on with one config value.
//
// No autoplay and no muted-loop background trick — this is content, not decoration, so the visitor
// starts it. `preload="metadata"` keeps the page weight to a poster image until they do.
export function IntroVideo({
  locale,
  heading,
  body,
  durationLabel,
}: {
  locale: Locale;
  heading: string;
  body: string;
  durationLabel: string;
}) {
  if (!INTRO_VIDEO) return null;

  return (
    <section className="border-b border-border bg-muted/30">
      <div className="container grid items-center gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="max-w-md">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {heading}
          </h2>
          <p className="mt-4 text-lg">{body}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {durationLabel} {INTRO_VIDEO.duration}
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-background">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- a <track> is rendered below */}
          <video
            className="aspect-video h-auto w-full"
            controls
            preload="metadata"
            playsInline
            poster={INTRO_VIDEO.poster}
          >
            <source src={INTRO_VIDEO.src} type="video/mp4" />
            <track
              kind="captions"
              src={INTRO_VIDEO.captions[locale]}
              srcLang={locale}
              label={locale === 'nl' ? 'Nederlands' : 'English'}
              default
            />
            <a href={INTRO_VIDEO.src}>{site.name}</a>
          </video>
        </div>
      </div>
    </section>
  );
}
