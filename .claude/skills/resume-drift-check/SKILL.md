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

Drift-check runs in one of two modes depending on the caller.

- **Tailor mode** (default — invoked from `resume-tailor` or manually): canonicals exist and we are verifying tailored or edited derivatives of them. Evidence layer is the four file sources below.
- **Initial-build mode** (invoked from `resume-builder` when the canonical is being written for the first time): no canonical exists yet. Evidence layer is the **interview context** — the user's answers during the current `resume-builder` conversation, plus any existing resume or LinkedIn the user supplied at the start. Treat the conversation transcript as the highest-trust source. Skip step 2 (Scope the scan) and the `derived_from_version` handling in step 3 — there's nothing to diff against.

**Tailor mode inputs:**

- **Canonicals:** `my-documents/resume.md` and `my-documents/cv.md`. At least one must exist; the other is optional. Read each file's `version` from frontmatter independently — they version separately.
- **Tailored resumes and cover letters:** `my-documents/applications/*/resume.md` and `my-documents/applications/*/coverletter.md` (every subdirectory). Read each file's `derived_from_version` from frontmatter. If missing, treat as `derived_from_version: 0` and flag it. (Tailored CVs are not produced by `resume-tailor` yet — when that lands, this section will extend to `applications/*/cv.md` with the same rules.)
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

Search the evidence layer (priority sources 1–3, then 4, or the conversation context in initial-build mode). Classify along two dimensions: **class** (is the claim supported by evidence?) and **severity** (how should a failure be handled?).

**Class:**

| Class | Rule |
|-------|------|
| **Supported** | Direct hit in the evidence layer (sources 1–3, or an explicit interview answer in initial-build mode). Auto-accepted. |
| **Unverifiable but plausible** | Hit only in reports (source 4). Likely real but not primary evidence. |
| **Unverifiable** | No hit anywhere. |
| **Contradicted** | Actively conflicts with an evidence source (e.g., "team of 8" vs canonical's "team of 4"). |

**Severity** (controls how remediation is handled in step 6):

| Severity | Applies to | Handling |
|----------|-----------|----------|
| **Cosmetic** | Unresolved placeholders (`year TBD`, stray `[ASK: ...]` or `[VERIFY: ...]`), typos, format glitches. Not claim-level failures. | Safe to auto-fix without user confirmation. |
| **Soft** | Unverifiable claims that are paraphrases, inference tightenings, or subtler padding. | Surface with a suggested fix AND the underlying question. Never auto-apply. |
| **Hard** | Contradicted claims, fabricated employers/dates/metrics, invented credentials, triggered experience-invention patterns. | Block save. User must resolve before the file is persisted. |

Common **soft** patterns to check for explicitly — these have each blown past earlier prose-rule patches in skill docs and are the reason this verification step exists:

- **Inference tightening.** The evidence states facts A and B separately; the output asserts a connection between them ("A applied to B", "the A-based project") that the evidence doesn't explicitly make. Plausible but not in the source.
- **Invented tool specifics.** The evidence says "AWS", "cloud", or "databases"; the output lists specific services ("AWS (S3, EC2, Lambda)", "PostgreSQL, MySQL") the evidence never named. Same rule applies to framework versions, library names, and CI/CD tools.
- **Dropped proficiency qualifiers.** The evidence describes a skill as "intermediate", "scripting only", "~1 year", or "learning"; the output strips the hedge and promotes it alongside deep-expertise skills.
- **Paraphrase-that-tightens.** The output is close to the evidence but subtly promotes a claim — "contributed to" → "built", "worked on" → "led", "co-supervised" → "managed".

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

### 6. Apply remediation by severity

Handle findings according to the severity assigned in step 4. The calling skill (`resume-builder`, `resume-tailor`, or a manual run) is responsible for enforcing these behaviours — drift-check produces the classification, the caller gates the save.

**Cosmetic findings — auto-fix.**

Rewrite the offending span in place and record each edit in the drift report. No user confirmation needed. This tier is strictly limited to placeholder strings (unresolved `year TBD`, stray `[ASK: ...]` or `[VERIFY: ...]`), typos, and obvious format glitches. **Never auto-fix a claim-level span**, even if the fix looks obvious.

**Soft findings — surface with a suggested fix and the underlying question.**

For every soft finding, show the user:

- The offending span with file path and rough location
- The evidence gap (what the output asserts vs. what the evidence actually supports)
- A suggested fix that restores fidelity — un-tighten the inference, restore the hedge, split conflated facts
- The **underlying question** the finding represents ("the real way to close this gap is for you to tell me X — do you want to answer that so we can include the accurate version?")

The user picks one of three actions per finding:

1. **Confirm** — the tighter claim is actually accurate. Prompt to add it to the canonical or story-bank so future checks will pass.
2. **Adjust** — apply the suggested fix (un-tighten, restore the hedge, split the inference).
3. **Ask underlying question** — the user answers the implicit question so the next iteration uses the real fact. This is the preferred path when the skill is running interactively; it almost always produces a stronger output than either confirming or adjusting.

**Hard findings — block save.**

For every hard finding, surface the same three options (Confirm / Adjust / Replace), but the calling skill **must not persist the output file** until every hard finding is resolved. A hard finding is a red light, not a yellow one.

**Only cosmetic findings auto-apply.** Everything else requires user input, without exception.

### 7. Summary

Report counts, flagged claims per application, and which actions the user took. Suggest re-running if the user confirmed claims against story-bank.

## Common Mistakes

- **Treating classification as truth.** Classification is a prompt for review, not a verdict. A claim can be legitimate without appearing in the evidence layer yet.
- **Overflagging paraphrases.** If a bullet says the same thing in different words as the canonical, that's supported — not unverifiable.
- **Ignoring the reports tier.** Self-references the user made in prior sessions are weaker evidence than the canonical, but they're not nothing. Use them to downgrade "unverifiable" to "unverifiable but plausible."
- **Silent patching of claims.** Only cosmetic findings (placeholders, typos, format glitches) are safe to rewrite without user confirmation. Soft and hard findings — anything at the claim level — always require the user to pick an action. Auto-fixing an inference tightening or an invented tool-specific expansion can produce a worse rewrite than the original, because the grader is itself an LLM and not reliable enough to delegate claim-level rewrites to.
