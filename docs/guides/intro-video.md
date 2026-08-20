---
title: "Guide — recording the home-page intro video"
status: guide
last_updated: 2026-08-20
owners: [architect]
related:
  - docs/product/FS-0002-home.md
  - docs/design/decisions/0007-front-page-three-bands-and-portfolio-focus.md
  - lib/site.ts
---

# Recording the home-page intro video

The player is built and wired (`components/intro-video.tsx`). It renders **nothing** while
`INTRO_VIDEO` in `lib/site.ts` is `null`, so the site ships safely without a video. This guide is
what to record and how to turn it on.

## Why it is there

The site's whole repositioning problem is that the technical case lands and the human one does not.
A short video is the only element on a page that carries tone, pace and manner — the things a
stakeholder-management claim is actually judged on. It sits directly under the hero, before the
metrics, because it is about the person and the metrics are about the work.

## What to record — 90 to 120 seconds, four beats

Do not script it word for word; it will sound scripted. Learn the four beats and talk.

1. **Who you are and what you are hired for** (~15s). "I am an integration and data architect. I get
   hired when an organisation has more than one estate and they do not agree with each other."
2. **The kind of estate you work in** (~25s). One concrete picture: a legacy ESB being retired, SAP
   on one side, a cloud platform on the other, twenty teams who each already have something that
   works. Specific beats general.
3. **How you work across teams** (~40s). This is the beat that matters, and it is the whole reason
   for the video. Tell one small piece of one story — the paved road being cheaper than staying put,
   or the reconciliation Finance could run themselves. **One** example, not three.
4. **What to do next** (~15s). "If you are modernising an ESB, or moving SAP data somewhere people
   have to trust it, email me or send a WhatsApp." Name both channels; they are both on the page.

### Things that will make it worse

- Reading a script off-camera. Visible, and it undoes the point of the video.
- A slide deck or screen share. This is not a talk.
- Listing technologies. The whole page below does that better than speech can.
- Apologising for your English. Speak at your own pace; a plain, unhurried accent reads as
  competent. Rushing to sound native is what reads as nervous.

## How to record

- **Framing:** head and shoulders, camera at eye level, eyes into the lens rather than at your own
  preview. Sit far enough back that your hands are in shot if you use them.
- **Light:** a window in front of you, nothing bright behind you. This matters more than the camera.
- **Sound:** the single biggest quality lever. Use any wired earbuds with a mic, or a phone on a
  desk 30–40 cm away, in a room with soft furnishings. Laptop built-in mics sound like a call.
- **Background:** plain wall or bookshelf. No virtual background.
- **Takes:** record the whole thing five or six times rather than editing between beats. The fourth
  take is usually the one.

## Encoding and installation

Put the encoded files in `public/media/`. Target under ~15 MB so the page stays fast on mobile.

```sh
# 1080p, H.264/AAC, web-optimised (faststart puts the index at the front so it starts instantly)
ffmpeg -i raw.mov -vf "scale=-2:1080" -c:v libx264 -crf 23 -preset slow \
       -c:a aac -b:a 128k -movflags +faststart public/media/intro.mp4

# poster frame — pick a second where your eyes are open and you are mid-gesture
ffmpeg -ss 00:00:03 -i public/media/intro.mp4 -frames:v 1 -q:v 3 public/media/intro-poster.jpg
```

**Captions are required, not optional.** Write `public/media/intro.en.vtt` and
`public/media/intro.nl.vtt` by hand from your own words — auto-generated captions of accented
English are unreliable, and a wrong caption is worse than none. Minimal WebVTT:

```
WEBVTT

00:00:00.000 --> 00:00:04.500
I am an integration and data architect.
```

Then set the config in `lib/site.ts`:

```ts
export const INTRO_VIDEO: IntroVideo | null = {
  src: '/media/intro.mp4',
  poster: '/media/intro-poster.jpg',
  captions: { en: '/media/intro.en.vtt', nl: '/media/intro.nl.vtt' },
  duration: '1:50',
};
```

Run `npm run build` and the section appears. Nothing else changes.

## Why self-hosted rather than YouTube or Vimeo

An embedded player puts a third-party processor and its cookies on the highest-traffic page, and the
privacy page's "this site collects nothing" claim would stop being true (FS-0007). A self-hosted
`<video>` served by the same nginx has no such cost. The trade is bandwidth and no analytics, which
for a two-minute intro is the right trade.

## Dutch

One video in English is fine to start — the caption track is per locale, so the Dutch page can carry
Dutch captions over the English audio. A separate Dutch recording is a nice-to-have, not a
prerequisite, and at A2–B1 it is not yet the right move.
