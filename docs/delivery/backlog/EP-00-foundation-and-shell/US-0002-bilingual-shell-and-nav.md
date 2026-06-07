---
title: "US-0002: Bilingual shell, navigation & language switcher"
persona: architect
status: draft
complexity: M
milestone: M0
last_updated: 2026-06-07
spec: docs/product/FS-0001-site-shell-and-content-pipeline.md
design: docs/design/decisions/0002-bilingual-en-nl-i18n.md
---

## Story

As a visitor,
I want a consistent header/footer and to switch between English and Dutch on any page,
so that I can navigate the site and read it in my language without losing my place.

## Context

Implements the shell + bilingual routing half of FS-0001 under ADR-0002. Locale-segmented routes
(`/en`, `/nl`), a configured default locale, and a language switcher that preserves page identity.
Depends on US-0001.

## Acceptance criteria (EARS)

- THE SYSTEM SHALL wrap every route in a shared layout with a header (name/logo + primary nav) and
  a footer (contact + social links).
- THE SYSTEM SHALL serve locale-segmented routes for English and Dutch with one configured default
  locale.
- WHEN a visitor uses the language switcher on any page, THE SYSTEM SHALL navigate to the
  equivalent page in the other locale, preserving page identity (not resetting to home).
- WHERE a page lacks a translation in the requested locale, THE SYSTEM SHALL fall back to the
  default locale and indicate the fallback (no silent 404).
- THE navigation SHALL be milestone-configurable so the Training entry can be a CTA stub in M0 and
  a full nav item in M1 without shell code changes.

## Out of scope

- Markdown rendering (US-0003) and per-page content (EP-01/EP-02).

## Notes

Nav labels are localized; keep a single nav definition driving both languages.
