# Job Hunt Skills

Skills for a practical, human led, AI assisted job search. Build a resume or CV from your real experience, research employers before you spend time applying, tailor applications to specific roles, prepare for interviews, and keep track of where everything stands.

**A Job Search System that Compounds**

- Every application is checked for AI hallucinations against your canonical documents
- Applications are automatically tracked locally so you can measure progress and see what you sent the employer when preparing for interviews or responding to offers
- Every approved bullet point, anecdote and statistic is saved for later use so every resume and CV you send gets better and better with less effort.

Open source and free, built and maintained by [Remotivated](https://remotivated.com/?utm_source=github&utm_medium=repo&utm_campaign=job-hunt-skills&utm_content=plugin-readme).

The skills work from your own material and do not invent experience. When a stronger line would need a fact you have not given, you get a question instead of a guess, and a final claim check flags anything in an application your saved evidence does not support.

## Start here

Ask:

```text
Help me get started.
```

or run `/job-hunt-skills:get-started`. If you already have a resume and a job posting, paste both: you get a tailored draft and an honest audit in the chat before anything is saved. Building your full source resume or CV comes after that, when you want it.

The core sequence is: build one accurate source document, research one company, tailor one application, prepare for one interview.

## The skills

| Skill                                                      | Use it when                                                                                 |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [get-started](skills/get-started/SKILL.md)                 | You are new and want the fastest path to a first useful draft.                              |
| [resume-builder](skills/resume-builder/SKILL.md)           | You want to build or update your source resume or CV (US resume or UK/EU CV format).        |
| [resume-tailor](skills/resume-tailor/SKILL.md)             | You have a specific posting and want a tailored resume or CV, and a cover letter if needed. |
| [company-research](skills/company-research/SKILL.md)       | You want to decide whether a company or role is worth your time.                            |
| [cover-letter](skills/cover-letter/SKILL.md)               | You only need a cover letter for a specific role.                                           |
| [resume-auditor](skills/resume-auditor/SKILL.md)           | You want direct, evidence-based feedback on your resume or CV.                              |
| [claim-check](skills/claim-check/SKILL.md)                 | You are about to send something and want a truth pass first.                                |
| [interview-coach](skills/interview-coach/SKILL.md)         | You have an interview coming up and want a prep brief X [interviewing](skills/interviewing/SKILL.md)               | You want to track interview stages, notes, and follow-ups.                                  |
| [linkedin-optimizer](skills/linkedin-optimizer/SKILL.md)   | You want to audit and rewrite LinkedIn sections.                                            |
| [proof-asset-creator](skills/proof-asset-creator/SKILL.md) | You want to choose and scope a case study or portfolio piece.                               |

Skills also activate from ordinary requests such as "audit my resume", "research this company", or "I have an interview at X".

## Your files stay in a folder you choose

Before saving anything, the skills show you the folder they will use and wait for you to confirm it. Everything is saved as plain markdown under `my-documents/` in that folder: your source resume or CV, a story bank of examples for interviews, an applications tracker, research reports, and one folder per application. The skills never save your job-search files inside the plugin itself, and nothing is uploaded to a service run by this project.

## What runs on your computer

- **Local Node scripts, when Node is available.** Bundled scripts create the `my-documents/` folders, write tracker rows and numbered reports, show a short progress summary, and export documents. When Node is not installed, the skills do the same file work with the assistant's normal file tools.
- **Document export.** `scripts/export-documents.mjs` turns a saved resume, CV, or cover letter into `.docx`, `.pdf`, and an `.html` preview next to the markdown file. Its JavaScript dependencies are bundled in `scripts/vendor/`, so there is no install step.
- **Typst, only if you installed it.** If a `typst` program is already on your computer, the exporter runs it locally to typeset the PDF, using the template and fonts in `templates/`. If it is not installed, the built-in renderer makes the PDF instead.
- **No network calls from the scripts.** None of the bundled scripts sends or fetches anything over the network. Company research uses your assistant's own web search within a set lookup budget, and the report says which sources it used and how many lookups it took.

The plugin has no hooks, no MCP servers, no telemetry, and no account to create.

## More

- Getting started walkthrough, prompts for any LLM, example outputs, and the full guide set: [github.com/Remotivated/job-hunt-skills](https://github.com/Remotivated/job-hunt-skills)
- Methodology guides bundled with the plugin: [guides/](guides/)
- License: MIT, see [LICENSE](LICENSE).
