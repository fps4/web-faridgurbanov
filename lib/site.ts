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
 * WhatsApp click-to-chat (FS-0007/US-0016). Stored split so the full number never appears as one
 * string in the exported HTML — same reasoning as the obfuscated email: the affordance is for
 * visitors, not for scrapers. Assembled in the browser by `whatsappHref()`.
 *
 * International format, digits only, no `+` and no spaces. `cc` is the country code.
 *
 * This is the **Rinkel business number** (+31 30 207 2959), not the personal mobile, so the public
 * surface and the CV contact number stay separate. Set to `null` to remove the WhatsApp affordance
 * from the whole site.
 *
 * Verified 2026-08-20: https://wa.me/31302072959 resolves to the WhatsApp Business profile
 * "Fusion Platform Services", so visitors see a business name rather than a bare number. Re-check
 * this if the number ever changes — wa.me only resolves for a number registered on WhatsApp, and an
 * unregistered one renders a working link that lands on "the phone number shared via url is
 * invalid", which is a worse failure than having no button.
 */
export const whatsapp: { cc: string; rest: string } | null = { cc: '31', rest: '302072959' };

/** Build a wa.me click-to-chat URL. Call from the browser only (see the note on `whatsapp`). */
export function whatsappHref(message?: string): string | undefined {
  if (!whatsapp) return undefined;
  const query = message?.trim() ? `?text=${encodeURIComponent(message.trim())}` : '';
  return `https://wa.me/${whatsapp.cc}${whatsapp.rest}${query}`;
}

/**
 * Optional self-hosted intro video for the home page (FS-0002). WHILE this is `null` the home page
 * renders no video section at all — an empty player is worse than none. Set it once the file is
 * recorded and encoded into `public/media/`; see docs/guides/intro-video.md for what to record, how
 * to encode it, and the caption requirement.
 *
 * Self-hosted deliberately: an embedded YouTube or Vimeo player would put a third-party processor
 * and its cookies on the highest-traffic page, and the privacy page's "nothing is collected" claim
 * would stop being true (FS-0007).
 */
export interface IntroVideo {
  /** Path under public/, e.g. '/media/intro.mp4'. H.264/AAC in an MP4 container. */
  src: string;
  /** Poster frame shown before playback, e.g. '/media/intro-poster.jpg'. Required. */
  poster: string;
  /** WebVTT caption track per locale. Required — an uncaptioned intro excludes people. */
  captions: Record<Locale, string>;
  /** Human-readable running time, e.g. '1:50'. Shown next to the heading so nobody is ambushed. */
  duration: string;
}

export const INTRO_VIDEO: IntroVideo | null = null;

/**
 * ADR-0004 gate — now discharged (ADR-0006). The gate existed for the two `sovereign-*` repos,
 * whose naming, neutralization and licensing prerequisites were never met; those repos were
 * removed from the public surface instead, so every remaining card is already public, honestly
 * framed and licensed. Kept as a flag rather than deleted: a future repo that is not yet fit to
 * link flips this off again without a structural change (FS-0005).
 */
export const REPO_LINKS_ENABLED = true;

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
export type Pillar = 'data' | 'modernization' | 'platform';

export interface PillarMeta {
  id: Pillar;
  label: Record<Locale, string>;
  /** One line saying what the group is evidence *of* — the buyer's words, not the stack's. */
  lede: Record<Locale, string>;
}

// Portfolio groups by pillar in this order (ADR-0007). The three groups are named after the three
// things a data or integration architect is actually engaged to do — decide and model the target,
// move an estate onto it, and run the platform underneath — rather than after technology families.
// The earlier "AI & applied ML" group was dissolved: after the pricing and ranking demos came off
// the surface it held one repo, and AI was pulling attention away from the positioning rather than
// supporting it. Pure data, so regrouping stays a one-line change.
export const pillars: PillarMeta[] = [
  {
    id: 'data',
    label: { en: 'Data architecture & modelling', nl: 'Data-architectuur & modellering' },
    lede: {
      en: 'Deciding what the target looks like, and what crosses the seam to get there.',
      nl: 'Bepalen hoe het doelmodel eruitziet, en wat de naad oversteekt om er te komen.',
    },
  },
  {
    id: 'modernization',
    label: { en: 'Modernization & migration', nl: 'Modernisering & migratie' },
    lede: {
      en: 'Moving a live estate wave by wave, with parity gates instead of a big-bang weekend.',
      nl: 'Een draaiend landschap wave voor wave verplaatsen, met pariteitspoorten in plaats van een big-bang-weekend.',
    },
  },
  {
    id: 'platform',
    label: { en: 'Integration & platform services', nl: 'Integratie & platformdiensten' },
    lede: {
      en: 'The self-service spine the teams downstream actually operate.',
      nl: 'De selfservice-ruggengraat die de teams stroomafwaarts echt bedienen.',
    },
  },
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
   * Per-repo public-link override on the site-wide REPO_LINKS_ENABLED gate. Omitted = follow the
   * gate. `true` forces a link on while the gate is off; **`false` forces it off while the gate is
   * on** — which is the case that matters now that the gate is open: a repo that exists locally but
   * has not been pushed yet must render its card without a dead link.
   */
  linkLive?: boolean;
  /**
   * The card body: what this repo proves, in the buyer's words. **Keep it to 40-70 words (roughly
   * 250-450 characters) in both locales** — the cards sit side by side in a three-column grid, so
   * an essay in one tile makes its neighbours look thin and nobody reads any of them. Enforced by
   * `PROVES_MAX_WORDS` in `lib/site.test.ts`.
   *
   * The shape that fits: one sentence saying what the repo is, one carrying the single strongest
   * concrete finding (a measured number, not a list of them), and the run command last. Everything
   * that does not fit belongs in the repo's own README — this is the hook, not the summary.
   */
  proves: Record<Locale, string>;
}

// Build proof across three areas (FS-0005), each card carrying an honest maturity label. Every repo
// listed here is public, licensed, honestly framed, and runs end-to-end (`working`) — the `reference`
// label stays in the type because a future card may need it, not because anything uses it today.
// Repos still being built are tracked in docs/notes/portfolio-repos-build-plan.md and added here
// only once they are real.
export const repos: Repo[] = [
  // — Data architecture & modelling —
  {
    slug: 'enterprise-data-model-lab',
    name: 'enterprise-data-model-lab',
    pillar: 'data',
    role: { en: 'Model one domain four ways', nl: 'Modelleer één domein op vier manieren' },
    maturity: 'working',
    license: 'MIT',
    url: 'https://github.com/fps4/enterprise-data-model-lab',
    proves: {
      en: 'One retail domain modelled four ways — glossary, conceptual, logical, then two physical targets from identical staging: Kimball dimensional and a Data Vault 2.0 raw vault. Fourteen assertions guard every build, and the trade-off is measured rather than argued: 1 join and 0.79 ms against 3 joins and 302 ms, at 3× the rows stored. Runs with `make demo`.',
      nl: 'Eén retaildomein op vier manieren gemodelleerd — glossary, conceptueel, logisch, en dan twee fysieke doelen uit identieke staging: Kimball-dimensioneel en een Data Vault 2.0 raw vault. Veertien assertions bewaken elke build, en de afweging wordt gemeten in plaats van beweerd: 1 join en 0,79 ms tegen 3 joins en 302 ms, bij 3× zoveel opgeslagen rijen. Draait met `make demo`.',
    },
  },
  {
    slug: 'sap-bdc-snowflake-blueprint',
    name: 'sap-bdc-snowflake-blueprint',
    pillar: 'data',
    role: { en: 'Decide what crosses the SAP↔cloud seam', nl: 'Bepaal wat de SAP↔cloud-naad oversteekt' },
    maturity: 'working',
    license: 'MIT',
    linkLive: true,
    url: 'https://github.com/fps4/sap-bdc-snowflake-blueprint',
    proves: {
      en: 'A one-page SAP → Business Data Cloud/Datasphere → Snowflake reference architecture with the decision attached: nine ordered rules assign each of 24 objects a mode — share, replicate, federate, split, or keep it in SAP — where residency and SLOs eliminate and cost only chooses among what survives. A local DuckDB simulation runs the modes, so the claim is measured. Runs with `make demo`.',
      nl: 'Een SAP → Business Data Cloud/Datasphere → Snowflake-referentiearchitectuur van één pagina, met de beslissing erbij: negen geordende regels wijzen elk van 24 objecten een modus toe — delen, repliceren, federeren, splitsen, of in SAP houden — waarbij dataresidentie en SLO\'s elimineren en kosten alleen kiezen uit wat overblijft. Een lokale DuckDB-simulatie draait de modi, zodat de claim gemeten is. Draait met `make demo`.',
    },
  },
  {
    slug: 'azure-lakehouse-decision',
    name: 'azure-lakehouse-decision',
    pillar: 'data',
    role: { en: 'Decide where a Synapse estate goes', nl: 'Bepaal waar een Synapse-landschap heen gaat' },
    maturity: 'working',
    license: 'MIT',
    linkLive: true,
    url: 'https://github.com/fps4/azure-lakehouse-decision',
    proves: {
      en: 'Microsoft Fabric or Databricks-on-Azure for a 20-workload Synapse estate, decided per workload rather than per feature: nine ordered rules where residency, streaming semantics and ML lifecycle eliminate, and cost only chooses among what survives. A Fabric workload has no standalone price — one more costs nothing until the pre-paid capacity saturates, and then costs a whole rung. Runs with `make demo`, no Azure subscription.',
      nl: 'Microsoft Fabric of Databricks-op-Azure voor een Synapse-landschap van 20 workloads, beslist per workload in plaats van per feature: negen geordende regels waarbij dataresidentie, streamingsemantiek en ML-levenscyclus elimineren, en kosten alleen kiezen uit wat overblijft. Een Fabric-workload heeft geen eigen prijs — één extra kost niets tot de vooruitbetaalde capaciteit vol is, en daarna een hele trede. Draait met `make demo`, zonder Azure-abonnement.',
    },
  },
  {
    slug: 'ai-first-bi-platform',
    name: 'ai-first-bi-platform',
    pillar: 'data',
    role: { en: "Decide what 'active customer' means", nl: "Bepaal wat 'actieve klant' betekent" },
    maturity: 'working',
    license: 'MIT',
    linkLive: true,
    url: 'https://github.com/fps4/ai-first-bi-platform',
    proves: {
      en: 'Three defensible definitions of “active customer” — Operations’, Analytics’ and Finance’ — built in a real dbt project, returning 953, 900 and 881 on the same estate on the same date. Nobody is wrong, and no dashboard says which one it is showing. The load-bearing finding: the operational table cannot answer the question at all, because its `status` column is overwritten in place. Runs with `make demo`.',
      nl: 'Drie verdedigbare definities van “actieve klant” — die van Operations, Analytics en Finance — gebouwd in een echt dbt-project, met 953, 900 en 881 als uitkomst op hetzelfde landschap op dezelfde datum. Niemand heeft ongelijk, en geen enkel dashboard zegt welke het toont. De dragende bevinding: de operationele tabel kán de vraag niet beantwoorden, omdat een `status`-kolom ter plekke wordt overschreven. Draait met `make demo`.',
    },
  },
  // — Modernization & migration —
  {
    slug: 'legacy-dwh-migration',
    name: 'legacy-dwh-migration',
    pillar: 'modernization',
    role: { en: 'Move a warehouse wave by wave', nl: 'Verhuis een warehouse wave voor wave' },
    maturity: 'working',
    license: 'MIT',
    url: 'https://github.com/fps4/legacy-dwh-migration',
    proves: {
      en: 'A legacy warehouse migrated wave by wave, with the programme artefacts as code. The assessment is crawled from the estate rather than read from an inventory — it finds 36% of objects never queried, and separates the genuinely retirable from the dormant but load-bearing. Cutover is gated by a parity harness with one defect injected on purpose, so the gate is demonstrably a gate. Runs with `make demo`.',
      nl: 'Een legacy warehouse dat wave voor wave wordt gemigreerd, met de programma-artefacten als code. De assessment wordt uit het landschap zelf gehaald in plaats van uit een inventarislijst — 36% van de objecten blijkt nooit bevraagd, en wat echt uitgefaseerd kan worden wordt gescheiden van wat slapend maar dragend is. Cutover wordt bewaakt door een pariteitsharnas met bewust één geïnjecteerd defect, zodat aantoonbaar is dat de poort werkt. Draait met `make demo`.',
    },
  },
  {
    slug: 'oracle-to-spring-strangler',
    name: 'oracle-to-spring-strangler',
    pillar: 'modernization',
    role: { en: 'Modernize legacy live, wave by wave', nl: 'Moderniseer legacy live, wave voor wave' },
    maturity: 'working',
    license: 'MIT',
    linkLive: true,
    url: 'https://github.com/fps4/oracle-to-spring-strangler',
    proves: {
      en: 'A working legacy-modernization lab: an Oracle PL/SQL + ORDS system migrated live to Spring Boot + PostgreSQL by the strangler fig pattern. Per-endpoint cutover waves in an nginx router — a wave is a PR, rollback is a git revert — with golden-master parity gates as wave exit criteria. Runs with `docker compose up`.',
      nl: 'Een werkend legacy-moderniseringslab: een Oracle PL/SQL + ORDS-systeem live gemigreerd naar Spring Boot + PostgreSQL via het strangler-fig-patroon. Cutover-waves per endpoint in een nginx-router — een wave is een PR, rollback een git revert — met golden-master-pariteitspoorten als exitcriteria. Draait met `docker compose up`.',
    },
  },
  // — Integration & platform services —
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
      en: 'A Kafka-native, multi-tenant event-streaming and integration platform: REST→Kafka ingest, managed JSONata transforms with DLQ and replay, Kafka Connect sinks, a control-plane API and a drag-and-drop pipeline UI, all under workspace-scoped observability. The self-service spine an integration team actually operates. Runs with `docker compose up`.',
      nl: 'Een Kafka-native, multi-tenant platform voor event-streaming en integratie: REST→Kafka-ingest, beheerde JSONata-transformaties met DLQ en replay, Kafka Connect-sinks, een control-plane-API en een drag-and-drop pipeline-UI, alles onder workspace-scoped observability. De selfservice-ruggengraat die een integratieteam echt bedient. Draait met `docker compose up`.',
    },
  },
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
      en: 'A working self-hosted identity provider: OAuth 2.0 + OIDC token issuance (RS256, published JWKS), a headless TypeScript SDK and a drop-in React `<Login/>`. Its audited management plane speaks both HTTP and MCP, so agents operate it under the same contract as people. Authentication only — products keep their own authorization. Runs with `docker compose up`.',
      nl: 'Een werkende self-hosted identity provider: OAuth 2.0 + OIDC-tokenuitgifte (RS256, gepubliceerde JWKS), een headless TypeScript-SDK en een drop-in React `<Login/>`. Het geauditeerde beheervlak spreekt zowel HTTP als MCP, zodat agents het onder hetzelfde contract bedienen als mensen. Alleen authenticatie — producten houden hun eigen autorisatie. Draait met `docker compose up`.',
    },
  },
  {
    slug: 'skills-coach',
    name: 'skills-coach',
    pillar: 'platform',
    role: { en: 'Keep the model outside the runtime', nl: 'Houd het model buiten de runtime' },
    maturity: 'working',
    license: 'MIT',
    linkLive: true,
    url: 'https://github.com/fps4/skills-coach',
    proves: {
      en: 'A pack-driven training platform that ships no model client at all: the runtime owns the packs, deterministic grading, spaced-repetition gating and a durable model of what a learner keeps getting wrong. Generation and correction sit behind a versioned coach API, so the caller can be a person today and a model API later. Runs with `make up`.',
      nl: 'Een pack-gedreven trainingsplatform dat zelf geen enkele model-client bevat: de runtime bezit de packs, deterministische beoordeling, spaced-repetition-poorten en een duurzaam model van wat een lerende blijft fout doen. Generatie en correctie zitten achter een geversioneerde coach-API, dus de aanroeper kan vandaag een mens zijn en later een model-API. Draait met `make up`.',
    },
  },
];
