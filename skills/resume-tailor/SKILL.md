---
name: resume-tailor
description: Use when the user has a specific job posting and wants to customize their resume, CV, work document, and/or cover letter for that role. Also use when they say "I'm applying to..." or share a job link.
---

## Overview

Reshape the user's work document for a specific role. This is not keyword swapping; it is adjusting which experiences lead, which language matches the posting, and how the argument is framed. Never modifies source work documents.

## Workflow

> **State layer:** reads `applications.md` for dedup, selects either `resume.md` or `cv.md` as the source work document, runs claim verification before saving, writes a numbered tailor report, and upserts the tracker at `status: saved`. See [state-layer contract](../_shared/state-layer.md).

### 0. Scaffold and select the source work document

Run `node scripts/scaffold-state.mjs` if the state layer is missing.

Select the source work document using [state-layer section 6](../_shared/state-layer.md#6-work-document-frontmatter-and-selection):

1. If the user names resume or CV, use that file.
2. If the job posting clearly implies a format, use the matching file when it exists.
3. If only one of `my-documents/resume.md` or `my-documents/cv.md` exists, use it.
4. If both exist and the choice is ambiguous, ask which work document to tailor.
5. If neither exists, offer `resume-builder` first or proceed from pasted source material with limited evidence checking.

Read the selected file's `version` and `label`. Let:

- `{document_filename}` be `resume.md` or `cv.md`.
- `{source_document}` be `my-documents/{document_filename}`.
- `{label}` be the frontmatter label, falling back to `resume` or `CV`.

Use `{label}` in all user-facing prose.

### 1. Dedup check

Read `my-documents/applications.md`. Compute the target `id` as `{company-slug}-{role-slug}` unless the user supplies a specific application id.

Check for both:

- Existing tracker row with that `id`.
- Existing tailored file at `my-documents/applications/{id}/{document_filename}`.

If either exists, warn the user:

> You already have a tailored {label} for **{Role} at {Company}**. Iterate on that version, replace it, or create a separate variant with a suffix like `{id}-referral`?

- **Iterate:** load the existing tailored file and continue from it.
- **Replace:** write to the same path after explicit confirmation. This is usually fine because tailored documents are per job, but `my-documents/` is gitignored, so do not imply git can recover overwritten personal files.
- **Separate variant:** use the user-confirmed suffixed id.

Warn, do not block. Users can always proceed.

### 2. Accept inputs

- **Job posting:** URL or pasted text. If URL access fails, ask for pasted text.
- **Source work document:** the selected `resume.md` or `cv.md`.
- **Source letter:** read `my-documents/coverletter.md` if it exists; treat it as source material, not a script to paraphrase mechanically.
- **Evidence:** read `story-bank.md`, `proof-assets/`, and relevant reports when needed for claim verification.

### 3. Analyze the posting

Extract:

- Role problem and likely success criteria.
- Top requirements and nice-to-haves.
- Required terminology and domain language.
- Company values and work-model signals.
- Any gaps the user should acknowledge directly.

### 4. Identify the angle

Decide the strongest honest case for this role:

- Which experiences map most directly to the posting?
- Which bullets or sections should lead?
- Which terminology should change for readability?
- Which gaps should be named instead of hidden?
- Which format conventions must be preserved from the source document?

For CV-format sources, preserve CV conventions such as Personal Statement, Education details, Languages, Publications when present, and References if present. For resume-format sources, preserve concise resume conventions. The skill adapts the content; it does not force one format into the other.

### 5. Tailor the work document

Match terminology, reorder bullets by relevance, and highlight remote or async signals where relevant. You may add or revise a Summary or Personal Statement if it strengthens the role-specific argument. Do not remove source sections unless they are clearly irrelevant to the role and the user agrees.

Never invent experience. Do not add tools, metrics, credentials, titles, employment dates, management scope, or domain exposure that the source work document or evidence layer does not support.

### 6. Tailor or write the cover letter

Address the specific role/company. Use the source letter only as raw material for voice and proof points. If it is missing, too broad, or weaker than a fresh draft from the posting plus evidence layer, write the tailored cover letter from scratch.

**Opening paragraph variants.** The opening determines whether the rest gets read. Produce **3 variants** of the opening paragraph labeled A/B/C, each with a one-line **angle label** stating what it leads with — e.g. *"A: leads with the company-need observation. B: leads with a proof-point hook tied to that need. C: leads with the why-now reason for this role."* The angles must be substantively different, not synonym rewrites. If you can only produce two honestly distinct angles, output two with a note explaining why. Surface the variants to the user, let them pick (or remix), then write only the chosen opening into `coverletter.md`. Body and closing remain single-output — they're constrained by the proof points and the ask, not by angle.

Quality bar (applies to whichever opening is chosen, plus the full letter):

- Name the company's need or problem, not just the user's job-search goal.
- Expand 1-2 proof points that map directly to that need.
- Explain why this role or company makes sense now.
- Name honest gaps directly instead of smoothing them over.
- Rewrite before save if the letter could work for five companies with only company-name swaps.

### 7. Claim verification before save

Invoke `claim-check` in tailor mode on the tailored work document and cover letter before files are persisted. Claim-check classifies concrete claims against the evidence layer and returns both class and severity.

Handle findings:

- **Cosmetic:** claim-check may auto-fix placeholders, typos, and format glitches.
- **Soft:** surface the issue, suggested fix, and underlying question. Prefer asking the underlying question over weakening the output by guesswork.
- **Hard:** block save until resolved. Contradicted or fabricated claims must not be written.

Gaps in the source work document itself still use `[ASK: ...]` placeholders and should be sent back through `resume-builder`; tailoring should not invent missing source facts.

### 8. Save outputs

Save only after verification returns a clean verdict: all cosmetic findings auto-fixed, all soft and hard findings resolved by user action.

**Tailored artifacts:**

```text
my-documents/applications/{id}/{document_filename}
my-documents/applications/{id}/coverletter.md
```

**Frontmatter on the tailored work document:**

```yaml
---
source_document: my-documents/{document_filename}
source_version: {current source version}
source_label: {label}
tailored_date: {today ISO}
application_id: {id}
---
```

**Tailor report:** write `my-documents/reports/{###}-{id}-tailor-{YYYY-MM-DD}.md`.

Report frontmatter:

```yaml
---
report_id: {###}
company: {Company}
role: {Role}
application_id: {id}
skill: resume-tailor
date: {today ISO}
summary: One-line tailoring angle.
---
```

Body: the angle chosen, important section or bullet changes, evidence gaps resolved, and any manual review notes. **For the cover letter opening: record all variants with their angle labels, then mark which one the user chose** — so a future rerun can revisit unchosen angles without redrafting from scratch.

**Tracker:** upsert `applications.md` with `status: saved` if no row exists, or leave existing status alone if it has already advanced. Follow the upsert and status rules in [state-layer section 3](../_shared/state-layer.md#3-applicationsmd-schema).

When inserting a new row, also populate:

- `source` if the user mentioned how they found the role (referral, board, cold, recruiter, watch). Otherwise `-`.
- `comp_expected` if the user has already told the employer a number (recruiter screen, application form). Otherwise `-` — the field tracks what was stated, not a target band or the posted range.
- `next_action_date` to today + 7 days as the default first follow-up window when status is `saved`. The user can edit it.

If the existing tracker row was read with a missing-column header (state-layer §3 rule 6), emit the full canonical schema on write per rule 7.

**DOCX/PDF:** after the tailored artifacts, report, and tracker have been persisted, invoke the generation script once with both tailored files:

```bash
python scripts/generate-docx.py my-documents/applications/{id}/{document_filename} my-documents/applications/{id}/coverletter.md
```

The script writes `.docx` and `.html` next to each input, plus `.pdf` when LibreOffice is available. The HTML preview lets the user eyeball formatting in a browser without opening the docx — docx and PDF remain canonical for submission. Run generation after tracker state is saved so rendering failure does not block the application record.

Handle failures:

- **Content validation failure:** fix unresolved placeholders, comments, `[ASK:]`, `[VERIFY:]`, or `year TBD` internally and rerun. Ask the user only when the blocker requires a missing fact.
- **Infrastructure/rendering failure:** report the failed file and exact rerun command.

If LibreOffice is missing but `.docx` files are written, treat the run as successful and report only that PDF conversion was skipped.

### 9. Summary and post-run prompt

Report:

- Files written.
- Key changes and why.
- Alignment strengths.
- Any remaining manual review notes.
- The tracker row for this application.

Then ask:

> Did you submit this application? If so, I can update the status to `applied`.

If the user confirms, upsert `applications.md` with `status: applied` and `updated: {today ISO}`. Only the user can trigger this transition.

## Cover-Letter-Only Mode

When invoked by the `cover-letter` skill or when the user explicitly asks for only a cover letter:

- Still select and read the source work document for evidence.
- Still run claim verification before save.
- Save only `my-documents/applications/{id}/coverletter.md` for a specific role, or `my-documents/coverletter.md` only when building a source letter for a tightly defined lane.
- Do not generate a generic letter.

## Common Mistakes

- **Keyword stuffing.** Match terminology naturally; do not cram keywords.
- **Only changing the top section.** Tailoring means relevance ordering across the document.
- **Changing the source document.** This skill writes to `applications/` only.
- **Forcing CV into resume or resume into CV.** Preserve the selected source format.
- **Tightening inference beyond evidence.** If the source states facts separately, do not assert a new connection unless the user confirms it.
