#!/usr/bin/env python3
"""Lightweight hygiene checks for public docs, prompts, templates, and examples."""

from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent

CHANGELOG = ROOT / "CHANGELOG.md"

PUBLIC_RENDER_TARGETS = [
    ROOT / "README.md",
    ROOT / "GETTING-STARTED.md",
    ROOT / "CONTRIBUTING.md",
    *sorted((ROOT / "examples").rglob("*.md")),
]

PUBLIC_GUIDE_TARGETS = [
    *sorted((ROOT / "guides").rglob("*.md")),
]

PROMPT_TARGETS = [
    *sorted((ROOT / "prompts").rglob("*.md")),
]

TEMPLATE_TARGETS = [
    *sorted((ROOT / "templates").rglob("*.md")),
]

PUBLIC_CONTENT_TARGETS = (
    PUBLIC_RENDER_TARGETS
    + PUBLIC_GUIDE_TARGETS
    + PROMPT_TARGETS
    + TEMPLATE_TARGETS
    + [CHANGELOG]
)

RENDER_BLOCKERS = [
    ("unresolved placeholder", re.compile(r"\byear TBD\b", re.IGNORECASE)),
    ("unresolved ASK/VERIFY marker", re.compile(r"\[(ASK|VERIFY):[^\]]+\]")),
    ("HTML comment", re.compile(r"<!--.*?-->", re.DOTALL)),
    (
        "unresolved bracket placeholder",
        re.compile(r"(?<!\!)\[(?![ xX]\])([^\]\n]{2,120})\](?!\()"),
    ),
]

PUBLIC_GUIDE_BLOCKERS = [
    ("unresolved placeholder", re.compile(r"\byear TBD\b", re.IGNORECASE)),
    ("unresolved ASK/VERIFY marker", re.compile(r"\[(ASK|VERIFY):[^\]]+\]")),
]


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def line_number(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def add_pattern_issues(
    issues: list[tuple[Path, int, str, str]],
    path: Path,
    text: str,
    patterns: list[tuple[str, re.Pattern[str]]],
) -> None:
    for label, pattern in patterns:
        for match in pattern.finditer(text):
            snippet = match.group(0).replace("\n", "\\n")
            issues.append((path, line_number(text, match.start()), label, snippet))


def main() -> int:
    issues: list[tuple[Path, int, str, str]] = []

    for path in PUBLIC_CONTENT_TARGETS:
        if not path.exists():
            issues.append((path, 1, "missing target", str(path)))

    for path in PUBLIC_RENDER_TARGETS:
        if path.exists():
            add_pattern_issues(issues, path, read(path), RENDER_BLOCKERS)

    for path in PUBLIC_GUIDE_TARGETS:
        add_pattern_issues(issues, path, read(path), PUBLIC_GUIDE_BLOCKERS)

    if issues:
        print("Public content hygiene check failed:\n", file=sys.stderr)
        for path, lineno, label, snippet in issues:
            rel = path.relative_to(ROOT) if path.is_relative_to(ROOT) else path
            print(f"- {rel}:{lineno}: {label}: {snippet}", file=sys.stderr)
        return 1

    print("Public content hygiene check passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
