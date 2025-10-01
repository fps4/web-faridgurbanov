import { CONFIG } from 'src/global-config';
import {
  loadMarkdown,
  resolvePageTitle,
  resolvePageDescription,
} from 'src/lib/loadMarkdown';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

export default async function Page({ params }) {

  function prefixInternalLinks(mdContent, lang) {
    // Only prefix links that start with a single slash and are not already prefixed with a language code
    return mdContent.replace(/\]\(\/(?![a-z]{2}\/)/g, `](/${lang}/`);
  }

  params = await params;
  const lang = params?.lang;

  const { content, frontMatter } = await loadMarkdown({
    lang,
    slugSegments: ['home.md'],
  });
  const contentWithLang = prefixInternalLinks(content, lang);

  // Pass raw Markdown content to PagesView
  return <HomeView mdContent={contentWithLang} frontMatter={frontMatter} />;
}

// ----------------------------------------------------------------------

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang;

  try {
    const { frontMatter } = await loadMarkdown({
      lang,
      slugSegments: ['home.md'],
    });
    const title = resolvePageTitle(frontMatter);
    const description = resolvePageDescription(frontMatter);

    return {
      title,
      ...(description && { description }),
      openGraph: {
        title,
        ...(description && { description }),
      },
    };
  } catch {
    return { title: CONFIG.appNameShort };
  }
}
