import React from 'react';
import { m } from 'framer-motion';
import rehypeSlug from 'rehype-slug';
import ReactMarkdown from 'react-markdown';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import { fallbackLng } from 'src/locales/locales-config';

import { MotionViewport } from 'src/components/animate';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// YouTube reference mapping: content/youtube.json (reference -> { lang: videoId } | videoId)
// Supports either per-language objects or a single default videoId string.
import YOUTUBE_MAP from '../../../content/youtube.json';
import { ContentTiles } from './components/content-tiles';


// Utility to flatten paths().js for lookup
function flattenPaths(obj, parentKey = '', result = {}) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      result[obj[key]] = parentKey ? [...parentKey.split('.'), key] : [key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      flattenPaths(obj[key], parentKey ? `${parentKey}.${key}` : key, result);
    }
  }
  return result;
}

// Main function to generate breadcrumb links
function getBreadcrumbLinksFromPathname(pathname, pathsObj) {
  const flatPaths = flattenPaths(pathsObj);
  // Find the longest matching path
  let matchedPath = '';
  for (const path in flatPaths) {
    if (
      pathname === path ||
      (pathname.startsWith(path) && path.length > matchedPath.length)
    ) {
      matchedPath = path;
    }
  }
  if (!matchedPath) {
    return [{ name: 'home', href: pathsObj.home }];
  }
  // Build breadcrumb segments
  const segments = matchedPath.split('/').filter(Boolean);
  let acc = '';
  const links = [];
  for (let i = 0; i < segments.length; i++) {
    acc += '/' + segments[i];
    // Find the prettified name from flatPaths or fallback
    const keyArr = flatPaths[acc];
    let name = keyArr ? keyArr[keyArr.length - 1] : segments[i];
    // Replace "Root" with the href value
    if (name === "Root") {
      name = acc;
    }
    links.push({ name, href: acc });
  }

  // Append any remaining segments beyond the known app paths (e.g., slug)
  if (pathname.length > matchedPath.length) {
    const remainder = pathname.slice(matchedPath.length);
    const extraSegments = remainder.split('/').filter(Boolean);
    for (let i = 0; i < extraSegments.length; i++) {
      acc += '/' + extraSegments[i];
      const name = decodeURIComponent(extraSegments[i]);
      links.push({ name, href: acc });
    }
  }
  return links;
}

// Resolve a YouTube video ID from a reference name mapped in content/youtube.json per language
function resolveYouTubeId(src, lang) {
  if (!src) return null;
  const trimmed = String(src).trim();
  // Treat as reference name and look up mapping
  const entry = YOUTUBE_MAP?.[trimmed];
  if (!entry) return null;
  if (typeof entry === 'string') return entry;

  // Prefer current language, then fallback, then any available
  const langId = entry?.[lang] || entry?.[fallbackLng];
  if (langId) return langId;
  const anyId = Object.values(entry).find((v) => typeof v === 'string');
  return anyId || null;
}

export function PagesMain({ mdContent, frontMatter, sx, ...other }) {
  const [processedContent] = React.useState(mdContent);
  const pathname = usePathname();
  const lang = React.useMemo(() => pathname?.split('/').filter(Boolean)[0] ?? 'en', [pathname]);
  const headingText = frontMatter?.heading ?? frontMatter?.title ?? '';
  const subtitleText = frontMatter?.subtitle ?? '';
  const { heading: tilesHeading, items: tileItems } = React.useMemo(
    () => resolveTiles(frontMatter),
    [frontMatter]
  );

  return (
    <Box
      component="section"
      sx={[{ overflow: "hidden" }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container component={MotionViewport} disableAnimate={false}>

        {/* Render title, breadcrumbs and subtitle */}
        <m.div>
          <Typography variant="h1" sx={{ mx: "auto", maxWidth: 640, my: 3 }}>
            {headingText}
            <CustomBreadcrumbs
              links={getBreadcrumbLinksFromPathname(pathname, paths(lang))}
              sx={{ mb: { xs: 3, m: 5 }, mt: 2 }} // Add top margin for more gap
            />
          </Typography>

          <Typography
            variant="h5"
            sx={{ mx: "auto", my: 3, maxWidth: 640, color: "text.secondary" }}
          >
            {subtitleText}
          </Typography>
        </m.div>

        {/* Render content with ReactMarkdown */}
        {/* <m.div variants={varFade("inUp")}> */}
        <m.div>
          <Typography
            component="div"
            sx={{ mx: "auto", maxWidth: 640, color: "text.secondary" }}
          >
            <ReactMarkdown
              rehypePlugins={[rehypeSlug]}
              components={{
                p: ({ node, children }) => {
                  const onlyChildIsImage =
                    node?.children &&
                    node.children.length === 1 &&
                    node.children[0]?.tagName === 'img';
                  if (onlyChildIsImage) {
                    // Avoid rendering a <p> around block-level image/video embeds
                    return <Box sx={{ my: 2 }}>{children}</Box>;
                  }
                  return (
                    <Typography component="p" sx={{ mb: 2 }}>
                      {children}
                    </Typography>
                  );
                },
                a: ({ href, children }) => (
                  <Link href={href} underline="hover">
                    {children}
                  </Link>
                ),
                ul: ({ children }) => (
                  <List sx={{ pl: 3, mb: 2, listStyleType: 'disc' }} component="ul">{children}</List>
                ),
                ol: ({ children }) => (
                  <List sx={{ pl: 3, mb: 2, listStyleType: 'decimal' }} component="ol">{children}</List>
                ),
                li: ({ children, ...props }) => (
                  <ListItem
                    sx={{ pl: 1, py: 0, display: 'list-item' }}
                    component="li"
                    {...props}
                  >
                    {children}
                  </ListItem>
                ),
                img: ({ src, alt }) => {
                  const isYouTube = (alt || '').toLowerCase() === 'youtube';
                  if (isYouTube) {
                    const videoId = resolveYouTubeId(src || '', lang);
                    if (!videoId) return null;
                    const srcUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
                    return (
                      <Box sx={{ my: 3 }}>
                        <Box
                          sx={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: 800,
                            mx: 'auto',
                            // 16:9 responsive container
                            pt: '56.25%'
                          }}
                        >
                          <Box sx={{ position: 'absolute', inset: 0 }}>
                            <Box
                              component="iframe"
                              src={srcUrl}
                              title="YouTube video"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              sx={{ border: 0, width: '100%', height: '100%' }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    );
                  }
                  // Fallback to normal image
                  return (
                    <Box
                      component="img"
                      alt={alt}
                      src={src}
                      sx={{ display: 'block', width: '100%', height: 'auto', my: 3 }}
                    />
                  );
                },
              }}
            >
              {processedContent}
            </ReactMarkdown>
          </Typography>
        </m.div>
      </Container>

      {tileItems.length ? (
        <ContentTiles heading={tilesHeading} items={tileItems} />
      ) : null}
    </Box>
  );
}

function resolveTiles(frontMatter) {
  if (!frontMatter) {
    return { heading: undefined, items: [] };
  }

  const result = {
    heading:
      frontMatter.tilesHeading ||
      frontMatter.tilesTitle ||
      undefined,
    items: [],
  };

  const tilesField = frontMatter.tiles;

  if (Array.isArray(tilesField)) {
    result.items = tilesField.filter(Boolean);
  } else if (tilesField && typeof tilesField === 'object') {
    if (Array.isArray(tilesField.items)) {
      result.items = tilesField.items.filter(Boolean);
    }
    if (!result.heading) {
      result.heading = tilesField.heading || tilesField.title || result.heading;
    }
  }

  if (!result.items.length && Array.isArray(frontMatter.tileItems)) {
    result.items = frontMatter.tileItems.filter(Boolean);
  }

  if (!result.items.length) {
    const numberedKeys = Object.keys(frontMatter).filter((key) => /^tile-\d+$/i.test(key));

    if (numberedKeys.length) {
      result.items = numberedKeys
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
  }

  return result;
}
