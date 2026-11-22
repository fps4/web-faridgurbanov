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
