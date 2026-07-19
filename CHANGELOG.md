# Changelog

## 1.1.0 - 2026-07-17

### Added

- **Native Codex plugin support.** Job Hunt Skills now installs in Codex CLI and Codex in the ChatGPT desktop app through the `remotivated` marketplace. The same 11 skills remain shared with Claude Code and Cowork.
- **Codex skill metadata and repository guidance.** Each skill includes OpenAI interface metadata, and `AGENTS.md` documents contributor checks and provider-parity rules.

### Breaking

- **Document export rebuilt on Node + Typst** (#31). `python scripts/generate-docx.py` is replaced by `node scripts/export-documents.mjs`; the `docx`/`test:docx` npm scripts are now `export`/`test:export`. Python, python-docx, markdown-it-py, and LibreOffice are no longer used on the user path — Python remains only in contributor CI check scripts. There is no "skipped PDF" state anymore: every Node run writes `.docx`, `.pdf`, and `.html` next to each input.

### Changed

- **Tiered output, reported as capability unlocks.** Tier 1 (no dependencies): submission-ready markdown + browser-openable HTML preview from `templates/preview-template.html`. Tier 2 (Node ≥ 18 alone — all JS dependencies ship bundled in `scripts/vendor/`): adds `.docx` and a baseline `.pdf`. Tier 3 (`typst` ≥ 0.12.0 on PATH): the `.pdf` is typeset from the vendored `templates/resume.typ` instead. The export script reports the tier on its last stdout line (`EXPORT_TIER=2|3`).
- **Font-deterministic PDFs.** PDFs embed the vendored Gelasio fonts (SIL OFL, metric-compatible with Georgia — page-break parity against the previous Georgia renders verified empirically); DOCX and HTML keep Georgia as the named font.
- Example artifacts and README screenshots regenerated with the new pipeline (Typst renders).

### Fixed

- **Installed-plugin resource resolution.** Skills now resolve bundled scripts, templates, guides, and fonts from the plugin installation root while keeping all `my-documents/` reads and writes in the user-confirmed workspace.

## 1.0.0 - 2026-04-28

Initial public release of Job Hunt Skills.

### Feature surface

- **11 skills** covering the full job-search loop: `get-started`, `resume-builder`, `resume-tailor`, `resume-auditor`, `claim-check`, `cover-letter`, `company-research`, `interviewing`, `interview-coach`, `linkedin-optimizer`, `proof-asset-creator`.
- **3 slash commands** for the most common entry points: `/get-started`, `/build-resume`, `/cover-letter`.
- **9 standalone prompts** that mirror the skill behaviors for ChatGPT, Gemini, Claude.ai, and other LLMs without plugin access.
- **9 long-form guides** on resume philosophy, ATS myths, company research, interview framework, networking, negotiation, sustainable search, remote job market, and proof assets.
- **Single-source state layer** in `my-documents/` (applications tracker, story bank, source work documents, tailored artifacts, reports, proof assets) governed by a shared contract.
- **DOCX/PDF/HTML export** via `scripts/generate-docx.py` (python-docx + LibreOffice headless), with an HTML preview that mirrors page geometry for in-browser eyeballing.
- **Curated public samples** under `examples/`.
