import Link from 'next/link';

// Placeholder root page. The real home, locale routing, and language switcher arrive in
// US-0002/US-0003; US-0001 only proves the static export builds and serves.
export default function Home() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-6 py-16 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Farid Gurbanov</h1>
      <p className="max-w-prose text-muted-foreground">
        Site scaffold (US-0001). Bilingual shell, navigation, and content arrive next.
      </p>
      <nav className="flex gap-4 text-sm">
        <Link className="underline underline-offset-4" href="/en">
          English
        </Link>
        <Link className="underline underline-offset-4" href="/nl">
          Nederlands
        </Link>
      </nav>
    </main>
  );
}
