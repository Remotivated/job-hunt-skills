# Getting Started with Job Hunt OS

This repo works best as a **toolkit**: a few strong workflows, useful prompts, practical guides, and a clean export path for markdown resumes and cover letters.

If you only remember one thing, remember this: **start with the hero workflows first**. Everything else is optional.

---

## Fastest Path

### Claude Code

Install the plugin:

```bash
claude plugin marketplace add Remotivated/job-hunt-os
claude plugin install job-hunt-os@job-hunt-os
```

Run `/reload-plugins` (or restart Claude Code), then ask:

> Help me get started

That is the fastest path to a first draft. The `get-started` skill handles orientation, optional local workspace setup, and the hand-off to `resume-builder`.

Clone fallback:

```bash
git clone https://github.com/Remotivated/job-hunt-os.git
cd job-hunt-os
claude
```

### Cowork

1. Install the plugin in Cowork.
2. Bind the Project to a local folder if you want the optional local workspace.
3. Ask: **Help me get started**.

Cowork and Claude Code use the same skill bundle and document export tooling.

### Any LLM (ChatGPT, Gemini, Claude.ai without plugins)

Use the prompts in [`prompts/`](prompts/). Copy one into a conversation, paste your materials, and work from there.

Prompt-only use skips saved workspace features and automatic DOCX/PDF export, but the methodology still applies.

---

## Hero Workflows

Lead with these four:

1. **`get-started`** - first-run onboarding and first draft
2. **`resume-builder`** - build or update a canonical resume, CV, or cover letter
3. **`resume-tailor`** - tailor for one specific job posting
4. **`remote-culture-check`** - vet the employer before you spend time applying

If you get traction, add:

- **`interview-coach`** for prep once interviews are scheduled
- **`resume-auditor`** when you want a harder critique

## Advanced / Optional

These are useful, but not the place to start:

- **`resume-drift-check`** - advanced verification for repeat users checking tailored materials
- **`linkedin-optimizer`** - LinkedIn rewrites and positioning
- **`proof-asset-creator`** - case studies and proof-of-value assets

## What You Will Get Quickly

In a typical first session, the repo is strongest at producing:

- a canonical resume or UK/EU CV
- a targeted cover letter when you have a real role in mind
- a company vetting pass for remote/hybrid fit
- an interview prep brief once you are in process

That is the core promise. Treat everything else as an add-on, not a requirement.

## CV Support

Canonical build flows support both:

- **US resume**
- **UK/EU CV**

Be careful not to assume perfect feature parity after the canonical build. Downstream workflows are strongest on resume-first paths today, so review CV-derived outputs carefully before sending them.

## Optional Local Workspace

If you are using Claude Code or Cowork and want saved files across sessions, the repo can keep an optional local workspace in `my-documents/`.

```text
my-documents/
|- resume.md or cv.md
|- coverletter.md
|- applications/
|- reports/
|- story-bank.md
`- proof-assets/
```

This is useful for repeat users. It is **not required** if you are just using the prompts.

Advanced users can inspect the full rules in [`skills/_shared/state-layer.md`](skills/_shared/state-layer.md).

## Sample Outputs

If you want to see what "finished" looks like, start with the curated examples in [examples/](examples/):

- [US resume example](examples/resume-tech-lead.md)
- [Cover letter example](examples/coverletter-computational-biology.md)
- [Interview prep brief example](examples/interview-prep-engineering-manager.md)

`tests/personas/` is for internal evaluation fixtures, not public samples.

## DOCX and PDF Generation

For Claude skill users, markdown outputs can be rendered with [`scripts/generate-docx.py`](scripts/generate-docx.py).

### Setup

```bash
pip install python-docx markdown-it-py
```

To also auto-generate PDFs, install LibreOffice:

- **macOS**: `brew install --cask libreoffice`
- **Windows**: `winget install TheDocumentFoundation.LibreOffice`
- **Linux**: `apt install libreoffice`

### Usage

```bash
python scripts/generate-docx.py my-documents/resume.md my-documents/coverletter.md
python scripts/generate-docx.py my-documents/applications/acme-engineer/resume.md my-documents/applications/acme-engineer/coverletter.md
```

If LibreOffice is missing, the script still writes valid `.docx` files and skips PDF conversion.

### Quick sanity checks

```bash
python scripts/test_generate_docx.py
python scripts/check-content-hygiene.py
```

## Prompt-Only Path

If you do not want plugins or saved state:

1. Open a file in [`prompts/`](prompts/)
2. Read the "What You'll Need" section
3. Copy the prompt
4. Paste it into your LLM
5. Paste your resume, job posting, or other source material

Compared to the Claude skills, prompts do **not** provide:

- saved local files
- automatic DOCX/PDF export
- multi-step workspace management

They do give you the fastest zero-setup path.

## Recommended Sequence

### Week 1

1. `get-started`
2. `resume-auditor`
3. `resume-builder` update pass if needed

### Once you find real openings

1. `remote-culture-check`
2. `resume-tailor`
3. `interview-coach` when interviews appear

### Ongoing

- update canonicals as your experience changes
- use the guides when you need search strategy, networking, or interview structure

## Guides Worth Reading First

- [Remote Job Market](guides/remote-job-market.md)
- [Resume Philosophy](guides/resume-philosophy.md)
- [ATS Myths](guides/ats-myths.md)
- [Company Research](guides/company-research.md)
- [Sustainable Search](guides/sustainable-search.md)
