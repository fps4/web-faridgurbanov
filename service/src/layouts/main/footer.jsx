import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

const FooterRoot = styled('footer')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.vars.palette.background.default,
}));

export function Footer({ sx, layoutQuery = 'md', setCookiesConsentOpen, ...other }) {

  const { t, currentLang } = useTranslate('navbar');

  const lang = currentLang?.value || 'en';
  const p = paths(lang);
  const LINKS = [
    {
      headline: t('overview'),
      children: [
        { name: t('about-me'), href: p.home },
        { name: t('contact-me'), href: p.contact },
        { name: t('privacy-policy'), href: p.privacy }, 
        {
          name: t('cookies-preferences'),
          href: '#',
          onClick: () => setCookiesConsentOpen(true), 
        },
      ],
    },
    {
      headline: t('expertise'),
      children: [
        { name: t('cloud-architecture'), href: `${p.expertise}/cloud-architecture` },
        { name: t('ai-automation'), href: `${p.expertise}/ai-automation` },
        { name: t('platform-engineering'), href: `${p.expertise}/platform-engineering` },
        { name: t('streaming-systems'), href: `${p.expertise}/streaming-systems` },
        { name: t('legacy-modernization'), href: `${p.expertise}/legacy-modernization` },
      ],
    },
    {
      headline: t('blog'),
      children: [
        { name: t('about-me'), href: p.home },
      ],
    },    
  ];
  
  return (
    <FooterRoot sx={sx} {...other}>
      <Divider />

      <Container
        sx={(theme) => ({
          pb: 5,
          pt: 5,
          textAlign: 'center',
          [theme.breakpoints.up(layoutQuery)]: { textAlign: 'unset' },
        })}
      >

        <Box
          sx={(theme) => ({
            gap: 5,
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.up(layoutQuery)]: { flexDirection: 'row' },
          })}
        >
          {LINKS.map((list) => (
            <Box
              key={list.headline}
              sx={(theme) => ({
                gap: 2,
                width: 1,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                [theme.breakpoints.up(layoutQuery)]: { alignItems: 'flex-start' },
              })}
            >
              <Typography component="div" variant="overline">
                {list.headline}
              </Typography>

              {list.children.map((link) => (
                <Link
                  key={link.name}
                  component={RouterLink}
                  href={link.href}
                  color="inherit"
                  variant="body2"
                  onClick={link.onClick} // Attach onClick handler
                >
                  {link.name}
                </Link>
              ))}
            </Box>
          ))}
        </Box>

        <Box
          sx={(theme) => ({
            mt: 5,
            mb: 2,
            gap: 2,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column', // Updated to stack logo and text vertically
            alignItems: 'center', // Center align items
            [theme.breakpoints.up(layoutQuery)]: { justifyContent: 'center' },
          })}
        >
          <Box sx={{ mt: 1, typography: 'caption' }}>
            { t('copyright') }
          </Box>
        </Box>

      </Container>

    </FooterRoot>
  );
}
