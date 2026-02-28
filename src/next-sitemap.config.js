const fs = require('fs');
const path = require('path');

const siteUrl = process.env.SITE_URL || 'https://faridgurbanov.com';

// detect available locales from content/ folder
function loadLocales() {
  const contentRoot = path.join(process.cwd(), 'content');
  try {
    const entries = fs.readdirSync(contentRoot, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((d) => d.name);
  } catch (e) {
    return [];
  }
}

const LOCALES = loadLocales();

function loadContentPages() {
  const contentRoot = path.join(process.cwd(), 'content');
  const locales = [];
  try {
    const entries = fs.readdirSync(contentRoot, { withFileTypes: true });
    entries.forEach((e) => {
      if (e.isDirectory()) locales.push(e.name);
    });
  } catch (e) {
    return [];
  }
  const pages = [];

  // recursive walker: produce paths like /<locale>/<section>/<slug>/
  function walk(dir, locale, relPath = '') {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      return;
    }

    entries.forEach((ent) => {
      const fullPath = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        const nextRel = relPath ? `${relPath}/${ent.name}` : ent.name;
        walk(fullPath, locale, nextRel);
        return;
      }

      if (ent.isFile() && ent.name.endsWith('.md')) {
        const name = ent.name.replace(/\.md$/, '');
        // build base path
        let urlPath = relPath ? `/${locale}/${relPath}` : `/${locale}`;
        // map index/home to the parent path, otherwise add the filename
        if (!(name === 'index' || name === 'home')) {
          urlPath = `${urlPath}/${name}`;
        }
        // normalize and ensure trailing slash
        urlPath = urlPath.replace(/\/+/g, '/');
        if (!urlPath.endsWith('/')) urlPath = `${urlPath}/`;
        pages.push(urlPath);
      }
    });
  }

  locales.forEach((locale) => {
    const localeDir = path.join(contentRoot, locale);
    walk(localeDir, locale, '');
  });

  return pages;
}

// Normalize incoming path or URL to a clean pathname starting with '/'
function normalizeToPath(input) {
  let s = input || '';
  try {
    // If it's an absolute URL, extract pathname
    if (s.startsWith('http://') || s.startsWith('https://')) {
      s = new URL(s).pathname;
    }
  } catch (e) {
    // ignore
  }
  // If config provided a full siteUrl prefixed string, remove it
  if (s.startsWith(siteUrl)) {
    s = s.substring(siteUrl.length);
  }
  // ensure leading slash
  if (!s.startsWith('/')) s = '/' + s;
  // normalize multiple slashes and remove query/hash
  s = s.split('?')[0].split('#')[0].replace(/\/+/g, '/');
  return s;
}

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  // raise sitemapSize to avoid splitting into sitemap-0.xml etc for small sites
  // set to 50000 (sitemap protocol limit per file) to keep everything in one sitemap.xml
  sitemapSize: 50000,
  transform: async (config, path) => {
    // path will be like '/en/section/slug/' or an absolute URL
    const lastmod = new Date().toISOString();
    const pathname = normalizeToPath(path);

    // build alternateRefs for all detected locales by replacing the leading locale segment
    const parts = pathname.split('/').filter(Boolean); // ['en','section','slug']
    let currentLocale = LOCALES.includes(parts[0]) ? parts[0] : null;
    const rest = parts.slice(currentLocale ? 1 : 0).join('/');

    const alternateRefs = LOCALES.map((lang) => {
      let href;
      if (parts.length === 0) {
        // root page
        href = `${siteUrl}/${lang}/`;
      } else {
        // replace first segment with target locale
        const newParts = [...parts];
        if (currentLocale) {
          newParts[0] = lang;
        } else {
          newParts.unshift(lang);
        }
        href = `${siteUrl}/${newParts.join('/')}/`;
      }
      // Mark as absolute so next-sitemap does NOT append loc again
      return { href, hreflang: lang, hrefIsAbsolute: true };
    });

    // add x-default pointing to primary locale if available
    if (LOCALES.length > 0) {
      const primary = LOCALES[0];
      let href;
      if (parts.length === 0) {
        href = `${siteUrl}/${primary}/`;
      } else {
        const newParts = [...parts];
        if (currentLocale) {
          newParts[0] = primary;
        } else {
          newParts.unshift(primary);
        }
        href = `${siteUrl}/${newParts.join('/')}/`;
      }
      alternateRefs.push({ href, hreflang: 'x-default', hrefIsAbsolute: true });
    }

    return {
      loc: pathname, // exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod,
      // next-sitemap builder expects `alternateRefs` key to emit xhtml:link tags
      alternateRefs,
    };
  },
  additionalPaths: async (config) => {
    const pages = loadContentPages();
    // next-sitemap does not run `transform` for additionalPaths items,
    // so build the full sitemap field object here including alternateRefs.
    return pages.map((p) => {
      const pathname = normalizeToPath(p);
      const parts = pathname.split('/').filter(Boolean);
      let currentLocale = LOCALES.includes(parts[0]) ? parts[0] : null;
      const rest = parts.slice(currentLocale ? 1 : 0).join('/');

      const alternateRefs = LOCALES.map((lang) => {
        let href;
        if (parts.length === 0) {
          // root page
          href = `${siteUrl}/${lang}/`;
        } else {
          // replace first segment with target locale
          const newParts = [...parts];
          if (currentLocale) {
            newParts[0] = lang;
          } else {
            newParts.unshift(lang);
          }
          href = `${siteUrl}/${newParts.join('/')}/`;
        }
        return { href, hreflang: lang, hrefIsAbsolute: true };
      });

      if (LOCALES.length > 0) {
        const primary = LOCALES[0];
        let href;
        if (parts.length === 0) {
          href = `${siteUrl}/${primary}/`;
        } else {
          const newParts = [...parts];
          if (currentLocale) {
            newParts[0] = primary;
          } else {
            newParts.unshift(primary);
          }
          href = `${siteUrl}/${newParts.join('/')}/`;
        }
        alternateRefs.push({ href, hreflang: 'x-default', hrefIsAbsolute: true });
      }

      return {
        loc: pathname,
        alternateRefs,
        lastmod: new Date().toISOString(),
        changefreq: config.changefreq,
        priority: config.priority,
      };
    });
  },
};
