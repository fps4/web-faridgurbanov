import type { Locale } from '@/lib/i18n';

// Site-wide facts and the two M0 feature gates. Kept as plain data so flipping a gate (enabling
// repo links once ADR-0004 closes, or flipping the home to training-forward in M1) is a one-line
// change, not a rebuild.

export const site = {
  name: 'Farid Gurbanov',
  domain: 'faridgurbanov.com',
  // Contact is mailto-only (no backend, no third-party processor) — see FS-0007 and the privacy
  // page. The address is assembled from parts at render time to resist naive scraping.
  email: { user: 'farid', domain: 'gurbanov.net' },
  linkedin: 'https://www.linkedin.com/in/fgurbanov/',
  github: 'https://github.com/fps4',
  location: { en: 'Eindhoven, Netherlands', nl: 'Eindhoven, Nederland' },
} as const;

export function emailAddress(): string {
  return `${site.email.user}@${site.email.domain}`;
}

/**
 * ADR-0004 gate. WHILE any public-surface prerequisite is unmet (one umbrella name, neutralized +
 * licensed forks, honest runnable-vs-reference framing), repo links stay OFF: portfolio/expertise
 * render descriptions and honest maturity labels only. Flip to `true` once all three close — a
 * single content/config change enables every link with no structural rebuild (FS-0005).
 */
export const REPO_LINKS_ENABLED = false;

/**
 * The home-page emphasis. M0 ships `credibility`; M1 flips to `training` (FS-0002, ADR-0003). The
 * home page is structured so this flag — not a rewrite — switches the lead.
 */
export const HOME_VARIANT: 'credibility' | 'training' = 'credibility';

/**
 * Whether the Training section is published. M0 is a credibility/brand surface only — the training
 * material and pages are prepared for M1 (FS-0008). WHILE this is `false`, the taster CTA, the
 * footer Training link, and the home/contact training blocks are hidden, and the `/training` route
 * emits no pages. The copy stays in the dictionary; flip to `true` in M1 to surface it all with no
 * rebuild. Pairs with HOME_VARIANT (credibility → training) and TRAINING_IN_NAV (lib/nav.ts).
 */
export const TRAINING_PUBLISHED = false;

export type Maturity = 'working' | 'reference';

/** The two areas the build-proof groups under (FS-0005). */
export type Pillar = 'ai' | 'platform';

export interface PillarMeta {
  id: Pillar;
  label: Record<Locale, string>;
}

// Portfolio groups by pillar in this order. AI & automation (the trio + eval harness) and the
// platform area (Tideway + the data/API/SAP blueprints). Pure data so adding a pillar or moving a
// repo between them is a one-line change.
export const pillars: PillarMeta[] = [
  { id: 'ai', label: { en: 'AI & automation', nl: 'AI & automatisering' } },
  { id: 'platform', label: { en: 'Integration, streaming & data', nl: 'Integratie, streaming & data' } },
];

export interface Repo {
  slug: string;
  name: string;
  pillar: Pillar;
  /** The one-line role this repo plays in its pillar. */
  role: Record<Locale, string>;
  maturity: Maturity;
  license: string | null;
  url: string;
  proves: Record<Locale, string>;
}

// Build proof across two areas (FS-0005), each card carrying an honest maturity label — no
// "production systems" claim. `working` runs end-to-end (`docker compose up`); `reference` is a
// readable reference architecture. Repos still being built are tracked in
// docs/notes/portfolio-repos-build-plan.md and added here only once they are real.
export const repos: Repo[] = [
  // — AI & automation: the govern → build → deliver trio —
  {
    slug: 'sovereign-llm-gateway',
    name: 'sovereign-llm-gateway',
    pillar: 'ai',
    role: { en: 'Govern & route the models', nl: 'Beheer & routeer de modellen' },
    maturity: 'working',
    license: null,
    url: 'https://github.com/fps4/sovereign-llm-gateway',
    proves: {
      en: 'A working LLM gateway: per-agent cost and budget enforcement, vendor abstraction (LiteLLM), a local-model fallback (Ollama) for sovereignty, and Prometheus observability. Runs end-to-end with `docker compose up`.',
      nl: 'Een werkende LLM-gateway: kosten- en budgetbewaking per agent, vendor-abstractie (LiteLLM), een lokaal-model-fallback (Ollama) voor soevereiniteit, en Prometheus-observability. Draait end-to-end met `docker compose up`.',
    },
  },
  {
    slug: 'sovereign-copilot',
    name: 'sovereign-copilot',
    pillar: 'ai',
    role: { en: 'Build a trustworthy agentic product', nl: 'Bouw een betrouwbaar agentisch product' },
    maturity: 'reference',
    license: null,
    url: 'https://github.com/fps4/sovereign-copilot',
    proves: {
      en: 'A reference architecture for a trustworthy copilot: deterministic tool contracts (MCP), retrieval grounded in your data (BGE-M3 + reranker), L1–L4 evaluation gates with goldens, and answers that trace to a recorded call chain.',
      nl: 'Een referentiearchitectuur voor een betrouwbare copilot: deterministische tool-contracten (MCP), retrieval geaard in je eigen data (BGE-M3 + reranker), L1–L4 evaluatiepoorten met goldens, en antwoorden die herleidbaar zijn tot een vastgelegde aanroepketen.',
    },
  },
  {
    slug: 'maestro',
    name: 'maestro',
    pillar: 'ai',
    role: { en: 'Deliver software with agents', nl: 'Lever software met agents' },
    maturity: 'reference',
    license: 'MIT',
    url: 'https://github.com/fps4/maestro',
    proves: {
      en: 'A reference architecture for spec-driven delivery: agents propose, humans dispose. Functional and technical gates enforced through GitHub branch protection across a multi-repo, multi-participant product.',
      nl: 'Een referentiearchitectuur voor spec-gedreven levering: agents stellen voor, mensen beslissen. Functionele en technische poorten afgedwongen via GitHub branch-protection over een multi-repo, multi-participant product.',
    },
  },
  // — Integration, streaming & data: Tideway as the working spine —
  {
    slug: 'tideway',
    name: 'tideway',
    pillar: 'platform',
    role: { en: 'Stream & integrate events at platform scale', nl: 'Stream & integreer events op platformschaal' },
    maturity: 'working',
    license: 'MIT',
    url: 'https://github.com/fps4/tideway',
    proves: {
      en: 'A Kafka-native, multi-tenant event-streaming & integration platform: REST→Kafka ingest, managed JSONata transforms with DLQ + replay, Kafka Connect HTTP/S3 sinks, a control-plane API and a drag-and-drop pipeline UI, all under workspace-scoped observability. Runs locally with `docker compose up`.',
      nl: 'Een Kafka-native, multi-tenant platform voor event-streaming & integratie: REST→Kafka-ingest, beheerde JSONata-transformaties met DLQ + replay, Kafka Connect HTTP/S3-sinks, een control-plane-API en een drag-and-drop pipeline-UI, alles onder workspace-scoped observability. Draait lokaal met `docker compose up`.',
    },
  },
];
