'use client';

import { useState } from 'react';
import type { EpisodeVideo as Video } from '@/lib/learning';

// An episode's video (FS-0012). Click to load: until the visitor presses play the frame shows the
// poster from our own files (or a plain frame) and makes no request to YouTube. Only the click puts
// the youtube-nocookie player in the page, which the privacy page names once a video is live
// (FS-0007). Before the video exists (a preview under `next dev`) the frame says so instead.
export function EpisodeVideo({
  video,
  title,
  missing,
  playLabel,
}: {
  video?: Video;
  title: string;
  missing: string;
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (!video) {
    return (
      <div className="grid aspect-video place-items-center rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
        {missing}
      </div>
    );
  }

  if (playing) {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-black">
        <iframe
          className="aspect-video h-auto w-full"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={playLabel}
      className="group relative block aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted text-left"
    >
      {video.poster ? (
        // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimised
        <img src={video.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <span className="absolute inset-0 grid place-items-center p-8 text-center text-2xl font-semibold tracking-tight text-muted-foreground">
          {title}
        </span>
      )}
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-foreground/85 text-background shadow-lg transition-transform group-hover:scale-105">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ml-1 h-9 w-9 fill-current">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
