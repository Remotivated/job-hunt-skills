# Getting Started with Job Hunt OS

Setup for every platform, plus how the file system keeps your documents organized.

---

## For Claude Code Users (Recommended)

Install as a plugin — or clone the repo and open it directly, and skills are discovered from `skills/`.

### Setup

```bash
git clone https://github.com/remotivated/job-hunt-os.git
cd job-hunt-os
```

Open the directory in Claude Code (CLI, VS Code extension, or desktop app). The 8 skills are automatically available — Claude discovers them from the `skills/` directory via the plugin manifest at `.claude-plugin/plugin.json`.

The `my-documents/` directory is where your working files live. It's gitignored by default so your personal documents never get committed.

### Your first session

Start with the resume builder:

> "Help me build my resume"

The `resume-builder` skill activates and walks you through a structured interview about your experience, achievements, and goals. Depending on what you ask for, it produces:

- `my-documents/resume.md` — Your canonical US resume in markdown (for US roles)
- `my-documents/cv.md` — Your canonical UK/EU CV in markdown (for UK/EU roles). Same length budget as the resume, different section list: Personal Statement, degree classification, CEFR languages, "References available on request." Not a US academic CV.
- `my-documents/coverletter.md` — Your canonical cover letter (the letter that introduces you for a specific role — complements either the resume or the CV)
- PDF versions of each file you built

Resume and CV are independent canonicals — you can have one, the other, or both, and they version independently.

From there:

- **Audit your resume** → "Give me honest feedback on my resume" (activates `resume-auditor`)
- **Tailor for a role** → "Tailor my resume for this job: [paste URL or text]" (activates `resume-tailor`)
- **Vet a company** → "Research [Company Name]'s remote culture" (activates `remote-culture-check`)
- **Prep for an interview** → "Help me prepare for an interview at [Company] for [Role]" (activates `interview-coach`)

### PDF generation

Skills that produce PDFs use HTML with embedded CSS styling. If that doesn't work:

- **Browser print-to-PDF**: Open the `.md` file, print → "Save as PDF"
- **Google Docs**: Paste the markdown content, export as PDF
- **Pandoc** (if installed): `pandoc resume.md -o resume.pdf`

> 💡 **Tip:** The markdown files are the source of truth. Generate PDFs whenever you need to submit, but do your editing in `.md` format.

---

## For Claude.ai / ChatGPT / Gemini Users

Skills require Claude Code. But the **prompts** work in any LLM.

### How to use prompts

1. Browse the [`prompts/`](prompts/) directory
2. Open the prompt you want (e.g., `resume-audit.md`)
3. Read the "What You'll Need" section to gather your materials
4. Copy the prompt from the "The Prompt" section
5. Paste it into your LLM conversation
6. Paste your resume, job description, or other materials where indicated
7. Send

### Available prompts

| Prompt | Use when... |
|--------|------------|
| [resume-audit](prompts/resume-audit.md) | You want critical feedback on your resume |
| [resume-tailor](prompts/resume-tailor.md) | You have a job posting and want to customize your resume |
| [interview-prep](prompts/interview-prep.md) | You have an upcoming interview |
| [company-research](prompts/company-research.md) | You want to evaluate a company's remote culture |
| [cover-letter](prompts/cover-letter.md) | You need a cover letter for a specific role |
| [linkedin-audit](prompts/linkedin-audit.md) | You want to improve your LinkedIn profile |

### Limitations

Prompts work in any LLM, but compared to skills they lack:

- **File management** — You'll need to manage your own files
- **PDF generation** — Copy output to Google Docs or your preferred tool
- **Web browsing** — Paste content directly instead of providing URLs
- **Multi-turn workflow** — Each prompt is a single interaction

Same methodology, you just handle the **file management** yourself.

---

## How the State Layer Works

Your master resume lives in one place. Tailored versions, reports, and evidence files each have their own directory. Here's the layout:

```
my-documents/
├── resume.md              ← Your master US resume (created by resume-builder)
├── cv.md                  ← Your master UK/EU CV (created by resume-builder; optional)
├── coverletter.md         ← Your master cover letter (created by resume-builder)
├── resume.pdf             ← PDF version
├── cv.pdf                 ← PDF version
├── coverletter.pdf        ← PDF version
├── applications.md        ← Tracker — one row per application (status, dates, links)
├── story-bank.md          ← STAR stories (your evidence layer — populated over time)
├── applications/
│   ├── acme-sre/          ← Tailored for Acme Corp SRE role
│   │   ├── resume.md
│   │   ├── resume.pdf
│   │   ├── coverletter.md
│   │   ├── coverletter.pdf
│   │   └── interview-prep.md
│   └── buffer-marketing/  ← Tailored for Buffer Marketing role
│       ├── resume.md
│       └── ...
├── reports/               ← Every skill run saves a numbered report here
│   ├── 001-buffer-vetting-2026-04-08.md
│   ├── 002-resume-audit-2026-04-09.md
│   └── ...
└── proof-assets/          ← Reusable case studies and portfolio pieces
    └── distributed-team-migration.md
```

### The four directories

- **Root canonicals** (`resume.md`, `cv.md`, `coverletter.md`) — sacred, never modified by per-application skills. `resume.md` and `cv.md` are independent: you can have one, the other, or both, and they version independently.
- **`applications/{id}/`** — artifacts you'd actually send to employers.
- **`reports/`** — evaluations, audits, and research for your own reference. Numbered, flat, read-only after creation.
- **`proof-assets/`** — case studies and portfolio pieces that get referenced across many applications.

### Key rules

- **`resume-builder` owns the canonicals** — it's the only skill that writes to `my-documents/resume.md`, `my-documents/cv.md`, and `my-documents/coverletter.md`, and the only skill that bumps the canonical `version` frontmatter.
- **`resume-tailor` creates application folders** — reads the canonicals and writes to `my-documents/applications/{id}/`. It runs an inline claim-verification pass against your evidence layer before saving, flagging any bullet that can't be traced back to real source material.
- **`resume-auditor` is read-only** — writes its critique to `reports/` but never touches your canonical files.
- **`remote-culture-check`, `interview-coach`, `linkedin-optimizer`** each save numbered reports under `reports/` after every run.
- **`resume-drift-check`** compares tailored resumes against the evidence layer (canonical, story-bank, proof-assets, reports) and flags hallucinated or contradicted claims.

### The applications tracker

`my-documents/applications.md` is a flat markdown table that every skill reads for dedup and writes to advance status. Columns: `id`, `company`, `role`, `status`, `updated`, `link`. Status values in lifecycle order: `saved → applied → interviewing → offer → closed | hired`.

You can edit it by hand at any time — it's just markdown. Skills only advance status forward, never backward.

### Privacy

The entire `my-documents/` directory is gitignored. Nothing under it is ever committed to the repo (except empty `.gitkeep` files that preserve the directory structure for new clones).

### Updating your canonical resume

As your career evolves, use `resume-builder` in "update" mode:

> "I want to update my resume — I just got promoted to Senior Engineer"

It reads your existing canonical files, asks what's changed, produces updated versions, and bumps the `version` in frontmatter. Any existing tailored resumes with a lower `derived_from_version` will get flagged for deep scanning the next time `resume-drift-check` runs.

---

## The Guides

The [`guides/`](guides/) directory is the "why" behind the skills. Worth reading before you dive in:

- **Start with** [Remote Job Market](guides/remote-job-market.md) to understand the landscape
- **Read** [Resume Philosophy](guides/resume-philosophy.md) before building or auditing
- **Check** [ATS Myths](guides/ats-myths.md) to stop worrying about the wrong things
- **Browse the rest** as they become relevant to your search stage

---

## Recommended Workflow

### Week 1: Build your foundation

1. `resume-builder` -- create your **canonical resume** and cover letter
2. `resume-auditor` -- get honest feedback (it won't be gentle)
3. Iterate until you're mostly seeing **STRONG ratings**
4. `linkedin-optimizer` -- align your LinkedIn with your resume

---

### Week 2+: Start applying with intent

1. `remote-culture-check` -- **vet the company** before you invest time
2. `resume-tailor` -- customize for good fits
3. `interview-coach` -- prep when you land interviews
4. Follow the [Sustainable Search](guides/sustainable-search.md) weekly rhythm so you don't burn out

---

### Ongoing

- Update canonicals when your experience changes
- `proof-asset-creator` -- build case studies that **show, not tell**
- [Networking Guide](guides/networking-guide.md) -- the 3/1/1 rhythm that compounds
