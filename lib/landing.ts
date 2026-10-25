// The storyline landing page's sections (FS-0010), read from the markdown body of
// content/en/ai-product-design/index.md so the owner edits the page as text. Each `## ` heading is a
// band. Inside a band:
//   - paragraphs before anything else are its intro;
//   - a list whose items open with bold (`- **Title.** body`) becomes cards;
//   - `### ` headings become questions with their answers;
//   - a line `<!-- modules -->` marks where the six modules are listed;
//   - anything after the cards is the band's outro.
// Headings inside fenced code blocks are ignored. Framework-free and unit-tested per AGENTS.md.

export interface LandingCard {
  title: string;
  body: string;
}

export interface LandingQuestion {
  question: string;
  answer: string;
}

export interface LandingSection {
  heading: string;
  intro: string;
  cards: LandingCard[];
  questions: LandingQuestion[];
  /** True where `<!-- modules -->` sits in the section. */
  modules: boolean;
  outro: string;
}

const MODULES_MARKER = /^\s*<!--\s*modules\s*-->\s*$/;
const CARD = /^[-*] \*\*(.+?)\*\*\s*(.*)$/;

/** The body before the first `## ` heading, and each `## ` section after it. */
export function landingSections(body: string): { lead: string; sections: LandingSection[] } {
  const lines = body.split('\n');
  const chunks: { heading: string | null; lines: string[] }[] = [{ heading: null, lines: [] }];
  let inFence = false;
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (!inFence && /^## /.test(line)) chunks.push({ heading: line.slice(3).trim(), lines: [] });
    else chunks[chunks.length - 1].lines.push(line);
  }
  const [lead, ...rest] = chunks;
  return { lead: lead.lines.join('\n').trim(), sections: rest.map((c) => section(c.heading ?? '', c.lines)) };
}

function section(heading: string, lines: string[]): LandingSection {
  const out: LandingSection = { heading, intro: '', cards: [], questions: [], modules: false, outro: '' };
  const intro: string[] = [];
  const outro: string[] = [];
  let phase: 'intro' | 'cards' | 'questions' | 'outro' = 'intro';

  for (const line of lines) {
    if (MODULES_MARKER.test(line)) {
      out.modules = true;
      continue;
    }
    if (/^### /.test(line)) {
      phase = 'questions';
      out.questions.push({ question: line.slice(4).trim(), answer: '' });
      continue;
    }
    if (phase === 'questions') {
      const q = out.questions[out.questions.length - 1];
      q.answer += `${line}\n`;
      continue;
    }
    const card = CARD.exec(line);
    if (card && (phase === 'intro' || phase === 'cards')) {
      phase = 'cards';
      out.cards.push({ title: card[1].replace(/[.:]$/, ''), body: card[2] });
      continue;
    }
    if (phase === 'cards') {
      // An indented line continues the card; a blank line inside the list is skipped; anything else
      // ends the list.
      if (/^\s+\S/.test(line)) {
        const c = out.cards[out.cards.length - 1];
        c.body = `${c.body} ${line.trim()}`.trim();
        continue;
      }
      if (!line.trim()) continue;
      phase = 'outro';
    }
    (phase === 'outro' ? outro : intro).push(line);
  }

  out.intro = intro.join('\n').trim();
  out.outro = outro.join('\n').trim();
  for (const q of out.questions) q.answer = q.answer.trim();
  return out;
}
