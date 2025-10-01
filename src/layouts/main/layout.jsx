'use client';

import TagManager from 'react-gtm-module'
import { useState, useEffect } from 'react';
import { ChatbotWidget } from '@fps4/widget-ui';
import { useBoolean } from 'minimal-shared/hooks';
import { useCookies, CookiesProvider } from 'react-cookie';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { usePathname } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { allLangs, useTranslate } from 'src/locales';

import { Logo } from 'src/components/logo';
import { CookiesConsent } from 'src/components/cookies-consent/cookies-consent-dialog';

import { Footer } from './footer';
import { NavMobile } from './nav/mobile';
import { NavDesktop } from './nav/desktop';
import { MainSection } from '../core/main-section';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { navData as mainNavData } from '../nav-config-main';
import { LanguagePopover } from '../components/language-popover';


// ----------------------------------------------------------------------

export function MainLayout({ sx, cssVars, children, slotProps, layoutQuery = 'md' }) {
  return (
    <CookiesProvider>
      <MainLayoutContent
        sx={sx}
        cssVars={cssVars}
        children={children}
        slotProps={slotProps}
        layoutQuery={layoutQuery}
      />
    </CookiesProvider>
  );
}

function MainLayoutContent({ sx, cssVars, children, slotProps, layoutQuery }) {
  
  const { t, currentLang } = useTranslate('navbar');
  const pathname = usePathname();

  useEffect(() => {
    console.log('MainLayoutContent hydrated on client');
  }, []);
  
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const lang = currentLang?.value || 'en';
  const navData = slotProps?.nav?.data ?? mainNavData(lang).map((item) => ({
    ...item,
    title: t(item.title),
  }));

  const [isCookiesConsentOpen, setCookiesConsentOpen] = useState(false); // Reintroduce state

  const [cookies] = useCookies(); // Initialize useCookies hook
  const [sessionCookie] = useCookies(['session_id']);
  const [userConsentCookie] = useCookies(['user_consent']);

  useEffect(() => {
    if (!userConsentCookie.user_consent) {
      setCookiesConsentOpen(true);
    }
  }, [sessionCookie, userConsentCookie.user_consent]);
  

  // --- Google Tag Manager: consent + dynamic page data ---
  const [gtmInitialized, setGtmInitialized] = useState(false);
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-5DXDHNDZ';
  const runtimeEnv = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || 'development';

  // Consent Mode: set default (denied) before any tags load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
    }
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
      wait_for_update: 500,
    });
  }, []);

  // Initialize GTM only after user consent is accepted
  useEffect(() => {
    if (userConsentCookie.user_consent !== 'accepted') return;
    if (gtmInitialized) return;

    if (typeof window !== 'undefined' && gtmId?.startsWith('G-')) {
      console.warn(
        'GTM initialization: NEXT_PUBLIC_GTM_ID looks like a GA4 Measurement ID (starts with G-). Use a GTM container ID (GTM-XXXX) for react-gtm-module.'
      );
    }

    TagManager.initialize({
      gtmId,
      dataLayerName: 'dataLayer',
      dataLayer: {
        event: 'consent_update',
        consent: {
          ad_storage: 'granted',
          analytics_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        },
        environment: runtimeEnv,
      },
    });
    setGtmInitialized(true);
  }, [gtmId, gtmInitialized, userConsentCookie.user_consent, runtimeEnv]);

  // Keep consent state in sync (update) regardless of GTM init
  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return;
    const granted = userConsentCookie.user_consent === 'accepted';
    window.gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
    });
  }, [userConsentCookie.user_consent]);

  // Push dynamic page details on route changes
  useEffect(() => {
    if (!gtmInitialized) return;

    const langVal = currentLang?.value || 'en';
    const pagePath = pathname || '/';
    const pageCategory = pagePath.split('/').filter(Boolean)[1] || 'home';
    const pageTitle = typeof document !== 'undefined' ? document.title : '';
    const pageLocation = typeof window !== 'undefined' ? window.location.href : '';
    const pageReferrer = typeof document !== 'undefined' ? document.referrer : '';
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const screenRes = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '';

    TagManager.dataLayer({
      dataLayer: {
        event: 'page_view',
        page_path: pagePath,
        page_title: pageTitle,
        page_location: pageLocation,
        page_referrer: pageReferrer,
        page_category: pageCategory,
        language: langVal,
        user_id: null, // user?.sub || null,
        session_id: sessionCookie?.session_id || null,
        visitor_id: cookies?.visitor_id || null,
        user_consent: userConsentCookie?.user_consent || null,
        user_agent: ua,
        screen_resolution: screenRes,
        logged_in: false, // !!user,
        environment: runtimeEnv,
      },
    });
  }, [gtmInitialized, pathname, currentLang?.value, sessionCookie?.session_id, cookies?.visitor_id, userConsentCookie?.user_consent, runtimeEnv]);

  const renderHeader = () => {
    const headerSlots = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={(theme) => ({
              mr: 1,
              ml: -1,
              [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
            })}
          />
          <NavMobile data={navData} open={open} onClose={onClose} />

          {/** @slot Logo */}
          <Logo />
        </>
      ),
      rightArea: (
        <>
          {/** @slot Nav desktop */}
          <NavDesktop
            data={navData}
            sx={(theme) => ({
              display: 'none',
              [theme.breakpoints.up(layoutQuery)]: { mr: 2.5, display: 'flex' },
            })}
          />


          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            <LanguagePopover data={allLangs} />

            {/** @slot Chatbot */}

            <ChatbotWidget
              options={{
                tenantId: CONFIG.chatbotTenantId, 
                apiBaseUrl: CONFIG.chatbotApiBaseUrl,
              }}
            />            

          </Box>
        </>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={slotProps?.header?.slotProps}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () => (
    <Footer
      sx={slotProps?.footer?.sx}
      layoutQuery={layoutQuery}
      setCookiesConsentOpen={setCookiesConsentOpen} // Pass function as prop
    />
  );

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={cssVars}
      sx={sx}
    >
      {renderMain()}
      {isCookiesConsentOpen && <CookiesConsent onCloseCompose={() => setCookiesConsentOpen(false)} />}
    </LayoutSection>
  );
}
