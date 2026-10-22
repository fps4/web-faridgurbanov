'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Sketch } from '@/components/deck/sketch';
import { CAMERA, STAGE, type Deck } from '@/lib/deck';

// The recording player for an episode deck (FS-0010), at /<locale>/deck/<episode>. One window shows the stage for OBS to capture
// (1920×1080, scaled to fit, the camera corner kept clear); a second, opened with `p`, is the
// presenter view: the cue to say, the next cue, the script time and a clock. The two follow each
// other over a BroadcastChannel, so a click or a presenter remote in either moves both.
//
//   → / Space / PageDown / click   next step       ← / PageUp   previous step
//   Home / End   first / last       c   camera guide on/off      f   full screen
//   p   open the presenter view     #12 in the URL   start at step 12

type Message = { step: number };

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
    const cue = deck.steps[step];
    const next = deck.steps[step + 1];
    return (
      <div className="min-h-screen bg-neutral-950 p-8 font-sans text-neutral-100">
        <div className="flex items-baseline justify-between text-sm text-neutral-400">
          <span>
            {deck.episode} · {deck.title}
          </span>
          <span>
            step {step + 1} / {deck.steps.length} · script {cue.at} · clock {clock}
          </span>
        </div>
        <p className="mt-8 text-4xl leading-snug">{cue.cue}</p>
        {next ? (
          <p className="mt-10 text-xl leading-snug text-neutral-400">
            <span className="mr-2 text-neutral-500">Next ({next.at}):</span>
            {next.cue}
          </p>
        ) : (
          <p className="mt-10 text-xl text-neutral-500">End of the episode.</p>
        )}
        <div className="mt-10 w-[640px] overflow-hidden rounded-md border border-neutral-700">
          <Sketch deck={deck} step={step} className="block h-auto w-full" />
        </div>
        <p className="mt-6 text-sm text-neutral-500">→ / Space next · ← back · this window and the stage follow each other</p>
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
