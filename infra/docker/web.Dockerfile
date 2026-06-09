# faridgurbanov.com — static site image.
# Multi-stage: build the Next.js static export (output: 'export' → ./out), then serve it from a
# minimal nginx. No application server (ADR-0001) — Docker appears only at the serving edge.
# Build context is the repo root: `docker build -f infra/docker/web.Dockerfile .`

FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* are baked at build time; override per-deployment via the compose build args.
ARG NEXT_PUBLIC_SITE_URL=https://faridgurbanov.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build
# Fail fast if the export wasn't produced (output: 'export' is required by ADR-0001).
RUN test -d out

FROM nginx:1.27-alpine AS runtime
COPY infra/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html
# nginx listens on 3035 (see nginx.conf) — keep EXPOSE and the healthcheck in lock-step.
EXPOSE 3035
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 \
    CMD wget -qO /dev/null http://127.0.0.1:3035/ || exit 1
