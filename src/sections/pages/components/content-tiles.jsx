'use client';

import NextLink from 'next/link';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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

export function ContentTiles({ heading, items, sx, ...other }) {
  const tiles = resolveTileCollection(items);

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
          <m.div variants={fadeInUp}>
            <Typography
              component="h2"
              variant="h4"
              sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, fontWeight: 600 }}
            >
              {heading}
            </Typography>
          </m.div>
        ) : null}

        <Grid
          container
          spacing={{ xs: 2.5, md: 3.5 }}
          justifyContent="center"
          sx={{
            mx: 'auto',
            maxWidth: { xs: '100%', md: 960, lg: 1024 },
          }}
        >
          {tiles.map((tile, index) => (
            <Grid
              key={getTileKey(tile, index)}
              item
              xs="auto"
              sx={{
                flexGrow: 0,
                flexShrink: 0,
                flexBasis: 300,
                maxWidth: 300,
              }}
            >
              <Box component={m.div} variants={fadeInUp} sx={{ height: '100%' }}>
                <TileCard tile={tile} />
              </Box>
            </Grid>
          ))}
        </Grid>
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

  const resolvedImage = backgroundImage || image || media;
  const resolvedColor = backgroundColor || tile?.color || tile?.bgColor || null;
  const resolvedHref = href || link || ctaHref || ctaLink || null;
  const resolvedCtaLabel = ctaLabel || ctaText || (resolvedHref ? 'Learn more' : null);

  return (
    <Paper
      elevation={resolvedImage ? 6 : 3}
      component="article"
      sx={(theme) => {
        const fallbackColor = theme.vars?.palette.background.paper ?? theme.palette.background.paper;

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
          color: resolvedImage ? 'common.white' : 'text.primary',
          backgroundColor: resolvedImage ? 'grey.900' : resolvedColor || fallbackColor,
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
        }}
      >
        {eyebrow ? (
          <Typography variant="overline" sx={{ letterSpacing: 1.8, opacity: resolvedImage ? 0.8 : 0.7 }}>
            {eyebrow}
          </Typography>
        ) : null}

        {title ? (
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        ) : null}

        {description ? (
          <Typography
            variant="body2"
            sx={{
              color: resolvedImage ? 'grey.100' : 'text.secondary',
              opacity: resolvedImage ? 0.92 : 1,
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
