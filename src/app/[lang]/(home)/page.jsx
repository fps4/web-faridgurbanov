import { CONFIG } from 'src/global-config';
import {
  loadMarkdown,
  resolvePageTitle,
  resolvePageDescription,
} from 'src/lib/loadMarkdown';

import { HomeView } from 'src/sections/home/view';
import { PagesView } from 'src/sections/pages/view';
import ContentCarousel from 'src/sections/pages/components/content-carousel';

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

  const carouselItems = extractCarouselItems(frontMatter);
  const carouselHeading =
    frontMatter?.carouselHeading ||
    frontMatter?.carouselTitle ||
    (typeof frontMatter?.carousel === 'object' && !Array.isArray(frontMatter.carousel)
      ? frontMatter?.carousel?.heading
      : undefined);
  return (
    <>
      <PagesView mdContent={contentWithLang} frontMatter={frontMatter} />
      <ContentCarousel
        heading={carouselHeading}
        items={carouselItems}
      />
      {/* <HomeView mdContent={contentWithLang} frontMatter={frontMatter} /> */}
    </>
  );
}

function extractCarouselItems(frontMatter) {
  if (!frontMatter) {
    return [];
  }

  const directArray = Array.isArray(frontMatter.carousel)
    ? frontMatter.carousel
    : Array.isArray(frontMatter.carouselItems)
      ? frontMatter.carouselItems
      : null;

  if (directArray) {
    return directArray.filter(Boolean);
  }

  const numberedKeys = Object.keys(frontMatter).filter((key) => /^carousel-\d+$/i.test(key));

  if (!numberedKeys.length) {
    return [];
  }

  return numberedKeys
    .sort()
    .map((key) => {
      const value = frontMatter[key];

      if (!value) {
        return null;
      }

      if (typeof value === 'string') {
        return { description: value };
      }

      if (typeof value === 'object') {
        return value;
      }

      return null;
    })
    .filter(Boolean);
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
