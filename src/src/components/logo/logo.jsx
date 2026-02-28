'use client';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components'; 

import { CONFIG } from 'src/global-config';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export function Logo({ sx, disabled, className, href = '/', isSingle = true, ...other }) {

  const singleLogo = (
    <Box
      component="img"
      alt={`${CONFIG.appName}`}
      src={`${CONFIG.assetsDir}/images/farid-gurbanov-02.jpg`}
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '50%',
      }}
    />
  );

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Farid Gurbanov"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: 80,
          height: 80,
          ...(!isSingle && { width: 120, height: 42 }),
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {singleLogo}
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(({ theme }) => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  padding: theme.spacing(1),
  backgroundColor: theme.palette.common.white,
  border: theme.palette.mode === 'light' ? `1px solid ${theme.palette.grey[300]}` : 'none',
  overflow: 'hidden',
  marginTop: theme.spacing(4),
}));
