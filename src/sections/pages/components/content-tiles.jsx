'use client';

import NextLink from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

const fadeInUp = varFade('inUp', { distance: 24 });

function getTileKey(item, index) {
  if (item?.id) return String(item.id);
  if (item?.title) return `${index}-${item.title}`;
  return String(index);
}

function resolveTileCollection(items) {
  if (!items) return [];
  if (Array.isArray(items)) {
    return items.filter(Boolean);
  }

  if (typeof items === 'object') {
    const values = Object.values(items).filter(Boolean);
    if (values.length) {
      return values;
    }
  }

  return [];
}

function isDarkColor(color, theme) {
  if (typeof color !== 'string') {
    return false;
  }

  const paletteMatch = color.match(/^([a-z]+)\.([a-z0-9]+)$/i);
  if (paletteMatch && theme?.palette) {
    const [, paletteKey, shadeKey] = paletteMatch;
    const paletteGroup = theme.palette[paletteKey];
    const shadeValue =
      paletteGroup && typeof paletteGroup[shadeKey] === 'string'
        ? paletteGroup[shadeKey]
        : null;
    if (shadeValue && shadeValue !== color) {
      return isDarkColor(shadeValue, theme);
    }
  }

  const trimmed = color.trim();
  const hex = trimmed.startsWith('#') ? trimmed.slice(1) : null;

  let channels = null;

  if (hex) {
    if (hex.length === 3 || hex.length === 4) {
      channels = [0, 1, 2].map((index) => {
        const value = hex[index];
        return parseInt(value + value, 16);
      });
    } else if (hex.length === 6 || hex.length === 8) {
      channels = [0, 2, 4].map((index) => parseInt(hex.slice(index, index + 2), 16));
    }
  } else {
    const rgbMatch = trimmed.match(/^rgba?\(([^)]+)\)$/i);
    if (rgbMatch) {
      const parts = rgbMatch[1]
        .split(',')
        .map((part) => part.trim())
        .slice(0, 3)
        .map((part) => {
          if (part.endsWith('%')) {
            const numeric = Number.parseFloat(part);
            if (Number.isNaN(numeric)) {
              return Number.NaN;
            }
            return (numeric / 100) * 255;
          }
          return Number.parseFloat(part);
        });

      if (parts.length === 3 && parts.every((value) => Number.isFinite(value))) {
        channels = parts;
      }
    }
  }

  if (!channels || channels.some((value) => Number.isNaN(value))) {
    return false;
  }

  const [r, g, b] = channels.map((value) => {
    const normalized = Math.min(Math.max(value, 0), 255) / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance < 0.5;
}

export function ContentTiles({ heading, items, sx, ...other }) {
  const tiles = useMemo(() => {
    const resolved = resolveTileCollection(items);
    return resolved;
  }, [items]);

  // build options (dedupe, trim, lowercase, split CSV/arrays)
  const filterOptions = useMemo(() => {
    const set = new Map();
    const add = (s) => {
      const label = s.trim();
      if (!label) return;
      const value = label.toLowerCase();
      if (!set.has(value)) set.set(value, { label, value });
    };

    for (const t of tiles) {
      const raw = t?.eyebrow;
      if (Array.isArray(raw)) raw.forEach((v) => add(String(v)));
      else if (typeof raw === 'string') raw.split(',').forEach((v) => add(v));
    }
    const options = Array.from(set.values()).sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
    );
    return options;
  }, [tiles]);

  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {

    const hasActive = filterOptions.some((option) => option.value === activeFilter);

    if (!hasActive) {
      setActiveFilter(null);
    }
  }, [activeFilter, filterOptions]);

  // filter tiles (match any tag)
  const filteredTiles = useMemo(() => {
    if (!activeFilter) {
      return tiles;
    }

    const target = activeFilter.toLowerCase();
    const result = tiles.filter((t) => {
      const raw = t?.eyebrow;
      const tags = Array.isArray(raw)
        ? raw
        : typeof raw === 'string'
          ? raw.split(',')
          : [];
      const match = tags.some((v) => String(v).trim().toLowerCase() === target);

      return match;
    });

    return result;
  }, [tiles, activeFilter]);


  if (!tiles.length) {
    return null;
  }

  return (
    <Box
      sx={[
        {
          width: '100%',
          my: { xs: 6, md: 8 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container component={MotionViewport} maxWidth="lg" sx={{ px: { xs: 2, md: 0 } }}>
        {heading ? (
            <Typography
              component="h2"
              variant="h4"
              sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, fontWeight: 600 }}
            >
              {heading}
            </Typography>
        ) : null}

        {filterOptions.length ? (
            <Stack
              direction="row"
              spacing={1.5}
              justifyContent="center"
              flexWrap="wrap"
              sx={{ mb: { xs: 4, md: 6 } }}
            >
              <Button
                onClick={() => setActiveFilter(null)}
                variant={activeFilter === null ? 'contained' : 'outlined'}
                size="small"
                color="primary"
              >
                All
              </Button>
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  onClick={() =>
                    setActiveFilter((prev) =>
                      prev === option.value ? null : option.value
                    )
                  }
                  variant={activeFilter === option.value ? 'contained' : 'outlined'}
                  size="small"
                  color="primary"
                >
                  {option.label}
                </Button>
              ))}
            </Stack>
        ) : null}

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: { xs: 2.5, md: 3.5 },
            mx: 'auto',
            maxWidth: { xs: '100%', md: 960, lg: 1024 },
          }}
        >
          {filteredTiles.map((tile, index) => (
            <Box
              key={getTileKey(tile, index)}
              sx={{
                flexGrow: 0,
                flexShrink: 0,
                flexBasis: { xs: '100%', sm: 300 },
                maxWidth: { xs: '100%', sm: 300 },
              }}
            >
              <Box sx={{ height: '100%' }}>
                <TileCard tile={tile} />
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

function TileCard({ tile }) {
  const {
    title,
    description,
    eyebrow,
    backgroundColor,
    backgroundImage,
    image,
    media,
    href,
    link,
    ctaHref,
    ctaLink,
    ctaLabel,
    ctaText,
  } = tile ?? {};

  const theme = useTheme();
  const resolvedImage = backgroundImage || image || media;
  const resolvedColor = backgroundColor || tile?.color || tile?.bgColor || null;
  const resolvedHref = href || link || ctaHref || ctaLink || null;
  const resolvedCtaLabel = ctaLabel || ctaText || (resolvedHref ? 'Learn more' : null);

  const paletteFallback = theme.palette.background.paper;
  const varsFallback = theme.vars?.palette?.background?.paper;
  const fallbackSurface =
    typeof varsFallback === 'string' && !varsFallback.startsWith('var(')
      ? varsFallback
      : paletteFallback;
  const resolvedBackground = resolvedColor || fallbackSurface;
  const hasImage = Boolean(resolvedImage);
  const hasDarkBackground = hasImage || isDarkColor(resolvedBackground, theme);
  const primaryTextColor = hasDarkBackground
    ? theme.palette.common.white
    : theme.palette.text.primary;
  const secondaryTextColor = hasDarkBackground
    ? theme.palette.grey[100]
    : theme.palette.text.secondary;
  const overlineColor = hasDarkBackground
    ? theme.palette.grey[200]
    : theme.palette.text.secondary;

  return (
    <Paper
      elevation={resolvedImage ? 6 : 3}
      component="article"
      sx={(theme) => {
        const fallbackColor = resolvedBackground;
        return {
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          minHeight: { xs: 280, md: 320 },
          px: { xs: 3, md: 4 },
          py: { xs: 3.5, md: 5 },
          overflow: 'hidden',
          borderRadius: 3,
          color: primaryTextColor,
          backgroundColor: resolvedImage ? 'grey.900' : fallbackColor,
          backgroundImage: resolvedImage ? `url(${resolvedImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: theme.transitions.create(['transform', 'box-shadow']),
          boxShadow: theme.vars.customShadows?.z16 || theme.shadows[6],
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: theme.vars.customShadows?.z20 || theme.shadows[8],
          },
        };
      }}
    >
      {resolvedImage ? (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background:
              'linear-gradient(180deg, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.4) 45%, rgba(17,24,39,0.35) 100%)',
          }}
        />
      ) : null}

      <Stack
        spacing={2}
        sx={{
          position: 'relative',
          zIndex: 1,
          flexGrow: 1,
          color: primaryTextColor,
        }}
      >
        {eyebrow ? (
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 1.8,
              opacity: hasDarkBackground ? 0.8 : 0.7,
              color: overlineColor,
            }}
          >
            {eyebrow}
          </Typography>
        ) : null}

        {title ? (
          <Typography variant="h5" sx={{ fontWeight: 600, color: primaryTextColor }}>
            {title}
          </Typography>
        ) : null}

        {description ? (
          <Typography
            variant="body2"
            sx={{
              color: secondaryTextColor,
              opacity: hasDarkBackground ? 0.92 : 1,
            }}
          >
            {description}
          </Typography>
        ) : null}
      </Stack>

      {resolvedHref && resolvedCtaLabel ? (
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            position: 'relative',
            zIndex: 1,
            mt: 3,
          }}
        >
          <Button component={NextLink} href={resolvedHref} variant="contained" color="primary">
            {resolvedCtaLabel}
          </Button>
        </Stack>
      ) : null}
    </Paper>
  );
}

export default ContentTiles;
