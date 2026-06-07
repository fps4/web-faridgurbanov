import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://faridgurbanov.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Farid Gurbanov',
  description: 'Personal site of Farid Gurbanov.',
};

// Root shell. The bilingual header/nav and language switcher land in US-0002; US-0001
// only establishes the theme-aware document so later pages share one surface.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning: next-themes sets the theme class on <html> before React hydrates.
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
