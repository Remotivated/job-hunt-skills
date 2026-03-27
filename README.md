# Job Hunt OS
### AI-powered skills for a smarter remote job search

Built by [Remotivated](https://remotivated.com) — the job platform where remote means remote.

---

Remote roles make up 8-12% of job postings but attract over 40% of applications. The math demands precision, not volume. Job Hunt OS gives you a system for that — Claude skills, standalone prompts, and methodology guides grounded in the principle that 5 tailored applications beat 50 generic ones. Every tool here is designed to help you research smarter, write stronger, and interview with confidence.

---

## What's Inside

### Skills (Claude Cowork / Claude Code)

| Skill | What it does |
|-------|-------------|
| [resume-builder](skills/resume-builder/SKILL.md) | Build a resume and cover letter from scratch through guided Q&A |
| [resume-auditor](skills/resume-auditor/SKILL.md) | Get genuinely critical feedback — counteracts AI sycophancy |
| [resume-tailor](skills/resume-tailor/SKILL.md) | Customize your resume for a specific job posting |
| [interview-coach](skills/interview-coach/SKILL.md) | Prepare for an interview with likely questions and talking points |
| [company-radar](skills/company-radar/SKILL.md) | Vet a company's remote culture before you apply |
| [proof-asset-creator](skills/proof-asset-creator/SKILL.md) | Build case studies, portfolios, and proof-of-value assets |
| [linkedin-optimizer](skills/linkedin-optimizer/SKILL.md) | Audit and improve your LinkedIn profile |

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

## Quick Start

### Claude Cowork (recommended)

1. Add this repo as a skill source in your Cowork project
2. Skills will be automatically discoverable
3. Start with: "Help me build my resume" → the `resume-builder` skill activates
4. Your canonical resume saves to `my-documents/resume.md`

### Claude Code

1. Clone this repo: `git clone https://github.com/remotivated/job-hunt-os.git`
2. Open in Claude Code — skills are automatically available
3. Same workflow as Cowork

### Any LLM (ChatGPT, Gemini, Claude Cloud)

1. Browse the [`prompts/`](prompts/) directory
2. Copy the prompt into your conversation
3. Paste your resume, job description, or other materials alongside it
4. Note: No file management, PDF generation, or web browsing — but the core methodology works anywhere

See [GETTING-STARTED.md](GETTING-STARTED.md) for detailed setup instructions.

---

## Your First Workflow

Here's the recommended sequence when you find a role you're interested in:

1. **Build your resume** → `resume-builder` creates your canonical resume
2. **Vet the company** → `company-radar` evaluates their remote culture
3. **Tailor for the role** → `resume-tailor` customizes your resume + cover letter
4. **Prepare for the interview** → `interview-coach` generates your prep brief

Each skill builds on the last. Your canonical resume (`my-documents/resume.md`) is the foundation — build it once, tailor it many times.

---

## Philosophy

- **Quality over quantity** — 5 tailored applications beat 50 generic ones
- **Show, don't tell** — Outcomes and proof over claims and buzzwords
- **Research before you apply** — 15 minutes of vetting saves 45 minutes of wasted effort
- **Your resume tells a story** — Make sure it's the right one for each reader
- **Remote readiness is a signal** — Demonstrate it, don't just claim it
- **AI enhances, it doesn't replace** — Use AI to sharpen your thinking, not to think for you

---

## About Remotivated

[Remotivated](https://remotivated.com) is the job platform where remote means remote. We provide a company profile and job directory to help jobseekers find genuine remote jobs and help remote-first employers stand out by sharing their culture.

Every company on Remotivated is classified by how they actually work — fully remote, remote-first, hybrid, or onsite — so you know what you're getting before you apply.

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
