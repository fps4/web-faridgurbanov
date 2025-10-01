import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Portal from '@mui/material/Portal';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { CookiesActions } from './cookies-actions'; // Import the refactored CookiesActions component

// ----------------------------------------------------------------------

export function CookiesConsent({ onCloseCompose }) {
  const { acceptCookies, declineCookies } = CookiesActions({}); // Use the CookiesActions component
  const { t } = useTranslate('common');

  return (
    <Portal>

      <Paper
        sx={[
          (theme) => ({
            maxWidth: '80%', 
            left: '10%', // Center horizontally (80% width leaves 10% margin on each side)
            bottom: 24, // Align to bottom with 24px spacing
            borderRadius: 2,
            display: 'flex',
            position: 'fixed',
            overflow: 'hidden',
            flexDirection: 'column',
            zIndex: theme.zIndex.modal,
            boxShadow: theme.vars.customShadows.dropdown,
            }),
          ]}
          >
          <Box
            sx={[
            (theme) => ({
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'background.default', // Changed to dark theme background
              p: theme.spacing(1.5, 1, 1.5, 2),
              position: 'relative', // Enable positioning for child elements
              gap: 1,
            }),
          ]}
        >

          <Box
            sx={{
              position: 'absolute',
              top: 8, // Adjust as needed
              right: 8, // Adjust as needed
              display: 'flex',
              gap: 1, // Add spacing between buttons
            }}
          >

            <IconButton onClick={onCloseCompose}>
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          </Box>
        </Box>


        <Box
          sx={{
            p: 2,
            gap: 2,
            display: 'flex',
            flex: '1 1 auto',
            overflow: 'hidden',
            flexDirection: 'column',
          }}
        >

          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('CookiesPreferences.header')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}
              dangerouslySetInnerHTML={{ __html: t('CookiesPreferences.technicalCookies') }}
            />
            <Typography variant="body1" sx={{ mb: 2 }}
              dangerouslySetInnerHTML={{ __html: t('CookiesPreferences.functionalCookies') }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              sx={{ mr: 1 }}
              variant="contained"
              color="primary"
              onClick={() => {
                acceptCookies();
                onCloseCompose();
              }}
            >
              {t('CookiesPreferences.accept')}
            </Button>
            <Button
              sx={{ mr: 1 }}
              variant="contained"
              color="primary"
              onClick={() => {
                declineCookies();
                onCloseCompose();
              }}
            >
              {t('CookiesPreferences.decline')}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Portal>
  );
}
