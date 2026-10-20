import { splitLabel, type KitRow } from '@/lib/kit-tables';
import type { CardSpec } from '@/lib/deck';

// One artifact slide (FS-0010): a section of a kit download, set in the same card for every deck so
// all sixteen episodes show their downloads the same way. The rows come from the kit snapshot at
// build time (lib/kit-tables.ts). A blank download shows each row's hint and an empty line to fill
// in; a filled-in one shows the answer. Highlighted rows get a marker stroke behind them.

export interface ResolvedCard {
  spec: CardSpec;
  rows: KitRow[];
}

export function ArtifactCard({ card, highlighted, animate }: { card: ResolvedCard; highlighted: number[]; animate: boolean }) {
  const { spec, rows } = card;
  return (
    <div className="deck-card">
      <div className="deck-card-head">
        <div>
          <div className="deck-card-title">{spec.title}</div>
          <div className="deck-card-subtitle">{spec.subtitle}</div>
        </div>
        {spec.tag ? <span className="deck-card-tag">{spec.tag}</span> : null}
      </div>
      <dl className="deck-card-rows">
        {rows.map((row, i) => {
          const { name, hint } = splitLabel(row.label);
          const on = highlighted.includes(i);
          return (
            <div key={row.label} className={`deck-card-row ${on ? (animate ? 'is-marked is-marking' : 'is-marked') : ''}`}>
              <dt>{name}</dt>
              {row.value ? <dd>{row.value}</dd> : <dd className="deck-card-blank">{hint || ' '}</dd>}
            </div>
          );
        })}
      </dl>
      <div className="deck-card-foot">
        <span>AI Product Design · faridgurbanov.com · CC BY 4.0</span>
        <span>{spec.source.split('/').at(-1)}</span>
      </div>
    </div>
  );
}
