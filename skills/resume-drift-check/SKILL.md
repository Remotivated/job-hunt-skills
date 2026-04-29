---
name: resume-drift-check
description: Internal and advanced skill for verifying that resumes, CVs, cover letters, and tailored application materials do not contain unsupported or inflated claims. User-facing final checks should usually invoke `claim-check`, which wraps this workflow.
---

## Overview

Detect and classify claims that are not supported by the evidence layer. This is a fabrication check, not a staleness check. It catches hallucinated metrics, invented tools, inflated scope, and projects that never existed before materials go to an employer.

The same verification mechanism runs inside `resume-builder`, `resume-tailor`, `cover-letter`, and `claim-check`.

## When to Run

- Embedded before `resume-builder` saves a new or rebuilt source work document.
- Embedded before `resume-tailor` or `cover-letter` saves tailored application materials.
- Manually through `claim-check` before submitting materials.
- After editing a source work document, to verify existing tailored materials still match evidence.

## State Layer

> Reads source work documents, tailored work documents, cover letters, story bank, proof assets, and reports. Writes a numbered verification report when run as a standalone check. See [state-layer contract](../_shared/state-layer.md).

## Workflow

### 1. Gather inputs

Drift-check has three modes.

**Initial-build mode** - invoked from `resume-builder` before the first save or rebuild of `resume.md` or `cv.md`.

- Evidence is the current interview conversation plus any existing resume, CV, LinkedIn export, or notes the user supplied.
- Treat the conversation transcript and supplied source material as highest-trust evidence.
- Skip source-version comparison because the source work document is not saved yet.

**Tailor mode** - invoked from `resume-tailor` or `cover-letter`.

- Evidence layer is the saved files listed in [state-layer section 8](../_shared/state-layer.md#8-evidence-layer).
- The caller passes the candidate tailored work document and/or cover letter before save.
- The caller blocks save until soft and hard findings are resolved.

**Standalone mode** - invoked manually or by `claim-check`.

- Default scope is all application materials under `my-documents/applications/*/`.
- If the user names a file, folder, company, role, or application id, scope to that target.
- Read both source work documents if they exist.

### 2. Tailor and standalone inputs

Read:

- Source work documents: `my-documents/resume.md` and/or `my-documents/cv.md`.
- Tailored work documents: `my-documents/applications/*/resume.md` and `my-documents/applications/*/cv.md`.
- Tailored cover letters: `my-documents/applications/*/coverletter.md`.
- Evidence layer: `story-bank.md`, `proof-assets/*.md`, and `reports/*.md`.

For each tailored work document, read frontmatter:

- Preferred: `source_document`, `source_version`, `source_label`, `application_id`.
- Legacy fallback: `derived_from_version` as `source_version`; infer `source_document` from the tailored filename.

If no source frontmatter exists, deep scan the file and warn.

### 3. Scope the scan

For each tailored work document:

- If `source_version` matches the current version of `source_document`, light scan only bullets or sections that diverge materially from the source.
- If `source_version` is older than the current source version, deep scan every concrete claim.
- If source metadata is missing or the source document no longer exists, deep scan and warn.

For cover letters, always scan every concrete claim because letters routinely synthesize facts across sources.

### 4. Extract claims

Extract concrete, probeable claims:

- Quantitative claims: numbers, percentages, dates, team sizes, revenue, time spans.
- Named projects, products, publications, launches, case studies, or initiatives.
- Tools, languages, platforms, frameworks, methodologies, and credentials.
- Role specifics: titles, scope, reporting lines, management or mentorship responsibility.
- Outcome claims: business impact, customer impact, research impact, process changes.

Ignore purely stylistic claims unless they imply evidence, seniority, or scope.

### 5. Classify each claim

Search the evidence layer in priority order:

1. Source work documents and current build interview context.
2. `story-bank.md`.
3. `proof-assets/*.md`.
4. `reports/*.md`.

Classify along two dimensions.

**Class:**

| Class | Rule |
| --- | --- |
| Supported | Direct or faithful paraphrase match in priority sources 1-3, or explicit interview answer in initial-build mode. |
| Unverifiable but plausible | Hit only in reports. |
| Unverifiable | No hit anywhere. |
| Contradicted | Conflicts with a higher-priority source. |

**Severity:**

| Severity | Applies to | Handling |
| --- | --- | --- |
| Cosmetic | Unresolved placeholders, stale `[ASK:]` or `[VERIFY:]` markers resolved in conversation, typos, format glitches. | Safe to auto-fix. |
| Soft | Plausible but unsupported paraphrases, inference tightening, dropped qualifiers, or subtle padding. | Surface with suggested fix and underlying question. |
| Hard | Contradicted claims, fabricated employers/dates/metrics, invented credentials, or invented experience. | Block save. |

Common soft patterns to check explicitly:

- **Inference tightening:** evidence states facts A and B separately; output asserts a connection between them.
- **Invented tool specifics:** evidence says "AWS" or "databases"; output lists specific services or engines the user never named.
- **Dropped proficiency qualifiers:** evidence says "learning", "intermediate", "scripting only", or similar; output strips the hedge.
- **Paraphrase-that-tightens:** "contributed to" becomes "led", "co-supervised" becomes "managed", or "worked on" becomes "built".

Classification is a prompt for review, not a final truth verdict. Some legitimate claims live in the user's head and need to be added to the source document or story bank.

### 6. Apply remediation by severity

The caller enforces remediation. Drift-check supplies findings and, when standalone, records the user's chosen actions.

**Cosmetic findings:** auto-fix only placeholders, stale markers resolved in conversation, typos, and obvious format glitches. Never auto-fix a claim-level span.

**Soft findings:** show the user:

- File path and rough location.
- The offending span.
- What the output asserts.
- What the evidence supports.
- A suggested fix that restores fidelity.
- The underlying question that would let the stronger claim stand honestly.

Preferred options:

1. **Answer the underlying question** so the real fact can be used.
2. **Adjust** to the suggested faithful version.
3. **Confirm and add evidence** to the source work document or story bank.

**Hard findings:** block save until resolved. The user may correct the source, adjust the claim, or replace the span with a supported claim.

### 7. Write the report in standalone mode

Standalone runs write `my-documents/reports/{###}-claim-check-{YYYY-MM-DD}.md` unless the caller explicitly asks for the internal slug `resume-drift-check`.

Report frontmatter:

```yaml
---
report_id: {###}
company: null
role: null
application_id: null
skill: claim-check
date: {today ISO}
summary: Checked {N} files - {A} supported, {B} unverifiable, {C} contradicted.
---
```

If scoped to a tracked application, set `company`, `role`, and `application_id`.

Body structure:

- Overview counts by class and severity.
- Per-file findings.
- Each flagged claim with exact span, classification, best evidence source, and recommended action.
- Any user-confirmed actions taken.

### 8. Summary

Report counts, blockers, resolved findings, and the next action. If the user confirmed new facts, recommend adding them to the source work document or story bank so future checks pass.

## Common Mistakes

- **Treating classification as truth.** A claim can be real but absent from the evidence layer.
- **Overflagging faithful paraphrases.** Same fact in different words is supported.
- **Ignoring reports as weak evidence.** Reports can downgrade a claim from unverifiable to unverifiable but plausible, but they are not primary evidence.
- **Silent claim patching.** Only cosmetic findings auto-apply. Soft and hard claim-level findings require user action.
