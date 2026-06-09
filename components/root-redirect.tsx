'use client';

import { useEffect } from 'react';

// Client-side redirect from `/` to the default locale. Static export has no server to issue a 30x,
// so the root page renders a visible language chooser (the no-JS path) and this island forwards
// JS-enabled visitors to the default locale. Replaces history so Back doesn't trap them on `/`.
export function RootRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}
