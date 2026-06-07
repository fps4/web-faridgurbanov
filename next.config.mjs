/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export (ADR-0001): emits static HTML/CSS/JS to ./out with no application server.
  // The export is served by the nginx image (infra/docker/web.Dockerfile); the DoD gate
  // (.github/workflows/dod.yml) asserts `out/` exists after `npm run build`.
  output: 'export',
  reactStrictMode: true,
  // next/image's default loader needs a server; the export is served by static nginx, so
  // opt images out of optimisation (US-0001 has no images yet — this keeps the door open).
  images: { unoptimized: true },
};

export default nextConfig;
