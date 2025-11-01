'use client';

import { PagesMain } from '../pages-main.jsx';

// ----------------------------------------------------------------------

export function PagesView({ mdContent, frontMatter }) {
  
  return (
      <PagesMain mdContent={mdContent} frontMatter={frontMatter} />
  );
}
