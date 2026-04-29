# Job Hunt Skills

Practical AI-assisted skills, prompts, guides, and templates for a more honest job search.

Built by [Remotivated](https://remotivated.com).

Job Hunt Skills helps you turn real experience into stronger resumes, cover letters, company research, interview prep, LinkedIn copy, and proof assets. It is designed for jobseekers first: simple enough to use as a prompt library, structured enough to run as Claude Code or Cowork skills, and strict about not inventing claims.

The core bet is simple: a few specific, truthful applications beat a large stack of generic ones.

## Use The Skills

Install the plugin if you use Claude Code or Cowork and want guided workflows that can read and write local markdown files.

### Claude Code

```bash
claude plugin marketplace add Remotivated/job-hunt-skills
claude plugin install job-hunt-skills@job-hunt-skills
```

Run `/reload-plugins` or restart Claude Code. Skills are available under the `/job-hunt-skills:` namespace, and plain-language requests also work.

Clone fallback:

```bash
git clone https://github.com/Remotivated/job-hunt-skills.git
cd job-hunt-skills
claude
```

### Cowork

1. Add the Job Hunt Skills marketplace in Cowork.
2. Install the plugin.
3. Bind a local folder if you want saved files.
4. Ask: **Help me get started.**

Plugin installation requires a Claude plan that supports plugins.

### Start Here

| Skill | Use it when... |
| --- | --- |
| [get-started](skills/get-started/SKILL.md) | You are new and want the fastest path to a first draft |
| [resume-builder](skills/resume-builder/SKILL.md) | You want to build or update a resume/CV-format work document |
| [resume-tailor](skills/resume-tailor/SKILL.md) | You have a specific job posting and want targeted materials |
| [company-research](skills/company-research/SKILL.md) | You want to decide whether a company or role is worth your time |
| [cover-letter](skills/cover-letter/SKILL.md) | You only need a specific cover letter |

Once you have traction, add [interviewing](skills/interviewing/SKILL.md) to manage interview-stage notes, [interview-coach](skills/interview-coach/SKILL.md) for deep prep, and [resume-auditor](skills/resume-auditor/SKILL.md) for a harder critique.

### Optional Skills

| Skill | What it does |
| --- | --- |
| [resume-auditor](skills/resume-auditor/SKILL.md) | Gives direct resume feedback instead of generic praise |
| [interview-coach](skills/interview-coach/SKILL.md) | Builds an interview prep brief from your actual experience |
| [interviewing](skills/interviewing/SKILL.md) | Tracks interview stages, notes, and follow-ups |
| [linkedin-optimizer](skills/linkedin-optimizer/SKILL.md) | Audits and rewrites LinkedIn sections |
| [proof-asset-creator](skills/proof-asset-creator/SKILL.md) | Helps turn experience into case studies and portfolio proof |
| [claim-check](skills/claim-check/SKILL.md) | Checks final materials for unsupported or inflated claims |

## Use The Prompts

If you use ChatGPT, Gemini, Claude.ai, or another LLM without plugins, start with the copy/paste prompts in [prompts/](prompts/). They do not require installation or local files.

| Prompt | Use it when... |
| --- | --- |
| [resume-builder](prompts/resume-builder.md) | You need a source work document in resume or CV format |
| [resume-audit](prompts/resume-audit.md) | You want blunt feedback on a resume |
| [resume-tailor](prompts/resume-tailor.md) | You want a tailored resume and cover letter for one role |
| [company-research](prompts/company-research.md) | You want a structured employer research pass |
| [interview-prep](prompts/interview-prep.md) | You want likely questions, talking points, and questions to ask |
| [cover-letter](prompts/cover-letter.md) | You want a specific cover letter for one role |
| [linkedin-audit](prompts/linkedin-audit.md) | You want LinkedIn positioning help |
| [proof-asset](prompts/proof-asset.md) | You want a case study, portfolio piece, or proof idea |
| [claim-check](prompts/claim-check.md) | You want a final unsupported-claims check before sending |

Prompt-only use has one important rule: verify anything the model adds or reframes before you send it. The skills can check saved evidence; prompts rely on your manual review.

## Read The Guides

The guides explain the methodology behind the skills and prompts.

| Guide | What it covers |
| --- | --- |
| [Resume Philosophy](guides/resume-philosophy.md) | Outcomes, angles, and honest tailoring |
| [ATS Myths](guides/ats-myths.md) | What ATS systems do and do not do |
| [Company Research](guides/company-research.md) | A practical employer vetting process |
| [Remote Job Market](guides/remote-job-market.md) | Why remote roles need sharper targeting |
| [Interview Framework](guides/interview-framework.md) | How to prepare and what to ask back |
| [Networking](guides/networking-guide.md) | A low-cringe relationship-building rhythm |
| [Proof Assets](guides/proof-assets.md) | How to show evidence beyond a resume |
| [Negotiation](guides/negotiation-guide.md) | How to handle offers and tradeoffs |
| [Sustainable Search](guides/sustainable-search.md) | Weekly pacing that does not burn you out |

## Sample Outputs

Curated sample outputs live in [examples/](examples/):

- [US resume example](examples/resume-tech-lead.md)
- [Cover letter example](examples/coverletter-computational-biology.md)
- [Interview prep brief example](examples/interview-prep-engineering-manager.md)

`tests/personas/` is for internal evaluation fixtures, not public samples.

## Optional Local Workspace

Claude Code and Cowork users can save work in `my-documents/`. The folder is gitignored so personal materials do not get committed.

```text
my-documents/
|- resume.md and/or cv.md
|- coverletter.md
|- applications/
|  `- {company-role}/
|     |- resume.md or cv.md
|     |- coverletter.md
|     |- interview-prep.md
|     `- interview-log.md
|- reports/
|- story-bank.md
`- proof-assets/
```

Prompt-only users can ignore this and manage their own files.

## DOCX and PDF Export

The skills save markdown first. `scripts/generate-docx.py` can render resumes, CVs, and cover letters to `.docx`; it also creates PDFs when LibreOffice is installed.

```bash
pip install python-docx markdown-it-py
python scripts/generate-docx.py my-documents/resume.md my-documents/coverletter.md
```

LibreOffice is optional. If it is missing, the script still writes valid `.docx` files.

## Quality Checks

```bash
python scripts/check-content-hygiene.py
python scripts/test_generate_docx.py
python scripts/test_skill_contracts.py
```

The hygiene check catches old names, unresolved public placeholders, and promotional copy that does not belong in a jobseeker-first resource. The DOCX tests cover the markdown renderer. The skill contract tests catch missing skills, schema drift, and stale state-layer conventions.

## Repository Structure

| Path | What it is |
| --- | --- |
| `skills/` | Claude Code and Cowork skills |
| `prompts/` | Copy/paste prompts for any LLM |
| `guides/` | Job search methodology |
| `templates/` | Resume, CV, and cover letter scaffolds |
| `scripts/` | Export and quality-check scripts |
| `examples/` | Curated sample outputs |
| `tests/personas/` | Synthetic evaluation fixtures |
| `research/` | Source notes behind the guides |

## Philosophy

- Tell the truth, specifically.
- Write for humans first. ATS compatibility is clean formatting, not magic.
- Tailor the argument, not the facts.
- Research companies before spending serious time applying.
- AI should sharpen your thinking, not replace your judgment.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the standards this repo uses: useful first, truthful always, and non-promotional by default.

## License

MIT. See [LICENSE](LICENSE) for details.
