---
title: "FS-0011 — Storyline feedback"
status: draft
last_updated: 2026-10-20
owners: [architect]
related:
  - docs/product/FS-0010-ai-product-design-storyline.md
  - docs/product/FS-0007-contact-and-privacy.md
  - docs/design/decisions/0001-tech-stack-and-static-export.md
  - docs/delivery/backlog/EP-03-ai-product-design/README.md
maestro:
  feature: storyline-feedback
  kind: functional_spec
  summary: |
    How the owner learns whether a part of the AI Product Design storyline was used: four short
    questions, asked the same way on every channel, and answered by the visitor's own email or
    WhatsApp. The site keeps its promise of no backend, no form and no analytics; counts come from
    the platforms that already keep them (GitHub, YouTube, LinkedIn) and are saved by the owner.
---

# FS-0011 — Storyline feedback

- **Status:** draft (requirements only; nothing built)
- **Raised:** 2026-10-20
- **Owner:** @farid (architect)
- **Decision:** none yet; see [Open decisions](#open-decisions)

## Why

Each part of the storyline is a bet that a non-technical reader will use its download in their own
work. Part 1 is the pilot, and it passes only on behaviour: a viewer forwards it unasked, uses the
canvas in a real meeting, or asks for a look at their own case. The downloads will also come in an
**assistant version**: instruction text the reader pastes into the assistant their company allows
(Microsoft 365 Copilot, ChatGPT, Claude), which interviews them and checks their answers against the
download's own rules. Whether anyone uses that version decides whether every part gets one.

None of that shows up in page views. The owner needs a few answers from people who used the
material, and a count of how many looked at it, collected the same way for every part so the parts
can be compared.

The site is a static export with no backend (ADR-0001), and its privacy page says it collects
nothing and runs no analytics (FS-0007). Feedback has to fit inside that, or the privacy page has to
change first.

## What we want to learn

The same four questions on every channel, so answers from email, WhatsApp, a debrief call and an
assistant can go into one log:

1. **What did you use it for?** In a meeting with others · on my own case · I only read it.
2. **Which version?** The file · the assistant version, in which assistant · both. Did the
   assistant version run there?
3. **What was missing or wrong?** One line.
4. *(Optional)* **How did you find it?** Someone sent it · LinkedIn · YouTube · search · other.

Question 4 is how a forward shows up. "Could you look at ours?" is a contact request, and goes
through the contact page as today.

## Approach

**No backend and no form on the site.** The visitor answers in their own mail app or WhatsApp, the
same mechanisms the contact page already uses. Counts come from tools that already keep them.

| Channel | What it gives | Who keeps it |
|---|---|---|
| Part page: "Tell me how it went" | The four questions, by email or WhatsApp | The owner's mailbox and phone |
| Assistant version, last step | The assistant drafts the four answers; the reader sends them | The reader decides |
| Episode description, post, first comment | A link to the part page's feedback section | The platform |
| Kit repository traffic | Views per file, referring sites, clones | GitHub, 14 days only; the owner saves it weekly |
| YouTube Studio, LinkedIn analytics | Views, watch time, reactions | The platforms |
| Pilot debrief | The four questions, asked in a 15-minute call | The owner |

## Scope

1. **Feedback section on the part page.** Below the downloads, a short section (`#feedback`) with
   the four questions and two links: one opens the visitor's mail app, one opens WhatsApp, each with
   the part and the questions already filled in. Built in the browser from the parts in
   `lib/site.ts`, like the contact email, so the address is not in the exported HTML.
2. **One feedback link per download.** Each download row links to the same section, with the
   download named in the prefilled subject.
3. **Assistant versions end with a feedback step (kit).** After the assistant has produced the
   filled download, it offers to draft the four answers in the reader's words and tells them where
   to send them: the part page's feedback section. It never sends anything, and the kit text holds
   no email address.
4. **Same link everywhere outside the site.** Episode descriptions, the LinkedIn post and the first
   comment link to `/ai-product-design/<part>#feedback`, with no tracking parameters.
5. **Kit traffic saved weekly.** GitHub keeps traffic for 14 days. A small script run by the owner
   saves the kit repository's views, popular files, referrers and clones to a private file once a
   week. It lives with the owner's notes, not in this repository, and the site does not call it.
6. **One log per part (private).** Every answer, from any channel, becomes one row: date, channel,
   the reader's role (no name unless they agree), the four answers, and whether it meets the pilot's
   pass rule. The original email or message is deleted once logged, unless the reader asked for a
   reply.
7. **Pilot access while the gate is shut.** While `STORYLINE_PUBLISHED` is false the part page is a
   404 in production, so pilot viewers get a pilot pack by email: the episodes as unlisted YouTube
   links, the downloads from the kit (already public), the assistant version, and the four questions.
8. **Privacy page.** One sentence in English and Dutch: feedback sent by email or WhatsApp is used
   only to improve the storyline, summarised without the sender's name, and the message deleted
   after logging. The rest of the page stays true as written.
9. **Quotes need permission.** A reader's words appear on the site or in a post only with their
   written agreement, as for references (FS-0009).

## Out of scope

- A form, a survey tool, or any endpoint that receives data (see Open decisions).
- Site analytics, tracking pixels, or tracking parameters on links.
- Counting downloads on the site; until US-0033, downloads are files in the kit repository on GitHub.
- A preview deployment of the gated storyline for pilot viewers.

## Acceptance criteria (EARS)

- THE part page SHALL show a feedback section with the four questions below the downloads, at the
  anchor `#feedback`.
- WHEN a visitor follows the email link, THE browser SHALL open a new message to the owner with a
  subject naming the part (and the download, WHERE the link came from a download row) and a body
  holding the four questions; THE site SHALL send nothing itself.
- WHEN a visitor follows the WhatsApp link, THE browser SHALL open a chat with the same text, built
  with `whatsappHref()`; WHERE `whatsapp` is `null`, THE section SHALL show the email link only.
- THE exported HTML SHALL NOT contain the owner's email address or WhatsApp number as one string;
  both SHALL be assembled in the browser, as on the contact page.
- THE feedback links SHALL work on the static export and SHALL NOT load any third-party script.
- THE prefilled subject and body SHALL hold no data about the visitor.
- WHILE `STORYLINE_PUBLISHED` is false, THE feedback section SHALL follow the part page's gate.
- EACH assistant version in the kit SHALL end with an offer to draft the four answers AND SHALL
  point to the part page's feedback section; IT SHALL NOT contain an email address or instruct the
  assistant to send anything.
- THE links in episode descriptions and posts SHALL point to `/ai-product-design/<part>#feedback`
  without query parameters.
- WHERE feedback arrives by email or WhatsApp, THE privacy page SHALL state, in English and Dutch,
  what it is used for, that it is summarised without the sender's name, and that the message is
  deleted after logging.
- IF a third-party form or any analytics is added later, THEN THE privacy page SHALL name the
  processor, the lawful basis and the retention before the change is published.

## Open decisions

1. **Email and WhatsApp only, or a form as well?** Recommended: email and WhatsApp only for Part 1.
   A form gets more answers from people who will not write an email, but it adds a processor, a
   consent line and a privacy-page change. Revisit after Part 1 is public: if the kit shows readers
   (GitHub traffic) but fewer than five answers arrive in four weeks, add an EU-hosted form linked
   from the section (not embedded), with its own ADR.
2. **Count PDF downloads from the server log?** When US-0033 serves PDFs from the site, the ds1 nginx
   access log could count them with no script on the page. That is still collection, so it needs a
   line on the privacy page. Decide with US-0033.
3. **Pilot pass rule for the assistant version.** Proposed: the assistant version earns a place in
   every part if at least one pilot viewer runs it on their own case and says it helped.

## Definition of done

- Under `next dev`, the Part 1 page shows the feedback section; both links open with the right
  subject and text; the exported HTML has no plain address or number (a test checks it).
- The privacy page has the feedback sentence in both languages.
- The canvas's assistant version in the kit ends with the feedback step.
- The first weekly kit-traffic snapshot is saved.
