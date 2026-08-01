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
      en: 'A working, pack-driven training platform that draws the line agentic products usually blur: the runtime owns the packs, deterministic rule-based grading, spaced-repetition gating and a durable model of what a learner keeps getting wrong — and ships no model client at all. Generation and free-form correction sit behind a versioned coach API (`/coach/v1`), so the caller can be a person driving an LLM CLI today and a model API later without the contract moving. Fastify + Next.js on MongoDB, authentication delegated to identity-service, training content deliberately kept out of the repo. Runs end-to-end with `make up`.',
      nl: 'Een werkend, pack-gedreven trainingsplatform dat de grens trekt die agentische producten meestal vervagen: de runtime bezit de packs, deterministische regelgebaseerde beoordeling, spaced-repetition-poorten en een duurzaam model van wat een lerende blijft fout doen — en bevat zelf geen enkele model-client. Generatie en vrije-tekstcorrectie zitten achter een geversioneerde coach-API (`/coach/v1`), zodat de aanroeper vandaag een mens met een LLM-CLI kan zijn en later een model-API, zonder dat het contract verschuift. Fastify + Next.js op MongoDB, authenticatie gedelegeerd aan identity-service, trainingsinhoud bewust buiten de repo gehouden. Draait end-to-end met `make up`.',
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
      en: 'A Kafka-native, multi-tenant event-streaming & integration platform: REST→Kafka ingest, managed JSONata transforms with DLQ + replay, Kafka Connect HTTP/S3 sinks, a control-plane API and a drag-and-drop pipeline UI, all under workspace-scoped observability. Runs locally with `docker compose up`.',
      nl: 'Een Kafka-native, multi-tenant platform voor event-streaming & integratie: REST→Kafka-ingest, beheerde JSONata-transformaties met DLQ + replay, Kafka Connect HTTP/S3-sinks, een control-plane-API en een drag-and-drop pipeline-UI, alles onder workspace-scoped observability. Draait lokaal met `docker compose up`.',
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
      en: 'A working legacy-modernization lab: an Oracle PL/SQL + ORDS "legacy" system migrated live to a Spring Boot + PostgreSQL service by the strangler fig pattern. AI-assisted assessment artifacts (business-rule catalog, dependency map), per-endpoint cutover waves in an nginx router — a wave is a PR, rollback is a git revert — and golden-master parity gates as wave exit criteria. Runs end-to-end with `docker compose up`.',
      nl: 'Een werkend legacy-moderniseringslab: een Oracle PL/SQL + ORDS "legacy"-systeem live gemigreerd naar een Spring Boot + PostgreSQL-service via het strangler-fig-patroon. AI-ondersteunde assessment-artefacten (business-rule-catalogus, dependency-map), cutover-waves per endpoint in een nginx-router — een wave is een PR, rollback een git revert — en golden-master-pariteitspoorten als exitcriteria per wave. Draait end-to-end met `docker compose up`.',
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
      en: 'A working self-hosted identity provider: OAuth 2.0 + OIDC token issuance (RS256, published JWKS), one deployment = one realm over a shared user pool, a headless TypeScript SDK, an opt-in drop-in React `<Login/>`, and an authenticated management plane for applications, credentials, users, entitlements and signing keys — network-restricted, scoped per actor, append-only audited, and exposed both as HTTP `/admin/v1` and as an MCP server so agents can operate it under the same contract. It owns authentication only; consuming products keep their own authorization. Runs end-to-end with `docker compose up`.',
      nl: 'Een werkende self-hosted identity provider: OAuth 2.0 + OIDC-tokenuitgifte (RS256, gepubliceerde JWKS), één deployment = één realm over een gedeelde gebruikerspool, een headless TypeScript-SDK, een opt-in drop-in React `<Login/>`, en een geauthenticeerd beheervlak voor applicaties, credentials, gebruikers, rechten en ondertekeningssleutels — netwerkbeperkt, per actor gescoped, append-only geauditeerd, en ontsloten zowel als HTTP `/admin/v1` als via een MCP-server zodat agents het onder hetzelfde contract kunnen bedienen. Het bezit alleen authenticatie; afnemende producten houden hun eigen autorisatie. Draait end-to-end met `docker compose up`.',
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
      en: 'A neural-network image-segmentation app — React + TypeScript front end → Node.js (Express) BFF → Python FastAPI service → a hand-written PyTorch U-Net — that detects contrails in sky-camera images and reports coverage and contrail count. Three services that run end-to-end with `docker compose up`, with CI on GitHub Actions. Trained on a synthetic sky generator so it runs on a laptop in minutes; the README writes down the path to real GVCCS / Sky-Cam imagery.',
      nl: 'Een neuraal-netwerk-beeldsegmentatie-app — React + TypeScript-frontend → Node.js (Express) BFF → Python FastAPI-service → een zelfgeschreven PyTorch U-Net — die contrails in sky-camera-beelden detecteert en dekking en aantal rapporteert. Drie services die end-to-end draaien met `docker compose up`, met CI op GitHub Actions. Getraind op een synthetische lucht-generator zodat het in minuten op een laptop draait; de README beschrijft het pad naar echte GVCCS / Sky-Cam-beelden.',
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
      en: 'A Polars/Pandas pipeline plus a Databricks-style notebook that flag which flights form persistent, climate-warming contrails — using the Schmidt–Appleman Criterion and ice-supersaturated regions — and propose altitude changes, weighing avoided climate forcing (CO₂e) against extra fuel burn. Lakehouse-shaped (Parquet, Delta / Unity-Catalog framing) and runs end-to-end on a laptop, with a documented path to ERA5 reanalysis + OpenSky real flight data.',
      nl: 'Een Polars/Pandas-pipeline plus een Databricks-achtige notebook die bepalen welke vluchten persistente, klimaatopwarmende contrails vormen — via het Schmidt–Appleman-criterium en ijs-oververzadigde regio\'s — en hoogtewijzigingen voorstellen, waarbij vermeden klimaatforcering (CO₂e) wordt afgewogen tegen extra brandstofverbruik. Lakehouse-vormig (Parquet, Delta / Unity-Catalog-framing) en draait end-to-end op een laptop, met een gedocumenteerd pad naar ERA5-reanalyse + OpenSky-vluchtdata.',
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
      en: 'A retail dynamic-pricing platform on a Databricks lakehouse: one elasticity-to-optimization engine serving two verticals — grocery (elasticity & markdown) and consumer electronics (competitive & lifecycle, MAP-compliant). Log-log demand estimation checked against a known ground truth, a solver-agnostic revenue optimizer (SciPy by default, Gurobi MIQP backend), and Delta Live Tables / Workflow pipelines. Two notebooks run end-to-end on a laptop on synthetic data — +6.4% revenue at flat margin in the grocery run — with the path to production written down.',
      nl: 'Een dynamic-pricing-platform voor retail op een Databricks-lakehouse: één elasticiteit-naar-optimalisatie-engine die twee verticals bedient — grocery (elasticiteit & afprijzing) en consumentenelektronica (competitief & lifecycle, MAP-conform). Log-log vraagschatting getoetst aan een bekende grondwaarheid, een solver-agnostische omzetoptimalisator (standaard SciPy, Gurobi-MIQP-backend), en Delta Live Tables / Workflow-pipelines. Twee notebooks draaien end-to-end op een laptop op synthetische data — +6,4% omzet bij gelijke marge in de grocery-run — met het pad naar productie opgeschreven.',
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
      en: 'A reference AI Application Platform for travel-marketplace ranking: a LightGBM learning-to-rank model and a GenAI explanation overlay registered behind one typed capability contract, fed by a real Feast feature store with point-in-time-correct training and online serving (no train/serve skew). A FastAPI serving API, a deterministic online-experiment framework (CUPED variance reduction plus an honest marketplace-interference caveat), and an evaluation harness — ranking quality and GenAI-explanation faithfulness — wired as a CI deploy gate that blocks a regression. Runs end-to-end on a laptop with `make demo` on synthetic data (+12.7% NDCG@10 over a popularity baseline), CI green on GitHub Actions.',
      nl: 'Een referentie-AI-applicatieplatform voor het rangschikken van reiservaringen op een marktplaats: een LightGBM learning-to-rank-model en een GenAI-uitleg-overlay geregistreerd achter één getypeerd capability-contract, gevoed door een echte Feast-feature-store met point-in-time-correcte training en online serving (geen train/serve-skew). Een FastAPI-serving-API, een deterministisch online-experimentraamwerk (CUPED-variantiereductie plus een eerlijk voorbehoud over marktplaats-interferentie), en een evaluatieharnas — rangschikkingskwaliteit én GenAI-uitleg-getrouwheid — als CI-deploypoort die een regressie blokkeert. Draait end-to-end op een laptop met `make demo` op synthetische data (+12,7% NDCG@10 t.o.v. een populariteitsbasislijn), CI groen op GitHub Actions.',
    },
  },
];
