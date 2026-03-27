# Getting Started with Job Hunt OS

This guide walks you through setup for every platform, plus how the file system works.

---

## For Claude Cowork Users (Recommended)

Claude Cowork is the easiest way to use Job Hunt OS. Skills work automatically — they activate based on what you ask.

### Setup

1. Add this repository as a skill source in your Cowork project settings
2. The 7 skills will be automatically discovered and available

### Your first session

Start with the resume builder:

> "Help me build my resume"

The `resume-builder` skill activates and walks you through a structured interview about your experience, achievements, and goals. It produces:

- `my-documents/resume.md` — Your canonical resume in markdown
- `my-documents/coverletter.md` — Your canonical cover letter
- PDF versions of both

From there, you can:

- **Audit your resume** → "Give me honest feedback on my resume" (activates `resume-auditor`)
- **Tailor for a role** → "Tailor my resume for this job: [paste URL or text]" (activates `resume-tailor`)
- **Vet a company** → "Research [Company Name]'s remote culture" (activates `company-radar`)
- **Prep for an interview** → "Help me prepare for an interview at [Company] for [Role]" (activates `interview-coach`)

### PDF generation

Skills that produce PDFs use HTML with embedded CSS styling for clean output. If PDF generation doesn't produce satisfactory results:

- Use the markdown file and convert via your preferred method
- **Browser print-to-PDF**: Open the `.md` file, print → "Save as PDF"
- **Google Docs**: Paste the markdown content, export as PDF
- **Pandoc** (if installed): `pandoc resume.md -o resume.pdf`

---

## For Claude Code Users

### Setup

```bash
git clone https://github.com/remotivated/job-hunt-os.git
cd job-hunt-os
```

Open the directory in Claude Code. Skills are automatically available — they're discovered by their `SKILL.md` files.

### Usage

Same workflow as Cowork. Skills activate based on your requests. You can also invoke them directly by name.

The `my-documents/` directory is where your working files live. It's gitignored by default so your personal documents never get committed.

---

## For Claude Cloud / ChatGPT / Gemini Users

Skills require Claude Cowork or Code. But the **prompts** work in any LLM.

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

The core methodology is the same — you just handle the logistics yourself.

---

## How Canonical Files Work

Job Hunt OS uses a simple file system:

```
my-documents/
├── resume.md              ← Your master resume (created by resume-builder)
├── coverletter.md         ← Your master cover letter (created by resume-builder)
├── resume.pdf             ← PDF version
├── coverletter.pdf        ← PDF version
└── applications/
    ├── acme-sre/          ← Tailored for Acme Corp SRE role
    │   ├── resume.md
    │   ├── resume.pdf
    │   ├── coverletter.md
    │   ├── coverletter.pdf
    │   └── interview-prep.md
    └── buffer-marketing/  ← Tailored for Buffer Marketing role
        ├── resume.md
        ├── ...
```

### Key rules

- **`resume-builder`** is the only skill that writes to canonical files (`my-documents/resume.md`, `my-documents/coverletter.md`)
- **`resume-tailor`** reads canonicals and writes to `my-documents/applications/{company}-{role}/`
- **`resume-auditor`** is read-only — it never modifies files
- **Other skills** read from canonicals as needed

### Updating your canonical resume

As your career evolves, use resume-builder in "update" mode:

> "I want to update my resume — I just got promoted to Senior Engineer"

It reads your existing canonical files, asks what's changed, and produces updated versions.

---

## The Guides

The [`guides/`](guides/) directory contains methodology documents — the "why" behind the skills. Read them when you want to understand the thinking, not just use the tools:

- Start with [Remote Job Market](guides/remote-job-market.md) to understand the landscape
- Read [Resume Philosophy](guides/resume-philosophy.md) before building or auditing
- Check [ATS Myths](guides/ats-myths.md) to stop worrying about the wrong things
- Browse the rest as they become relevant to your search stage

---

## Recommended Workflow

### Week 1: Foundation
1. Run `resume-builder` to create your canonical resume and cover letter
2. Run `resume-auditor` for critical feedback
3. Iterate until the audit comes back mostly STRONG ratings
4. Run `linkedin-optimizer` to align your LinkedIn

### Week 2+: Active Search
1. Research companies with `company-radar`
2. For good fits, tailor with `resume-tailor`
3. When you get interviews, prepare with `interview-coach`
4. Follow the [Sustainable Search](guides/sustainable-search.md) weekly rhythm

### Ongoing
- Update canonicals as your experience grows
- Build proof assets with `proof-asset-creator`
- Follow the [Networking Guide](guides/networking-guide.md) 3/1/1 rhythm
