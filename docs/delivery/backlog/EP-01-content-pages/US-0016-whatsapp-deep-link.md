---
title: "US-0016: WhatsApp click-to-chat contact channel"
persona: visitor
status: done
complexity: S
milestone: M1
last_updated: 2026-08-20
spec: docs/product/FS-0007-contact-and-privacy.md
design: docs/design/decisions/0001-tech-stack-and-static-export.md
---

## Story

As a visitor who would rather send a quick message than draft an email,
I want a "Message me on WhatsApp" affordance on the contact page that opens a chat to the owner
with my note pre-filled,
so that I can reach out in one tap and the owner receives my message — and my verified WhatsApp
number to reply to — without either of us needing an app server.

## Context

Extends FS-0007 / US-0015 with a second low-friction channel alongside the obfuscated email. It uses
WhatsApp's official click-to-chat link (`https://wa.me/<number>?text=<prefilled>`): the visitor's
own WhatsApp opens a chat addressed to the owner's Rinkel-linked number, so the message is sent
**from the visitor's account** — the owner receives a normal WhatsApp message carrying the sender's
verified number and profile, and can reply in-thread.

This is the only "leave a message and I get a number to reply to" option compatible with the static
export (ADR-0001): it needs **no backend and no secrets**, so it cannot leak an API key the way a
client-side call to a messaging API (Rinkel, WhatsApp Business, Twilio) would. The Rinkel API is
voice-focused (call events, recordings, voicemails) and does not send outbound WhatsApp messages, so
it is out of scope here. A free-text box may pre-fill the link, but the visitor still presses send
in WhatsApp — the link cannot auto-send.

Because clicking the link discloses the owner's number and the visitor's intent to Meta, the privacy
page (US-0015) must gain an accurate line about this; the email path stays processor-free as it is
today. Depends on US-0015.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL present a WhatsApp contact affordance on the contact page that, when activated,
  opens a WhatsApp chat addressed to the owner's configured number via the official click-to-chat
  link, working without a server-side backend or any embedded secret.
- WHERE a free-text input is offered, THE SYSTEM SHALL URL-encode its contents into the link's
  pre-filled message and SHALL NOT transmit anything itself — the visitor sends from their own
  WhatsApp.
- THE owner's WhatsApp number SHALL be sourced from a single config value (e.g. `lib/site.ts`) in
  international format, and SHALL NOT be hard-coded across components.
- THE privacy/GDPR page SHALL state that choosing the WhatsApp channel discloses the visitor's
  WhatsApp number and message to Meta as a third-party processor, while affirming the email path
  remains processor-free.
- THE WhatsApp affordance and its helper/hint copy SHALL be available in both English and Dutch.
- WHERE the link cannot pre-fill or open (no WhatsApp installed / unsupported client), THE affordance
  SHALL degrade to a plain `wa.me` link the visitor can still use, with no script error.

## Out of scope

- Any server-side or third-party send path (Rinkel API, WhatsApp Business API, Pipedream, Twilio,
  Formspree-style backends) — these need a server, paid account, or secret and break ADR-0001.
- Auto-sending the message, delivery receipts, read state, or storing/queuing messages on the site.
- A WhatsApp chat widget/embed or live-chat SDK.

## Notes

Keep the affordance consistent with the existing obfuscated-email pattern (a client island next to
the email section), not a heavyweight form. The privacy line must reflect the real data flow — the
moment of value (the owner getting a verified number to reply to) is exactly the moment Meta becomes
a processor; say so plainly rather than as boilerplate.

---

## Scope extension and delivery (2026-08-20, ADR-0007)

Delivered, with one deliberate change: the owner asked for the affordance to be reachable from **any
page**, not only Contact. `components/whatsapp-launcher.tsx` adds a fixed launcher in the locale
layout alongside the contact-page affordance in `components/whatsapp-contact.tsx`.

This does **not** cross the "no widget/embed" line in *Out of scope*: both are plain anchors to
`wa.me`, with no SDK, no iframe and nothing loaded from Meta until the visitor activates the link.
The privacy analysis is unchanged in kind; only its reach grows, and the privacy page states it.

Two implementation notes:

- The number is assembled in the browser from `whatsapp` in `lib/site.ts`, matching the
  obfuscated-email pattern, so the full number is not sitting in the exported HTML.
- The configured number is the **Rinkel business number** (+31 30 207 2959), confirmed by the owner
  2026-08-20 — which is what this story assumed all along. The personal mobile stays on the CV and
  off the public surface. Setting `whatsapp` to `null` removes the channel from the whole site.
- **Registration verified 2026-08-20.** `https://wa.me/31302072959` resolves to the WhatsApp
  Business profile **"Fusion Platform Services"**, so the click-to-chat link works and a visitor sees
  a business name rather than a bare number. This check matters because `wa.me` renders a
  working-looking link for an unregistered number and then lands on *"the phone number shared via url
  is invalid"* — worse than having no button. Re-run it if the number ever changes.
