import rough from 'roughjs';
import type { Options } from 'roughjs/bin/core';
import { ArtifactCard } from '@/components/deck/artifact-card';
import { LINE_HEIGHT, STAGE, highlightAt, tagWidth, visibleAt, wrapText, type CardSpec, type Deck, type Element, type Shape, type Tone } from '@/lib/deck';

// The sketch renderer for an episode deck (FS-0010, ADR-0010). Shapes are drawn with rough.js so the
// diagram looks drawn by hand; a seed per element keeps the strokes identical on every render, so
// a static figure on a page and the recorded deck are the same drawing. When `animate` is
// on, the elements that arrive at the current step draw themselves in order (strokes trace in, text
// writes on), fast enough that a viewer never waits for a hand. No hooks: this renders on the
// server for page figures and inside the client player for recording.

export const PAPER = '#fbf8f1';

export const TONES: Record<Tone, string> = {
  ink: '#1f2328',
  accent: '#1d4ed8',
  warn: '#c2410c',
  muted: '#8b8f97',
  marker: '#e9b308',
};

export const HAND_FONT = "'Caveat', 'Segoe Print', 'Comic Sans MS', cursive";
export const SANS_FONT = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

const generator = rough.generator();

function seedFor(id: string): number {
  let h = 2166136261;
  for (const ch of id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0) % 2147483647 || 1;
}

function paths(shape: Shape, opts: Options): { d: string; stroke: string; strokeWidth: number; fill?: string }[] {
  const g = generator;
  switch (shape.kind) {
    case 'box':
      return g.toPaths(g.rectangle(shape.x, shape.y, shape.w, shape.h, { ...opts, fill: shape.fill ? opts.stroke : undefined, fillStyle: 'hachure', hachureGap: 14 }));
    case 'ellipse':
      return g.toPaths(g.ellipse(shape.x + shape.w / 2, shape.y + shape.h / 2, shape.w, shape.h, { ...opts, roughness: 1.6 }));
    case 'line':
      return g.toPaths(g.linearPath(shape.points, opts));
    case 'arrow': {
      const { x1, y1, x2, y2 } = shape;
      const a = Math.atan2(y2 - y1, x2 - x1);
      const head = 22;
      const left: [number, number] = [x2 - head * Math.cos(a - 0.45), y2 - head * Math.sin(a - 0.45)];
      const right: [number, number] = [x2 - head * Math.cos(a + 0.45), y2 - head * Math.sin(a + 0.45)];
      return [
        ...g.toPaths(g.line(x1, y1, x2, y2, opts)),
        ...g.toPaths(g.linearPath([left, [x2, y2], right], { ...opts, roughness: 0.8 })),
      ];
    }
    case 'seat': {
      const { x, y } = shape;
      return [
        ...g.toPaths(g.circle(x, y - 28, 36, opts)),
        ...g.toPaths(g.arc(x, y + 30, 70, 70, Math.PI, 2 * Math.PI, false, opts)),
        ...g.toPaths(g.rectangle(x - 34, y + 40, 68, 26, { ...opts, roughness: 0.8 })),
      ];
    }
    case 'clock': {
      const { x, y, r } = shape;
      return [
        ...g.toPaths(g.circle(x, y, 2 * r, opts)),
        ...g.toPaths(g.linearPath([[x, y - r * 0.6], [x, y], [x + r * 0.45, y + r * 0.2]], { ...opts, roughness: 0.6 })),
      ];
    }
    case 'tag':
      return g.toPaths(g.rectangle(shape.x, shape.y - 22, tagWidth(shape.text), 44, { ...opts, roughness: 0.9 }));
    case 'text':
    case 'card':
      return [];
  }
}

/** How long an element takes to appear, in seconds. Fast: a whole step lands in one or two seconds. */
export function durationOf(shape: Shape): number {
  switch (shape.kind) {
    case 'text':
      return Math.min(1.2, 0.25 + shape.text.length * 0.02);
    case 'box':
    case 'ellipse':
    case 'clock':
      return 0.55;
    case 'card':
      return 0.5;
    case 'seat':
      return 0.3;
    default:
      return 0.35;
  }
}

function TextShape({ shape, color }: { shape: Extract<Shape, { kind: 'text' }>; color: string }) {
  const size = shape.size ?? 40;
  const lines = wrapText(shape.text, size, shape.wrap, shape.font ?? 'hand');
  return (
    <text
      x={shape.x}
      y={shape.y}
      fill={color}
      fontSize={size}
      fontFamily={shape.font === 'sans' ? SANS_FONT : HAND_FONT}
      fontWeight={shape.font === 'sans' ? 400 : 600}
      textAnchor={shape.anchor ?? 'start'}
    >
      {lines.map((line, i) => (
        <tspan key={i} x={shape.x} dy={i === 0 ? 0 : size * LINE_HEIGHT}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export type Motion = 'enter' | 'leave' | 'still';

function ElementView({
  el,
  motion,
  delay,
  step,
  cards,
}: {
  el: Element;
  motion: Motion;
  delay: number;
  step: number;
  cards: Record<string, CardSpec>;
}) {
  const color = TONES[el.tone ?? 'ink'];
  const shape = el.shape;
  const dur = durationOf(shape);
  const style = { '--delay': `${delay}s`, '--dur': `${dur}s` } as React.CSSProperties;
  const motionClass = motion === 'enter' ? 'deck-enter' : motion === 'leave' ? 'deck-leave' : '';

  if (shape.kind === 'text') {
    return (
      <g className={`${motionClass} ${motion === 'enter' ? 'deck-write' : ''}`} style={style} data-id={el.id}>
        <TextShape shape={shape} color={color} />
      </g>
    );
  }

  if (shape.kind === 'card') {
    const card = cards[shape.card];
    return (
      <foreignObject x={shape.x} y={shape.y} width={shape.w} height={shape.h} className={`${motionClass} ${motion === 'enter' ? 'deck-rise' : ''}`} style={style} data-id={el.id}>
        {card ? <ArtifactCard card={card} highlighted={highlightAt(shape, step)} animate={motion !== 'still'} /> : null}
      </foreignObject>
    );
  }

  const opts: Options = { seed: seedFor(el.id), stroke: color, strokeWidth: el.tone === 'muted' ? 2.5 : 3.5, roughness: 1.2, bowing: 1.2 };
  return (
    <g className={`${motionClass} ${motion === 'enter' ? 'deck-draw' : ''}`} style={style} data-id={el.id}>
      {paths(shape, opts).map((p, i) => (
        <path key={i} d={p.d} stroke={p.stroke} strokeWidth={p.strokeWidth} fill={p.fill ?? 'none'} strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
      ))}
      {shape.kind === 'tag' ? (
        <text x={shape.x + tagWidth(shape.text) / 2} y={shape.y + 10} fill={color} fontSize={32} fontFamily={HAND_FONT} fontWeight={700} textAnchor="middle">
          {shape.text}
        </text>
      ) : null}
    </g>
  );
}

/**
 * Draw a deck at one step. `from` is the step the viewer came from: moving forward by one animates
 * what arrives and fades what leaves; any other jump (back, or a static page) draws the step still.
 */
export function Sketch({
  deck,
  step,
  from,
  className,
}: {
  deck: Deck;
  step: number;
  from?: number;
  className?: string;
}) {
  const cards = Object.fromEntries(deck.cards.map((c) => [c.key, c]));
  const forward = from !== undefined && from === step - 1;
  const leaving = forward ? deck.elements.filter((el) => visibleAt(el, from) && !visibleAt(el, step)) : [];
  const visible = deck.elements.filter((el) => visibleAt(el, step));

  // Arrivals start once the leavers have faded, and overlap each other slightly so a step reads
  // as one gesture.
  let clock = leaving.length ? 0.3 : 0;
  const delays = new Map<string, number>();
  for (const el of visible) {
    if (forward && el.in === step) {
      delays.set(el.id, clock);
      clock += durationOf(el.shape) * 0.6;
    }
  }

  return (
    <svg viewBox={`0 0 ${STAGE.w} ${STAGE.h}`} className={className} role="img" aria-label={deck.title} style={{ background: PAPER }}>
      {leaving.map((el) => (
        <ElementView key={`leave-${el.id}`} el={el} motion="leave" delay={0} step={from ?? step} cards={cards} />
      ))}
      {visible.map((el) => (
        <ElementView
          key={el.id}
          el={el}
          motion={delays.has(el.id) ? 'enter' : 'still'}
          delay={delays.get(el.id) ?? 0}
          step={step}
          cards={cards}
        />
      ))}
    </svg>
  );
}
