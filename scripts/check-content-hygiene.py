#!/usr/bin/env python3
"""Lightweight hygiene checks for public docs, prompts, templates, and examples."""

from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent

TEXT_EXTENSIONS = {
    ".md",
    ".py",
    ".mjs",
    ".json",
    ".yml",
    ".yaml",
    ".txt",
}

SKIP_DIRS = {
    ".git",
    ".claude",
    "node_modules",
    "__pycache__",
    "my-documents",
}

CHANGELOG = ROOT / "CHANGELOG.md"
SELF = Path(__file__).resolve()

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

PUBLIC_GUIDE_BLOCKERS = [
    ("internal grader note", re.compile(r"Notes for the test grader")),
    ("unresolved placeholder", re.compile(r"\byear TBD\b", re.IGNORECASE)),
    ("unresolved ASK/VERIFY marker", re.compile(r"\[(ASK|VERIFY):[^\]]+\]")),
]

PROMPT_INTRO_BLOCKERS = [
    ("old prompt framing", re.compile(r"\bThin version\b", re.IGNORECASE)),
    ("technical prompt framing", re.compile(r"no-file-system", re.IGNORECASE)),
    ("skill comparison framing", re.compile(r"Use the skill if", re.IGNORECASE)),
    ("capability-negative framing", re.compile(r"This prompt can(?:not|'t)", re.IGNORECASE)),
]

PROMOTIONAL_BLOCKERS = [
    ("marketing tagline", re.compile(r"where remote means remote", re.IGNORECASE)),
    ("newsletter promo", re.compile(r"Work is a Verb", re.IGNORECASE)),
    ("newsletter promo", re.compile(r"remotivated\.com/newsletter", re.IGNORECASE)),
    ("product funnel copy", re.compile(r"no signup", re.IGNORECASE)),
    ("product tagline", re.compile(r"job platform where remote", re.IGNORECASE)),
]

OLD_NAME_PATTERNS = [
    ("old project name", re.compile(r"\bJob Hunt OS\b")),
    ("old package name", re.compile(r"\bjob-hunt-os\b")),
    ("old skill name", re.compile(r"\bremote-culture-check\b")),
]


def tracked_text_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*"):
        if any(part in SKIP_DIRS for part in path.relative_to(ROOT).parts):
            continue
        if not path.is_file():
            continue
        if path.name == "LICENSE" or path.suffix in TEXT_EXTENSIONS:
            files.append(path)
    return sorted(files)


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

    for path in tracked_text_files():
        text = read(path)
        if path not in {CHANGELOG, SELF}:
            add_pattern_issues(issues, path, text, OLD_NAME_PATTERNS)

    for path in PUBLIC_CONTENT_TARGETS:
        if not path.exists():
            issues.append((path, 1, "missing target", str(path)))
            continue
        add_pattern_issues(issues, path, read(path), PROMOTIONAL_BLOCKERS)

    for path in PUBLIC_RENDER_TARGETS:
        if path.exists():
            add_pattern_issues(issues, path, read(path), RENDER_BLOCKERS)

    for path in PUBLIC_GUIDE_TARGETS:
        add_pattern_issues(issues, path, read(path), PUBLIC_GUIDE_BLOCKERS)

    for path in PROMPT_TARGETS:
        add_pattern_issues(issues, path, read(path), PROMPT_INTRO_BLOCKERS)

    for path in TEMPLATE_TARGETS:
        add_pattern_issues(issues, path, read(path), OLD_NAME_PATTERNS)

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
