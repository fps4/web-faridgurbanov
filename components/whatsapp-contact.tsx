'use client';

import * as React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { whatsapp, whatsappHref } from '@/lib/site';

// Contact-page WhatsApp affordance (FS-0007/US-0016). The textarea only pre-fills the click-to-chat
// link — nothing is transmitted from this page. The visitor's own WhatsApp opens with the text
// already typed and they press send, which is why the owner receives a verified number to reply to
// without the site ever having a backend.
//
// Degrades on purpose: with no JS the link still points at a plain wa.me chat with no pre-fill.
export function WhatsAppContact({
  heading,
  hint,
  placeholder,
  cta,
  defaultText,
}: {
  heading: string;
  hint: string;
  placeholder: string;
  cta: string;
  defaultText: string;
}) {
  const [text, setText] = React.useState(defaultText);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => setReady(true), []);

  if (!whatsapp) return null;
  const href = ready ? whatsappHref(text) : undefined;

  return (
    <>
      <h2 className="mt-10 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {heading}
      </h2>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">{hint}</p>
      <label className="sr-only" htmlFor="wa-message">
        {placeholder}
      </label>
      <textarea
        id="wa-message"
        rows={3}
        value={text}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        className="mt-3 w-full max-w-sm rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <p className="mt-3">
        <a
          href={href}
          target="_blank"
          rel="noopener nofollow"
          className="inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4 hover:text-foreground"
        >
          {cta}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </p>
    </>
  );
}
