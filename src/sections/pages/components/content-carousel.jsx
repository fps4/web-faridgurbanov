'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NextLink from 'next/link';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const AUTO_PLAY_INTERVAL = 6000;
const SWIPE_THRESHOLD = 50;

function getItemKey(item, index) {
  if (item?.id) return String(item.id);
  if (item?.title) return `${index}-${item.title}`;
  return String(index);
}

export function ContentCarousel({ heading, items = [], sx, ...other }) {
  const slides = useMemo(() => (Array.isArray(items) ? items.filter(Boolean) : []), [items]);
  const slideCount = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchDeltaRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetAutoPlay = useCallback(() => {
    clearTimer();
    if (typeof window === 'undefined' || slideCount < 2) {
      return;
    }
    timerRef.current = window.setInterval(() => {
      setActiveIndex((prev) => ((prev + 1) % slideCount));
    }, AUTO_PLAY_INTERVAL);
  }, [clearTimer, slideCount]);

  useEffect(() => {
    resetAutoPlay();
    return () => {
      clearTimer();
    };
  }, [resetAutoPlay, clearTimer]);

  useEffect(() => {
    if (slideCount > 0 && activeIndex > slideCount - 1) {
      setActiveIndex(0);
    }
  }, [slideCount, activeIndex]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1 >= slideCount ? 0 : prev + 1));
    resetAutoPlay();
  }, [resetAutoPlay, slideCount]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 < 0 ? Math.max(slideCount - 1, 0) : prev - 1));
    resetAutoPlay();
  }, [resetAutoPlay, slideCount]);

  const handleSelect = useCallback((index) => {
    if (index === activeIndex) {
      resetAutoPlay();
      return;
    }

    if (index < 0 || index >= slideCount) {
      return;
    }

    setActiveIndex(index);
    resetAutoPlay();
  }, [activeIndex, resetAutoPlay, slideCount]);

  const handleTouchStart = useCallback((event) => {
    if (!event.touches?.length) {
      return;
    }
    touchStartXRef.current = event.touches[0].clientX;
    touchDeltaRef.current = 0;
  }, []);

  const handleTouchMove = useCallback((event) => {
    if (touchStartXRef.current === null || !event.touches?.length) {
      return;
    }
    touchDeltaRef.current = event.touches[0].clientX - touchStartXRef.current;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const delta = touchDeltaRef.current;
    touchStartXRef.current = null;
    touchDeltaRef.current = 0;

    if (Math.abs(delta) < SWIPE_THRESHOLD || slideCount < 2) {
      return;
    }

    if (delta > 0) {
      handlePrev();
    } else {
      handleNext();
    }
  }, [handleNext, handlePrev, slideCount]);

  const currentSlide = slides[activeIndex] ?? null;

  if (!slideCount || !currentSlide) {
    return null;
  }

  const {
    title,
    description,
    image,
    media,
    href,
    link,
    ctaHref,
    ctaLink,
    ctaLabel,
    ctaText,
    eyebrow,
  } = currentSlide;

  const resolvedImage = image || media;
  const resolvedHref = href || link || ctaHref || ctaLink;
  const resolvedCtaLabel = ctaLabel || ctaText || (resolvedHref ? 'Learn more' : '');

  return (
    <Box
      sx={[
        {
          width: '100%',
          my: 6,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container maxWidth="md">
        {heading ? (
          <Typography
            component="h2"
            variant="h4"
            sx={{ textAlign: 'center', mb: 3, fontWeight: 600 }}
          >
            {heading}
          </Typography>
        ) : null}
      </Container>

      <Container maxWidth="md" sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
        <Fade
          key={getItemKey(currentSlide, activeIndex)}
          in
          timeout={{ enter: 400, exit: 200 }}
        >
          <Paper
            elevation={3}
            sx={{
              position: 'relative',
              width: '100%',
              px: { xs: 4, md: 10 },
              py: { xs: 8, md: 10 },
              display: 'flex',
              alignItems: 'center',
              minHeight: { xs: 360, md: 420 },
              overflow: 'hidden',
              color: resolvedImage ? 'common.white' : 'text.primary',
              backgroundColor: resolvedImage ? 'grey.900' : 'background.paper',
              backgroundImage: resolvedImage ? `url(${resolvedImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              '&::after': resolvedImage
                ? {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(135deg, rgba(17,24,39,0.7) 0%, rgba(17,24,39,0.45) 40%, rgba(17,24,39,0.2) 100%)',
                  }
                : undefined,
            }}
          >
            <Stack
              spacing={2}
              sx={{
                position: 'relative',
                zIndex: 1,
                maxWidth: '100%',
                textAlign: { xs: 'center', md: 'left' },
                mx: { xs: 'auto', md: 0 },
                px: { xs: 1.5, md: 3 },
              }}
            >
              {eyebrow ? (
                <Typography
                  variant="overline"
                  color={resolvedImage ? 'grey.300' : 'text.secondary'}
                  sx={{ letterSpacing: 2, textTransform: 'uppercase' }}
                >
                  {eyebrow}
                </Typography>
              ) : null}

              {title ? (
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {title}
                </Typography>
              ) : null}

              {description ? (
                <Typography
                  variant="body1"
                  color={resolvedImage ? 'grey.100' : 'text.secondary'}
                  sx={{ opacity: resolvedImage ? 0.92 : 1 }}
                >
                  {description}
                </Typography>
              ) : null}

              {resolvedHref && resolvedCtaLabel ? (
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  justifyContent={{ xs: 'center', md: 'flex-start' }}
                >
                  <Button
                    component={NextLink}
                    href={resolvedHref}
                    variant="contained"
                  >
                    {resolvedCtaLabel}
                  </Button>
                </Stack>
              ) : null}
            </Stack>
          </Paper>
        </Fade>

        {slideCount > 1 ? (
          <>
            <IconButton
              aria-label="Previous slide"
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                top: '50%',
                left: { xs: 8, md: 16 },
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'common.white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.35)',
                },
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <IconButton
              aria-label="Next slide"
              onClick={handleNext}
              sx={{
                position: 'absolute',
                top: '50%',
                right: { xs: 8, md: 16 },
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'common.white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.35)',
                },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </>
        ) : null}
        </Box>

        {slideCount > 1 ? (
          <Stack direction="row" justifyContent="center" spacing={1.5} sx={{ mt: 2 }}>
            {slides.map((item, index) => (
              <IconButton
                key={getItemKey(item, index)}
                aria-label={`Go to slide ${index + 1}`}
                size="small"
                onClick={() => handleSelect(index)}
                sx={{
                  color: index === activeIndex ? 'text.primary' : 'text.disabled',
                  '&:hover': {
                    color: 'text.primary',
                  },
                }}
              >
                <FiberManualRecordIcon sx={{ fontSize: index === activeIndex ? 12 : 9 }} />
              </IconButton>
            ))}
          </Stack>
        ) : null}
      </Container>
    </Box>
  );
}

export default ContentCarousel;
