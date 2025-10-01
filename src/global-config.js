import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------

export const CONFIG = {
  appName: 'Farid Gurbanov - Solutions Engineer & Architect',
  appNameShort: 'Farid Gurbanov',
  appVersion: packageJson.version,
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL ?? '',
  chatbotUrl: process.env.NEXT_PUBLIC_CHATBOT_URL ?? '',
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '',
  chatbotTenantId: process.env.NEXT_PUBLIC_CHATBOT_TENANT_ID ?? '',
  chatbotApiBaseUrl: process.env.NEXT_PUBLIC_CHATBOT_API_BASE_URL ?? '',
  isStaticExport: JSON.parse(`${process.env.BUILD_STATIC_EXPORT}`),
  /**
   * Social media
   */
  social: [
    { label: 'LinkedIn', value: 'linkedin', url: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? '' },
  ],
};
