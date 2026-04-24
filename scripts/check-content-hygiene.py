#!/usr/bin/env python3
"""Lightweight hygiene checks for public docs and curated examples."""

from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
EXAMPLES_DIR = ROOT / "examples"
TARGETS = [
    ROOT / "README.md",
    ROOT / "GETTING-STARTED.md",
    *sorted(EXAMPLES_DIR.rglob("*.md")),
]

PATTERNS = [
    ("dead script reference", re.compile(r"generate-pdf\.mjs")),
    ("internal grader note", re.compile(r"Notes for the test grader")),
    ("unresolved placeholder", re.compile(r"\byear TBD\b", re.IGNORECASE)),
    ("unresolved ASK/VERIFY marker", re.compile(r"\[(ASK|VERIFY):[^\]]+\]")),
    ("HTML comment", re.compile(r"<!--.*?-->", re.DOTALL)),
    (
        "unresolved bracket placeholder",
        re.compile(r"(?<!\!)\[(?![ xX]\])([^\]\n]{2,120})\](?!\()"),
    ),
]


def line_number(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def main() -> int:
    issues: list[tuple[Path, int, str, str]] = []

    for path in TARGETS:
        if not path.exists():
            issues.append((path, 1, "missing target", str(path)))
            continue

        text = path.read_text(encoding="utf-8")
        for label, pattern in PATTERNS:
            for match in pattern.finditer(text):
                snippet = match.group(0).replace("\n", "\\n")
                issues.append((path, line_number(text, match.start()), label, snippet))

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
