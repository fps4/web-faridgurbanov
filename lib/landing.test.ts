import { describe, expect, it } from 'vitest';
import { landingSections } from '@/lib/landing';

describe('landingSections', () => {
  const body = [
    'Lead line.',
    '',
    '## Who it is for',
    'Intro paragraph.',
    '',
    '- **Sponsors.** You hold a budget',
    '  and want one use case live.',
    '- **Product owners:** You write the scorecard.',
    '',
    'After the cards.',
    '',
    '## The eight parts',
    'Start with Part 1.',
    '<!-- parts -->',
    '',
    '## Questions',
    '### Is this a course?',
    'No.',
    '',
    'A playbook.',
    '### Is it free?',
    'Yes.',
    '```',
    '## not a heading',
    '```',
  ].join('\n');

  const { lead, sections } = landingSections(body);

  it('splits the lead and one band per H2', () => {
    expect(lead).toBe('Lead line.');
    expect(sections.map((s) => s.heading)).toEqual(['Who it is for', 'The eight parts', 'Questions']);
  });

  it('turns bold-led list items into cards, with continuation lines and an outro', () => {
    const [who] = sections;
    expect(who.intro).toBe('Intro paragraph.');
    expect(who.cards).toEqual([
      { title: 'Sponsors', body: 'You hold a budget and want one use case live.' },
      { title: 'Product owners', body: 'You write the scorecard.' },
    ]);
    expect(who.outro).toBe('After the cards.');
  });

  it('marks where the parts go', () => {
    expect(sections[1]).toMatchObject({ intro: 'Start with Part 1.', parts: true, cards: [] });
    expect(sections[0].parts).toBe(false);
  });

  it('reads H3s as questions and ignores headings in code fences', () => {
    expect(sections[2].questions).toEqual([
      { question: 'Is this a course?', answer: 'No.\n\nA playbook.' },
      { question: 'Is it free?', answer: 'Yes.\n```\n## not a heading\n```' },
    ]);
  });
});
