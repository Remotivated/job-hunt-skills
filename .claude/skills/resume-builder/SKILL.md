---
name: resume-builder
description: Use when the user wants to create a resume, CV, or cover letter from scratch, rebuild an existing one, or update their canonical resume/CV after a career change, promotion, or new achievements. Triggers on US resumes ("build my resume") and on UK/EU CVs ("build my CV", "I need a CV for a UK role", "European CV"). In this project "CV" always means the UK/EU work CV; US academic CVs are out of scope.
---

## Terminology

Three distinct documents. Do not conflate them:

- **Resume** — US 1-2 page work document. Canonical: `my-documents/resume.md`.
- **CV** — UK/EU 1-2 page work document with Personal Statement, degree classification, Languages (CEFR), and "References available on request". Canonical: `my-documents/cv.md`. **Not** the US academic CV.
- **Cover letter** — the accompanying letter that introduces the candidate, explains interest in a specific role, and maps experience to the employer's needs. Complements either a resume or a CV; not a replacement for either. Canonical: `my-documents/coverletter.md`.

**Disambiguation rule:** If the user says "CV" without naming a region, ask: "Is this for a UK or EU role, or a US role? In this project 'CV' means the UK/EU work CV — for US roles I'd build a resume instead." If academic signals appear (publications, tenure-track, postdoc, faculty search, grant-funded lab), say directly: "Academic CVs (with publications, grants, teaching sections) are out of scope here. If you're moving from academia to industry, I can build a UK/EU CV or a US resume depending on where you're applying — which is it?" Never silently map "CV" to the UK/EU template for a US candidate.

## Workflow

> **State layer:** this skill owns canonical `version` bumps. See [state-layer contract §6](../_shared/state-layer.md#6-canonical-resume-frontmatter).

### 1. Orient the user

Before asking any interview questions, give a short (4-6 sentence) orientation so a first-time user knows what's about to happen. Cover:

- **What we'll do together:** a structured interview about your work, then I draft the document(s), run a drift check, save them, and generate PDFs.
- **What will exist afterward:** canonical markdown under `my-documents/` (`resume.md` and/or `cv.md`, plus `coverletter.md`) and matching PDFs. These are the foundation every other skill in this repo reads from.
- **Rough time:** plan for 15-25 minutes of back-and-forth — longer if you're starting from scratch with no existing resume.
- **What comes next:** once the canonicals exist, `resume-auditor` gives honest feedback and `resume-tailor` customizes for specific roles.

Keep it conversational, not a bulleted wall. If the user is clearly in update mode and already knows the drill, compress or skip.

### 2. First-run scaffolding

Run `node scripts/scaffold-state.mjs` once, before the interview, even if `my-documents/` appears to exist. The script is idempotent — it only creates what's missing (`applications.md`, `story-bank.md`, the subdirectories with `.gitkeep`s). This is the state layer the rest of Job Hunt OS depends on, so don't skip it even in update mode. See [state-layer contract §2](../_shared/state-layer.md#2-first-run-scaffolding).

### 3. Gather existing materials

Ask: "Do you have an existing resume or LinkedIn profile URL you'd like to work from? If not no worries, we can build a new one from scratch together."

- **If provided:** Read, analyze, identify gaps. Ask targeted follow-ups for outcomes, metrics, remote signals.
- **If starting from scratch:** Run the structured interview below.

### 4. Structured interview

Probe for outcomes, not responsibilities.

- **Current role:** Title, day-to-day, 2-3 proudest accomplishments (push for numbers, timeframes, scope)
- **Prior experience:** What did you deliver? What changed because of your work?
- **Skills/tools:** Technologies, platforms, certifications
- **Target roles:** What roles and industries are you aiming for?
- **Remote signals:** Remote experience? Or: independent projects, cross-timezone work, documentation, self-directed delivery?
- **Education:** Brief for resume mode — degree, school, year. **CV mode:** also ask about degree classification (First, 2:1, 2:2 / Distinction, Merit) and, for early-career candidates (< 5 years experience), enough detail to lead the document with Education above Experience.
- **Story/angle:** "Are you a specialist, generalist, or career changer? This shapes what leads."
- **CV mode only — Personal Statement seed:** instead of (or in addition to) the optional Professional Summary, ask: "In 2-4 sentences, who are you professionally, what are you known for, and what kind of role are you looking for next?" First-person is fine; avoid dated third-person tone. This becomes the Personal Statement at the top of `cv.md`.
- **CV mode only — Languages and locale:** ask which spoken languages and proficiency (CEFR levels A1-C2 if known), and which country/region the CV targets (some EU countries expect a photo; UK does not — default to no photo unless the user is sure).

### 5. Generate outputs

Produce the markdown for whichever shareable outputs are in scope for this run. **Do not save yet** — the drift check below runs against the interview answers before the files are persisted.

**Resume (US):** Bullet structure: `[Action verb] + [what you did] + [specific outcome]`. Include 1-2 remote-readiness bullets per role. Follow `templates/resume-template.md`. Target path: `my-documents/resume.md`.

**CV (UK/EU):** Same bullet structure, but lead with a **Personal Statement** (2-4 sentences, first-person OK, no third-person 1990s tone) instead of a Professional Summary. Section order follows `templates/resume-eu-template.md`: Personal Statement → Experience → Education → Skills (include spoken Languages with CEFR levels in EU contexts) → Interests (optional, only if specific) → References ("available on request"). Skip photo, DOB, address, marital status. For early-career candidates, move Education above Experience and include degree classification. Target path: `my-documents/cv.md`.

**Cover letter:** Hook → body mapping experience to goals → confident closing. Follow `templates/coverletter-template.md`. Target path: `my-documents/coverletter.md`.

**Drift check before save:** Before writing any markdown file to disk, invoke `resume-drift-check` in **initial-build mode** with the generated content and the current interview conversation as evidence. Handle findings per severity (see [resume-drift-check §6](../resume-drift-check/SKILL.md)):

- **Cosmetic findings** — the check auto-fixes placeholders, typos, and format glitches. Continue.
- **Soft findings** — stop and surface each finding with a suggested fix **and** the underlying question the interview didn't answer. Common first-build patterns: dropped proficiency qualifiers ("intermediate" → plain), invented tool specifics ("AWS" → "AWS (S3, EC2, Lambda)"), paraphrasing that tightens a claim beyond what the user actually said in the interview. Do not save until the user resolves each one — and prefer asking the underlying question over adjusting the output, because a real answer beats a hedged rewrite.
- **Hard findings** — block save. Do not write the markdown until every hard finding is resolved. Fabricated employers, dates, metrics, or credentials must be corrected from outside the interview before the canonical file exists.

Only once drift-check returns a clean verdict — all findings auto-fixed or resolved — save the markdown files to their target paths, then proceed to PDF generation below.

**PDF toolchain prerequisite check:** Before invoking `generate-pdf.mjs` for the first time, verify the toolchain. Check whether `node_modules/playwright/package.json` exists at the repo root. If it doesn't, tell the user:

> PDF generation needs a one-time setup: `npm install` (installs Playwright) and `npx playwright install chromium` (~300 MB Chromium download). Both are idempotent and only needed once per machine. OK to run them now?

On confirmation, run `npm install && npx playwright install chromium` and wait for it to finish before proceeding. If the user declines, save the markdown (it's the canonical artifact) and skip PDF generation — report that they can rerun `node scripts/generate-pdf.mjs <path>` later. The markdown save is the load-bearing success; PDFs are recoverable.

**Generate PDFs:** After writing the markdown file(s), invoke the PDF script **once** with all paths so Chromium only launches a single time. The script routes by filename (`resume*.md` → Resume, `cv*.md` → CV, `coverletter*.md` → Cover Letter) — no flags needed:

```
node scripts/generate-pdf.mjs my-documents/resume.md my-documents/coverletter.md
```

```
node scripts/generate-pdf.mjs my-documents/cv.md my-documents/coverletter.md
```

In single-document modes, only pass the file you wrote. The script renders each PDF independently — one file can fail while the other succeeds, and the exit code is non-zero if *any* file failed. The markdown save is still the canonical success; report whichever file(s) failed to the user with the exact rerun command and move on:

> Markdown saved. PDF generation failed for `my-documents/cv.md`: `<error message>`. Fix and rerun: `node scripts/generate-pdf.mjs my-documents/cv.md`

**Frontmatter (required on `resume.md` and `cv.md`):**

```yaml
---
version: 1
updated: 2026-04-08
---
```

On first build: `version: 1`. On update (see §8 Modes below): read the current frontmatter, increment `version` by 1, set `updated` to today's ISO date. **Resume and CV version independently** — bumping `resume.md` does not touch `cv.md` and vice versa. See [state-layer contract §6](../_shared/state-layer.md#6-canonical-resume-frontmatter) for the full rule. `coverletter.md` does not need frontmatter.

### 6. Seed the story bank (offer, don't assume)

The interview just collected concrete accomplishments — exactly the STAR material `story-bank.md` is designed to hold for `interview-coach` and `resume-drift-check`. After saving the canonicals, offer to capture the richest 2-3 as stubs:

> I noticed you mentioned [brief one-line summaries of 2-3 accomplishments from the interview]. Want me to capture those as STAR stubs in `story-bank.md` now? It seeds your evidence layer for interview prep and drift-checking, and you can flesh them out later.

If the user declines, move on without pushing — don't re-ask. If they accept, append each as a STAR+R entry (Situation / Task / Action / Result / Reflection) to `my-documents/story-bank.md` using whatever detail the interview surfaced, and mark gaps with `[ASK: …]` placeholders rather than inventing. Never fabricate specifics to round out a stub.

### 7. Closing orientation

End the run with a short recap so the user knows what now exists and what to do next. Keep it tight — the user just spent 20 minutes in an interview, don't bury the landing:

- **Files created** (with paths): the canonicals you wrote, plus their PDFs.
- **One-line reminder** that these are the canonicals every other skill reads from, and they live in the gitignored `my-documents/` tree.
- **The 1-2 skills most likely to be useful next**, framed as suggestions rather than a checklist:
  - "Want honest feedback on what we just built? → `resume-auditor`"
  - "Found a specific role you're interested in? → `remote-culture-check` first (vet the company), then `resume-tailor` (customize for the role)"

In update mode, compress this to a single line ("Resume bumped to v3, PDFs regenerated") — no need to re-orient someone who already knows the system.

### 8. Modes

- **"Just resume"**, **"just CV"**, or **"just cover letter"** — skip the others
- **"CV mode"** — triggered by phrases like "build my CV", "I need a CV for a UK role", "European CV", or any explicit CV request. Uses `templates/resume-eu-template.md` and writes `my-documents/cv.md`. Resume and CV are independent canonicals; building one does not modify the other.
- **"Update"** — read the relevant existing canonical (resume *or* CV), ask what's changed, revise, bump that file's `version` only. Scaffolding in §2 is still safe to run (idempotent); orientation in §1 and closing in §7 can be compressed.

## Common Mistakes

- **Inventing metrics.** Never fabricate numbers. Use `[ASK: what was the result?]` placeholders for gaps.
- **Dropping proficiency qualifiers.** When the user describes a skill as "intermediate," "scripting only," "~1 year," "learning," or similar, preserve that hedge in the Skills section. Stripping qualifiers silently upgrades the profile — e.g. "Python (scripting only)" becoming plain "Python" sitting next to languages the user has years of depth in. This is a softer form of inventing depth, and screens probe exactly these items. If the qualifier makes a line ugly, move the item to a separate "Familiar with" line rather than deleting the hedge.
- **Inventing tool specifics.** When the user says "AWS," "cloud," or "databases," don't promote that to "AWS (S3, EC2, Lambda)," "cloud (GCP, Azure)," or "databases (PostgreSQL, MySQL)" unless they specifically named those services. Ask instead — "Which AWS services specifically?" — and if the user doesn't know or can't remember, keep the skill at the level of fidelity they supplied. Plausible service names feel safe because they're common in bootcamps and job postings, but recruiters probe exactly these items in screens. Same rule applies to framework versions, library names, and CI/CD tools: don't fill in the blanks with plausible defaults.
- **Over-polishing.** The resume should sound like the user at their most articulate, not a different person.
- **Ignoring the angle.** Every resume tells a story — specialist, generalist, career changer. If you don't identify it, the resume reads as a disconnected list.
- **Skipping remote signals.** Even users without remote experience have evidence of self-direction, async work, or independent delivery. Surface it.

## Reference

See `guides/resume-philosophy.md` for methodology and `guides/ats-myths.md` for formatting.
