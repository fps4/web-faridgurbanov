'use client';

import * as React from 'react';
import { site } from '@/lib/site';

// Exposes the email as a working mailto without putting a plain `user@domain` string in the static
// HTML (FS-0007: protected against naive scraping). The address is assembled from parts in the
// browser; a non-mailto fallback shows the human-readable form for no-JS readers. With a label
// (`children`) the anchor keeps that label and the fallback sits next to it in a <noscript>, so a
// visitor without JavaScript still sees `user [at] domain` and nobody else sees it (art-r903t1r2tp).
export function ObfuscatedEmail({
  className,
  fallbackClassName,
  subject,
  children,
}: {
  className?: string;
  fallbackClassName?: string;
  subject?: string;
  children?: React.ReactNode;
}) {
  const [href, setHref] = React.useState<string | undefined>(undefined);
  const address = `${site.email.user}@${site.email.domain}`;

  React.useEffect(() => {
    const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
    setHref(`mailto:${address}${query}`);
  }, [address, subject]);

  // Default label: the address with the @ shown as " [at] " until JS hydrates the real mailto.
  const label = children ?? (href ? address : `${site.email.user} [at] ${site.email.domain}`);
  return (
    <>
      <a className={className} href={href} rel="nofollow">
        {label}
      </a>
      {children && (
        <noscript>
          <span className={fallbackClassName}>{`${site.email.user} [at] ${site.email.domain}`}</span>
        </noscript>
      )}
    </>
  );
}
