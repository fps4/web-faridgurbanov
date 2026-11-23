import type { Locale } from '@/lib/i18n';

// Site-wide facts and the home-page intro video setting. Kept as plain data. The gates of the
// removed Learning, Portfolio and Training sections are gone (maestro story art-y97cjsakwq,
// following the decision art-896t5kxfka).

export const site = {
  name: 'Farid Gurbanov',
  domain: 'faridgurbanov.com',
  // Contact is mailto-only (no backend, no third-party processor) — see FS-0007 and the privacy
  // page. The address is assembled from parts at render time to resist naive scraping.
  email: { user: 'farid', domain: 'gurbanov.net' },
  linkedin: 'https://www.linkedin.com/in/fgurbanov/',
  // The recommendations tab of the same profile. A reference marked `verified` links here so a
  // reader can check the words at the source (FS-0009).
  linkedinRecommendations: 'https://www.linkedin.com/in/fgurbanov/details/recommendations/',
  github: 'https://github.com/fps4',
  location: { en: 'Eindhoven, Netherlands', nl: 'Eindhoven, Nederland' },
} as const;

// The Work page's two lists (art-vvzsw9ap9e, ADR-0010 §3.3, §5), verbatim from the approved site
// copy: "Work" > "Earlier work, short" and "Also built". Nothing here is written by a builder.

/**
 * Earlier work: one or two lines each, no case page behind it. `lead` is the bold start of the
 * entry as the copy has it and `rest` is the text after it, so `lead + rest` reads as in the copy.
 * `id` is the entry's anchor on /work and is stable: other pages (a reference, a Practice piece)
 * link to `/work#<id>`. Never rename one without redirecting what links to it.
 */
export interface EarlierWorkEntry {
  id: string;
  lead: string;
  rest: string;
}

export const earlierWork: readonly EarlierWorkEntry[] = [
  {
    id: 'earlier-sap-events',
    lead: 'SAP events, proof of concept.',
    rest: ' SAP Advanced Event Mesh pushes events to a REST endpoint of the adapter, with retry, dead-letter queue and a pause per event type.',
  },
  {
    id: 'earlier-databricks-review',
    lead: 'Databricks cost and pipeline review.',
    rest: ' Together with a data scientist. The cost of the existing workloads went down by more than a third.',
  },
  {
    id: 'earlier-security-data-lake',
    lead: 'Security data lake for a UK telecom operator',
    rest: ', at Accenture. I designed it from the concept and proved it with a demo. An offshore team brought it to production. 5–10 TB a day.',
  },
  {
    id: 'earlier-sap-finance-snowflake',
    lead: 'SAP Finance to Snowflake for a German manufacturer',
    rest: ', at Accenture. A large proof of concept that I built myself.',
  },
];

/**
 * The Dutch of each entry, by `id` (maestro story art-j9e7z77xy0), verbatim from the approved Dutch
 * copy, "Eerder werk, kort". The ids, and so the anchors, are the English entries'.
 */
const earlierWorkNl: Record<string, Pick<EarlierWorkEntry, 'lead' | 'rest'>> = {
  'earlier-sap-events': {
    lead: 'SAP-events, proof of concept.',
    rest: ' SAP Advanced Event Mesh stuurt events naar een REST-endpoint van de adapter, met retry, dead-letter queue en een pauze per eventtype.',
  },
  'earlier-databricks-review': {
    lead: 'Review van Databricks-kosten en pipelines.',
    rest: ' Samen met een data scientist. De kosten van de bestaande workloads gingen met meer dan een derde omlaag.',
  },
  'earlier-security-data-lake': {
    lead: 'Security data lake voor een Britse telecomoperator',
    rest: ', bij Accenture. Ik heb het ontworpen vanaf het concept en bewezen met een demo. Een offshore team bracht het naar productie. 5–10 TB per dag.',
  },
  'earlier-sap-finance-snowflake': {
    lead: 'SAP Finance naar Snowflake voor een Duitse fabrikant',
    rest: ', bij Accenture. Een grote proof of concept die ik zelf heb gebouwd.',
  },
};

/** The Earlier work list as the locale's page shows it. */
export function earlierWorkFor(locale: Locale): readonly EarlierWorkEntry[] {
  if (locale === 'en') return earlierWork;
  return earlierWork.map((e) => ({ ...e, ...earlierWorkNl[e.id] }));
}

/** The entry's name without the full stop that ends a bold lead in the copy. */
export const earlierWorkTitle = (e: EarlierWorkEntry): string => e.lead.replace(/\.$/, '');

/** The anchor of the Earlier work list on /work; the old case-study addresses lead here. */
export const EARLIER_WORK_ANCHOR = 'earlier-work';

/**
 * Also built: the owner's public repositories, one line each in his words. Only a repository he
 * has chosen and that meets ADR-0004 (public, licensed, neutral, described as what it is) is
 * listed; `camel-quarkus-crash-course` is "not listed for now" in the copy.
 */
export interface AlsoBuiltEntry {
  name: string;
  href: string;
  text: string;
}

export const alsoBuilt: readonly AlsoBuiltEntry[] = [
  {
    name: 'hybrid-kafka-on-azure',
    href: 'https://github.com/fps4/hybrid-kafka-on-azure',
    text: 'My own notes and labs from learning hybrid Kafka on Azure, module by module.',
  },
];

/** The Dutch line of each repository, by name, verbatim from the approved Dutch copy, "Ook gebouwd". */
const alsoBuiltNl: Record<string, string> = {
  'hybrid-kafka-on-azure': 'Mijn eigen aantekeningen en labs van het leren van hybride Kafka op Azure, module voor module.',
};

/** The Also built list as the locale's page shows it. */
export function alsoBuiltFor(locale: Locale): readonly AlsoBuiltEntry[] {
  if (locale === 'en') return alsoBuilt;
  return alsoBuilt.map((r) => ({ ...r, text: alsoBuiltNl[r.name] ?? r.text }));
}

export function emailAddress(): string {
  return `${site.email.user}@${site.email.domain}`;
}

/**
 * WhatsApp click-to-chat (FS-0007/US-0016; the button of maestro story art-r903t1r2tp). Stored split so the full number never appears as one
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

/** Build the wa.me click-to-chat URL. Call from the browser only (see the note on `whatsapp`). */
export function whatsappHref(): string | undefined {
  if (!whatsapp) return undefined;
  return `https://wa.me/${whatsapp.cc}${whatsapp.rest}`;
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
 * The photo that stands in the place of the intro video (art-cxvf6s5t94, decision art-896t5kxfka
 * §4.1) WHILE `INTRO_VIDEO` is null. Served from the site itself (`public/media/`); the file is
 * 800 by 1000 (4 to 5), with no camera, date or location data. The two links are followed only
 * when a visitor clicks them; nothing is loaded from either site.
 */
export const HERO_PHOTO = {
  src: '/media/farid-gurbanov.jpg',
  width: 800,
  height: 1000,
  unescoHref: 'https://whc.unesco.org/en/list/1696',
  wikipediaHref: 'https://en.wikipedia.org/wiki/Khinalug#Addition_to_UNESCO_World_Heritage_List',
} as const;
