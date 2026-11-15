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

  // A mat around the picture, so a light video (the decks are white paper) keeps its edge on a
  // light page.
  const frame =
    'rounded-xl border border-foreground/30 bg-muted p-1.5 shadow-md sm:p-2';

  if (!video) {
    return (
      <div className={frame}>
        <div className="grid aspect-video place-items-center rounded-lg border border-dashed border-border bg-background p-6 text-center text-sm text-muted-foreground">
          {missing}
        </div>
      </div>
    );
  }

  if (playing) {
    return (
      <div className={frame}>
        <div className="overflow-hidden rounded-lg bg-black">
          <iframe
            className="block aspect-video h-auto w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className={frame}>
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={playLabel}
        className="group relative block aspect-video w-full overflow-hidden rounded-lg bg-background text-left"
      >
        {video.poster ? (
          // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimised
          <img
            src={video.poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span className="absolute inset-x-0 bottom-0 p-6 text-center text-xl font-semibold tracking-tight text-muted-foreground">
            {title}
          </span>
        )}
        {/* On a poster (a deck's title slide) the button sits in the corner the decks keep clear for
            the camera, off the title; on a plain frame it is centred. */}
        <span
          className={
            video.poster
              ? 'absolute bottom-[18%] right-[12.5%] translate-x-1/2 translate-y-1/2'
              : 'absolute inset-0 grid place-items-center'
          }
        >
          <span className="grid h-14 w-14 place-items-center rounded-full sm:h-20 sm:w-20 bg-foreground/85 text-background shadow-lg transition-transform group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="ml-1 h-7 w-7 fill-current sm:h-9 sm:w-9"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </button>
    </div>
  );
}
