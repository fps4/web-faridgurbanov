import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SiteHeader } from '@/components/site-header';
import { locales } from '@/lib/i18n';

vi.mock('next/navigation', () => ({ usePathname: () => '/en' }));

// Maestro story art-26rhtzey62: the top bar is the name, then Work, Practice and Contact, then the
// language switcher. The test reads what a visitor gets, not how it is styled.
describe('the header', () => {
  it.each(locales)('has the name and the three links, in order, then the language switcher, in %s', (l) => {
    render(SiteHeader({ locale: l }));

    const name = screen.getByRole('link', { name: /Farid Gurbanov/ });
    expect(name.getAttribute('href')).toBe(`/${l}`);
    expect(name.textContent).toBe('Farid Gurbanov');

    const primary = screen.getByRole('navigation', { name: 'Primary' });
    const links = within(primary).getAllByRole('link');
    expect(links.map((a) => a.textContent)).toEqual(['Work', 'Practice', 'Contact']);
    expect(links.map((a) => a.getAttribute('href'))).toEqual([`/${l}/work`, `/${l}/practice`, `/${l}#contact`]);

    const language = screen.getByRole('navigation', { name: 'Language' });
    expect(language.textContent).toContain(l.toUpperCase());

    const order = [name, primary, language];
    for (let i = 1; i < order.length; i++) {
      expect(order[i - 1].compareDocumentPosition(order[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });
});
