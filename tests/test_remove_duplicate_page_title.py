"""Spec-derived tests for feature: remove-duplicate-page-title.

The fix ships a single Hugo markdown render hook,
`layouts/_default/_markup/render-heading.html`, that suppresses a duplicate
leading post-title heading in the body so the title -- already rendered once by
the post layout, with the date beneath it -- appears exactly once.

This is a template-only change with no executable Python, so each acceptance
criterion is verified *structurally* against the committed render hook using
only the standard library: the guard's scope (page kind, leading top-level
heading), its normalised equality comparison, its in-place verbatim rendering of
every other heading, and the template's well-formedness.
"""
from __future__ import annotations

import re
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
RENDER_HOOK = REPO_ROOT / "layouts" / "_default" / "_markup" / "render-heading.html"


@pytest.fixture(scope="module")
def hook() -> str:
    assert RENDER_HOOK.is_file(), (
        "AC-1: heading render hook is missing at "
        f"{RENDER_HOOK.relative_to(REPO_ROOT)}"
    )
    return RENDER_HOOK.read_text(encoding="utf-8")


def _branches(src: str) -> tuple[str, str]:
    """Return (suppressed_branch, rendered_branch) of the title guard."""
    if_m = re.search(r"\{\{-?\s*if\s+\$isDuplicateTitle\s*-?\}\}", src)
    else_m = re.search(r"\{\{-\s*else\s*-\}\}", src)
    end_m = re.search(r"\{\{-\s*end\s*-\}\}", src)
    assert if_m and else_m and end_m, "title guard if/else/end block not found"
    assert if_m.end() <= else_m.start() < end_m.start(), "guard block out of order"
    return src[if_m.end():else_m.start()], src[else_m.end():end_m.start()]


def _condition(src: str) -> str:
    """Return the boolean expression assigned to $isDuplicateTitle."""
    m = re.search(r"\$isDuplicateTitle\s*:=\s*and\b(.+?)-?\}\}", src, re.DOTALL)
    assert m, "duplicate-title condition ($isDuplicateTitle := and ...) not found"
    return m.group(1)


def test_ac1_duplicate_leading_title_heading_is_suppressed(hook: str) -> None:
    """AC-1: a blog post renders its title exactly once.

    The hook derives a normalised front-matter title and heading text, and when
    a leading body heading equals the title it emits *nothing* -- so the title
    (rendered once by the layout) is never repeated in the body.
    """
    assert re.search(r"\$title\s*:=\s*\.Page\.Title", hook), \
        "AC-1: title must be sourced from front matter (.Page.Title)"
    assert re.search(r"\$text\s*:=\s*\.Text", hook), \
        "AC-1: body heading text must be compared against the title"
    # Both sides normalised the same way (plainify + lower) so a differently
    # cased/spaced repeat still deduplicates to exactly one rendered title.
    assert hook.count("plainify") >= 2 and hook.count("lower") >= 2, \
        "AC-1: title and heading text must be normalised identically"
    assert re.search(r"eq\s+\$text\s+\$title", hook), \
        "AC-1: the duplicate is detected by title/heading-text equality"

    suppressed, rendered = _branches(hook)
    assert "<h" not in suppressed, \
        "AC-1: the duplicate branch must emit no heading (title rendered once)"
    assert "<h" in rendered, \
        "AC-1: non-duplicate headings must still render"


def test_ac2_guard_preserves_title_then_date_then_body_order(hook: str) -> None:
    """AC-2: title stays before the date and body; only the duplicate is removed.

    The guard fires solely for the body's leading (Ordinal 0) level-1 heading,
    so the layout's title and the date beneath it are untouched and every other
    heading renders verbatim in place -- preserving title -> date -> body order.
    """
    condition = _condition(hook)
    assert re.search(r"eq\s+\.Ordinal\s+0", condition), \
        "AC-2: only the leading heading (Ordinal 0) may be suppressed"
    assert re.search(r"eq\s+\.Level\s+1", condition), \
        "AC-2: only a top-level (Level 1) heading may be suppressed"

    _suppressed, rendered = _branches(hook)
    # Kept headings render at their original level and text, in place, so the
    # guard relocates nothing relative to the date/body.
    assert re.search(r"<h\{\{\s*\.Level\s*\}\}", rendered), \
        "AC-2: kept headings render in place with their original level"
    assert ".Text" in rendered, \
        "AC-2: kept headings render their original text"


def test_ac3_non_blog_post_pages_are_unchanged(hook: str) -> None:
    """AC-3: home/about/section/taxonomy pages keep their current title display.

    The suppression condition requires `.Page.Kind == \"page\"`, so on any other
    page kind the guard never fires and every heading renders verbatim --
    leaving non-post title behaviour unchanged.
    """
    condition = _condition(hook)
    assert re.search(r'eq\s+\.Page\.Kind\s+"page"', condition), \
        "AC-3: suppression must be scoped to blog post pages (Kind == page)"


def test_ac4_render_hook_is_well_formed(hook: str) -> None:
    """AC-4: the template is well-formed, so the build adds no new warning/error.

    Balanced action delimiters and block open/close pairs, plus a complete,
    balanced heading element in the render branch, guard against introducing a
    build-time template error or malformed-HTML warning.
    """
    assert hook.count("{{") == hook.count("}}"), \
        "AC-4: unbalanced Go-template action delimiters"
    openers = len(re.findall(r"\{\{-?\s*(?:if|range|with|block|define)\b", hook))
    closers = len(re.findall(r"\{\{-?\s*end\b", hook))
    assert openers == closers, \
        "AC-4: unbalanced template block actions (if/range/... vs end)"

    _suppressed, rendered = _branches(hook)
    assert re.search(r"<h\{\{\s*\.Level\s*\}\}", rendered), \
        "AC-4: render branch must open a heading element"
    assert re.search(r"</h\{\{\s*\.Level\s*\}\}>", rendered), \
        "AC-4: render branch must close a balanced heading element"
