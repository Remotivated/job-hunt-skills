---
name: resume-builder
description: Use when the user wants to create a resume, CV, or cover letter from scratch, rebuild an existing one, or update their canonical resume/CV after a career change, promotion, or new achievements. Triggers on US resumes ("build my resume") and on UK/EU CVs ("build my CV", "I need a CV for a UK role", "European CV"). In this project "CV" always means the UK/EU work CV; US academic CVs are out of scope. For first-time users setting up from a fresh clone, prefer `get-started` — it wraps this skill with orientation, scaffolding, and post-build framing.
---

## Terminology

Three distinct documents. Do not conflate them:

- **Resume** — US 1-2 page work document. Canonical: `my-documents/resume.md`.
- **CV** — UK/EU 1-2 page work document with Personal Statement, degree classification, Languages (CEFR), and "References available on request". Canonical: `my-documents/cv.md`. **Not** the US academic CV.
- **Cover letter** — the accompanying letter that introduces the candidate, explains interest in a specific role or tightly-defined target lane, and maps experience to the employer's needs. Complements either a resume or a CV; not a replacement for either. `my-documents/coverletter.md` is a source letter, not permission to write something broad enough to send anywhere.

**Disambiguation rule:** If the user says "CV" without naming a region, ask: "Is this for a UK or EU role, or a US role? In this project 'CV' means the UK/EU work CV — for US roles I'd build a resume instead." If academic signals appear (publications, tenure-track, postdoc, faculty search, grant-funded lab), say directly: "Academic CVs (with publications, grants, teaching sections) are out of scope here. If you're moving from academia to industry, I can build a UK/EU CV or a US resume depending on where you're applying — which is it?" Never silently map "CV" to the UK/EU template for a US candidate.

**Vocabulary rule:** Mirror the user's own word throughout the session. If they said "CV," say "CV." If they said "resume," say "resume." This word gets written to the canonical's `label` frontmatter field at save time (see §4) and is the source of truth for every downstream skill. Do not translate the user's word in either direction.

## Workflow

> **Onboarding hand-off:** If the user appears to be on a fresh clone or is new to Job Hunt OS, hand off to `get-started` instead — it wraps this skill with orientation, story-bank seeding, and closing framing. This skill stays focused on the document itself.
>
> **State layer:** this skill owns canonical `version` bumps. See [state-layer contract §6](../_shared/state-layer.md#6-canonical-resume-frontmatter).

### 1. First-run scaffolding

Run `node scripts/scaffold-state.mjs` once, before the interview, even if `my-documents/` appears to exist. The script is idempotent — safe to call repeatedly, it only creates what's missing (`applications.md`, `story-bank.md`, the subdirectories with `.gitkeep`s). See [state-layer contract §2](../_shared/state-layer.md#2-first-run-scaffolding). (If `get-started` already delegated to this skill, scaffolding ran once upstream — the second call is a no-op.)

### 2. Gather existing materials

Ask: "Do you have an existing resume or LinkedIn profile URL you'd like to work from? If not no worries, we can build a new one from scratch together."

- **If provided:** Read, analyze, identify gaps. Ask targeted follow-ups for outcomes, metrics, remote signals.
- **If starting from scratch:** Run the structured interview below.

### 3. Structured interview

Probe for outcomes, not responsibilities.

- **Current role:** Title, day-to-day, 4-6 proudest accomplishments (push for numbers, timeframes, scope). If the user stalls at 2-3, probe for more before moving on — the current role carries the most weight on the resume and needs enough raw material for the best bullets to compete with each other.
- **Internal promotions — probe explicitly.** If tenure at the current employer is 3+ years and the user has named only one title, ask: "Have you held other roles at [company]?" Don't assume long tenure is a single role — collapsing multiple titles into one flattens the trajectory signal a resume depends on. Apply the same probe to any prior employer with 3+ years of tenure.
- **Prior experience:** 3-4 accomplishments per role (1-2 is fine for roles older than ~10 years). What did you deliver? What changed because of your work?
- **Skills/tools:** Technologies, platforms, certifications
- **Target roles:** What roles and industries are you aiming for?
- **Cover letter specificity (only if a cover letter is in scope):** Ask for one exact role title, one specific company or tightly-defined company type/stage, the problem they want to be hired to solve, why they want that lane now, and any honest gap they would rather name directly than hide. Do not draft from vague answers like "SaaS," "remote jobs," or "Director/VP roles."
- **Remote signals:** Remote experience? Or: independent projects, cross-timezone work, documentation, self-directed delivery?
- **Education:** Brief for resume mode — degree, school, year. **CV mode:** also ask about degree classification (First, 2:1, 2:2 / Distinction, Merit) and, for early-career candidates (< 5 years experience), enough detail to lead the document with Education above Experience.
- **Story/angle:** "Are you a specialist, generalist, or career changer? This shapes what leads."
- **CV mode only — Personal Statement seed:** instead of (or in addition to) the optional Professional Summary, ask: "In 2-4 sentences, who are you professionally, what are you known for, and what kind of role are you looking for next?" First-person is fine; avoid dated third-person tone. This becomes the Personal Statement at the top of `cv.md`.
- **CV mode only — Languages and locale:** ask which spoken languages and proficiency (CEFR levels A1-C2 if known), and which country/region the CV targets (some EU countries expect a photo; UK does not — default to no photo unless the user is sure).

### 4. Generate outputs

Produce the markdown for whichever shareable outputs are in scope for this run. **Do not save yet** — the drift check below runs against the interview answers before the files are persisted.

**Resume (US):** Bullet structure: `[Past-tense action verb] + [what you did] + [specific outcome]`. Past tense throughout, including the current role — consistent voice reads as accomplishments, not a job description. The summary, if included, uses the same implied first-person voice as the bullets. Include 1-2 remote-readiness bullets per role. Follow `templates/resume-template.md`. Target path: `my-documents/resume.md`.

**CV (UK/EU):** Same bullet structure — past tense throughout, including the current role. Lead with a **Personal Statement** (2-4 sentences, first-person OK, no third-person 1990s tone) instead of a Professional Summary. Section order follows `templates/resume-eu-template.md`: Personal Statement → Experience → Education → Skills (include spoken Languages with CEFR levels in EU contexts) → Interests (optional, only if specific) → References ("available on request"). Skip photo, DOB, address, marital status. For early-career candidates, move Education above Experience and include degree classification. Target path: `my-documents/cv.md`.

**Cover letter:** Only generate `my-documents/coverletter.md` if you have enough specificity to make it sound like something the user would actually send. Minimum bar: one exact target role or tightly-defined lane, one concrete employer or company type/stage, one clear problem they want to help solve, and two proof points from the interview. If you do not have that, say so plainly and skip the cover letter; a missing `coverletter.md` is better than a generic one.

When you do write it, follow `templates/coverletter-template.md` and enforce this quality bar:

- Anchor to one target lane, not a basket of role families.
- Lead with a problem/need and proof, not "I am writing to express interest" filler.
- Expand 1-2 strong proof points; do not turn the letter into a prose resume.
- Include a real reason this lane makes sense for the user now.
- If there is an honest gap worth naming, name it directly instead of smoothing over it.
- Fail and rewrite if the letter contains broad positioning language such as "I'm targeting X, Y, or Z roles," "I'd like to bring the same work to a SaaS company," or any closing that could survive a five-company swap with only noun changes.

Before save, do an adversarial self-check: "Would the user actually send this?" and "If I swapped in another company or lane, would most of this still read the same?" If either answer is yes, rewrite or skip the letter.

**Drift check before save:** Before writing any markdown file to disk, invoke `resume-drift-check` in **initial-build mode** with the generated content and the current interview conversation as evidence. Handle findings per severity (see [resume-drift-check §6](../resume-drift-check/SKILL.md)):

- **Cosmetic findings** — the check auto-fixes placeholders, typos, and format glitches. Continue.
- **Soft findings** — stop and surface each finding with a suggested fix **and** the underlying question the interview didn't answer. Common first-build patterns: dropped proficiency qualifiers ("intermediate" → plain), invented tool specifics ("AWS" → "AWS (S3, EC2, Lambda)"), paraphrasing that tightens a claim beyond what the user actually said in the interview. Do not save until the user resolves each one — and prefer asking the underlying question over adjusting the output, because a real answer beats a hedged rewrite.
- **Hard findings** — block save. Do not write the markdown until every hard finding is resolved. Fabricated employers, dates, metrics, or credentials must be corrected from outside the interview before the canonical file exists.

Only once drift-check returns a clean verdict — all findings auto-fixed or resolved — save the markdown files to their target paths, then proceed to DOCX/PDF generation below.

**Generate DOCX (and PDF if available):** After writing the markdown file(s), invoke the generation script **once** with all paths so LibreOffice only cold-starts a single time. The script routes by filename (`resume*.md` → Resume, `cv*.md` → CV, `coverletter*.md` → Cover Letter) — no flags needed:

```
python scripts/generate-docx.py my-documents/resume.md my-documents/coverletter.md
```

```
python scripts/generate-docx.py my-documents/cv.md my-documents/coverletter.md
```

In single-document modes, only pass the file you wrote. The script always produces a `.docx` next to each input, then converts each to `.pdf` via LibreOffice headless.

Handle failures in two buckets:

- **Content validation failure** — if the script says the markdown is "not ready to render" (for example unresolved placeholders, template comments, `[ASK:]`, `[VERIFY:]`, or `year TBD`), do **not** dump that raw error on the user and stop. Treat it as an internal quality gate. Read the exact blocker(s), fix the markdown, and rerun the script automatically. If the blocker can only be resolved by getting a missing fact from the user, ask that narrow question explicitly; otherwise keep the repair loop internal.
- **Infrastructure/rendering failure** — if the markdown is valid but `.docx` build or PDF conversion fails (LibreOffice missing, timeout, launch error, conversion error), report the per-file failure and exact rerun command.

If LibreOffice is not on the user's PATH, the script writes the `.docx` files (which are valid submittable artifacts) and prints install instructions for `soffice` — do not treat that as a failure of the run. The script renders each file independently; the exit code is non-zero only if any `.docx` build or `.pdf` conversion *actually* errored. Report any infrastructure/rendering failures with the exact rerun command and move on:

> Markdown saved. PDF conversion failed for `my-documents/cv.md`: `<error message>`. The `.docx` is in place; rerun once fixed: `python scripts/generate-docx.py my-documents/cv.md`

**Frontmatter (required on `resume.md` and `cv.md`):**

```yaml
---
version: 1
updated: 2026-04-08
label: resume      # or "CV" — the user's own word, captured once, reused forever
---
```

On first build: `version: 1`. Set `label` to the word the user has been using in conversation up to this point — "CV" if they said CV, "resume" if they said resume. If ambiguous, default from filename (`cv.md` → `CV`, `resume.md` → `resume`). On update (see §5 Modes below): read the current frontmatter, increment `version` by 1, set `updated` to today's ISO date, **preserve the existing `label` verbatim** — never silently overwrite a user's set preference. **Resume and CV version independently** — bumping `resume.md` does not touch `cv.md` and vice versa. See [state-layer contract §6](../_shared/state-layer.md#6-canonical-resume-frontmatter) for the full rule. `coverletter.md` does not need frontmatter.

### 5. Modes

- **"Just resume"** or **"just CV"** — skip the others
- **"Just cover letter"** still requires cover-letter specificity. If the user wants "just a cover letter" but cannot name a concrete target or a tightly-defined lane, do not force a generic draft.
- **"CV mode"** — triggered by phrases like "build my CV", "I need a CV for a UK role", "European CV", or any explicit CV request. Uses `templates/resume-eu-template.md` and writes `my-documents/cv.md`. Resume and CV are independent canonicals; building one does not modify the other.
- **"Update"** — read the relevant existing canonical (resume *or* CV), ask what's changed, revise, bump that file's `version` only. Scaffolding in §1 is still safe to run (idempotent).

## Common Mistakes

- **Inventing metrics.** Never fabricate numbers. Use `[ASK: what was the result?]` placeholders for gaps.
- **Dropping proficiency qualifiers.** When the user describes a skill as "intermediate," "scripting only," "~1 year," "learning," or similar, preserve that hedge in the Skills section. Stripping qualifiers silently upgrades the profile — e.g. "Python (scripting only)" becoming plain "Python" sitting next to languages the user has years of depth in. This is a softer form of inventing depth, and screens probe exactly these items. If the qualifier makes a line ugly, move the item to a separate "Familiar with" line rather than deleting the hedge.
- **Inventing tool specifics.** When the user says "AWS," "cloud," or "databases," don't promote that to "AWS (S3, EC2, Lambda)," "cloud (GCP, Azure)," or "databases (PostgreSQL, MySQL)" unless they specifically named those services. Ask instead — "Which AWS services specifically?" — and if the user doesn't know or can't remember, keep the skill at the level of fidelity they supplied. Plausible service names feel safe because they're common in bootcamps and job postings, but recruiters probe exactly these items in screens. Same rule applies to framework versions, library names, and CI/CD tools: don't fill in the blanks with plausible defaults.
- **Over-polishing.** The resume should sound like the user at their most articulate, not a different person.
- **Ignoring the angle.** Every resume tells a story — specialist, generalist, career changer. If you don't identify it, the resume reads as a disconnected list.
- **Skipping remote signals.** Even users without remote experience have evidence of self-direction, async work, or independent delivery. Surface it.

## Reference

See `guides/resume-philosophy.md` for methodology and `guides/ats-myths.md` for formatting.
