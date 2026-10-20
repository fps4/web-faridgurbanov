import { describe, expect, it } from 'vitest';
import { pickRows, plain, splitLabel, tableUnder } from '@/lib/kit-tables';

const doc = `# Canvas

## 1 · The decision

| | Fast-track |
|---|---|
| **The decision** | Pay, pay part, deny, or investigate |
| **The prediction it lacks** | *Is it covered?* *Is it genuine?* |

Some prose.

## 2 · Owner

| | |
|---|---|
| **Owner of the outcome** | The head of claims |
`;

describe('kit tables', () => {
  it('reads the rows under a heading, skipping the header row', () => {
    expect(tableUnder(doc, 'the decision')).toEqual([
      { label: 'The decision', value: 'Pay, pay part, deny, or investigate' },
      { label: 'The prediction it lacks', value: 'Is it covered? Is it genuine?' },
    ]);
  });

  it('stops at the next heading', () => {
    expect(tableUnder(doc, 'Owner')).toEqual([{ label: 'Owner of the outcome', value: 'The head of claims' }]);
  });

  it('returns nothing for a missing heading', () => {
    expect(tableUnder(doc, 'risk')).toEqual([]);
  });

  it('picks rows by label and fails on a missing one', () => {
    const rows = tableUnder(doc, 'the decision');
    expect(pickRows(rows, ['The prediction it lacks'])[0].value).toContain('covered');
    expect(() => pickRows(rows, ['The action'])).toThrow(/The action/);
  });

  it('matches a blank download\'s label by its name and splits off the hint', () => {
    const blank = `## 1 · The decision\n\n| | Yours | Example |\n|---|---|---|\n| **The decision** — what someone decides | | Refund |\n`;
    const [row] = pickRows(tableUnder(blank, 'The decision'), ['The decision']);
    expect(row.value).toBe('');
    expect(splitLabel(row.label)).toEqual({ name: 'The decision', hint: 'what someone decides' });
  });

  it('strips emphasis, code and links', () => {
    expect(plain('**a** *b* `c` [d](https://x)')).toBe('a b c d');
  });
});
