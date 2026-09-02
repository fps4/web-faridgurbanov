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
      en: 'One retail domain taken through a business glossary, a conceptual model, a normalised logical model, and two physical targets built from identical staging: Kimball dimensional (SCD Type 2, one stated fact grain) and a Data Vault 2.0 raw vault. Fourteen assertions run on every build — overlapping validity windows, exactly one current row, no-op versions, fact grain, point-in-time joins, satellite keys, and reconciliation between both models and the source. Then the trade-off is measured rather than argued: same question, 1 join and 0.79 ms in Kimball against 3 joins and 302 ms in the vault, at 3× the rows stored. Runs with `make demo`.',
      nl: 'Eén retaildomein doorlopen via een business-glossary, een conceptueel model, een genormaliseerd logisch model, en twee fysieke doelen uit identieke staging: Kimball-dimensioneel (SCD Type 2, één vastgelegde feitengranulariteit) en een Data Vault 2.0 raw vault. Veertien assertions draaien bij elke build — overlappende geldigheidsvensters, precies één actuele rij, no-op-versies, feitengranulariteit, point-in-time-joins, satellietsleutels, en aansluiting tussen beide modellen én de bron. Daarna wordt de afweging gemeten in plaats van beweerd: dezelfde vraag kost 1 join en 0,79 ms in Kimball tegen 3 joins en 302 ms in de vault, bij 3× zoveel opgeslagen rijen. Draait met `make demo`.',
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
      en: 'A one-page SAP → Business Data Cloud/Datasphere → Snowflake reference architecture with the decision attached: nine ordered rules assign each of 24 objects a mode — share zero-copy, replicate, federate, split, or keep it in SAP — where residency and SLOs eliminate and cost only chooses among what survives. A transparent cost model gives the crossover frequency at which replication overtakes federation, and a local DuckDB simulation runs all three modes so the claim is measured. Runs end-to-end with `make demo`; the diagram is the artifact, the engine is what makes it arguable.',
      nl: 'Een SAP → Business Data Cloud/Datasphere → Snowflake-referentiearchitectuur van één pagina, met de beslissing erbij: negen geordende regels wijzen elk van 24 objecten een modus toe — zero-copy delen, repliceren, federeren, splitsen, of in SAP houden — waarbij dataresidentie en SLO\'s elimineren en kosten alleen kiezen uit wat overblijft. Een transparant kostenmodel geeft de omslagfrequentie waarboven repliceren goedkoper wordt dan federeren, en een lokale DuckDB-simulatie draait alle drie de modi zodat de claim gemeten is. Draait end-to-end met `make demo`; het diagram is het artefact, de engine maakt het bespreekbaar.',
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
      en: 'Microsoft Fabric or Databricks-on-Azure for a 20-workload Synapse estate, decided per workload rather than per feature. Nine ordered rules where residency, T-SQL surface, streaming semantics and ML lifecycle eliminate, and cost only chooses among what survives. The structural point is that a Fabric workload has no standalone price: one pre-paid F-SKU carries the estate, so one more workload costs nothing until the capacity saturates and then costs a whole rung — which is why two notebooks end up metered on Databricks solely because they would have stepped F32 to F64, and why unused headroom turns out to be the cheapest compute in the estate. Two eliminations are executed rather than asserted: the same payment stream finishes 3.49% out per window on an ingestion-time engine and exactly right on an event-time one, and a load killed between its two writes leaves 893 torn rows once its multi-table transaction is taken away. One workload has no home at all, and the register says which single fact has to change. Runs with `make demo` — no Azure subscription, no capacity, no Docker.',
      nl: 'Microsoft Fabric of Databricks-op-Azure voor een Synapse-landschap van 20 workloads, beslist per workload in plaats van per feature. Negen geordende regels waarbij dataresidentie, T-SQL-oppervlak, streamingsemantiek en ML-levenscyclus elimineren, en kosten alleen kiezen uit wat overblijft. Het structurele punt: een Fabric-workload heeft geen eigen prijs. Eén vooruitbetaalde F-SKU draagt het hele landschap, dus een extra workload kost niets tot de capaciteit vol is en daarna een hele trede — en dat is waarom twee notebooks op Databricks gemeterd eindigen, puur omdat ze F32 naar F64 zouden duwen, en waarom ongebruikte ruimte de goedkoopste rekenkracht in het landschap blijkt. Twee eliminaties worden uitgevoerd in plaats van beweerd: dezelfde betaalstroom komt op een ingestion-time-engine 3,49% per venster verkeerd uit en op een event-time-engine precies goed, en een load die tussen zijn twee schrijfacties wordt afgebroken laat 893 inconsistente rijen achter zodra je de multi-table-transactie weghaalt. Eén workload heeft helemaal geen bestemming, en het register benoemt welk enkele feit daarvoor moet veranderen. Draait met `make demo` — geen Azure-abonnement, geen capaciteit, geen Docker.',
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
      en: "Three defensible definitions of \u201Cactive customer\u201D \u2014 Operations\u2019, Analytics\u2019 and Finance\u2019 \u2014 built in a real dbt project over five source shapes, returning 953, 900 and 881 on the same estate on the same date. Nobody is wrong, and no dashboard says which one it is showing. The load-bearing finding is that the operational table cannot answer the question at all: a `status` column is overwritten in place, so asked about March it returns today\u2019s answer under a historical label \u2014 no error, no null, a number of the right magnitude from the right table. Only the event stream can, which is why the projection that turns an append-only log into intervals runs in event time rather than arrival time, deduplicates on the producer\u2019s idempotency key, and is gated by nine tests. Then the trade is measured rather than claimed: the same 24 business questions asked over the raw schema and over the metric registry come back 21 of 24 confidently wrong against 0 of 24 \u2014 but the governed path returns a number to only 14 of the 24 and asks a question on the rest, which is the cost, stated in the same table. Every definition is reimplemented independently in Python over the raw log, so the marts are checked against something that is not themselves. Runs with `make demo`.",
      nl: "Drie verdedigbare definities van \u201Cactieve klant\u201D \u2014 die van Operations, Analytics en Finance \u2014 gebouwd in een echt dbt-project over vijf brontypen, met 953, 900 en 881 als uitkomst op hetzelfde landschap op dezelfde datum. Niemand heeft ongelijk, en geen enkel dashboard zegt welke het toont. De dragende bevinding: de operationele tabel k\u00E1n de vraag niet beantwoorden. Een `status`-kolom wordt ter plekke overschreven, dus op de vraag naar maart komt het antwoord van vandaag terug onder een historisch label \u2014 geen fout, geen null, een getal van de juiste orde uit de juiste tabel. Alleen de event-stream kan het wel, en daarom draait de projectie die een append-only log in intervallen omzet op event-tijd in plaats van aankomsttijd, dedupliceert op de idempotency-sleutel van de producer, en wordt ze door negen tests bewaakt. Daarna wordt de afweging gemeten in plaats van beweerd: dezelfde 24 businessvragen, gesteld over het ruwe schema en over het metric-register, komen terug als 21 van de 24 zelfverzekerd fout tegenover 0 van de 24 \u2014 maar het bestuurde pad geeft slechts op 14 van de 24 een getal en stelt op de rest een wedervraag, en dat is de prijs, in dezelfde tabel benoemd. Elke definitie is onafhankelijk opnieuw ge\u00EFmplementeerd in Python over het ruwe log, zodat de marts worden getoetst aan iets anders dan zichzelf. Draait met `make demo`.",
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
      en: 'A legacy warehouse migrated wave by wave, with the programme artefacts as code. The assessment is crawled from the estate — catalog, lineage and a year of query telemetry — not read from an inventory, and it finds that 36% of objects were never queried while separating the ones that are genuinely retirable from the ones that are dormant but load-bearing. The wave plan is a scored model whose weights are config, sequenced under lineage as a hard constraint. Cutover is gated by a three-check parity harness with a tolerance policy written up front, and one defect is injected on purpose so the gate is demonstrably a gate. Ends with a decommission ledger and a business case with a break-even month. Runs with `make demo`.',
      nl: 'Een legacy warehouse dat wave voor wave wordt gemigreerd, met de programma-artefacten als code. De assessment wordt uit het landschap zelf gehaald — catalogus, lineage en een jaar aan query-telemetrie — niet uit een inventarislijst, en vindt dat 36% van de objecten nooit is bevraagd, waarbij onderscheid wordt gemaakt tussen wat echt uitgefaseerd kan worden en wat slapend maar dragend is. Het waveplan is een gescoord model waarvan de wegingen configuratie zijn, gesequenced met lineage als harde randvoorwaarde. Cutover wordt bewaakt door een pariteitsharnas met drie controles en een vooraf vastgelegd tolerantiebeleid, en er wordt bewust één defect geïnjecteerd zodat aantoonbaar is dat de poort werkt. Sluit af met een decommission-ledger en een business case met omslagmaand. Draait met `make demo`.',
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
      en: 'A working legacy-modernization lab: an Oracle PL/SQL + ORDS system migrated live to Spring Boot + PostgreSQL by the strangler fig pattern. AI-assisted assessment artifacts, per-endpoint cutover waves in an nginx router — a wave is a PR, rollback is a git revert — and golden-master parity gates as wave exit criteria. Runs end-to-end with `docker compose up`.',
      nl: 'Een werkend legacy-moderniseringslab: een Oracle PL/SQL + ORDS-systeem live gemigreerd naar Spring Boot + PostgreSQL via het strangler-fig-patroon. AI-ondersteunde assessment-artefacten, cutover-waves per endpoint in een nginx-router — een wave is een PR, rollback een git revert — en golden-master-pariteitspoorten als exitcriteria. Draait end-to-end met `docker compose up`.',
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
      en: 'A Kafka-native, multi-tenant event-streaming and integration platform: REST→Kafka ingest, managed JSONata transforms with DLQ and replay, Kafka Connect HTTP/S3 sinks, a control-plane API and a drag-and-drop pipeline UI, all under workspace-scoped observability. The self-service spine an integration team actually operates. Runs locally with `docker compose up`.',
      nl: 'Een Kafka-native, multi-tenant platform voor event-streaming en integratie: REST→Kafka-ingest, beheerde JSONata-transformaties met DLQ en replay, Kafka Connect HTTP/S3-sinks, een control-plane-API en een drag-and-drop pipeline-UI, alles onder workspace-scoped observability. De selfservice-ruggengraat die een integratieteam echt bedient. Draait lokaal met `docker compose up`.',
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
      en: 'A working self-hosted identity provider: OAuth 2.0 + OIDC token issuance (RS256, published JWKS), a headless TypeScript SDK and a drop-in React `<Login/>`. Its audited management plane speaks both HTTP `/admin/v1` and MCP, so agents operate it under the same contract as people. Authentication only — products keep their own authorization. Runs end-to-end with `docker compose up`.',
      nl: 'Een werkende self-hosted identity provider: OAuth 2.0 + OIDC-tokenuitgifte (RS256, gepubliceerde JWKS), een headless TypeScript-SDK en een drop-in React `<Login/>`. Het geauditeerde beheervlak spreekt zowel HTTP `/admin/v1` als MCP, zodat agents het onder hetzelfde contract bedienen als mensen. Alleen authenticatie — producten houden hun eigen autorisatie. Draait end-to-end met `docker compose up`.',
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
      en: 'A working, pack-driven training platform that ships no model client at all: the runtime owns the packs, deterministic grading, spaced-repetition gating and a durable model of what a learner keeps getting wrong. Generation and correction sit behind a versioned coach API, so the caller can be a person with an LLM CLI today and a model API later. Runs end-to-end with `make up`.',
      nl: 'Een werkend, pack-gedreven trainingsplatform dat zelf geen enkele model-client bevat: de runtime bezit de packs, deterministische beoordeling, spaced-repetition-poorten en een duurzaam model van wat een lerende blijft fout doen. Generatie en correctie zitten achter een geversioneerde coach-API, dus de aanroeper kan vandaag een mens met een LLM-CLI zijn en later een model-API. Draait end-to-end met `make up`.',
    },
  },
];
