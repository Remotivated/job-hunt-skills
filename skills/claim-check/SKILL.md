---
name: claim-check
description: Use when the user wants a final truth pass before submitting a resume, CV, cover letter, LinkedIn section, or application package. Also use when they ask whether a draft contains unsupported, inflated, or hallucinated claims.
---

## Overview

User-facing wrapper around `resume-drift-check`. The goal is simple: catch unsupported claims before the user sends materials to an employer.

Use this skill name in conversation and reports. Do not expose `resume-drift-check` unless the user is asking about internals.

## Workflow

> **State layer:** reads source work documents, tailored application materials, story bank, proof assets, and reports. Writes a numbered `claim-check` report. See [state-layer contract](../_shared/state-layer.md).

### 1. Scope the check

Ask only if the target is not obvious. Scope options:

- A pasted draft.
- A specific file path.
- A specific application id, company, or role.
- All application materials under `my-documents/applications/`.

If the user says "before I submit" and a current application is clear, check that application package: tailored work document plus cover letter.

### 2. Gather evidence

Run `node scripts/scaffold-state.mjs` if state files are missing.

Read available evidence in priority order:

1. `my-documents/resume.md` and/or `my-documents/cv.md`.
2. `my-documents/story-bank.md`.
3. `my-documents/proof-assets/*.md`.
4. `my-documents/reports/*.md`.

If no saved source work document exists, proceed on pasted source material but warn that evidence checking is limited to what the user provides in the session.

### 3. Invoke drift-check

Invoke `resume-drift-check` in standalone mode with report slug and skill set to `claim-check`.

Classify findings using the drift-check classes and severities:

- Supported
- Unverifiable but plausible
- Unverifiable
- Contradicted
- Cosmetic / Soft / Hard severity

### 4. Resolve blockers

For every soft or hard finding, give the user the smallest useful choice:

- Answer the underlying question so the stronger claim can stand.
- Adjust to the supported version.
- Remove the claim.
- Add the confirmed fact to the source work document or story bank for future checks.

Do not silently rewrite claim-level spans. Cosmetic fixes are the only auto-fixes.

### 5. Save the report

Write `my-documents/reports/{###}-claim-check-{YYYY-MM-DD}.md`.

Report frontmatter:

```yaml
---
report_id: {###}
company: {Company or null}
role: {Role or null}
application_id: {application id or null}
skill: claim-check
date: {today ISO}
summary: Checked {N} files - {A} supported, {B} unverifiable, {C} contradicted.
---
```

### 6. Close

Report:

- Whether the package is safe to send.
- Any hard blockers.
- Any soft claims the user chose to confirm, adjust, or remove.
- Files changed, if any cosmetic fixes were applied.

If the materials are clean and tied to an application, ask whether the user submitted them. If yes, offer to advance the tracker to `applied`.

## Common Mistakes

- **Calling this a fact guarantee.** It is an evidence check against saved materials, not a background investigation.
- **Auto-fixing claims.** Do not rewrite soft or hard findings without user choice.
- **Ignoring pasted drafts.** If the user supplies only pasted text, check that text against whatever evidence they also provide.
