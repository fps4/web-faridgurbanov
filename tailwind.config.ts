import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import defaultTheme from 'tailwindcss/defaultTheme';

// shadcn/ui token mapping → CSS variables defined in app/globals.css.
const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    // One centred column. The design's text column is 1080px with 32px outside it on each side, so the
    // box is at most 1144px (border-box) and the text 1080px (FS-0001). Bands wrap a `container`, so
    // their backgrounds still run the full width.
    container: { center: true, padding: '32px', screens: { '2xl': '1144px' } },
    extend: {
      // Inter for text and Space Grotesk for headings, self-hosted (@font-face in app/globals.css).
      // The fallbacks show at once while the files load (font-display: swap).
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', ...defaultTheme.fontFamily.sans],
        heading: ['"Space Grotesk Variable"', '"Space Grotesk"', '"Inter Variable"', ...defaultTheme.fontFamily.sans],
      },
      // Pages that narrow a container with `max-w-5xl` keep the same column as the rest.
      maxWidth: { '5xl': '1144px' },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [typography],
};

export default config;
