import type { Locale } from '@/lib/i18n';

// A single nav definition driving the header in both languages (FS-0001). The header is Work,
// Practice, Contact, in that order (decision art-896t5kxfka §5, maestro story art-y97cjsakwq).
// Contact is a part of the home page, not a page of its own (maestro story art-r903t1r2tp), so its
// href is the anchor: hrefFor('en', '#contact') → '/en#contact', one click from any page.

/** The Contact part of the home page (art-r903t1r2tp). The id of that section is `contact`. */
export const CONTACT_HREF = '#contact';

export interface NavItem {
  /** Path under the locale segment, e.g. '/work' → /en/work. '' is the home root; '#contact' the Contact part of home. */
  href: string;
  label: Record<Locale, string>;
}

/** Primary header navigation. */
export const primaryNav: NavItem[] = [
  { href: '/work', label: { en: 'Work', nl: 'Werk' } },
  { href: '/practice', label: { en: 'Practice', nl: 'Werkwijze' } },
  { href: CONTACT_HREF, label: { en: 'Contact', nl: 'Contact' } },
];

/**
 * The references page (FS-0009). Footer-only while the set is small: it is reached from the home
 * band, the contact page and the footer, and the footer shows it only WHILE at least one reference
 * is published. Promote it into primaryNav once there are enough to carry a nav slot.
 */
export const referencesNav: NavItem = {
  href: '/references',
  label: { en: 'References', nl: 'Referenties' },
};

export function headerNav(): NavItem[] {
  return primaryNav;
}

/** Build a locale-prefixed href: hrefFor('en', '/work') → '/en/work'; home → '/en'. */
export function hrefFor(locale: Locale, href: string): string {
  return `/${locale}${href}`;
}
