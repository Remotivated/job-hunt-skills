# Job Hunt OS
### AI-assisted toolkit for a smarter remote/hybrid job search

Built by [Remotivated](https://remotivated.com) - the job platform where remote means remote.

---

Remote roles make up **8-12% of job postings** but attract **over 40% of applications**. Cold applications convert at 0.1-2%. The math is brutal, and volume makes it worse.

Job Hunt OS is a markdown-first toolkit for the other approach: guided Claude skills, copy/paste prompts, practical guides, and a DOCX/PDF export script built around one bet: **5 tailored applications beat 50 generic ones**.

It helps you produce better materials faster. It does **not** turn the job search into a fully automated operating system.

---

## Best Fit

- Guided prompts + Claude skills for resume, cover letter, research, and interview work
- Resume/CV/cover letter generation with ATS-safe DOCX/PDF export
- Company vetting and interview prep for remote/hybrid roles
- Optional local workspace for repeat users who want saved canonicals and reports

**CV support:** canonical build flows support both a US resume and a UK/EU CV. Downstream workflows are strongest on resume-first paths today, so review CV-derived outputs carefully.

## Start Here

These are the 4 workflows to lead with:

| Workflow | Use it when... |
| -------- | --------------- |
| [get-started](skills/get-started/SKILL.md) | You are new and want the fastest path to a first draft |
| [resume-builder](skills/resume-builder/SKILL.md) | You want to build or update a canonical resume, CV, or cover letter |
| [resume-tailor](skills/resume-tailor/SKILL.md) | You have a specific job posting and want a targeted version |
| [remote-culture-check](skills/remote-culture-check/SKILL.md) | You want to vet whether a company is actually remote/hybrid-friendly |

Once you have traction, add `interview-coach` for interview prep and `resume-auditor` if you want a harder critique.

## Advanced / Optional Workflows

| Workflow | What it does |
| -------- | ------------- |
| [resume-auditor](skills/resume-auditor/SKILL.md) | Gives critical resume feedback instead of generic praise |
| [interview-coach](skills/interview-coach/SKILL.md) | Builds an interview prep brief from your actual experience |
| [resume-drift-check](skills/resume-drift-check/SKILL.md) | Advanced verification pass for repeat users checking tailored materials |
| [linkedin-optimizer](skills/linkedin-optimizer/SKILL.md) | Audits and rewrites LinkedIn sections |
| [proof-asset-creator](skills/proof-asset-creator/SKILL.md) | Helps turn experience into case studies and proof assets |

## Prompts and Guides

### Prompts (Any LLM)

| Prompt | Use it when... |
| ------ | --------------- |
| [resume-audit](prompts/resume-audit.md) | You want blunt feedback on a resume |
| [resume-tailor](prompts/resume-tailor.md) | You want a tailored resume and cover letter without plugins |
| [interview-prep](prompts/interview-prep.md) | You want likely questions, talking points, and questions to ask |
| [company-research](prompts/company-research.md) | You want a structured remote/hybrid company vetting pass |
| [cover-letter](prompts/cover-letter.md) | You want a targeted cover letter for one specific role |
| [linkedin-audit](prompts/linkedin-audit.md) | You want LinkedIn positioning help |

### Guides (Methodology)

| Guide | What it covers |
| ----- | --------------- |
| [Remote Job Market](guides/remote-job-market.md) | Why strategy beats volume |
| [Resume Philosophy](guides/resume-philosophy.md) | Outcomes, angles, and anti-sycophancy |
| [ATS Myths](guides/ats-myths.md) | What ATS systems actually do |
| [Company Research](guides/company-research.md) | A 15-minute employer vetting stack |
| [Interview Framework](guides/interview-framework.md) | How to prepare and what to ask back |
| [Networking](guides/networking-guide.md) | The 3/1/1 rhythm for warm opportunities |
| [Sustainable Search](guides/sustainable-search.md) | Weekly pacing that does not burn you out |

## Sample Outputs

Curated, polished sample outputs live in [examples/](examples/):

- [US resume example](examples/resume-tech-lead.md)
- [Cover letter example](examples/coverletter-computational-biology.md)
- [Interview prep brief example](examples/interview-prep-engineering-manager.md)

`tests/personas/` is for internal evaluation fixtures, not public samples. Those files may include synthetic edge cases or testing annotations.

## DOCX and PDF Generation

`resume-builder` and `resume-tailor` can produce ATS-safe `.docx` files next to the markdown they save. Under the hood, [`scripts/generate-docx.py`](scripts/generate-docx.py) walks the markdown into styled paragraphs with `python-docx` and `markdown-it-py`, then converts each `.docx` to `.pdf` with LibreOffice when `soffice` is available.

### One-time setup

```bash
pip install python-docx markdown-it-py
```

To also auto-generate PDFs, install LibreOffice and make sure `soffice` is on your `PATH`:

| OS | Install command |
| -- | --------------- |
| macOS | `brew install --cask libreoffice` |
| Windows | `winget install TheDocumentFoundation.LibreOffice` |
| Linux | `apt install libreoffice` |

### Manual invocation

```bash
python scripts/generate-docx.py my-documents/resume.md my-documents/coverletter.md
python scripts/generate-docx.py my-documents/applications/acme-engineer/resume.md my-documents/applications/acme-engineer/coverletter.md
```

If LibreOffice is missing, the script still writes valid `.docx` files and skips PDF conversion.

### Trust checks

```bash
python scripts/test_generate_docx.py
python scripts/check-content-hygiene.py
```

The first checks the renderer. The second is a lightweight guardrail for public docs and curated examples.

## Optional Local Workspace

The `my-documents/` tree is useful if you are running the Claude skills repeatedly and want saved canonicals, application folders, reports, and story-bank entries.

It is **optional**. If you are using prompts in ChatGPT, Gemini, or Claude.ai without plugins, you can ignore it and manage your own files.

```text
my-documents/
|- resume.md or cv.md
|- coverletter.md
|- applications/
|- reports/
|- story-bank.md
`- proof-assets/
```

Advanced users can inspect the full contract in [`skills/_shared/state-layer.md`](skills/_shared/state-layer.md).

## Install

### Claude Code

Install as a plugin:

```bash
claude plugin marketplace add Remotivated/job-hunt-os
claude plugin install job-hunt-os@job-hunt-os
```

Run `/reload-plugins` (or restart Claude Code). The skills become available under the `/job-hunt-os:` namespace, but plain-language requests also work.

Clone fallback:

```bash
git clone https://github.com/Remotivated/job-hunt-os.git
cd job-hunt-os
claude
```

### Cowork

1. Add the Job Hunt OS marketplace and install the plugin.
2. Bind your Project to a local folder if you want the optional local workspace.
3. Ask: **"Help me get started."**

Plugin installation requires a Claude Pro or Team plan.

### Any LLM (ChatGPT, Gemini, Claude.ai without plugins)

Use the prompts in [`prompts/`](prompts/). No plugins, no saved workspace, no automatic export - just copy, paste, and work from the prompt plus your materials.

### What works where

| Feature | Claude Code | Cowork | Other LLMs |
| ------- | :---------: | :----: | :--------: |
| Hero workflows | Yes | Yes | Prompt-only |
| Optional local workspace | Yes | Yes | No |
| DOCX/PDF generation | Yes | Yes | No |
| Copy/paste prompts | Yes | Yes | Yes |

See [GETTING-STARTED.md](GETTING-STARTED.md) for a faster walkthrough.

## Quick Start

1. **Build your first draft** - "Help me get started."
2. **Vet the company** - "Research Acme's remote culture."
3. **Tailor for the role** - "Tailor my resume for this job: paste the posting."
4. **Prep once you get traction** - "Help me prepare for the Acme interview."

That sequence covers the core value of the repo without needing every optional workflow.

## Repository Structure

| Path | What it is |
| ---- | ---------- |
| `skills/` | Claude Code skills |
| `prompts/` | Copy/paste prompts for any LLM |
| `guides/` | Methodology and strategy guides |
| `templates/` | Resume, CV, and cover letter scaffolds |
| `scripts/` | DOCX/PDF export plus lightweight checks |
| `examples/` | Curated sample outputs |
| `tests/personas/` | Internal evaluation fixtures |
| `my-documents/` | Optional local workspace, gitignored |
| `research/` | Source notes behind the guides |

## Troubleshooting

**Skills not discovered.** Run `/reload-plugins` in Claude Code. If that does not help, open `/plugin` and check the Errors tab.

**LibreOffice not installed.** `.docx` still generates. Install LibreOffice later if you want automatic PDFs.

**"No canonical resume found."** Run `resume-builder` once before `resume-tailor`.

**Need a simpler path?** Use the prompts. They skip the local workspace and get you straight to output.

## Philosophy

> **The average corporate job posting gets 250 applications.** You're not going to out-volume that. Out-prepare it.

> **Nobody got hired because their resume said "results-driven."** Show outcomes. Kill the buzzwords.

> **15 minutes of research saves you from a company that calls Slack pings "async."** Vet before you apply.

> **Your resume is an argument, not a history.** Different reader, different argument.

> **AI is a power tool, not a ghostwriter.** It sharpens your thinking. It doesn't replace it.

## About Remotivated

[Remotivated](https://remotivated.com) is the job platform where remote means remote. Too many job boards let "remote" mean "remote until we change our mind." We classify companies by how they actually work - fully remote, remote-first, hybrid, or onsite - so you know what you're signing up for before you apply.

## Stay Updated

- **Star this repo** to get notified of new skills and updates
- **[Work is a Verb](https://remotivated.com/newsletter)** - our newsletter on remote work, job search strategy, and building a career on your terms

## Contributing

This is an open-source project and contributions are welcome:

- **Prompt improvements** - if a prompt works better with different wording, open a PR
- **Guide suggestions** - if there is a topic we should cover, open an issue
- **Bug fixes** - if a sample, doc, or script is broken, send a patch

## License

MIT - use it, fork it, share it. See [LICENSE](LICENSE) for details.
