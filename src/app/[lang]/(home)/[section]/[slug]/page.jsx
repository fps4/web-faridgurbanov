import { CONFIG } from 'src/global-config';
import {
  loadMarkdown,
  resolvePageTitle,
  resolvePageDescription,
} from 'src/lib/loadMarkdown';

import { PagesView } from 'src/sections/pages/view';


// ----------------------------------------------------------------------

export default async function Page({ params }) {
  function prefixInternalLinks(mdContent, lang) {
    // Only prefix links that start with a single slash and are not already prefixed with a language code
    return mdContent.replace(/\]\(\/(?![a-z]{2}\/)/g, `](/${lang}/`);
  }

  params = await params;
  const lang = params?.lang;
  const sectionParam = params?.section;
  const slugParam = params?.slug;

  if (!sectionParam || !slugParam) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'red' }}>
        Error: {!sectionParam ? 'No section specified in route.' : 'No slug specified in route.'}
      </div>
    );
  }

  try {
    const { content, frontMatter } = await loadMarkdown({
      lang,
      slugSegments: [sectionParam, `${slugParam}.md`],
    });
    const contentWithLang = prefixInternalLinks(content, lang);

    return <PagesView mdContent={contentWithLang} frontMatter={frontMatter} />;
  } catch {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'red' }}>
        Error: Content for section &quot;{sectionParam}&quot; and slug &quot;{slugParam}&quot; not found.
      </div>
    );
  }
}

// ----------------------------------------------------------------------

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang;
  const sectionParam = resolvedParams?.section;
  const slugParam = resolvedParams?.slug;

  if (!sectionParam || !slugParam) {
    return { title: CONFIG.appNameShort };
  }

  try {
    const { frontMatter } = await loadMarkdown({
      lang,
      slugSegments: [sectionParam, `${slugParam}.md`],
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
