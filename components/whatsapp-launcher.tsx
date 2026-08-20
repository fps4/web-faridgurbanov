'use client';

import * as React from 'react';
import { MessageCircle } from 'lucide-react';
import { whatsapp, whatsappHref } from '@/lib/site';

// Site-wide WhatsApp click-to-chat launcher (FS-0007/US-0016). A link, not a widget: no SDK, no
// iframe, no script from Meta — the visitor's own WhatsApp opens with a chat addressed to the owner,
// and they press send themselves. That keeps the static export honest (ADR-0001) and keeps the
// privacy story accurate: nothing leaves the page until the visitor chooses this channel.
//
// The number is assembled in the browser (see `whatsapp` in lib/site.ts) so it is not sitting in the
// exported HTML for scrapers. Until hydration the button is simply not rendered — a dead button is
// worse than no button, and the contact page carries the same affordance without JS.
export function WhatsAppLauncher({ label, prefill }: { label: string; prefill: string }) {
  const [href, setHref] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    setHref(whatsappHref(prefill));
  }, [prefill]);

  if (!whatsapp || !href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener nofollow"
      aria-label={label}
      title={label}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-3 text-sm font-medium shadow-lg transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring print:hidden"
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
