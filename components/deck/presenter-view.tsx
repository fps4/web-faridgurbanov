'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Sketch } from '@/components/deck/sketch';
import { STAGE, type Deck } from '@/lib/deck';
import { noteLines } from '@/lib/decks/presenter-notes.mjs';

// The presenter view of an episode deck (FS-0010), under `npm run dev` only: the stage, the presenter
// notes for the click under it, the next click's first line, the planned time and a clock. The notes
// are not in the deck: they come from the wiki's `.slides.md` through the notes server
// (scripts/notes-server.mjs), and an edit here is saved back into that file.
//
//   e or double-click the notes   edit this click's notes     ⌘↵ / Ctrl↵   save      Esc   cancel
//
// The text in the editor is the `▶` block as the wiki writes it: `- ` bullets, two spaces to continue
// a bullet. A save replaces that block only. When the block changed on disk while the editor was open
// (an edit in the wiki, or Claude's), the first save does not overwrite it: the view says so, and a
// second save does.

const NOTES_SERVER = 'http://127.0.0.1:3041';

type Notes = { file: string; version: string; steps: Record<string, string> };
/** `base` is the block as it was when the editor opened (null: no block yet), to catch a change on disk. */
type Editing = { step: string; text: string; base: string | null };

// The notes' own markdown, as the wiki writes it: **bold** for the thought to say, *italic*,
// `code`, [links](url) shown by their text. Everything else is plain text.
function inline(line: string): ReactNode[] {
  return line.split(/(\[[^\]]+\]\([^)\s]+\)|\*\*.+?\*\*|\*[^*\s][^*]*\*|`[^`]+`)/g).map((part, i) => {
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link)
      return (
        <a key={i} href={link[2]} target="_blank" rel="noreferrer" className="underline decoration-neutral-600 underline-offset-2 hover:text-white">
          {inline(link[1])}
        </a>
      );
    if (/^\*\*.+\*\*$/.test(part))
      return (
        <strong key={i} className="font-semibold text-white">
          {inline(part.slice(2, -2))}
        </strong>
      );
    if (/^\*.+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    if (/^`.+`$/.test(part)) return <code key={i} className="font-mono text-[0.9em]">{part.slice(1, -1)}</code>;
    return part;
  });
}

/** The deck's notes from the notes server, kept current while the wiki file changes on disk. */
function useNotes(deck: Deck) {
  const [notes, setNotes] = useState<Notes | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const base = `${deck.locale}/${deck.id}`;

  const reads = useRef(0);

  const load = useCallback(async () => {
    // Only the latest read counts: one that failed while the server was down may finish after it.
    const read = ++reads.current;
    try {
      const res = await fetch(`${NOTES_SERVER}/notes/${base}`);
      const body = await res.json();
      if (read !== reads.current) return;
      if (!res.ok) throw new Error(body.error);
      setNotes(body);
      setProblem(null);
    } catch (err) {
      if (read !== reads.current) return;
      setProblem(
        err instanceof TypeError
          ? 'The notes server is not running: `npm run dev` starts it (or `npm run notes:serve`). The notes shown are the last ones read.'
          : String((err as Error).message),
      );
    }
  }, [base]);

  useEffect(() => {
    // A fresh read on every (re)connect, so an edit made while the server was down shows up. The
    // browser gives up on an event stream whose server refused the connection, so this retries itself.
    let events: EventSource | undefined;
    let retry: ReturnType<typeof setTimeout> | undefined;
    const connect = () => {
      events = new EventSource(`${NOTES_SERVER}/events/${base}`);
      events.onopen = () => void load();
      events.onmessage = (e: MessageEvent<string>) => setNotes(JSON.parse(e.data));
      events.onerror = () => {
        void load();
        if (events?.readyState === EventSource.CLOSED) retry = setTimeout(connect, 3000);
      };
    };
    connect();
    return () => {
      clearTimeout(retry);
      events?.close();
    };
  }, [base, load]);

  return { notes, setNotes, problem };
}

export function PresenterView({ deck, step, clock, isFallback }: { deck: Deck; step: number; clock: string; isFallback: boolean }) {
  const { notes, setNotes, problem } = useNotes(deck);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; warn?: boolean } | null>(null);
  const box = useRef<HTMLTextAreaElement>(null);
  // Full screen hides the browser's tabs and address bar; `f` does the same (the player's key).
  const [full, setFull] = useState(false);
  useEffect(() => {
    const onChange = () => setFull(Boolean(document.fullscreenElement));
    onChange();
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);
  // The browser refuses full screen without a real click or key press; that is not an error to report.
  const toggleFull = () => void (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {});

  const here = deck.steps[step];
  const next = deck.steps[step + 1];
  const lines = (name: string) => noteLines(notes?.steps[name] ?? '');

  // A "saved" line belongs to the click it was saved on.
  useEffect(() => {
    if (!editing) setMessage(null);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const edit = useCallback(() => {
    if (!notes) return;
    setEditing({ step: here.name, text: notes.steps[here.name] ?? '- ', base: notes.steps[here.name] ?? null });
    setMessage(null);
  }, [notes, here.name]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (editing || e.key !== 'e' || e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      edit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editing, edit]);

  // The cursor at the end of the block, where a new line usually goes.
  useEffect(() => {
    const el = box.current;
    if (!editing || !el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [editing?.step]); // eslint-disable-line react-hooks/exhaustive-deps

  async function save() {
    if (!editing || !notes || saving) return;
    setSaving(true);
    // A step without a block yet gets one after the block of the step before it.
    const i = deck.steps.findIndex((s) => s.name === editing.step);
    const after = editing.base === null ? deck.steps[i - 1]?.name : undefined;
    try {
      const res = await fetch(`${NOTES_SERVER}/notes/${deck.locale}/${deck.id}/${encodeURIComponent(editing.step)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base: editing.base, text: editing.text, after }),
      });
      const body = await res.json();
      if (res.ok) {
        setNotes(body);
        setEditing(null);
        setMessage({ text: `Saved ▶ ${editing.step} to ${body.file}.` });
      } else if (res.status === 409) {
        // Take the block as it is now as the base, so the next save overwrites it on purpose.
        setNotes({ file: body.file, version: body.version, steps: body.steps });
        setEditing({ ...editing, base: body.steps[editing.step] ?? null });
        setMessage({ text: `▶ ${editing.step} changed on disk while you were editing. Your text is still here: ⌘↵ again overwrites the block, Esc keeps the file's.`, warn: true });
      } else {
        setMessage({ text: `Not saved: ${body.error}`, warn: true });
      }
    } catch {
      setMessage({ text: 'Not saved: the notes server is not running (`npm run dev` starts it).', warn: true });
    } finally {
      setSaving(false);
    }
  }

  // A *Source* line is for checking, not for saying: it reads smaller and quieter.
  const lineClass = (line: string) =>
    line.startsWith('→') ? 'list-none -ml-5 text-neutral-400' : /^\*Sources?:\*/.test(line) ? 'text-sm text-neutral-500' : undefined;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-neutral-950 px-4 py-3 font-sans text-neutral-100">
      <div className="flex items-baseline justify-between gap-4 text-xs text-neutral-400">
        <span className="truncate">
          {deck.episode} · {deck.title}
        </span>
        <span className="flex shrink-0 items-baseline gap-3 tabular-nums">
          step {step + 1} / {deck.steps.length} · plan {here.at} · clock {clock}
          <button
            type="button"
            // Blurred after the click, so Space (next click) does not press it again.
            onClick={(e) => {
              e.currentTarget.blur();
              toggleFull();
            }}
            className="rounded px-1.5 py-0.5 text-neutral-400 ring-1 ring-neutral-700 hover:text-white hover:ring-neutral-500"
          >
            {full ? 'Exit full screen' : 'Full screen'}
          </button>
        </span>
      </div>
      {/* The stage gets the most room it can: beside the notes on a landscape window (the notes in a
          narrow column on the right), above them on a portrait one. The stage is 16:9, as wide as its
          area allows or as tall, whichever is smaller; the next click's first line sits under it, in
          the room a wide window leaves there. Neither moves between clicks. */}
      <div className="mt-3 grid min-h-0 flex-1 grid-rows-[minmax(0,3fr)_minmax(0,2fr)] gap-4 [@media(min-aspect-ratio:5/4)]:grid-cols-[minmax(0,1fr)_clamp(240px,24%,380px)] [@media(min-aspect-ratio:5/4)]:grid-rows-1">
        <div className="min-h-0 [container-type:size]">
          <div
            className="overflow-hidden rounded-md ring-1 ring-neutral-700"
            style={{ width: `min(100cqw, calc((100cqh - 3rem) * ${STAGE.w / STAGE.h}))` }}
          >
            <Sketch deck={deck} step={step} className="block h-auto w-full" />
          </div>
          {notes ? (
            <p className="mt-2 line-clamp-2 text-sm leading-snug text-neutral-400 [&_strong]:font-normal [&_strong]:text-neutral-300">
              {next ? (
                <>
                  <span className="mr-1.5 text-neutral-500">Next ({next.at}):</span>
                  {inline(lines(next.name)[0] ?? '')}
                </>
              ) : (
                <span className="text-neutral-500">End of the episode.</span>
              )}
            </p>
          ) : null}
        </div>
        {editing ? (
          <div className="flex min-h-0 flex-col">
            <p className="mb-2 text-xs text-amber-400">
              Editing ▶ <code className="font-mono">{editing.step}</code>
              {editing.step !== here.name ? ' (the deck has moved on; this saves the block you opened)' : ''} · ⌘↵ save · Esc cancel
            </p>
            <textarea
              ref={box}
              value={editing.text}
              spellCheck
              onChange={(e) => setEditing({ ...editing, text: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  void save();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  setEditing(null);
                  setMessage(null);
                }
              }}
              className="min-h-0 flex-1 resize-none rounded-md bg-neutral-900 p-3 font-mono text-sm leading-relaxed text-neutral-100 ring-1 ring-amber-500/60 focus:outline-none"
            />
          </div>
        ) : (
          <div className="min-h-0 overflow-y-auto pr-1" onDoubleClick={edit} title={notes ? 'Double-click or press e to edit' : undefined}>
            {notes ? (
              <ul className="list-disc space-y-1.5 pl-5 text-base leading-snug text-neutral-200">
                {lines(here.name).map((line, i) => (
                  <li key={i} className={lineClass(line)}>
                    {inline(line)}
                  </li>
                ))}
              </ul>
            ) : null}
            {notes && !lines(here.name).length ? (
              <p className="text-sm text-neutral-500">No notes for ▶ {here.name} yet: press e to write them.</p>
            ) : null}
            {problem ? <p className="mt-3 text-sm text-amber-400">{inline(problem)}</p> : null}
          </div>
        )}
      </div>
      {message ? <p className={`mt-2 text-xs ${message.warn ? 'text-amber-400' : 'text-emerald-400'}`}>{inline(message.text)}</p> : null}
      <p className="mt-2 truncate text-right text-xs text-neutral-500">
        → / Space next · ← back · e edit notes · f full screen · this window and the stage follow each other
        {notes ? ` · notes: wiki/${notes.file}` : ''}
      </p>
      {isFallback ? <p className="mt-1 text-xs text-amber-400">No deck in this language yet: showing the English deck.</p> : null}
    </div>
  );
}
