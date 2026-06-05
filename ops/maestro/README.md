# maestro RCA — managed-product onboarding (sender side)

This folder is how **faridgurbanov-webapp** raises a **root-cause investigation** in
[maestro](https://github.com/fps4/maestro) when something goes wrong in the deployed site — manually,
or from a monitor — **without any page or user content leaving the deployment**.

It implements the *sender* half of maestro's managed-product RCA contract
(`standards/managed-product-rca.yaml`, ADR-0026). maestro is the *receiver*: it opens an investigation,
its RCA agent diagnoses, and on architect approval a fix is dispatched through the normal delivery loop.

## How it's wired

This product is registered in maestro as:

- product id **`internal`**, repo **`fps4/faridgurbanov-webapp`**
- a **`product_runtime`** principal (`runtime@faridgurbanov-webapp.fps4.nl`) authorized to open
  investigations for this product **only** — never to start a build or decide a gate.

## Raise an investigation

```bash
# against a local maestro (serve --engine on :8800), loopback dev identity:
node ops/maestro/flag-investigation.mjs --reason "checkout 500 on submit"

# against a real maestro edge, with a component-auth JWT:
MAESTRO_URL=https://maestro.fps4.nl MAESTRO_TOKEN="$JWT" \
  node ops/maestro/flag-investigation.mjs --reason "wrong VAT on invoice" --severity critical
```

The script POSTs a **reference object** — identifiers, a short reason, a `signal_fingerprint`, and a
`replay_url` — and **nothing else**. maestro refuses (422) any trigger carrying content fields
(`prompt`, `answer`, `messages`, `content`, …): the reference-only invariant is enforced on receipt,
so the data boundary holds even if a sender misbehaves.

Repeated triggers for the same `--reason` collapse onto one open investigation (storm control).

## The bundle (`replay_url`) — the evidence floor

The trigger points at an in-deployment bundle endpoint over the private link; maestro's RCA agent
pulls it when it investigates. **A static site serves no such endpoint yet**, so the pull is
*unreachable* — which is a **valid, first-class state**: the RCA agent records "evidence unreachable"
and diagnoses from the trigger metadata rather than fabricating a cause. The investigation still opens
and is still useful.

To give maestro real evidence later, expose a private-network route that returns a JSON diagnostic
trace for a `correlation_id`:

```
GET {DEPLOY_BASE_URL}/__rca/bundle/{correlation_id}   →  { ...diagnostic trace as JSON... }
```

behind the deployment's own auth (maestro sends `Authorization: Bearer $MAESTRO_RCA_BUNDLE_TOKEN` if
set). Keep it reachable only over the private link — never a public route. The contents stay in the
deployment; only the reference ever crosses to maestro.

## Automatic triggering (later)

Wire the same script (or its POST) behind a monitor / error-budget alert so an incident fires an
investigation with no human in the loop. Today this is the manual operator-flag path; the contract is
identical for the automatic one (just `--source monitor`).
