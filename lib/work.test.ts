import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseFrontmatter } from '@/lib/frontmatter';
import { EARLIER_WORK_ANCHOR, alsoBuilt, earlierWork, earlierWorkTitle } from '@/lib/site';

// The Work page's lists (art-vvzsw9ap9e, ADR-0010 §3.3, §5, AGENTS.md "Public repository"): what
// the site links as the owner's own repositories, and the stable anchors other pages point at.

// The repositories the approved site copy lists under "Also built" today. Adding one is the owner's
// choice and goes into the copy first (and ADR-0004's prerequisites must hold for it).
const APPROVED_REPOSITORIES = ['hybrid-kafka-on-azure'];

describe('Also built', () => {
  it('lists only the repositories the approved copy lists', () => {
    expect(alsoBuilt.map((r) => r.name)).toEqual(APPROVED_REPOSITORIES);
  });

  it('links each one to its public repository under github.com/fps4/, and to nothing else', () => {
    for (const r of alsoBuilt) {
      expect(r.href).toBe(`https://github.com/fps4/${r.name}`);
      expect(r.text.trim()).not.toBe('');
    }
  });

  it('keeps the repository the copy marks as not listed for now off the page', () => {
    expect(alsoBuilt.map((r) => r.name)).not.toContain('camel-quarkus-crash-course');
  });
});

describe('Earlier work', () => {
  it('has the four entries of the approved copy, with no case page behind them', () => {
    expect(earlierWork).toHaveLength(4);
    const slugs = readdirSync(join(process.cwd(), 'content', 'en', 'work')).map((f) => f.replace(/\.md$/, ''));
    for (const e of earlierWork) expect(slugs).not.toContain(e.id);
  });

  it('gives each entry a stable, unique anchor id of its own', () => {
    const ids = earlierWork.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^earlier-[a-z0-9-]+$/);
    expect(EARLIER_WORK_ANCHOR).toBe('earlier-work');
    expect(ids).toContain('earlier-security-data-lake');
  });

  it('names an entry without the full stop of its bold lead', () => {
    expect(earlierWorkTitle(earlierWork[0])).toBe('SAP events, proof of concept');
    expect(earlierWorkTitle(earlierWork[2])).toBe('Security data lake for a UK telecom operator');
  });

  // Every visible string of the list is one of the approved ones, so a client name cannot come in
  // without this test (and the approved copy) changing first.
  it('holds exactly the approved texts', () => {
    expect(earlierWork.map((e) => e.lead + e.rest)).toEqual([
      'SAP events, proof of concept. SAP Advanced Event Mesh pushes events to a REST endpoint of the adapter, with retry, dead-letter queue and a pause per event type.',
      'Databricks cost and pipeline review. Together with a data scientist. The cost of the existing workloads went down by more than a third.',
      'Security data lake for a UK telecom operator, at Accenture. I designed it from the concept and proved it with a demo. An offshore team brought it to production. 5–10 TB a day.',
      'SAP Finance to Snowflake for a German manufacturer, at Accenture. A large proof of concept that I built myself.',
    ]);
  });
});

describe('the case studies on the Work page', () => {
  const dir = join(process.cwd(), 'content', 'en', 'work');
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));

  it('are the two that stay', () => {
    expect(files.sort()).toEqual(['cloud-gateway.md', 'integration-adapter.md']);
  });

  it.each(files)('%s carries its large text, list line and Where it stands', (f) => {
    const { data } = parseFrontmatter(readFileSync(join(dir, f), 'utf8'));
    expect(typeof data.large).toBe('string');
    expect(typeof data.listed).toBe('string');
    expect(typeof data.stands).toBe('string');
    expect((data.listed as string).length).toBeGreaterThan(0);
    expect((data.stands as string).length).toBeGreaterThan(0);
  });
});
