import type { CardSpec } from '@/lib/deck';

// One card on a deck (FS-0010): a title, a subtitle and labelled rows, set the same way in every
// deck. An episode closes on one, read across the room: the idea, the move and Monday. Highlighted
// rows get a marker stroke behind them.

export function ArtifactCard({ card, highlighted, animate }: { card: CardSpec; highlighted: number[]; animate: boolean }) {
  return (
    <div className="deck-card deck-card--summary">
      <div className="deck-card-head">
        <div>
          <div className="deck-card-title">{card.title}</div>
          <div className="deck-card-subtitle">{card.subtitle}</div>
        </div>
        {card.tag ? <span className="deck-card-tag">{card.tag}</span> : null}
      </div>
      <dl className="deck-card-rows">
        {card.rows.map((row, i) => {
          const on = highlighted.includes(i);
          return (
            <div key={row.label} className={`deck-card-row ${on ? (animate ? 'is-marked is-marking' : 'is-marked') : ''}`}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          );
        })}
      </dl>
      <div className="deck-card-foot">
        <span>AI Product Design · faridgurbanov.com</span>
        <span>{card.source}</span>
      </div>
    </div>
  );
}
