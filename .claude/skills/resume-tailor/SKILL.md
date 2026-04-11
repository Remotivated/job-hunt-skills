---
name: resume-tailor
description: Use when the user has a specific job posting and wants to customize their resume and cover letter for that role. Also use when they say "I'm applying to..." or share a job link.
---

## Overview

Reshape the resume narrative for a specific role. This is not keyword swapping — it's adjusting which experiences lead and how they're framed. Never modifies canonical files.

## Workflow

> **State layer:** reads `applications.md` to dedup existing tailorings, runs claim verification against the evidence layer before saving, writes a tailor-report stub, and upserts the tracker at `status: saved`. See [state-layer contract](../_shared/state-layer.md).

### 0. Dedup check

Read `my-documents/applications.md` (first-run scaffold if missing). Compute the target `id` as `{company-slug}-{role-slug}`. If a row with that `id` already exists **or** `my-documents/applications/{id}/resume.md` already exists, warn:

> You have a tailored resume for **{Role} at {Company}**. Iterate on the existing version, or create a new one?

- **Iterate:** load the existing tailored file and continue from there.
- **New one:** the new version **overwrites** `applications/{id}/resume.md` in place. Rationale: parallel folders for the same role get messy. Git history on the canonical + the report stub preserve recoverability.
- **Genuine need for two simultaneous variants** (e.g., same role applied via two channels): the user picks a distinct suffix like `{id}-referral` and passes that as the target.

Warn, do not block — the user can always proceed.

### 1. Accept inputs

- **Job posting** — URL or pasted text. If URL can't be accessed, ask for pasted text.
- **Canonical files** — Read `my-documents/resume.md` and `my-documents/coverletter.md`

### 2. Analyze the posting

Extract: top requirements, terminology, company values, remote specifics.

### 3. Identify the angle

What's the strongest story for THIS role? Which experiences map to their priorities? How should emphasis shift?

### 4. Tailor

**Resume:** Match terminology, reorder bullets by relevance, highlight remote signals. You may add a Summary section or reorganize structure if it strengthens the narrative, but don't remove sections from the canonical. Never invent experience.

**Claim verification (required before save):** For every added or rewritten bullet, classify each quantitative claim and named project against the evidence layer (canonical → story-bank → proof-assets → reports), using the rules in [state-layer §7](../_shared/state-layer.md#7-evidence-layer-priority-order). This is the **same mechanism** used by `resume-drift-check` — one shared pass, not two. Surface any **unverifiable** or **contradicted** claim inline as `[VERIFY: {claim} — {source-gap}]` so the user can confirm, adjust, or replace before the file is saved. Gaps in the canonical itself still use `[ASK: ...]` placeholders as before.

**Cover letter:** Address specific role/company. Lead with strongest alignment. Confident closing.

### 5. Save outputs

**Tailored artifacts:**

```
my-documents/applications/{id}/resume.md
my-documents/applications/{id}/coverletter.md
```

Where `{id}` is the dedup-matched or user-confirmed id from Step 0 (lowercase kebab-case, e.g., `buffer-content-marketing-manager`).

**Frontmatter on the tailored `resume.md`:**

```yaml
---
derived_from_version: {current canonical version}
tailored_date: {today ISO}
application_id: {id}
---
```

Read the canonical's `version` field and copy it into `derived_from_version`. See [state-layer §6](../_shared/state-layer.md#6-canonical-resume-frontmatter).

**Tailor report stub:** Also write `my-documents/reports/{###}-{id}-tailor-{YYYY-MM-DD}.md`. Frontmatter: `id`, `company`, `role`, `application_id: {id}`, `skill: resume-tailor`, `date`, `summary`. Body: the angle chosen, which canonical bullets were reframed, and every `[VERIFY:]` marker that still needed user attention.

**Upsert the tracker:** `applications.md` upsert with `status: saved` if no row exists, or leave existing status alone (never regress). Rules in [state-layer §3](../_shared/state-layer.md#3-applicationsmd-schema).

**PDF:** After the tailor-report stub is written and `applications.md` has been upserted, invoke the PDF script **once** with both tailored files so Chromium only cold-starts one time:

```
node scripts/generate-pdf.mjs my-documents/applications/{id}/resume.md my-documents/applications/{id}/coverletter.md
```

Run PDF generation **after** tracker state has been persisted so a rendering failure does not block the `status: saved` upsert. The script renders each file independently — one can fail while the other succeeds, and the exit code is non-zero if *any* file failed. On failure, report which file(s) failed to the user with the exact rerun command for the failing file only:

> Tailored markdown and tracker updated. PDF generation failed for `my-documents/applications/{id}/resume.md`: `<error message>`. Fix and rerun: `node scripts/generate-pdf.mjs my-documents/applications/{id}/resume.md`

**Never modify canonical files** unless explicitly asked.

### 6. Summary and post-run prompt

Report to the user: key changes and why, alignment strengths, `[ASK]` gaps, `[VERIFY]` flags, and anything to review manually. Show the tracker row for this application.

Then ask:

> Did you submit this application? If so, I can update the status to `applied`.

If the user confirms, upsert `applications.md` with `status: applied` and `updated: {today ISO}`. Only the user can trigger this transition — the skill never auto-advances past `saved`.

## Common Mistakes

- **Keyword stuffing.** Matching terminology ≠ cramming keywords. Swap naturally where their language differs from yours.
- **Only changing the summary.** Tailoring means reordering and reframing bullets throughout, not just editing the top paragraph.
- **Modifying canonicals.** This skill writes to `applications/` subdirectories. The originals are sacred.
