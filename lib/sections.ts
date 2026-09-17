// Split a markdown body at its last level-2 heading, so a page can render something between the
// penultimate and final sections without the content pipeline learning about it. The case-study
// pages use this to place a reference (FS-0009) between "Who had to say yes" and "Role & stack":
// every study ends on its role-and-stack section in both locales, so "before the last H2" is a
// language-independent way to say "after the stakeholders". Headings inside fenced code blocks
// are ignored. Framework-free and unit-tested per AGENTS.md.

export interface SplitBody {
  /** Everything up to (not including) the last `## ` heading. */
  head: string;
  /** The last `## ` heading and everything after it; '' when the body has no H2. */
  tail: string;
}

export function splitBeforeLastSection(body: string): SplitBody {
  const lines = body.split('\n');
  let inFence = false;
  let lastHeading = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    else if (!inFence && /^## /.test(line)) lastHeading = i;
  }
  if (lastHeading === -1) return { head: body, tail: '' };
  return {
    head: lines.slice(0, lastHeading).join('\n'),
    tail: lines.slice(lastHeading).join('\n'),
  };
}
