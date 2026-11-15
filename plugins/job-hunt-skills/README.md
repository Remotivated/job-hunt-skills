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

The core sequence is: build one accurate source document, decide whether a posting is worth pursuing, research one company, tailor one application, prepare for one interview.

## The skills

| Skill                                                      | Use it when                                                                                 |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [get-started](skills/get-started/SKILL.md)                 | You are new and want the fastest path to a first useful draft.                              |
| [resume-builder](skills/resume-builder/SKILL.md)           | You want to build or update your source resume or CV (US resume or UK/EU CV format).        |
| [opportunity-evaluator](skills/opportunity-evaluator/SKILL.md) | You found a posting and want a pursue, hold, or skip read before investing time. |
| [resume-tailor](skills/resume-tailor/SKILL.md)             | You have a specific posting and want a tailored resume or CV, and a cover letter if needed. |
| [company-research](skills/company-research/SKILL.md)       | You want to decide whether a company or role is worth your time.                            |
| [cover-letter](skills/cover-letter/SKILL.md)               | You only need a cover letter for a specific role.                                           |
| [resume-auditor](skills/resume-auditor/SKILL.md)           | You want direct, evidence-based feedback on your resume or CV.                              |
| [claim-check](skills/claim-check/SKILL.md)                 | You are about to send something and want a truth pass first.                                |
| [interview-coach](skills/interview-coach/SKILL.md)         | You have an interview coming up and want a prep brief. |
| [interviewing](skills/interviewing/SKILL.md)               | You want to track interview stages, notes, and follow-ups.                                  |
| [linkedin-optimizer](skills/linkedin-optimizer/SKILL.md)   | You want to audit and rewrite LinkedIn sections.                                            |
| [proof-asset-creator](skills/proof-asset-creator/SKILL.md) | You want to choose and scope a case study or portfolio piece.                               |

Skills also activate from ordinary requests such as "audit my resume", "research this company", or "I have an interview at X".

## Your files stay in a folder you choose

Before saving anything, the skills show you the folder they will use and wait for you to confirm it. Everything is saved as plain markdown under `my-documents/` in that folder: your source resume or CV, a story bank of examples for interviews, an applications tracker, research reports, and one folder per application. The skills never save your job-search files inside the plugin itself, and nothing is uploaded to a service run by this project.

## What runs on your computer

Nothing. This plugin is text only: skills, guides, templates, and shared rules written in Markdown, with its manifests, icon, and license. It contains no scripts or other code, and it never downloads or installs any.

- **Your files are handled with your assistant's ordinary file tools.** The skills follow written procedures to create the `my-documents/` folders, write tracker rows and numbered reports, save the postings you choose to pursue, and show a short progress summary.
- **Word and PDF files come from your assistant's own document abilities**, following a written layout. Where your assistant cannot make them, you get your markdown and a print-ready page to open in a browser, and you are told which you got.
- **No network calls from the plugin.** Company research uses your assistant's own web search within a set lookup budget, and the report says which sources it used and how many lookups it took.
- **Optional scripts, only if you install them.** [Job Hunt Skills Tools](https://github.com/Remotivated/job-hunt-skills/tree/main/plugins/job-hunt-skills-tools) is a separate companion plugin with Node scripts for typeset Word and PDF export, locked tracker writes, and posting fingerprints. This plugin works fully without it and never installs it for you.

The plugin has no hooks, no MCP servers, no telemetry, and no account to create.

## Privacy

- **Remotivated receives nothing from the plugin.** It sends no data to Remotivated or to any server Remotivated runs, and it has no analytics.
- **Your job-search files stay where you put them.** They are plain markdown in the folder you chose, and you can read, edit, move, or delete them at any time.
- **No credentials are read.** The plugin does not read API keys, tokens, passwords, or other credentials from your computer.
- **Your assistant's own terms still apply.** What you share in the conversation, and any web research the assistant does, is handled by your AI provider (for example Anthropic for Claude) under its terms. The plugin does not change that.

## More

- Getting started walkthrough, prompts for any LLM, example outputs, and the full guide set: [github.com/Remotivated/job-hunt-skills](https://github.com/Remotivated/job-hunt-skills)
- Methodology guides bundled with the plugin: [guides/](guides/)
- License: MIT, see [LICENSE](LICENSE).
