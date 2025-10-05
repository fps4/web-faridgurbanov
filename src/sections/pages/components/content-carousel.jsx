'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NextLink from 'next/link';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
      {heading ? (
        <Typography
          component="h2"
          variant="h4"
          sx={{ textAlign: 'center', mb: 3, fontWeight: 600 }}
        >
          {heading}
        </Typography>
      ) : null}

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
              px: { xs: 2, md: 6 },
              py: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: { xs: 3, md: 6 },
              minHeight: { md: 320 },
            }}
          >
            {resolvedImage ? (
              <Box
                component="img"
                src={resolvedImage}
                alt={title ? `${title} visual` : 'Carousel visual'}
                sx={{
                  width: { xs: '100%', md: '40%' },
                  maxWidth: 380,
                  borderRadius: 2,
                  objectFit: 'cover',
                }}
              />
            ) : null}

            <Stack spacing={2} sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, px: { md: 2 } }}>
              {eyebrow ? (
                <Typography variant="overline" color="text.secondary">
                  {eyebrow}
                </Typography>
              ) : null}

              {title ? (
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
              ) : null}

              {description ? (
                <Typography variant="body1" color="text.secondary">
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
                    color="primary"
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
                bgcolor: 'rgba(0,0,0,0.6)',
                color: 'common.white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.8)',
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
                bgcolor: 'rgba(0,0,0,0.6)',
                color: 'common.white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.8)',
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
    </Box>
  );
}

export default ContentCarousel;
