---
name: resume-builder
description: Use when the user wants to create or update a source work document in resume or CV format, or create a source cover letter from scratch. Triggers on US resumes ("build my resume") and UK/EU-style work CVs ("build my CV", "I need a CV for a UK role", "European CV"). US academic CVs are out of scope. For first-time users setting up from a fresh clone, prefer `get-started`.
---

## Terminology

Two document categories:

- **Work document:** the user's source career document. It may be saved in resume format at `my-documents/resume.md` or CV format at `my-documents/cv.md`. These are format variants of the same workflow; downstream resume skills must accommodate either.
- **Cover letter:** an accompanying letter for a specific role, company, or tightly defined target lane. `my-documents/coverletter.md` is a source letter, not permission to create something generic enough to send anywhere.

Format-specific conventions:

- **Resume format:** US 1-2 page work document with concise sections and optional Professional Summary.
- **CV format:** UK/EU 1-2 page work document with Personal Statement, degree classification when relevant, Languages with CEFR when relevant, and "References available on request" where expected. Not the US academic CV.

**Disambiguation rule:** If the user says "CV" without naming a region, ask whether they need a UK/EU-style work CV or are using CV to mean a US resume. If academic signals appear, say directly that academic CVs with publications, grants, and teaching sections are out of scope; offer a UK/EU-style work CV or US-style resume for industry applications.

**Vocabulary rule:** Mirror the user's word. If they say "CV," say "CV." If they say "resume," say "resume." Save that word in the `label` frontmatter field and preserve it on future edits.

## Workflow

> **Onboarding hand-off:** If the user appears to be on a fresh clone or is new to Job Hunt Skills, hand off to `get-started`. This skill focuses on the document itself.
>
> **State layer:** this skill owns source work-document version bumps. See [state-layer contract section 6](../_shared/state-layer.md#6-work-document-frontmatter-and-selection).

### 1. First-run scaffolding

Run `node scripts/scaffold-state.mjs` once before the interview. The script is idempotent and only creates missing state files/directories.

### 2. Decide scope and format

Clarify:

- Resume format, CV format, cover letter, or a combination.
- New build, rebuild, or update.
- Target country/region and target roles.
- Whether the user has an existing resume, CV, LinkedIn export, job posting, or notes.

If updating, select the existing work document using [state-layer section 6](../_shared/state-layer.md#6-work-document-frontmatter-and-selection), read its frontmatter, and preserve `label`.

### 3. Gather existing materials

Ask:

> Do you have an existing resume, CV, LinkedIn profile, or notes you'd like to work from? If not, we can build from scratch together.

If provided, read and analyze it before asking follow-ups. If starting from scratch, run the structured interview below.

### 4. Structured interview

Probe for outcomes, not responsibilities.

- **Current role:** title, day-to-day, 4-6 strongest accomplishments. Push for numbers, timeframes, scope, users, revenue, costs, quality, speed, risk, or research impact.
- **Internal promotions:** if tenure at an employer is 3+ years and the user names one title, ask whether they held other roles there.
- **Prior experience:** 3-4 accomplishments per recent role; 1-2 is fine for older roles.
- **Skills/tools:** technologies, platforms, certifications, methodologies, spoken languages when relevant.
- **Target roles:** roles, industries, seniority, region, and work model.
- **Cover letter specificity:** only if a cover letter is in scope. Ask for exact role or tightly defined lane, employer or company type/stage, the problem they want to solve, proof points, and any honest gap.
- **Remote signals:** remote experience, cross-timezone work, documentation, independent delivery, async habits, or self-directed projects.
- **Education:** degree, school, year. For CV format, also ask degree classification and whether Education should lead for early-career users.
- **Story/angle:** specialist, generalist, leader, career changer, academic-to-industry, or another honest frame.
- **CV-format extras:** Personal Statement seed, languages with proficiency, target country/region, and whether Publications/Selected Talks are relevant for industry.

**STAR+R inline enrichment.** While probing accomplishments, watch for ones with clear STAR shape (situation, task, action, result). When you find one, ask the Reflection prompt inline — "What would you do differently, or what did you learn?" — so the story is complete enough to bank in step 6.5 without a second round of prompting. Skip the prompt for routine accomplishments that are not story-bank candidates.

### 5. Generate outputs

Produce markdown for the requested documents. Do not save yet; claim verification runs first.

**Resume format:** follow `templates/resume-template.md`. Use achievement bullets: action + work + outcome. Use past tense throughout, including current role. Include remote-readiness evidence where relevant. Target path: `my-documents/resume.md`.

**CV format:** follow `templates/resume-eu-template.md`. Lead with a Personal Statement rather than a US-style Professional Summary. Preserve useful academic-to-industry evidence such as selected publications or talks only when it strengthens the target role. Skip photo, DOB, full address, and marital status unless the user explicitly needs a locale where they are expected. Target path: `my-documents/cv.md`.

**Cover letter:** generate `my-documents/coverletter.md` only when there is enough specificity to write something the user would actually send. Minimum bar: one exact role or tight lane, one concrete employer or company type/stage, one clear problem, and two proof points. If the answers are vague, say so and skip the letter.

Cover letter quality bar:

- Lead with the employer's need and relevant proof.
- Expand 1-2 proof points instead of prose-copying the work document.
- Explain why this role or lane makes sense now.
- Name honest gaps directly when useful.
- Rewrite or skip if the letter survives a five-company swap.

### 6. Claim verification before save

Invoke `claim-check` in initial-build mode with the generated content and current interview conversation as evidence.

Handle findings:

- **Cosmetic:** auto-fix placeholders, typos, and format glitches.
- **Soft:** stop and surface the issue, suggested fix, and underlying question. Prefer asking the user the underlying question.
- **Hard:** block save. Fabricated employers, dates, metrics, credentials, or experience must be corrected before the file exists.

Only save after every non-cosmetic finding is resolved.

### 6.5. Capture pass for interview overflow

Source work documents are space-constrained. A structured interview surfaces more material than fits in 1-2 pages. After claim-check passes, identify content the user told you that did not make it into the work document but has a natural canonical home outside it.

**Floor threshold.** Skip silently if nothing qualifies.

**Meaningfulness.** Same bar as `resume-tailor` capture pass: would future-me want this in canonical evidence, or is it scaffolding chatter? Routine context, vague aspirations, and accomplishments already covered by a saved bullet are not capture candidates.

**Route each candidate:**

- **STAR+R-shaped narrative captured during the interview** → `story-bank.md` entry
- **Reusable case study with metrics and ≥1 paragraph of narrative** → `proof-assets/{slug}.md`
- **Ambiguous** → ask the user

**Prompt shape:**

> The interview surfaced 2 stories that didn't fit in the work document but are worth banking:
>
> 1. "Stripe outage incident response" — STAR+R complete
>    Propose: capture as story-bank entry [accept / redirect / skip]
>
> 2. "Migration of legacy billing system, 6-month project, $2M cost reduction"
>    Propose: capture as proof-asset {legacy-billing-migration} [accept / redirect / skip]

**Write semantics:** story-bank entries follow [state-layer §7](../_shared/state-layer.md#7-story-bank-schema) — kebab-case `id`, themes inferred from content, `created` set to today, `usage: []`. Proof-assets use a confirmed kebab-case slug. Captures are derived from material the user just told you, validated implicitly by the conversation, so no second claim-check pass is needed. Captured artifacts are persisted in step 7 alongside the source work document.

### 7. Save and version

Source work-document frontmatter:

```yaml
---
version: 1
updated: 2026-04-08
label: resume
---
```

On first build, set `version: 1`. On update, increment only the file changed and preserve `label` verbatim. If both `resume.md` and `cv.md` exist, they version independently because they are separate files, but the skills treat them as work-document format variants.

`coverletter.md` does not need frontmatter.

**Captured artifacts from step 6.5** (if any) are written in this step alongside the source work document — story-bank entries appended to `story-bank.md`, proof-assets created at `my-documents/proof-assets/{slug}.md`. Captures do not affect the source work document's `version`.

### 8. Generate DOCX, PDF, and HTML preview

After writing markdown, invoke the generation script once with all files written:

```bash
python scripts/generate-docx.py my-documents/resume.md my-documents/coverletter.md
```

or:

```bash
python scripts/generate-docx.py my-documents/cv.md my-documents/coverletter.md
```

In single-document modes, pass only the file written. The script writes `.docx` and `.html` next to each input, and adds `.pdf` when LibreOffice is available. The `.html` is a browser-openable preview that mirrors the page geometry — useful for eyeballing formatting without Word/LibreOffice. Docx and PDF remain canonical for submission.

Handle failures:

- **Content validation failure:** fix unresolved placeholders, template comments, `[ASK:]`, `[VERIFY:]`, or `year TBD` internally and rerun. Ask the user only when a missing fact is required.
- **Infrastructure/rendering failure:** report the file, error, and exact rerun command.

If LibreOffice is missing but `.docx` files are written, treat that as success with skipped PDF conversion.

### 9. Modes

- **Resume format:** writes `my-documents/resume.md`.
- **CV format:** writes `my-documents/cv.md`.
- **Just cover letter:** requires specificity; do not force a generic letter.
- **Update:** select the relevant source work document, ask what changed, revise, and bump only that file's `version`.
- **Capture pass hand-off:** when invoked by `resume-tailor` capture pass with new content already specified, skip the "what changed" prompt, integrate the content into the appropriate role/section, run claim-check on the integrated draft, and bump `version` on save. The user has already approved the content; do not re-litigate it.

## Common Mistakes

- **Inventing metrics.** Use `[ASK: what was the result?]` for gaps.
- **Dropping proficiency qualifiers.** Preserve "learning", "intermediate", "scripting only", "~1 year", or similar hedges.
- **Inventing tool specifics.** Do not expand "AWS" into service names, "databases" into engines, or "CI/CD" into tools unless the user named them.
- **Over-polishing.** The document should sound like the user at their most articulate.
- **Ignoring the angle.** Every work document needs a coherent story.
- **Skipping remote signals.** Surface evidence of self-direction, async work, documentation, or independent delivery when relevant.

## Reference

See [../../guides/resume-philosophy.md](../../guides/resume-philosophy.md) and [../../guides/ats-myths.md](../../guides/ats-myths.md).
