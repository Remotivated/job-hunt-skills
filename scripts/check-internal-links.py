#!/usr/bin/env python3
"""Internal markdown link checker.

Verifies that every relative file/anchor link in tracked markdown resolves:

- File links: target path exists on disk.
- Anchor links: target heading exists in the target file (or same file for `#foo`).
  Anchors are matched against GitHub-style slugs of the file's headings.

External schemes (http, https, mailto, tel, ftp, ssh, file, data) are not checked.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlsplit

from markdown_it import MarkdownIt


ROOT = Path(__file__).resolve().parent.parent

SKIP_DIRS = {
    ".git",
    ".claude",
    "node_modules",
    "__pycache__",
    "my-documents",
}

EXTERNAL_SCHEMES = {
    "http",
    "https",
    "mailto",
    "tel",
    "ftp",
    "ftps",
    "ssh",
    "git",
    "file",
    "data",
    "javascript",
}

MD = MarkdownIt("commonmark")


def collect_md_files() -> list[Path]:
    files: list[Path] = []
    for path in ROOT.rglob("*.md"):
        rel_parts = path.relative_to(ROOT).parts
        if any(part in SKIP_DIRS for part in rel_parts):
            continue
        if path.is_file():
            files.append(path)
    return sorted(files)


def github_slug(text: str) -> str:
    """Approximate GitHub's heading anchor slug algorithm."""
    s = text.strip().lower()
    s = re.sub(r"[^\w\s-]", "", s, flags=re.UNICODE)
    s = re.sub(r"\s+", "-", s)
    return s


_heading_cache: dict[Path, set[str]] = {}


def headings_for(path: Path) -> set[str]:
    """Return the set of GitHub-style heading slugs found in `path`.

    Headings inside fenced code blocks are correctly excluded by the parser.
    Duplicate slugs get GitHub's `-1`, `-2`, ... suffixes.
    """
    cached = _heading_cache.get(path)
    if cached is not None:
        return cached

    try:
        text = path.read_text(encoding="utf-8")
    except OSError:
        _heading_cache[path] = set()
        return _heading_cache[path]

    tokens = MD.parse(text)
    slugs: set[str] = set()
    counts: dict[str, int] = {}
    for i, tok in enumerate(tokens):
        if tok.type != "heading_open":
            continue
        inline = tokens[i + 1]
        raw = inline.content or ""
        base = github_slug(raw)
        if not base:
            continue
        if base in counts:
            counts[base] += 1
            slug = f"{base}-{counts[base] - 1}"
        else:
            counts[base] = 1
            slug = base
        slugs.add(slug)

    _heading_cache[path] = slugs
    return slugs


def iter_links(path: Path):
    """Yield (line_number, href) for every markdown link in `path`.

    Uses the parsed token stream so links inside fenced code blocks and
    inline code are not reported.
    """
    try:
        text = path.read_text(encoding="utf-8")
    except OSError:
        return

    tokens = MD.parse(text)
    for tok in tokens:
        if tok.type != "inline" or not tok.children:
            continue
        line = (tok.map[0] + 1) if tok.map else 1
        for child in tok.children:
            if child.type == "link_open":
                href = child.attrGet("href") or ""
                yield line, href


def is_external(href: str) -> bool:
    if not href:
        return True
    parts = urlsplit(href)
    return bool(parts.scheme) and parts.scheme.lower() in EXTERNAL_SCHEMES


def split_target(href: str) -> tuple[str, str]:
    """Split href into (path, fragment) without losing the empty cases."""
    if "#" in href:
        path, _, frag = href.partition("#")
        return path, frag
    return href, ""


def resolve_target(source: Path, target: str) -> Path:
    target = unquote(target)
    if target.startswith("/"):
        return (ROOT / target.lstrip("/")).resolve()
    return (source.parent / target).resolve()


def check_link(source: Path, line: int, href: str) -> str | None:
    """Return an error message if the link is broken, else None."""
    if is_external(href):
        return None

    raw_path, fragment = split_target(href)

    if not raw_path:
        if not fragment:
            return None
        target_file = source
    else:
        target_file = resolve_target(source, raw_path)
        if not target_file.exists():
            return f"missing file: {href}"

    if fragment:
        if target_file.is_dir():
            return f"anchor on directory: {href}"
        if target_file.suffix.lower() != ".md":
            return None
        slug = github_slug(unquote(fragment))
        if slug not in headings_for(target_file):
            return f"missing anchor: {href}"

    return None


def main() -> int:
    issues: list[tuple[Path, int, str]] = []

    for path in collect_md_files():
        for line, href in iter_links(path):
            err = check_link(path, line, href)
            if err:
                issues.append((path, line, err))

    if issues:
        print("Internal link check failed:\n", file=sys.stderr)
        for path, line, msg in issues:
            rel = path.relative_to(ROOT) if path.is_relative_to(ROOT) else path
            print(f"- {rel}:{line}: {msg}", file=sys.stderr)
        print(f"\n{len(issues)} broken link(s).", file=sys.stderr)
        return 1

    print("Internal link check passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
