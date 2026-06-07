// Strip a leading YAML frontmatter block (`---\n…\n---`) off a markdown doc before rendering.
//
// Content lives as filesystem markdown with frontmatter (title, summary, order, draft) that drives
// nav and ordering (FS-0001, US-0003). Rendering the body must not dump that block into the prose;
// this is the one shared implementation so the regex doesn't drift.
export function stripFrontmatter(md: string): string {
  const m = /^---\n[\s\S]*?\n---\n?/.exec(md);
  return m ? md.slice(m[0].length) : md;
}
