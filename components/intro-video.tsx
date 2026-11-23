import { site, INTRO_VIDEO } from '@/lib/site';
import type { Locale } from '@/lib/i18n';

// Home-page intro video (FS-0002/US-0017). Self-hosted <video>, no third-party player: an embedded
// YouTube/Vimeo frame would place a processor and its cookies on the highest-traffic page and break
// the privacy page's "nothing is collected" claim (FS-0007). Renders nothing WHILE INTRO_VIDEO is
// null, so the feature ships dark and turns on with one config value.
//
// No autoplay and no muted-loop background trick — this is content, not decoration, so the visitor
// starts it. `preload="metadata"` keeps the page weight to a poster image until they do.
// No text of its own (maestro story art-9947n0hg99): every text on the home page is approved copy,
// and there is none for this place yet. The player and its caption track are all it renders.
export function IntroVideo({ locale }: { locale: Locale }) {
  if (!INTRO_VIDEO) return null;

  return (
    <section className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-border bg-background">
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
