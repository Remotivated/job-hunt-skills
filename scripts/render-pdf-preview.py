#!/usr/bin/env python3
"""Render the first page of each PDF as a PNG preview.

Used to produce the example-output thumbnails shown in the README.
Run from repo root:

    python scripts/render-pdf-preview.py examples/*/resume.pdf
"""

import sys
from pathlib import Path

import pypdfium2 as pdfium

SCALE = 2.0


def screenshot_name(pdf_path: Path) -> str:
    # Examples now live under examples/{candidate}/.../resume.pdf. Use the
    # candidate folder name so multiple resume.pdf files don't clobber each
    # other in examples/screenshots/.
    parts = pdf_path.resolve().parts
    if "examples" in parts:
        i = parts.index("examples")
        if i + 1 < len(parts) - 1:
            return f"{parts[i + 1]}-{pdf_path.stem}"
    return pdf_path.stem


def render(pdf_path: Path, out_dir: Path) -> Path:
    pdf = pdfium.PdfDocument(str(pdf_path))
    page = pdf[0]
    bitmap = page.render(scale=SCALE)
    pil = bitmap.to_pil()
    out_path = out_dir / f"{screenshot_name(pdf_path)}.png"
    pil.save(out_path, "PNG", optimize=True)
    return out_path


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("usage: render-pdf-preview.py <pdf> [<pdf>...]", file=sys.stderr)
        return 2
    out_dir = Path("examples/screenshots")
    out_dir.mkdir(parents=True, exist_ok=True)
    for arg in argv[1:]:
        pdf_path = Path(arg)
        if not pdf_path.exists():
            print(f"missing: {pdf_path}", file=sys.stderr)
            return 1
        out = render(pdf_path, out_dir)
        print(f"Wrote {out} ({out.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
