# Getting Started With Job Hunt Skills

Install Job Hunt Skills first — see the **Use The Skills** section of [README.md](README.md) for Claude Code, Cowork, and clone-fallback instructions, plus the prompt-library path for any LLM. This page is the "what to do this week" walkthrough once installation is done.

Start small. Build one accurate source work document in resume or CV format, research one real company, tailor one application, and prepare for one interview.

## The Core Sequence

1. **Build your source document** with `get-started` or `resume-builder`.
2. **Research the company** with `company-research`.
3. **Tailor for the role** with `resume-tailor`.
4. **Move into interviewing** with `interviewing`.
5. **Prepare deeply** with `interview-coach`.

That sequence is the heart of the repo. Everything else is useful, but optional.

## What You Can Create

- A source work document in US resume or UK/EU-style CV format.
- A cover letter when you have a specific role, company, or tightly defined target lane.
- A company research brief that covers role fit, remote/hybrid signals, and red flags.
- A tailored resume and cover letter for one real posting.
- Interview-stage notes, follow-ups, and a prep brief grounded in your actual experience.
- LinkedIn copy and proof assets once the basics are in place.

## Resume And CV Formats

`resume-builder` supports both format conventions:

- US-style resumes.
- UK/EU-style work CVs.

In this repo, CV means a UK/EU-style work document, not a US academic CV. The downstream resume skills select whichever source work document fits the user, role, and region, so tailoring, audit, interview prep, and claim checks should work from either `resume.md` or `cv.md`.

## Prompt-Only Path

Use this path for ChatGPT, Gemini, Claude.ai, or any LLM without plugin access.

1. Open [prompts/README.md](prompts/README.md).
2. Pick one prompt.
3. Paste the requested inputs.
4. Review every claim the model adds or reframes.
5. Remove or verify anything that is not true.

The skills can check saved evidence. Prompt-only use cannot, so your manual truth pass matters.

## Good First Reads

- [Resume Philosophy](guides/resume-philosophy.md)
- [ATS Myths](guides/ats-myths.md)
- [Company Research](guides/company-research.md)
- [Interview Framework](guides/interview-framework.md)
- [Sustainable Search](guides/sustainable-search.md)
