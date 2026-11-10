import type { EpisodeVideo as Video } from '@/lib/learning';

// An episode's video (FS-0012). Self-hosted <video>, as the home intro video: no third-party player,
// so the privacy page's "nothing is collected" stays true (FS-0007). No autoplay; `preload="metadata"`
// keeps the page to a poster until the visitor starts it. Before the video exists (a preview under
// `next dev`) the frame says so instead.
export function EpisodeVideo({ video, title, missing }: { video?: Video; title: string; missing: string }) {
  if (!video) {
    return (
      <div className="grid aspect-video place-items-center rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
        {missing}
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- a <track> is rendered below */}
      <video className="aspect-video h-auto w-full" controls preload="metadata" playsInline poster={video.poster}>
        <source src={video.src} type="video/mp4" />
        <track kind="captions" src={video.captions} srcLang="en" label="English" default />
        <a href={video.src}>{title}</a>
      </video>
    </div>
  );
}
