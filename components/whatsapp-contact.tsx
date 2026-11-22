'use client';

import * as React from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { whatsapp, whatsappHref } from '@/lib/site';

// The WhatsApp button of the Contact part of the home page (FS-0007; maestro story art-r903t1r2tp).
// A plain link to the click-to-chat address of the number lib/site.ts holds, assembled in the
// browser so the full number is not one string in the exported HTML. The page has no message box
// and sends nothing. Renders nothing WHILE `whatsapp` in lib/site.ts is null.
export function WhatsAppButton({ label, className }: { label: string; className?: string }) {
  const [href, setHref] = React.useState<string | undefined>(undefined);
  React.useEffect(() => setHref(whatsappHref()), []);

  if (!whatsapp) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener nofollow"
      className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), className)}
    >
      {label}
    </a>
  );
}
