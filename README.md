# Job Hunt OS
### AI-powered skills for a smarter remote job search

Built by [Remotivated](https://remotivated.com) — the job platform where remote means remote.

---

Remote roles make up **8-12% of job postings** but attract **over 40% of applications**. Cold applications convert at 0.1-2%. The math is brutal, and volume makes it worse.

Job Hunt OS is a system for the other approach — Claude skills, standalone prompts, and methodology guides built on a simple bet: **5 tailored applications beat 50 generic ones**. Research the company. Write for the reader. Show up prepared.

---

## What's Inside

### Skills (Claude Code)

| Skill | What it does |
|-------|-------------|
| [get-started](skills/get-started/SKILL.md) | **Start here if you're new.** Orients you, scaffolds the state layer, and hands off to `resume-builder` to produce your first canonical documents |
| [resume-builder](skills/resume-builder/SKILL.md) | Build a resume (US), CV (UK/EU), and/or cover letter from scratch through guided Q&A |
| [resume-auditor](skills/resume-auditor/SKILL.md) | Get genuinely critical feedback — counteracts AI sycophancy |
| [resume-tailor](skills/resume-tailor/SKILL.md) | Customize your resume for a specific job posting |
| [interview-coach](skills/interview-coach/SKILL.md) | Prepare for an interview with likely questions and talking points |
| [remote-culture-check](skills/remote-culture-check/SKILL.md) | Vet a company's remote culture before you apply |
| [proof-asset-creator](skills/proof-asset-creator/SKILL.md) | Build case studies, portfolios, and proof-of-value assets |
| [linkedin-optimizer](skills/linkedin-optimizer/SKILL.md) | Audit and improve your LinkedIn profile |
| [resume-drift-check](skills/resume-drift-check/SKILL.md) | Catch hallucinated claims in tailored resumes before you submit |

### Prompts (Any LLM)

| Prompt | What it does |
|--------|-------------|
| [resume-audit](prompts/resume-audit.md) | Critical resume feedback with bullet ratings and rewrites |
| [resume-tailor](prompts/resume-tailor.md) | Customize resume + cover letter for a specific role |
| [interview-prep](prompts/interview-prep.md) | Generate interview questions, talking points, and questions to ask |
| [company-research](prompts/company-research.md) | Evaluate a company's remote culture using a red flag framework |
| [cover-letter](prompts/cover-letter.md) | Generate a targeted cover letter that complements your resume |
| [linkedin-audit](prompts/linkedin-audit.md) | Audit and rewrite your LinkedIn profile sections |

### Guides (Methodology)

| Guide | What it covers |
|-------|---------------|
| [Remote Job Market](guides/remote-job-market.md) | The competition math and why strategy beats volume |
| [Resume Philosophy](guides/resume-philosophy.md) | Show don't tell — outcomes, angles, and anti-sycophancy |
| [ATS Myths](guides/ats-myths.md) | What ATS systems actually do (and the myths to ignore) |
| [Company Research](guides/company-research.md) | The 15-minute vetting stack for evaluating employers |
| [Interview Framework](guides/interview-framework.md) | You're evaluating them too — questions and green/red flags |
| [Proof Assets](guides/proof-assets.md) | Case studies, portfolios, and proof that beats claims |
| [Networking](guides/networking-guide.md) | The 3/1/1 rhythm — generous networking that works |
| [Negotiation](guides/negotiation-guide.md) | Scripts, levers, and the confidence to ask for more |
| [Sustainable Search](guides/sustainable-search.md) | Weekly rhythm, pacing, and mental health |

---

## DOCX and PDF generation

`resume-builder` and `resume-tailor` automatically produce ATS-safe `.docx` files alongside the markdown they save. Under the hood: `scripts/generate-docx.py` walks the markdown into styled paragraphs with [python-docx](https://python-docx.readthedocs.io/) + [markdown-it-py](https://markdown-it-py.readthedocs.io/), then converts each `.docx` to `.pdf` in a single headless [LibreOffice](https://www.libreoffice.org/) batch — the same pattern Anthropic's [docx skill](https://github.com/anthropics/skills/blob/main/skills/docx/SKILL.md) uses.

### One-time setup

```bash
pip install python-docx markdown-it-py
```

That's the minimum to produce a `.docx`. To also auto-generate `.pdf` files, install LibreOffice and make sure `soffice` (its CLI) is on your PATH:

| OS | Install command |
| -- | --------------- |
| macOS | `brew install --cask libreoffice` |
| Windows | `winget install TheDocumentFoundation.LibreOffice` |
| Linux | `apt install libreoffice` (or your package manager's equivalent) |

If LibreOffice isn't installed, the script still writes the `.docx` — it's a valid submittable artifact on its own — and prints the install hints above. **Cowork users:** both python-docx and LibreOffice are pre-installed in the code-execution sandbox, so no setup is needed.

### Manual invocation

Regenerate after hand-editing markdown. The script accepts one or more input paths and launches LibreOffice once for the whole batch:

```bash
python scripts/generate-docx.py my-documents/resume.md my-documents/coverletter.md
python scripts/generate-docx.py my-documents/applications/acme-engineer/resume.md my-documents/applications/acme-engineer/coverletter.md
```

Output always lands next to each input with `.docx` (and `.pdf` when LibreOffice is available). Files are rendered independently — one can fail without blocking the others, and the script exits non-zero if any file actually errored. A missing LibreOffice install is *not* a failure.

### Design

The script picks the document type from the input filename: `coverletter*` renders with extra paragraph spacing, `cv*` and everything else use the resume layout. The design is single-column serif typography (Georgia, with Liberation Serif as the LibreOffice substitute) with a restrained navy accent — ATS parsers and human reviewers see the same document. The "ATS-safe vs. pretty" tradeoff is largely a myth when multi-column layouts, images, tables, and text-in-shapes are avoided.

### If generation fails

If `.docx` generation fails, the markdown is still saved — it's the canonical artifact. If `.pdf` conversion fails (or LibreOffice isn't installed), the `.docx` is still written and you can open it in Word, LibreOffice, or Google Docs and "Save as PDF" by hand. Run the test suite with `python scripts/test_generate_docx.py` if you suspect a regression in the script itself.

---

## State Layer

Your state, not the project's. The entire `my-documents/` tree is gitignored — nothing under it is ever committed. It's created on your first skill run and grows across sessions as a local markdown memory.

```text
my-documents/
├── resume.md              # your canonical US resume
├── cv.md                  # your canonical UK/EU CV (optional; versions independently)
├── coverletter.md         # your canonical cover letter
├── applications.md        # tracker — one row per application
├── story-bank.md          # STAR stories (populated incrementally)
├── applications/{id}/     # tailored resumes and cover letters per role
├── reports/               # numbered evaluations from every skill run
└── proof-assets/          # reusable case studies
```

Every skill reads and writes this layer so each run builds on the last:

- `remote-culture-check` dedupes against companies you've already vetted
- `resume-tailor` warns when a tailored version already exists and verifies claims against your evidence layer
- `resume-drift-check` catches hallucinated claims by comparing tailored resumes against your canonical, story bank, and proof assets
- `interview-coach` remembers stories you've already used in prior prep sessions

Contract: [`skills/_shared/state-layer.md`](skills/_shared/state-layer.md).

### About `CLAUDE.md`

The `CLAUDE.md` file at the repo root is the entry point every skill reads on startup — it imports the state layer contract so every skill run operates under the same rules for `my-documents/`. **Don't delete it.** If you need to add your own project instructions, append to the file rather than replacing it.

---

## Repository structure

| Path | What it is |
| ---- | ---------- |
| `skills/` | Claude Code skills — the canonical workflows |
| `prompts/` | Standalone prompts for any LLM (no file system, no state layer) |
| `guides/` | Methodology guides — the philosophy behind the skills |
| `templates/` | Markdown scaffolds for the resume, CV, and cover letter |
| `scripts/` | DOCX/PDF generation (Python) and state scaffolding (Node) |
| `my-documents/` | Your local state — gitignored. Created on first skill run |
| `research/` | Source notes the guides were built from. Reference material, not canon |
| `drafts/` | Marketing copy (newsletter, social posts). Not part of the toolchain |

---

## Install

### Claude Code

Install as a plugin:

```bash
claude plugin marketplace add Remotivated/job-hunt-os
claude plugin install job-hunt-os@job-hunt-os
```

Run `/reload-plugins` (or restart Claude Code). The 9 skills become available under the `/job-hunt-os:` namespace — e.g. `/job-hunt-os:get-started`. You don't need to invoke them explicitly, though: ask in plain language ("Help me get started" or "Help me build my resume") and Claude picks the right one.

**Clone fallback** — if you'd rather work inside the repo directly:

```bash
git clone https://github.com/Remotivated/job-hunt-os.git
cd job-hunt-os
claude
```

Skills are discovered from `skills/` via `.claude-plugin/plugin.json`.

### Cowork

1. In Cowork ([claude.ai](https://claude.ai)), add the Job Hunt OS marketplace and install the plugin. Cowork will show an authorization screen for the install — approve it.
2. Create a **Project** and bind it to a local folder on your machine. Cowork will ask for permission to read and write files in that folder — approve it. This folder is where `my-documents/` will live.
3. In the Project, ask: *"Help me get started."* The `get-started` skill orients you, scaffolds the state layer, and hands off to `resume-builder` for the Q&A.

Plugin installation requires a Claude Pro or Team plan.

### Any LLM (ChatGPT, Gemini, Claude.ai without plugins)

No plugins, no state layer — but the **prompts** in [`prompts/`](prompts/) work anywhere. Copy one into a conversation, paste your materials alongside it, and the core methodology still applies. You manage your own files.

### What works where

| Feature                       | Claude Code | Cowork                      | Other LLMs (prompts) |
| ----------------------------- | :---------: | :-------------------------: | :------------------: |
| 9 skills                      | Yes         | Yes                         | —                    |
| State layer (`my-documents/`) | Yes         | Yes                         | —                    |
| DOCX + PDF generation         | Yes         | Yes (sandbox pre-installed) | —                    |
| Cross-run memory              | Yes         | Yes                         | —                    |
| Works in any LLM              | —           | —                           | Yes                  |

Everything that works in Claude Code works in Cowork — same skills, same state layer, same output format. The plugin is one bundle that both surfaces load the same way.

See [GETTING-STARTED.md](GETTING-STARTED.md) for a longer walk-through of both install paths.

---

## Quick Start: from zero to first tailored application

Surface-agnostic — the same five prompts work in Claude Code and Cowork.

1. **Build your canonical resume** — *"Help me get started."* `get-started` orients you, scaffolds the state layer, and hands off to `resume-builder` for a structured Q&A that saves `my-documents/resume.md` (plus `.docx` and, if LibreOffice is installed, `.pdf`). Already set up? Skip to `resume-builder` directly with *"Help me update my resume."*
2. **Vet the company** — *"Research Acme Corp's remote culture."* `remote-culture-check` produces a numbered report under `my-documents/reports/`.
3. **Tailor for the role** — *"Tailor my resume for this job: [paste URL or description]."* `resume-tailor` writes to `my-documents/applications/{id}/` and logs the application in `applications.md`.
4. **Drift-check before submitting** — *"Check the tailored resume for drift."* `resume-drift-check` compares the tailored version against your canonical, story bank, and proof assets, and flags any claim it can't trace.
5. **Prep for the interview** — *"Help me prepare for the Acme interview."* `interview-coach` generates a prep brief and saves it under `reports/`.

Each step builds on the last. Your canonical resume (`my-documents/resume.md`) is the foundation — build it once, tailor it many times.

---

## Troubleshooting

**Skills not discovered.** Run `/reload-plugins` in Claude Code. If that doesn't help, open `/plugin` and check the **Errors** tab for loader issues. In Cowork, confirm the plugin shows as enabled in your Project settings.

**LibreOffice not installed.** The `.docx` still generates — it's a valid submittable artifact on its own. Only the `.pdf` step is skipped. Install LibreOffice (see above) or open the `.docx` in Word / Google Docs and "Save as PDF" by hand. Cowork users get LibreOffice pre-installed in the code-execution sandbox, so no action needed there.

**Cowork folder authorization denied.** If you clicked "deny" when Cowork asked for folder access, open the Project settings and re-authorize the folder. Skills can't read or write `my-documents/` without permission.

**"No canonical resume found"** from `resume-tailor` or `resume-drift-check`. Those skills depend on `my-documents/resume.md` existing first. Run `resume-builder` once to create it, then re-run the tailor.

**`applications.md` parse error.** A skill reported the tracker table is malformed and refused to write. Open the file, fix the broken row (usually a missing pipe or a header mismatch), and re-run. Skills never overwrite a tracker they can't parse — by design.

**Out-of-date clone.** If you see references to Playwright, Charter, or an HTML resume template anywhere in the repo, pull the latest `master`. Those belonged to the old PDF pipeline that was replaced in #10.

---

## Philosophy

> **The average corporate job posting gets 250 applications.** You're not going to out-volume that. Out-prepare it.

> **Nobody got hired because their resume said "results-driven."** Show outcomes. Kill the buzzwords.

> **15 minutes of research saves you from a company that calls Slack pings "async."** Vet before you apply.

> **Your resume is an argument, not a history.** Different reader, different argument.

> **Saying "I'm great at remote work" proves nothing.** Showing how you ran a distributed project does.

> **AI is a power tool, not a ghostwriter.** It sharpens your thinking. It doesn't replace it.

---

## About Remotivated

[Remotivated](https://remotivated.com) is the job platform where remote means remote. Too many job boards let "remote" mean "remote until we change our mind." We classify every company by how they actually work — fully remote, remote-first, hybrid, or onsite — so you know what you're signing up for before you apply.

---

## Stay Updated

- **Star this repo** to get notified of new skills and updates
- **[Work is a Verb](https://remotivated.com/newsletter)** — our newsletter on remote work, job search strategy, and building a career on your terms

---

## Contributing

This is an open-source project and contributions are welcome:

- **Skill requests** — Open an issue describing what you'd like to see
- **Prompt improvements** — If a prompt works better with different wording, submit a PR
- **Guide suggestions** — Topics we should cover? Let us know
- **Bug fixes** — Found a typo or broken link? PRs welcome

---

## License

MIT — use it, fork it, share it. See [LICENSE](LICENSE) for details.
