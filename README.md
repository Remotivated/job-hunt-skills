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
| [resume-builder](.claude/skills/resume-builder/SKILL.md) | Build a resume (US), CV (UK/EU), and/or cover letter from scratch through guided Q&A |
| [resume-auditor](.claude/skills/resume-auditor/SKILL.md) | Get genuinely critical feedback — counteracts AI sycophancy |
| [resume-tailor](.claude/skills/resume-tailor/SKILL.md) | Customize your resume for a specific job posting |
| [interview-coach](.claude/skills/interview-coach/SKILL.md) | Prepare for an interview with likely questions and talking points |
| [remote-culture-check](.claude/skills/remote-culture-check/SKILL.md) | Vet a company's remote culture before you apply |
| [proof-asset-creator](.claude/skills/proof-asset-creator/SKILL.md) | Build case studies, portfolios, and proof-of-value assets |
| [linkedin-optimizer](.claude/skills/linkedin-optimizer/SKILL.md) | Audit and improve your LinkedIn profile |
| [resume-drift-check](.claude/skills/resume-drift-check/SKILL.md) | Catch hallucinated claims in tailored resumes before you submit |

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

## PDF generation

`resume-builder` and `resume-tailor` automatically produce ATS-safe PDFs alongside the markdown they save. Under the hood: `scripts/generate-pdf.mjs` renders the markdown through an HTML template with Playwright's headless Chromium.

### One-time setup

```bash
npm install
npx playwright install chromium
```

The second command downloads Chromium (~300 MB) into Playwright's cache. This is a one-time cost per machine.

### Manual invocation

Regenerate PDFs after hand-editing markdown. The script accepts one or more input paths and launches Chromium once for the whole batch:

```bash
node scripts/generate-pdf.mjs my-documents/resume.md my-documents/coverletter.md
node scripts/generate-pdf.mjs my-documents/applications/acme-engineer/resume.md my-documents/applications/acme-engineer/coverletter.md
```

Output always lands next to each input with a `.pdf` extension. Files are rendered independently — one can fail without blocking the others, and the script exits non-zero if any file failed.

### Templates

A single `templates/document-template.html` backs every document type, paired with the shared stylesheet (`templates/shared.css`). The script picks the title and body class from the input filename: `coverletter*` renders with `<title>… — Cover Letter</title>` and `<body class="coverletter">`, `cv*` with `CV` and `<body class="cv">`, and everything else defaults to `Resume` with an empty body class. That lets `shared.css` scope a few cover-letter- or CV-specific rules without needing separate HTML files.

The design is single-column serif typography (Charter) with a restrained navy accent — ATS parsers and human reviewers see the same document. The "ATS-safe vs. pretty" tradeoff is largely a myth when multi-column layouts, images, and text-in-shapes are avoided.

### Troubleshooting

If PDF generation fails, the markdown is still saved — it's the canonical artifact. The error message will tell you the fix; the most common case is Chromium not being installed (run the setup step above).

---

## State Layer

Job Hunt OS keeps a local markdown-based memory under `my-documents/`:

```
my-documents/
├── resume.md              # your canonical US resume
├── cv.md                  # your canonical UK/EU CV (optional; versions independently from resume.md)
├── coverletter.md         # your canonical cover letter
├── applications.md        # tracker — one row per application
├── story-bank.md          # STAR stories (populated incrementally)
├── applications/{id}/     # tailored resumes and cover letters
├── reports/               # numbered evaluations from every skill run
└── proof-assets/          # reusable case studies
```

Every skill reads and writes this layer so each run builds on the last — `remote-culture-check` dedupes against companies you already vetted, `resume-tailor` warns when a tailored version already exists, `resume-drift-check` catches hallucinated claims by comparing tailored resumes to your evidence layer. The entire `my-documents/` tree is gitignored; it's your state, not the project's.

Contract: [`.claude/skills/_shared/state-layer.md`](.claude/skills/_shared/state-layer.md).

---

## Repository structure

| Path | What it is |
| ---- | ---------- |
| `.claude/skills/` | Claude Code skills — the canonical workflows |
| `prompts/` | Standalone prompts for any LLM (no file system, no state layer) |
| `guides/` | Methodology guides — the philosophy behind the skills |
| `templates/` | HTML/CSS for PDF rendering, plus markdown scaffolds |
| `scripts/` | Node scripts (PDF generation, state scaffolding) |
| `my-documents/` | Your local state — gitignored. Created on first skill run |
| `research/` | Source notes the guides were built from. Reference material, not canon |
| `drafts/` | Marketing copy (newsletter, social posts). Not part of the toolchain |

---

## Quick Start

### Claude Code (recommended)

1. Clone this repo: `git clone https://github.com/remotivated/job-hunt-os.git`
2. Open the directory in Claude Code — skills are automatically discovered from `.claude/skills/`
3. Start with: "Help me build my resume" → the `resume-builder` skill activates
4. Your canonical resume saves to `my-documents/resume.md`

### Any LLM (ChatGPT, Gemini, Claude.ai)

1. Browse the [`prompts/`](prompts/) directory
2. Copy the prompt into your conversation
3. Paste your resume, job description, or other materials alongside it
4. No file management or web browsing — but the core methodology works anywhere

See [GETTING-STARTED.md](GETTING-STARTED.md) for detailed setup instructions.

---

## Your First Workflow

Here's the recommended sequence when you find a role you're interested in:

1. **Build your resume** → `resume-builder` creates your canonical resume
2. **Vet the company** → `remote-culture-check` evaluates their remote culture
3. **Tailor for the role** → `resume-tailor` customizes your resume + cover letter
4. **Prepare for the interview** → `interview-coach` generates your prep brief
5. **Sanity-check tailoring** → `resume-drift-check` catches hallucinated claims before you submit

Each skill builds on the last. Your canonical resume (`my-documents/resume.md`) is the **foundation** — build it once, tailor it many times.

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
