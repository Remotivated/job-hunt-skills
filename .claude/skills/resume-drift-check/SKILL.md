---
name: resume-drift-check
description: Use when the user wants to verify that tailored resumes don't contain hallucinated claims, after editing the canonical resume, or before submitting applications. Also invoked automatically inside resume-tailor before every save.
---

## Overview

Detect and classify claims in tailored resumes that aren't supported by the evidence layer. This is a **fabrication check**, not a staleness check — the goal is catching hallucinations, numbers that drifted, and projects that never existed, before a tailored resume goes to an employer.

**The same verification pass runs embedded inside `resume-tailor` before every save.** There is one shared mechanism, not two.

## When to Run

- **Manually, any time** the user wants to sanity-check their tailored resumes.
- **After editing the canonical** — bumps the canonical `version`, which may have created drift in existing tailored files.
- **Before submitting applications** — final pre-flight check.
- **Embedded inside `resume-tailor`** — runs automatically on every tailor before the file is saved.

## State Layer

> Reads the canonical resume and CV, all tailored resumes, and the evidence layer. Writes a drift report to `my-documents/reports/`. See [state-layer contract](../_shared/state-layer.md).

## Workflow

### 1. Gather inputs

- **Canonicals:** `my-documents/resume.md` and `my-documents/cv.md`. At least one must exist; the other is optional. Read each file's `version` from frontmatter independently — they version separately.
- **Tailored resumes:** `my-documents/applications/*/resume.md` (every subdirectory). Read each file's `derived_from_version` from frontmatter. If missing, treat as `derived_from_version: 0` and flag it. (Tailored CVs are not produced by `resume-tailor` yet — when that lands, this section will extend to `applications/*/cv.md` with the same rules.)
- **Evidence layer** (priority order per [state-layer §7](../_shared/state-layer.md#7-evidence-layer-priority-order)):
  1. Canonical `resume.md` **and** canonical `cv.md` — both treated as highest-trust evidence
  2. `my-documents/story-bank.md`
  3. `my-documents/proof-assets/*.md`
  4. `my-documents/reports/*.md`

### 2. Scope the scan

For each tailored resume:

- If `derived_from_version == current canonical version`: **light scan** — only check bullets that diverge textually from the canonical.
- If `derived_from_version < current canonical version`: **deep scan** — check every bullet, since the canonical may have been edited in ways that invalidate tailored claims.
- If no `derived_from_version` frontmatter: **deep scan** + warn.

### 3. Extract claims

For each bullet in scope, extract:

- **Quantitative claims:** numbers, percentages, dates, team sizes, revenue figures, time spans ("increased X by 40%", "led a team of 8", "over 3 years").
- **Named projects or outcomes:** project codenames, specific product launches, named tools built, identifiable initiatives ("the distributed team migration", "Project Phoenix").
- **Role specifics:** titles, scope statements, reporting lines.

### 4. Classify each claim

Search the evidence layer (priority sources 1–3, then 4). Classify:

| Class | Rule |
|-------|------|
| **Supported** | Direct hit in canonical, story-bank, or proof-assets (sources 1–3). Auto-accepted. |
| **Unverifiable but plausible** | Hit only in reports (source 4). Likely real but not primary evidence. Flag gently. |
| **Unverifiable** | No hit anywhere. Flag loudly — could be hallucinated. |
| **Contradicted** | Actively conflicts with an evidence source (e.g., "team of 8" vs canonical's "team of 4"). Flag loudly. |

**Verification is a prompt, not a verdict.** Classification is a starting point for the user to review — not a final judgment. Some legitimate claims live in the user's head and haven't made it into the evidence layer yet.

### 5. Write the drift report

Save to `my-documents/reports/{###}-resume-drift-check-{YYYY-MM-DD}.md`.

**Frontmatter:**

```yaml
---
id: {next-number}
company: null
role: null
application_id: null
skill: resume-drift-check
date: {today ISO}
summary: Checked {N} tailored resumes — {A} supported, {B} unverifiable, {C} contradicted.
---
```

**Body structure:**

- **Overview** — counts per class.
- **Per-application findings** — one section per tailored resume:
  - Path to the file.
  - `derived_from_version` vs current canonical `version`.
  - Each flagged claim with: the exact bullet text, classification, best-matching evidence source (or lack thereof), and a recommended action.

### 6. Offer remediation actions

For every **unverifiable** or **contradicted** claim, offer the user three choices:

1. **Confirm** — the claim is real. Prompt to add it to the canonical or story-bank so future checks will pass.
2. **Adjust** — the wording needs correction. Suggest a revised version and offer to patch the tailored file in place.
3. **Replace** — remove the claim entirely or swap in an alternative. Offer to patch the tailored file.

Do not auto-apply any fix. The user confirms every action.

### 7. Summary

Report counts, flagged claims per application, and which actions the user took. Suggest re-running if the user confirmed claims against story-bank.

## Common Mistakes

- **Treating classification as truth.** Classification is a prompt for review, not a verdict. A claim can be legitimate without appearing in the evidence layer yet.
- **Overflagging paraphrases.** If a bullet says the same thing in different words as the canonical, that's supported — not unverifiable.
- **Ignoring the reports tier.** Self-references the user made in prior sessions are weaker evidence than the canonical, but they're not nothing. Use them to downgrade "unverifiable" to "unverifiable but plausible."
- **Silent patching.** Never edit a tailored resume without explicit user confirmation on each claim.
