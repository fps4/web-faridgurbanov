// Read the two-column tables of a kit download (FS-0010). The kit's downloads are Markdown sources
// (fps4/ai-product-design-kit); a snapshot of the ones the decks show is kept in content/kit/ by
// scripts/sync-kit.mjs. An artifact slide is built from the table rows at build time, so the slide
// and the download cannot drift apart. Framework-free and unit-tested per AGENTS.md.

export interface KitRow {
  /** The first column, plain. A blank download's label carries its hint: "The decision — what …". */
  label: string;
  /** The second column, plain: the filled-in answer, or '' on a blank download. */
  value: string;
}

/** A blank download's label is "Name — hint". Split it so a slide can set the two differently. */
export function splitLabel(label: string): { name: string; hint: string } {
  const at = label.indexOf(' — ');
  return at === -1 ? { name: label, hint: '' } : { name: label.slice(0, at), hint: label.slice(at + 3) };
}

/** Drop inline Markdown emphasis and code marks; keep the words. */
export function plain(cell: string): string {
  return cell
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .trim();
}

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}

/**
 * The rows of the first table under the heading whose text contains `heading` (case-insensitive).
 * The header row and the separator row are skipped; a row needs a label in the first column.
 * Returns [] when the heading or its table is missing, so a caller can fail loudly in a test.
 */
export function tableUnder(markdown: string, heading: string): KitRow[] {
  const lines = markdown.split('\n');
  const start = lines.findIndex((l) => /^#{1,6}\s/.test(l) && l.toLowerCase().includes(heading.toLowerCase()));
  if (start === -1) return [];

  const rows: KitRow[] = [];
  let inTable = false;
  let seenSeparator = false;
  for (const line of lines.slice(start + 1)) {
    if (/^#{1,6}\s/.test(line)) break;
    if (line.trim().startsWith('|')) {
      inTable = true;
      if (/^\|?\s*:?-{3,}/.test(line.trim())) {
        seenSeparator = true;
        continue;
      }
      if (!seenSeparator) continue; // the header row
      const [label = '', value = ''] = cells(line);
      if (plain(label)) rows.push({ label: plain(label), value: plain(value) });
    } else if (inTable) {
      break;
    }
  }
  return rows;
}

/**
 * Pick rows by label name (the part before any " — hint"), in the order asked; a missing label is
 * an error the deck test catches.
 */
export function pickRows(rows: KitRow[], labels: string[]): KitRow[] {
  return labels.map((label) => {
    const row = rows.find((r) => splitLabel(r.label).name.toLowerCase() === label.toLowerCase());
    if (!row) throw new Error(`kit table has no row "${label}"`);
    return row;
  });
}
