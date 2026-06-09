import type { Locale } from '@/lib/i18n';

// A single nav definition driving the header in both languages (FS-0001, US-0002). The set is
// milestone-aware: in M0 Training is a CTA stub (rendered as a button, not a nav link); in M1 it
// becomes a full nav item — flip TRAINING_IN_NAV with no shell code change.

export interface NavItem {
  /** Path under the locale segment, e.g. '/work' → /en/work. '' is the home root. */
  href: string;
  label: Record<Locale, string>;
}

/** Primary header navigation (excludes Training — see TRAINING_IN_NAV / the taster CTA). */
export const primaryNav: NavItem[] = [
  { href: '/expertise', label: { en: 'Expertise', nl: 'Expertise' } },
  { href: '/work', label: { en: 'Selected work', nl: 'Geselecteerd werk' } },
  { href: '/portfolio', label: { en: 'Portfolio', nl: 'Portfolio' } },
  { href: '/writing', label: { en: 'Writing', nl: 'Blog' } },
  { href: '/contact', label: { en: 'Contact', nl: 'Contact' } },
];

/** The training entry. M0: CTA stub only (TRAINING_IN_NAV = false). M1: also a nav item. */
export const trainingNav: NavItem = {
  href: '/training',
  label: { en: 'Training', nl: 'Training' },
};

/** M0 renders Training as a CTA button; M1 promotes it into primaryNav. */
export const TRAINING_IN_NAV = false;

export function headerNav(): NavItem[] {
  return TRAINING_IN_NAV ? [...primaryNav, trainingNav] : primaryNav;
}

/** Build a locale-prefixed href: hrefFor('en', '/work') → '/en/work'; home → '/en'. */
export function hrefFor(locale: Locale, href: string): string {
  return `/${locale}${href}`;
}
