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
// `code`. Everything else is plain text.
function inline(line: string): ReactNode[] {
  return line.split(/(\*\*.+?\*\*|\*[^*\s][^*]*\*|`[^`]+`)/g).map((part, i) => {
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
      {/* The stage on top in three fifths of the height, the notes below in a fixed area of two
          fifths, so neither moves between clicks. The stage is 16:9, as wide as the window allows or
          as tall as its area, whichever is smaller; the notes start at the top of theirs. */}
      <div className="mt-6 min-h-0 flex-[3_3_0%] [container-type:size]">
        <div
          className="overflow-hidden rounded-md ring-1 ring-neutral-700"
          style={{ width: `min(100cqw, calc(100cqh * ${STAGE.w / STAGE.h}))` }}
        >
          <Sketch deck={deck} step={step} className="block h-auto w-full" />
        </div>
      </div>
      {editing ? (
        <div className="mt-6 flex min-h-0 flex-[2_2_0%] flex-col">
          <p className="mb-2 text-sm text-amber-400">
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
            className="min-h-0 flex-1 resize-none rounded-md bg-neutral-900 p-4 font-mono text-lg leading-relaxed text-neutral-100 ring-1 ring-amber-500/60 focus:outline-none"
          />
        </div>
      ) : (
        <div className="mt-6 min-h-0 flex-[2_2_0%] overflow-y-auto" onDoubleClick={edit} title={notes ? 'Double-click or press e to edit' : undefined}>
          {notes ? (
            <ul className="list-disc space-y-2 pl-7 text-2xl leading-snug text-neutral-200">
              {lines(here.name).map((line, i) => (
                <li key={i} className={line.startsWith('→') ? 'list-none -ml-7 text-neutral-400' : undefined}>
                  {inline(line)}
                </li>
              ))}
            </ul>
          ) : null}
          {notes && !lines(here.name).length ? (
            <p className="text-xl text-neutral-500">No notes for ▶ {here.name} yet: press e to write them.</p>
          ) : null}
          {notes ? (
            next ? (
              <p className="mt-6 text-xl leading-snug text-neutral-400">
                <span className="mr-2 text-neutral-500">Next ({next.at}):</span>
                {inline(lines(next.name)[0] ?? '')}
              </p>
            ) : (
              <p className="mt-6 text-xl text-neutral-500">End of the episode.</p>
            )
          ) : null}
          {problem ? <p className="text-xl text-amber-400">{inline(problem)}</p> : null}
        </div>
      )}
      {message ? <p className={`mt-3 text-sm ${message.warn ? 'text-amber-400' : 'text-emerald-400'}`}>{inline(message.text)}</p> : null}
      <p className="mt-4 text-sm text-neutral-500">
        → / Space next · ← back · e edit notes · this window and the stage follow each other
        {notes ? ` · notes: wiki/${notes.file}` : ''}
      </p>
      {isFallback ? <p className="mt-2 text-sm text-amber-400">No deck in this language yet: showing the English deck.</p> : null}
    </div>
  );
}
