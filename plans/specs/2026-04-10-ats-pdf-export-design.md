# ATS-Optimized PDF Export — Design

**Issue:** [#2 — Add ATS-optimized PDF export to resume-builder and resume-tailor](https://github.com/Remotivated/job-hunt-os/issues/2)
**Date:** 2026-04-10
**Status:** Approved, ready for implementation plan

## Problem

`resume-builder` and `resume-tailor` currently stop at markdown. Users must manually convert to PDF before submitting — the gap between "here's a good resume" and "here's a resume ready to submit." The `resume-builder` skill already references "PDF versions via HTML/CSS" but no tooling backs it up.

## Goals

- Emit ATS-safe PDFs automatically at the end of both skill workflows.
- One visual design works for both ATS parsers and human reviewers (the supposed tradeoff is largely a myth when columns, images, and shapes are avoided).
- Markdown remains the canonical artifact. PDF generation failure must not lose user work.

## Non-goals

- Multi-column or visually-heavy templates.
- Canva MCP or template customization UI.
- Automated ATS parser testing in CI (no CI in this repo).
- Additional template variants for different audiences.

## File layout

```
scripts/
  generate-pdf.mjs          # CLI entry point
templates/
  resume-template.html      # Structured header + {{body}} slot
  coverletter-template.html # Same structure, paragraph flow body
  shared.css                # Single stylesheet, both templates link it
package.json                # Declares runtime + dev deps
package-lock.json
.gitignore                  # Adds node_modules/
```

Scripts and templates live at repo root, not inside `.claude/`, because they are user-facing tools rather than skill definitions. A single shared stylesheet keeps resume and cover letter visually identical without duplication.

## Output paths

No changes to existing skill contracts:

- `resume-builder` → `my-documents/resume.pdf`, `my-documents/coverletter.pdf`
- `resume-tailor` → `my-documents/applications/{id}/resume.pdf`, `my-documents/applications/{id}/coverletter.pdf`

## `generate-pdf.mjs`

### CLI

```
node scripts/generate-pdf.mjs <input.md> [output.pdf]
```

If `output.pdf` is omitted, writes next to the input with `.pdf` extension. Exit code 0 on success, non-zero with a one-line error on failure so the skill's soft-fail path can surface it.

### Pipeline

1. **Load markdown** — read file, strip YAML frontmatter with `gray-matter`. Resume has `version`/`updated` frontmatter; cover letter has none. Both handled.
2. **Normalize unicode** — regex pass before parsing:
   - em-dash `—` → `-`
   - en-dash `–` → `-`
   - smart quotes `"` `"` → `"`
   - smart apostrophes `'` `'` → `'`
   - ellipsis `…` → `...`
   - zero-width chars (`\u200B`–`\u200D`, `\uFEFF`) → removed
   - non-breaking space `\u00A0` → regular space
3. **Hybrid parse** — extract a structured header, let the body flow:
   - Line 1 `# Name` → `{{name}}`
   - First non-empty line after the name → `{{contact}}` (rendered as-is, markdown links allowed)
   - First `---` divider consumed; everything after → `{{body}}` via `marked`
4. **Pick template** — filename heuristic: `coverletter*.md` → cover letter template, else resume template.
5. **Render** — substitute `{{name}}`, `{{contact}}`, `{{body}}` into the HTML template. Templates reference `shared.css` via relative `<link>`.
6. **Playwright → PDF** — launch chromium headless, `setContent()` with `waitUntil: 'networkidle'`, then:
   ```js
   page.pdf({ format: 'Letter', margin: '0.5in all sides', printBackground: false })
   ```
   Close browser.
7. **Write PDF** — to output path; report bytes written.

### Error surfaces

All exit non-zero with a clear message that tells the user exactly how to fix:

- Chromium missing → `"Chromium not installed. Run: npx playwright install chromium"`
- Input file missing → `"Input not found: <path>"`
- Template missing → `"Template not found: templates/resume-template.html"`

## Templates + CSS

### `shared.css`

ATS-safe but human-readable:

- Font: `Georgia, 'Times New Roman', serif` for body and headings (one family parses cleanly). System fonts only, no web fonts.
- Single-column block flow. No flexbox or grid for structure — parsers walk top-to-bottom in reading order.
- Color: pure black text on white. One subtle accent: `#1a1a1a` 1px bottom border under `h2` section headings.
- Sizes: body `11pt`, `h1` `20pt`, `h2` `13pt` uppercase with letter-spacing, `h3` `11.5pt` bold.
- Link handling: underlined, `color: inherit` so they print as black text (ATS parsers still read the `href`).
- `@page { size: Letter; margin: 0.5in; }` for print sizing.
- Zero images, columns, tables, or SVG.

### `resume-template.html`

```html
<header>
  <h1>{{name}}</h1>
  <p class="contact">{{contact}}</p>
</header>
<hr>
<main>{{body}}</main>
```

The markdown body's `## Experience / ## Skills / ## Education` become `<h2>` sections naturally. Job headers (`### Title — Company`) become `<h3>`. Date lines (`*Jan 2022 – Present* · City`) stay italic via markdown.

### `coverletter-template.html`

Same header block as the resume. Body is flowing paragraphs rather than sectioned content. Same CSS.

## Skill integration

### `resume-builder` §3 "Generate outputs"

After writing `resume.md` and `coverletter.md`, invoke the script via Bash:

```
node scripts/generate-pdf.mjs my-documents/resume.md
node scripts/generate-pdf.mjs my-documents/coverletter.md
```

Soft-fail: if a script call exits non-zero, the skill reports:

> Markdown saved. PDF generation failed: `<error message>`. Fix and rerun: `node scripts/generate-pdf.mjs my-documents/resume.md`

Markdown save is the canonical success signal. PDF is a bonus artifact. "Just resume" / "just cover letter" modes only invoke the script for the file(s) they wrote.

Replace the existing line 39 text ("PDF versions via HTML/CSS. Fallback: pandoc, browser print-to-PDF, or Google Docs export.") with a pointer to `scripts/generate-pdf.mjs`. The soft-fail message replaces the fallback list.

### `resume-tailor` §5 "Save outputs"

Same pattern, pointing at the application folder:

```
node scripts/generate-pdf.mjs my-documents/applications/{id}/resume.md
node scripts/generate-pdf.mjs my-documents/applications/{id}/coverletter.md
```

Runs **after** the tailor-report stub is written and `applications.md` is upserted — so tracker state reflects a saved application even if PDF generation fails.

Update §5 line 74 the same way: point to `scripts/generate-pdf.mjs`, drop the fallback list.

### State layer impact

None. PDF generation is a pure sink — read markdown, write PDF, no side effects on frontmatter, tracker rows, or reports. No changes to `state-layer.md`.

## README updates

Add a new `## PDF generation` section (between existing "Skills" and "State Layer"):

1. One-time setup: `npm install` then `npx playwright install chromium`. Explain the ~300MB Chromium download.
2. What gets generated automatically: resume-builder + resume-tailor both produce PDFs alongside markdown.
3. Manual invocation: `node scripts/generate-pdf.mjs <input.md>` — useful for regenerating after hand-edits.
4. Troubleshooting: "If PDF generation fails, the markdown is still saved. Check the error message for the fix."

## Verification

### Manual smoke test (issue #2 acceptance criteria)

1. `node scripts/generate-pdf.mjs my-documents/resume.md` produces `my-documents/resume.pdf`.
2. Open the PDF — visual sanity check: name, contact, sections render in order, no garbled characters.
3. Copy-paste from the PDF into a plain text editor — confirm text comes out in reading order (ATS parsers do exactly this).
4. Upload to a free ATS test tool (Workable or Lever) — confirm parse captures name, email, job titles, dates.
5. Unicode spot-check: temporarily add `—`, `"smart"`, `…`, `\u200B` to `resume.md`, regenerate, confirm the PDF contains `-`, `"straight"`, `...`, no ZWSP.

### Automated test

One `test-generate-pdf.mjs` script run manually — feeds a fixture markdown with known unicode gremlins through the pipeline, asserts the PDF buffer exists and is > 10KB. Not wired to CI (no CI in this repo), just a repeatable local check.

No test for the template or CSS — visual output is verified by the manual smoke test.

## Dependencies

Runtime:
- `playwright` — chromium automation and PDF rendering
- `marked` — markdown → HTML for the body slot
- `gray-matter` — frontmatter parsing

Dev:
- (none required; no test runner, no bundler)

## Open questions

None. Ready for implementation plan.
