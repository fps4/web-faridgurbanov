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

/** The areas the build-proof groups under (FS-0005). */
export type Pillar = 'ai' | 'platform' | 'applied';

export interface PillarMeta {
  id: Pillar;
  label: Record<Locale, string>;
}

// Portfolio groups by pillar in this order. AI & automation (the two sovereign-* repos + the
// training runtime), the platform area (the event-integration platform + the legacy-modernization
// lab + the identity service), and applied ML & data science (the two purpose-built COAV demos,
// the retail dynamic-pricing demo and the marketplace ranking platform). Pure data so adding a
// pillar or moving a repo between them is a one-line change.
export const pillars: PillarMeta[] = [
  { id: 'ai', label: { en: 'AI & automation', nl: 'AI & automatisering' } },
  { id: 'platform', label: { en: 'Integration, data & modernization', nl: 'Integratie, data & modernisering' } },
  { id: 'applied', label: { en: 'Applied ML & data science', nl: 'Toegepaste ML & datawetenschap' } },
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
  /**
   * Per-repo public-link override on top of the site-wide REPO_LINKS_ENABLED gate (ADR-0004).
   * WHILE that gate is off, a repo with `linkLive: true` still renders its link — for repos that
   * are already public, honestly framed and licensed (the two purpose-built COAV demos). Omitted
   * or `false` = follow the gate.
   */
  linkLive?: boolean;
  proves: Record<Locale, string>;
}

// Build proof across two areas (FS-0005), each card carrying an honest maturity label — no
// "production systems" claim. `working` runs end-to-end (`docker compose up`); `reference` is a
// readable reference architecture. Repos still being built are tracked in
// docs/notes/portfolio-repos-build-plan.md and added here only once they are real.
export const repos: Repo[] = [
  // — AI & automation: govern the models, build a trustworthy agentic product, and run a product
  //   that keeps the model outside its own runtime —
  {
    slug: 'sovereign-llm-gateway',
    name: 'sovereign-llm-gateway',
    pillar: 'ai',
    role: { en: 'Govern & route the models', nl: 'Beheer & routeer de modellen' },
    maturity: 'working',
    license: null,
    url: 'https://github.com/fps4/sovereign-llm-gateway',
    proves: {
      en: 'A working LLM gateway: per-agent cost and budget enforcement, vendor abstraction (LiteLLM), a local-model fallback (Ollama) for sovereignty, and Prometheus observability. Every model call passes one choke point, so governance is enforced in code rather than circulated as a policy document. Runs end-to-end with `docker compose up`.',
      nl: 'Een werkende LLM-gateway: kosten- en budgetbewaking per agent, vendor-abstractie (LiteLLM), een lokaal-model-fallback (Ollama) voor soevereiniteit, en Prometheus-observability. Elke modelaanroep passeert één punt, zodat governance in code wordt afgedwongen in plaats van rondgestuurd als beleidsdocument. Draait end-to-end met `docker compose up`.',
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
      en: 'A reference architecture for a trustworthy copilot: deterministic tool contracts (MCP), retrieval grounded in your own data (BGE-M3 + reranker), L1–L4 evaluation gates with goldens, and answers that trace back to a recorded call chain. Readable end to end — a reference architecture, not a running system, and the card says so.',
      nl: 'Een referentiearchitectuur voor een betrouwbare copilot: deterministische tool-contracten (MCP), retrieval geaard in je eigen data (BGE-M3 + reranker), L1–L4 evaluatiepoorten met goldens, en antwoorden die herleidbaar zijn tot een vastgelegde aanroepketen. Van begin tot eind leesbaar — een referentiearchitectuur, geen draaiend systeem.',
    },
  },
  // — Skills Coach: public, honestly framed and MIT-licensed, so it carries a live link (linkLive)
  //   ahead of the gate. —
  {
    slug: 'skills-coach',
    name: 'skills-coach',
    pillar: 'ai',
    role: { en: 'Keep the model outside the runtime', nl: 'Houd het model buiten de runtime' },
    maturity: 'working',
    license: 'MIT',
    linkLive: true,
    url: 'https://github.com/fps4/skills-coach',
    proves: {
      en: 'A working, pack-driven training platform that ships no model client at all: the runtime owns the packs, deterministic grading, spaced-repetition gating and a durable model of what a learner keeps getting wrong. Generation and correction sit behind a versioned coach API, so the caller can be a person with an LLM CLI today and a model API later. Runs end-to-end with `make up`.',
      nl: 'Een werkend, pack-gedreven trainingsplatform dat zelf geen enkele model-client bevat: de runtime bezit de packs, deterministische beoordeling, spaced-repetition-poorten en een duurzaam model van wat een lerende blijft fout doen. Generatie en correctie zitten achter een geversioneerde coach-API, dus de aanroeper kan vandaag een mens met een LLM-CLI zijn en later een model-API. Draait end-to-end met `make up`.',
    },
  },
  // — Integration, data & modernization: the event-integration platform as the working spine —
  {
    slug: 'event-integration-platform',
    name: 'event-integration-platform',
    pillar: 'platform',
    role: { en: 'Stream & integrate events at platform scale', nl: 'Stream & integreer events op platformschaal' },
    maturity: 'working',
    license: 'MIT',
    linkLive: true,
    url: 'https://github.com/fps4/event-integration-platform',
    proves: {
      en: 'A Kafka-native, multi-tenant event-streaming and integration platform: REST→Kafka ingest, managed JSONata transforms with DLQ and replay, Kafka Connect HTTP/S3 sinks, a control-plane API and a drag-and-drop pipeline UI, all under workspace-scoped observability. The self-service spine an integration team actually operates. Runs locally with `docker compose up`.',
      nl: 'Een Kafka-native, multi-tenant platform voor event-streaming en integratie: REST→Kafka-ingest, beheerde JSONata-transformaties met DLQ en replay, Kafka Connect HTTP/S3-sinks, een control-plane-API en een drag-and-drop pipeline-UI, alles onder workspace-scoped observability. De selfservice-ruggengraat die een integratieteam echt bedient. Draait lokaal met `docker compose up`.',
    },
  },
  // — Legacy modernization: the Oracle→Spring strangler lab. Public, honestly framed (its README
  //   carries an explicit honesty statement) and MIT-licensed, so it carries a live link
  //   (linkLive) ahead of the gate. —
  {
    slug: 'oracle-to-spring-strangler',
    name: 'oracle-to-spring-strangler',
    pillar: 'platform',
    role: { en: 'Modernize legacy live, wave by wave', nl: 'Moderniseer legacy live, wave voor wave' },
    maturity: 'working',
    license: 'MIT',
    linkLive: true,
    url: 'https://github.com/fps4/oracle-to-spring-strangler',
    proves: {
      en: 'A working legacy-modernization lab: an Oracle PL/SQL + ORDS system migrated live to Spring Boot + PostgreSQL by the strangler fig pattern. AI-assisted assessment artifacts, per-endpoint cutover waves in an nginx router — a wave is a PR, rollback is a git revert — and golden-master parity gates as wave exit criteria. Runs end-to-end with `docker compose up`.',
      nl: 'Een werkend legacy-moderniseringslab: een Oracle PL/SQL + ORDS-systeem live gemigreerd naar Spring Boot + PostgreSQL via het strangler-fig-patroon. AI-ondersteunde assessment-artefacten, cutover-waves per endpoint in een nginx-router — een wave is een PR, rollback een git revert — en golden-master-pariteitspoorten als exitcriteria. Draait end-to-end met `docker compose up`.',
    },
  },
  // — Identity: the self-hosted IdP the other products authenticate against. Public, honestly
  //   framed and MIT-licensed, so it carries a live link (linkLive) ahead of the gate. —
  {
    slug: 'identity-service',
    name: 'identity-service',
    pillar: 'platform',
    role: { en: 'Own identity across products', nl: 'Beheer identiteit over producten heen' },
    maturity: 'working',
    license: 'MIT',
    linkLive: true,
    url: 'https://github.com/fps4/identity-service',
    proves: {
      en: 'A working self-hosted identity provider: OAuth 2.0 + OIDC token issuance (RS256, published JWKS), a headless TypeScript SDK and a drop-in React `<Login/>`. Its audited management plane speaks both HTTP `/admin/v1` and MCP, so agents operate it under the same contract as people. Authentication only — products keep their own authorization. Runs end-to-end with `docker compose up`.',
      nl: 'Een werkende self-hosted identity provider: OAuth 2.0 + OIDC-tokenuitgifte (RS256, gepubliceerde JWKS), een headless TypeScript-SDK en een drop-in React `<Login/>`. Het geauditeerde beheervlak spreekt zowel HTTP `/admin/v1` als MCP, zodat agents het onder hetzelfde contract bedienen als mensen. Alleen authenticatie — producten houden hun eigen autorisatie. Draait end-to-end met `docker compose up`.',
    },
  },
  // — Applied ML & data science: the two purpose-built COAV demos (a matched pair) and the retail
  //   dynamic-pricing demo. Already public, honestly framed and licensed, so they carry live links
  //   (linkLive) ahead of the gate. —
  {
    slug: 'contrail-segmentation-demo',
    name: 'contrail-segmentation-demo',
    pillar: 'applied',
    role: { en: 'Detect contrails in sky-camera images', nl: 'Detecteer contrails in sky-camera-beelden' },
    maturity: 'working',
    license: null,
    linkLive: true,
    url: 'https://github.com/fps4/contrail-segmentation-demo',
    proves: {
      en: 'A neural-network image-segmentation app — React front end → Node.js (Express) BFF → Python FastAPI service → a hand-written PyTorch U-Net — that detects contrails in sky-camera images and reports coverage and count. Three services, `docker compose up`, CI on GitHub Actions. Trained on a synthetic sky generator so it runs on a laptop in minutes; the README writes down the path to real GVCCS imagery.',
      nl: 'Een neuraal-netwerk-beeldsegmentatie-app — React-frontend → Node.js (Express) BFF → Python FastAPI-service → een zelfgeschreven PyTorch U-Net — die contrails in sky-camera-beelden detecteert en dekking en aantal rapporteert. Drie services, `docker compose up`, CI op GitHub Actions. Getraind op een synthetische lucht-generator zodat het in minuten op een laptop draait; de README beschrijft het pad naar echte GVCCS-beelden.',
    },
  },
  {
    slug: 'contrail-avoidance-pipeline',
    name: 'contrail-avoidance-pipeline',
    pillar: 'applied',
    role: { en: 'Decide which flights to reroute — and at what cost', nl: 'Bepaal welke vluchten omgeleid worden — en tegen welke kosten' },
    maturity: 'working',
    license: null,
    linkLive: true,
    url: 'https://github.com/fps4/contrail-avoidance-pipeline',
    proves: {
      en: 'A Polars/Pandas pipeline plus a Databricks-style notebook that flag which flights form persistent, climate-warming contrails — via the Schmidt–Appleman Criterion and ice-supersaturated regions — and propose altitude changes, weighing avoided climate forcing (CO₂e) against extra fuel burn. Lakehouse-shaped and laptop-runnable, with a documented path to ERA5 and OpenSky data.',
      nl: 'Een Polars/Pandas-pipeline plus een Databricks-achtige notebook die bepalen welke vluchten persistente, klimaatopwarmende contrails vormen — via het Schmidt–Appleman-criterium en ijs-oververzadigde regio\'s — en hoogtewijzigingen voorstellen, waarbij vermeden klimaatforcering (CO₂e) wordt afgewogen tegen extra brandstofverbruik. Lakehouse-vormig en laptop-draaibaar, met een gedocumenteerd pad naar ERA5- en OpenSky-data.',
    },
  },
  // — Retail dynamic pricing: one lakehouse, two pricing verticals. Public, honestly framed and
  //   MIT-licensed, so it carries a live link (linkLive) ahead of the gate. —
  {
    slug: 'retail-dynamic-pricing',
    name: 'retail-dynamic-pricing',
    pillar: 'applied',
    role: { en: 'Price retail at scale — elasticity to optimization', nl: 'Prijs retail op schaal — van elasticiteit tot optimalisatie' },
    maturity: 'working',
    license: 'MIT',
    linkLive: true,
    url: 'https://github.com/fps4/retail-dynamic-pricing',
    proves: {
      en: 'A retail dynamic-pricing platform on a Databricks lakehouse: one elasticity-to-optimization engine serving two verticals — grocery (markdown) and consumer electronics (MAP-compliant lifecycle). Log-log demand estimation checked against a known ground truth, plus a solver-agnostic revenue optimizer. Two notebooks run end-to-end on a laptop on synthetic data — +6.4% revenue at flat margin.',
      nl: 'Een dynamic-pricing-platform voor retail op een Databricks-lakehouse: één elasticiteit-naar-optimalisatie-engine die twee verticals bedient — grocery (afprijzing) en consumentenelektronica (MAP-conforme lifecycle). Log-log vraagschatting getoetst aan een bekende grondwaarheid, plus een solver-agnostische omzetoptimalisator. Twee notebooks draaien end-to-end op een laptop op synthetische data — +6,4% omzet bij gelijke marge.',
    },
  },
  // — Marketplace ranking: a reference AI Application Platform — the ML-platform layer
  //   (feature store → serving → experimentation → eval gate) around a ranking model. Public,
  //   honestly framed (README honesty statement) and MIT-licensed, so it carries a live link. —
  {
    slug: 'marketplace-intel-platform',
    name: 'marketplace-intel-platform',
    pillar: 'applied',
    role: { en: 'Rank a marketplace — feature store to eval gate', nl: 'Rangschik een marktplaats — feature store tot eval-gate' },
    maturity: 'working',
    license: 'MIT',
    linkLive: true,
    url: 'https://github.com/fps4/marketplace-intel-platform',
    proves: {
      en: 'A reference AI application platform for marketplace ranking: a LightGBM learning-to-rank model and a GenAI explanation overlay behind one typed capability contract, fed by a Feast feature store with point-in-time-correct training and serving. An eval harness — ranking quality and explanation faithfulness — is wired as a CI deploy gate that blocks a regression. `make demo` runs it end-to-end: +12.7% NDCG@10.',
      nl: 'Een referentie-AI-applicatieplatform voor het rangschikken op een marktplaats: een LightGBM learning-to-rank-model en een GenAI-uitleg-overlay achter één getypeerd capability-contract, gevoed door een Feast-feature-store met point-in-time-correcte training en serving. Een evaluatieharnas — rangschikkingskwaliteit én uitleg-getrouwheid — is een CI-deploypoort die een regressie blokkeert. `make demo` draait het end-to-end: +12,7% NDCG@10.',
    },
  },
];
