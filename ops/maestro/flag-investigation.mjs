#!/usr/bin/env node
/**
 * flag-investigation — raise a reference-only RCA trigger into maestro (EP-05 / maestro ADR-0026).
 *
 * This is the **sender** side of the managed-product RCA contract
 * (maestro: standards/managed-product-rca.yaml). It POSTs a trigger carrying **identifiers + a
 * replay_url only — never page/content data** to maestro's investigation intake. maestro opens an
 * investigation, the RCA agent diagnoses, and on architect approval a fix is dispatched through the
 * normal delivery loop.
 *
 * The faridgurbanov-webapp is onboarded to maestro as product `internal`, repo
 * `fps4/faridgurbanov-webapp`, with a `product_runtime` principal (see maestro config/products.yaml).
 *
 * Usage:
 *   node ops/maestro/flag-investigation.mjs --reason "checkout 500 on submit" \
 *        [--correlation <id>] [--severity error] [--source monitor] [--replay-url <url>]
 *
 * Env:
 *   MAESTRO_URL         maestro base URL            (default http://127.0.0.1:8800)
 *   MAESTRO_PRODUCT_ID  the product id              (default internal)
 *   MAESTRO_REPO        the repo the RCA targets    (default fps4/faridgurbanov-webapp)
 *   MAESTRO_IDENTITY    loopback dev identity       (default runtime@faridgurbanov-webapp.fps4.nl)
 *                       — sent as X-Maestro-Identity; honoured only off-prod over loopback.
 *   MAESTRO_TOKEN       component-auth JWT          — sent as Authorization: Bearer (prod path).
 *   DEPLOY_BASE_URL     the deployment base URL the bundle is reachable at over the private link
 *                       (default http://127.0.0.1:3034). The replay_url is derived from it unless
 *                       --replay-url is given. NOTE: a static site serves no bundle endpoint yet, so
 *                       the pull is "unreachable" and the RCA records that (a valid state — Q6); see
 *                       this folder's README for adding a real /__rca/bundle endpoint.
 */
import { createHash } from 'node:crypto';

function arg(name, fallback = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const MAESTRO_URL = process.env.MAESTRO_URL || 'http://127.0.0.1:8800';
const PRODUCT_ID = process.env.MAESTRO_PRODUCT_ID || 'internal';
const REPO = process.env.MAESTRO_REPO || 'fps4/faridgurbanov-webapp';
const IDENTITY = process.env.MAESTRO_IDENTITY || 'runtime@faridgurbanov-webapp.fps4.nl';
const TOKEN = process.env.MAESTRO_TOKEN || '';
const DEPLOY_BASE_URL = process.env.DEPLOY_BASE_URL || 'http://127.0.0.1:3034';

const reason = arg('reason');
if (!reason) {
  console.error('error: --reason "<short incident reason>" is required');
  process.exit(2);
}
const correlationId = arg('correlation', `web-${Date.now().toString(36)}`);
const severity = arg('severity', 'error');
const source = arg('source', 'operator-flag');
const replayUrl = arg('replay-url', `${DEPLOY_BASE_URL}/__rca/bundle/${correlationId}`);

// Stable signal fingerprint — repeated triggers for the same incident collapse onto one investigation
// (maestro storm-control). Keyed on repo + reason so a flapping monitor doesn't storm maestro.
const signalFingerprint = createHash('sha256').update(`${REPO}:${reason}`).digest('hex').slice(0, 16);

// The reference object — IDENTIFIERS + metadata + replay_url ONLY. No page content, no user data.
// maestro re-asserts this on receipt and refuses a content-bearing trigger (422).
const reference = {
  product_id: PRODUCT_ID,
  repo: REPO,
  correlation_id: correlationId,
  signal_fingerprint: signalFingerprint,
  reason,
  occurred_at: new Date().toISOString(),
  severity,
  source,
  replay_url: replayUrl,
  deployment_id: 'faridgurbanov-webapp@ds1',
};

const headers = { 'Content-Type': 'application/json', 'Idempotency-Key': `rca-${signalFingerprint}` };
if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
else headers['X-Maestro-Identity'] = IDENTITY; // loopback dev path (off-prod only)

const url = `${MAESTRO_URL}/api/products/${PRODUCT_ID}/tasks`;
const res = await fetch(url, {
  method: 'POST',
  headers,
  body: JSON.stringify({ task_type: 'investigation', reference }),
});

const text = await res.text();
let body;
try { body = JSON.parse(text); } catch { body = text; }

if (!res.ok) {
  console.error(`✗ maestro refused (${res.status}):`, body);
  process.exit(1);
}
console.log('✓ investigation opened in maestro');
console.log(`  task_id:     ${body.task_id}`);
console.log(`  product:     ${body.product_id}`);
console.log(`  stage:       ${body.stage}${body.collapsed ? ' (collapsed onto an open investigation)' : ''}`);
console.log(`  fingerprint: ${signalFingerprint}`);
console.log(`  view:        ${MAESTRO_URL}${body.href}`);
