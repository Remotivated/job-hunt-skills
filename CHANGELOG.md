# Changelog

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
