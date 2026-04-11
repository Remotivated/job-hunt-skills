---
name: resume-builder
description: Use when the user wants to create a resume, CV, or cover letter from scratch, rebuild an existing one, or update their canonical resume/CV after a career change, promotion, or new achievements. Triggers on US resumes ("build my resume") and on UK/EU CVs ("build my CV", "I need a CV for a UK role", "European CV").
---

## Overview

Build a resume, CV, and/or cover letter through conversational Q&A. This is the only skill that writes to canonical files (`my-documents/resume.md`, `my-documents/cv.md`, `my-documents/coverletter.md`). Resume and CV are independent canonicals — both can coexist, and they version independently.

## Workflow

> **State layer:** this skill owns canonical `version` bumps. See [state-layer contract §6](../_shared/state-layer.md#6-canonical-resume-frontmatter).

### 1. Gather existing materials

Ask: "Do you have an existing resume or LinkedIn profile URL I can work from?"

- **If provided:** Read, analyze, identify gaps. Ask targeted follow-ups for outcomes, metrics, remote signals.
- **If starting from scratch:** Run the structured interview below.

### 2. Structured interview

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

### 3. Generate outputs

**Resume (US):** Bullet structure: `[Action verb] + [what you did] + [specific outcome]`. Include 1-2 remote-readiness bullets per role. Follow `templates/resume-template.md`. Save to `my-documents/resume.md`.

**CV (UK/EU):** Same bullet structure, but lead with a **Personal Statement** (2-4 sentences, first-person OK, no third-person 1990s tone) instead of a Professional Summary. Section order follows `templates/cv-template.md`: Personal Statement → Experience → Education → Skills (include spoken Languages with CEFR levels in EU contexts) → Interests (optional, only if specific) → References ("available on request"). Skip photo, DOB, address, marital status. For early-career candidates, move Education above Experience and include degree classification. Save to `my-documents/cv.md`.

**Cover letter:** Hook → body mapping experience to goals → confident closing. Follow `templates/coverletter-template.md`. Save to `my-documents/coverletter.md`.

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

On first build: `version: 1`. On update (see §4 Modes below): read the current frontmatter, increment `version` by 1, set `updated` to today's ISO date. **Resume and CV version independently** — bumping `resume.md` does not touch `cv.md` and vice versa. See [state-layer contract §6](../_shared/state-layer.md#6-canonical-resume-frontmatter) for the full rule. `coverletter.md` does not need frontmatter.

### 4. Modes

- **"Just resume"**, **"just CV"**, or **"just cover letter"** — skip the others
- **"CV mode"** — triggered by phrases like "build my CV", "I need a CV for a UK role", "European CV", or any explicit CV request. Uses `templates/cv-template.md` and writes `my-documents/cv.md`. Resume and CV are independent canonicals; building one does not modify the other.
- **"Update"** — read the relevant existing canonical (resume *or* CV), ask what's changed, revise, bump that file's `version` only

## Common Mistakes

- **Inventing metrics.** Never fabricate numbers. Use `[ASK: what was the result?]` placeholders for gaps.
- **Over-polishing.** The resume should sound like the user at their most articulate, not a different person.
- **Ignoring the angle.** Every resume tells a story — specialist, generalist, career changer. If you don't identify it, the resume reads as a disconnected list.
- **Skipping remote signals.** Even users without remote experience have evidence of self-direction, async work, or independent delivery. Surface it.

## Reference

See `guides/resume-philosophy.md` for methodology and `guides/ats-myths.md` for formatting.
