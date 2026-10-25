'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Sketch } from '@/components/deck/sketch';
import { CAMERA, STAGE, type Deck } from '@/lib/deck';

// The recording player for an episode deck (FS-0010), at /<locale>/deck/<episode>. One window shows the stage for OBS to capture
// (1920×1080, scaled to fit, the camera corner kept clear); a second, opened with `p`, is the
// presenter view: the stage, the presenter notes for the click under it, the next click's first
// line, the planned time and a clock. The two follow each other over a
// BroadcastChannel, so a click or a presenter remote in either moves both.
//
//   → / Space / PageDown / click   next step       ← / PageUp   previous step
//   Home / End   first / last       c   camera guide on/off      f   full screen
//   p   open the presenter view     #12 in the URL   start at step 12

type Message = { step: number };

// The notes' own markdown, as the wiki writes it: **bold** for the thought to say, *italic*,
// `code`. Everything else is plain text.
function inline(line: string) {
  return line.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`)/g).map((part, i) => {
    if (/^\*\*.+\*\*$/.test(part)) return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    if (/^\*.+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    if (/^`.+`$/.test(part)) return <code key={i} className="font-mono text-[0.9em]">{part.slice(1, -1)}</code>;
    return part;
  });
}

function initialStep(max: number): number {
  const n = Number(window.location.hash.slice(1));
  return Number.isInteger(n) && n >= 0 && n <= max ? n : 0;
}

export function DeckPlayer({
  deck,
  isFallback = false,
}: {
  deck: Deck;
  /** True when this locale has no deck of its own and shows the English one. */
  isFallback?: boolean;
}) {
  const last = deck.steps.length - 1;
  const [step, setStep] = useState(0);
  const [from, setFrom] = useState<number | undefined>(undefined);
  const [presenter, setPresenter] = useState(false);
  const [ready, setReady] = useState(false);
  const [guide, setGuide] = useState(false);
  const [scale, setScale] = useState(1);
  const [started, setStarted] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const channel = useRef<BroadcastChannel | null>(null);
  const current = useRef(0);

  const go = useCallback(
    (next: number, broadcast = true) => {
      const target = Math.max(0, Math.min(last, next));
      setFrom(current.current);
      current.current = target;
      setStep(target);
      setStarted((s) => s ?? Date.now());
      window.history.replaceState(null, '', `#${target}`);
      if (broadcast) channel.current?.postMessage({ step: target } satisfies Message);
    },
    [last],
  );

  useEffect(() => {
    setPresenter(new URLSearchParams(window.location.search).has('presenter'));
    const start = initialStep(last);
    current.current = start;
    setStep(start);
    setReady(true);
    const bc = new BroadcastChannel(`deck-${deck.id}`);
    bc.onmessage = (e: MessageEvent<Message>) => go(e.data.step, false);
    channel.current = bc;
    return () => bc.close();
  }, [deck.id, last, go]);

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / STAGE.w, window.innerHeight / STAGE.h));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', ' ', 'PageDown', 'Enter'].includes(e.key)) {
        e.preventDefault();
        go(step + 1);
      } else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) {
        e.preventDefault();
        go(step - 1);
      } else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(last);
      else if (e.key === 'c') setGuide((g) => !g);
      else if (e.key === 'f') void (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
      else if (e.key === 'p') window.open(`${window.location.pathname}?presenter#${step}`, `presenter-${deck.id}`, 'width=1100,height=760');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, last, go, deck.id]);

  // Nothing until the window size, the step and the view are known: no flash of step 0 at full size.
  if (!ready) return <div className="deck-stage-wrap" />;

  if (presenter) {
    const elapsed = started ? Math.floor((now - started) / 1000) : 0;
    const clock = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`;
    const here = deck.steps[step];
    const next = deck.steps[step + 1];
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-neutral-950 p-8 font-sans text-neutral-100">
        <div className="flex items-baseline justify-between text-sm text-neutral-400">
          <span>
            {deck.episode} · {deck.title}
          </span>
          <span>
            step {step + 1} / {deck.steps.length} · plan {here.at} · clock {clock}
          </span>
        </div>
        {/* The stage on top, filling what the notes below leave free, at 16:9: as wide as the window
            allows, or as tall as the space above the notes, whichever is smaller. */}
        <div className="mt-6 min-h-0 flex-1 [container-type:size]">
          <div
            className="overflow-hidden rounded-md ring-1 ring-neutral-700"
            style={{ width: `min(100cqw, calc(100cqh * ${STAGE.w / STAGE.h}))` }}
          >
            <Sketch deck={deck} step={step} className="block h-auto w-full" />
          </div>
        </div>
        <ul className="mt-6 list-disc space-y-3 pl-8 text-3xl leading-snug text-neutral-200">
          {here.notes.map((line, i) => (
            <li key={i} className={line.startsWith('→') ? 'list-none -ml-8 text-neutral-400' : undefined}>
              {inline(line)}
            </li>
          ))}
        </ul>
        {next ? (
          <p className="mt-6 text-xl leading-snug text-neutral-400">
            <span className="mr-2 text-neutral-500">Next ({next.at}):</span>
            {inline(next.notes[0])}
          </p>
        ) : (
          <p className="mt-6 text-xl text-neutral-500">End of the episode.</p>
        )}
        <p className="mt-4 text-sm text-neutral-500">→ / Space next · ← back · this window and the stage follow each other</p>
        {isFallback ? <p className="mt-2 text-sm text-amber-400">No deck in this language yet: showing the English deck.</p> : null}
      </div>
    );
  }

  return (
    <div className="deck-stage-wrap" onClick={() => go(step + 1)}>
      <div className="deck-stage" style={{ transform: `scale(${scale})` }}>
        <Sketch key={step} deck={deck} step={step} from={from} />
        {guide ? (
          <div
            className="deck-camera-guide"
            style={{ left: CAMERA.x, top: CAMERA.y, width: CAMERA.w, height: CAMERA.h }}
            aria-hidden="true"
          />
        ) : null}
      </div>
      {guide ? (
        <div className="deck-hud">
          step {step + 1} / {deck.steps.length} · {deck.steps[step].at} · c guide · p presenter · f full screen
        </div>
      ) : null}
    </div>
  );
}
