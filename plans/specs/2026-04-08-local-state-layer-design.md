# Local State Layer Design

**Issue:** [Remotivated/job-hunt-os#1](https://github.com/Remotivated/job-hunt-os/issues/1)
**Status:** Approved — ready for implementation plan
**Date:** 2026-04-08

## Problem

Every skill in `job-hunt-os` is currently stateless. A `resume-tailor` run has no memory of prior tailored versions for the same role, `company-radar` can't dedupe against companies the user already vetted, and `interview-coach` can't build on prior prep sessions. Each session is ephemeral, so the value of the toolkit doesn't compound over time.

Inspired by [santifer/career-ops](https://github.com/santifer/career-ops), which uses `data/applications.md` + a `reports/` archive to turn an AI-assisted job search into a compounding pipeline. Their approach saves every evaluation as a numbered, slugged, dated report and registers every touched company in a tracker that skills can query.

This spec designs the equivalent layer for `job-hunt-os`.

## Goals

1. **Compounding value.** Each skill run builds on prior runs instead of starting from zero.
2. **Hand-editable.** A user with a text editor can read, edit, and understand every file without running a skill.
3. **Hallucination-resistant.** When AI-tailored resumes drift from reality, the drift is detectable and correctable.
4. **Ship-ready this week.** No dependencies on unshipped infrastructure (no public API, no external services).

## Non-Goals

- Sync to the in-app Remotivated tracker (deferred — the app has no public API yet).
- A UI layer over the markdown files (the markdown *is* the UI).
- Populating `story-bank.md` with content (deferred to issue #2).
- Automatic status transitions beyond `saved` (every other transition stays user-driven).

---

## Design

### 1. File Layout

```
my-documents/
├── resume.md                          # canonical (existing)
├── coverletter.md                     # canonical (existing)
├── applications.md                    # NEW: tracker (index model)
├── story-bank.md                      # NEW: placeholder, filled by issue #2
├── applications/                      # artifacts you'd send
│   └── {id}/
│       ├── resume.md                  # tailored
│       ├── coverletter.md             # tailored
│       └── *.pdf                      # generated
├── reports/                           # NEW: evaluations and research (flat)
│   ├── 001-buffer-vetting-2026-04-08.md
│   ├── 002-resume-audit-2026-04-09.md
│   └── ...
└── proof-assets/                      # NEW: reusable case studies
    └── {slug}.md
```

Four directories, each with one purpose:

- **Root canonicals** (`resume.md`, `coverletter.md`) — sacred, never modified by per-application skills.
- **`applications/`** — per-role artifacts the user submits to employers. Organized by `{company-slug}-{role-slug}` folder.
- **`reports/`** — evaluations and research, flat structure, global counter, read-only after creation.
- **`proof-assets/`** — reusable case studies and portfolio evidence that live across applications.

The entire `my-documents/` tree is gitignored, so this also provides the user-layer / system-layer separation without an explicit data contract: skills and templates live in `.claude/` and `templates/` (system, version-controlled), everything the user owns lives in `my-documents/` (user, local).

### 2. `applications.md` Schema

**Model:** Index — a flat table where each row is one application. Chosen over a worklog (append-only journal) or hybrid because skills need O(1) dedup queries and humans need at-a-glance status scanning.

**Format:** GitHub-flavored markdown table at the top of the file, followed by an optional `## Notes` section for freeform text.

```markdown
# Applications

| id                               | company    | role                       | status       | updated    | link                             |
|----------------------------------|------------|----------------------------|--------------|------------|----------------------------------|
| buffer-content-marketing-manager | Buffer     | Content Marketing Manager  | applied      | 2026-04-08 | https://buffer.com/careers/...   |
| zapier-senior-pm                 | Zapier     | Senior Product Manager     | interviewing | 2026-04-10 | https://zapier.com/jobs/...      |
| automattic-developer-advocate    | Automattic | Developer Advocate         | closed       | 2026-03-28 | -                                |

## Notes

Freeform section for things that don't fit the table.
```

**Columns:**

| Column    | Format              | Description                                                     |
|-----------|---------------------|-----------------------------------------------------------------|
| `id`      | `{company}-{role}` kebab-case | Canonical slug. Matches `applications/{id}/` folder. Future sync key. |
| `company` | Display name        | Human-readable, e.g. `Buffer`.                                  |
| `role`    | Display name        | Human-readable, e.g. `Content Marketing Manager`.               |
| `status`  | Enum (see below)    | Current lifecycle state.                                        |
| `updated` | `YYYY-MM-DD` ISO    | Date of the most recent status change. No other formats.       |
| `link`    | URL or `-`          | Job posting URL. `-` if removed or unavailable.                 |

**Status enum** (6 values, lifecycle order):

1. `saved` — vetted and intending to apply, but not yet applied
2. `applied` — materials submitted
3. `interviewing` — at least one interview scheduled or completed
4. `offer` — offer in hand
5. `closed` — terminal non-offer (rejected, withdrawn, or ghosted)
6. `hired` — terminal positive

The `saved` value mirrors the vocabulary of the in-app Remotivated tracker, which simplifies a future one-way sync (repo → app). `rejected` / `withdrawn` / `ghosted` are intentionally collapsed into `closed`; the distinction rarely drives skill behavior and can be captured in a report if it matters.

**Explicitly excluded columns** (and reasons):

- `date_added` — redundant with `updated`.
- `date_applied` — implied by `status=applied` + `updated`. Status transitions carry the date.
- `source`, `notes` — one more column to forget; notes belong in reports or the per-application folder.
- `folder` — derivable from `id`.

**Parsing contract:**

- Skills parse `applications.md` with a markdown table regex.
- Rows are sorted by `updated` descending (newest first) when skills write. A user editing by hand doesn't need to maintain sort; the next skill run re-sorts.
- Empty table = header row + separator only. Skills handle this gracefully.
- If parsing fails (malformed table), the skill reports the parse error and exits rather than overwriting. This means the file must stay a valid markdown table — a constraint accepted for the human-editability win.

### 3. `reports/` Convention

**Filename format:** `{###}-{slug}-{YYYY-MM-DD}.md`

- `{###}` — zero-padded global counter (`001`, `002`, ..., `999`, `1000`). Width grows naturally.
- `{slug}` — short descriptor, kebab-case. Includes the company for company-specific reports, plus the skill type. Examples: `buffer-vetting`, `zapier-interview-prep`, `resume-audit`.
- `{YYYY-MM-DD}` — date the report was generated.

**Examples:**

```
001-buffer-vetting-2026-04-08.md
002-resume-audit-2026-04-09.md
003-zapier-vetting-2026-04-10.md
004-zapier-interview-prep-2026-04-15.md
005-resume-drift-check-2026-04-20.md
```

**Next-number algorithm:** Skills read `ls reports/`, extract the highest `###` prefix, add 1. Zero reports → start at `001`.

**Frontmatter** (required on every report):

```yaml
---
id: 007
company: Buffer                                  # null for canonical-only reports
role: Content Marketing Manager                  # null if not role-specific
application_id: buffer-content-marketing-manager # null if no tracked application
skill: company-radar                             # which skill produced this
date: 2026-04-08
summary: One-line takeaway for at-a-glance scanning.
---
```

**The `application_id` field is the load-bearing link between `applications.md` and `reports/`.** When a skill runs for a specific application, it sets `application_id` so future queries ("show me all reports for Buffer's CMM role") are trivial.

**Body:** Whatever the skill wants to write. No constraints beyond the frontmatter.

**Read-only after creation.** If a skill re-runs for the same company, it creates a *new* numbered report — not an edit of the old one. This preserves history without clobbering.

**Directory structure:** Flat. No nesting by year until the user has 500+ reports (years away, YAGNI).

### 4. Skill Integration Matrix

Each existing skill gets a defined contract. Plus one new skill: `resume-drift-check`.

#### `company-radar` (vets remote culture)

- **Before running:** Read `applications.md`. If company already exists, prompt: *"You vetted Buffer on 2026-03-14 — report 012. Re-run, or open that?"*
- **After running:** Write report to `reports/{###}-{company-slug}-vetting-{date}.md`. If the verdict is positive and no row exists, upsert `applications.md` with `status: saved`. If a row already exists, leave status alone.

#### `resume-tailor` (customizes resume for a specific role)

- **Before running:** Read `applications.md`. If a row exists for this company+role, warn: *"You have a tailored resume for this role. Iterate on the existing version, or create a new one?"*
- **Claim verification:** Before saving, every added/rewritten bullet is verified against the evidence layer (canonical + reports + story-bank + proof-assets). Unsupported claims are flagged inline with `[VERIFY: ...]` markers for the user to confirm or correct.
- **After running:** Write artifacts to `applications/{id}/resume.md` and `applications/{id}/coverletter.md` (unchanged from current behavior). Write a report stub to `reports/{###}-{slug}-tailor-{date}.md` summarizing the angle and any flagged gaps. Upsert `applications.md` with `status: saved`.
- **Post-run prompt:** Surface the tracker row and ask: *"Did you submit this application? If so, I can update the status to `applied`."*

#### `resume-auditor` (critical feedback on canonical resume)

- No application context. Writes `reports/{###}-resume-audit-{date}.md`. Does not touch `applications.md`.

#### `interview-coach` (interview prep brief)

- **Before running:** Read `applications.md`. If no row exists for this company, warn (do not block): *"I don't see a tracked application for Buffer. Interview prep still works — want me to create a tracker row with `status: interviewing`, or skip the tracker?"* (Rationale: users may have interviews for applications submitted before they started using the tracker.)
- **After running:** Write `reports/{###}-{slug}-interview-prep-{date}.md`. If the user confirmed tracker creation, upsert row with `status: interviewing`.

#### `proof-asset-creator` (case studies, portfolios)

- Writes `my-documents/proof-assets/{slug}.md`. No report, no tracker touch. Proof assets are reusable evidence, not application artifacts, so they don't belong in `reports/` or `applications/`.

#### `linkedin-optimizer` (profile audit)

- Writes `reports/{###}-linkedin-audit-{date}.md`. No tracker touch.

#### `resume-builder` (builds canonical from scratch)

- Writes canonical `my-documents/resume.md` and `my-documents/coverletter.md` with frontmatter (see Section 5). No reports, no tracker touch.

#### NEW: `resume-drift-check` (hallucination detector)

- **Purpose:** Detect and classify claims in tailored resumes that aren't supported by the evidence layer. Not a staleness check — a fabrication check.
- **When to run:** Manually, after editing the canonical or before submitting applications. Also runs embedded inside `resume-tailor` before saving.
- **Inputs:**
  - Canonical `resume.md`
  - All `applications/{id}/resume.md` files
  - Evidence layer: `story-bank.md`, `proof-assets/`, `reports/`
- **Algorithm (rough):**
  - For each tailored resume, extract every quantitative claim and every named project/outcome.
  - For each claim, search the evidence layer.
  - Classify:
    - **Supported** — hit in canonical, story-bank, or proof-assets (priority sources 1–3).
    - **Unverifiable but plausible** — hit only in reports (lower-trust source 4).
    - **Unverifiable** — no hit anywhere.
    - **Contradicted** — actively conflicts with an evidence source (e.g., "team of 8" vs canonical's "team of 4").
- **Output:** `reports/{###}-resume-drift-check-{date}.md` summarizing findings per application.
- **User action:** For each flagged claim, the skill offers: **confirm** (it's real, will update canonical or story-bank), **adjust** (the wording needs correction), **replace** (remove it entirely).
- **v1 degradation:** Until `story-bank.md` has content (issue #2), the skill runs with canonical + proof-assets + reports only. Still catches obvious fabrications. Gets stronger once stories land.

#### Shared rules across all skills

- **Dedup behavior:** Warn, never block. The user can always proceed.
- **Status transitions:** Skills only *advance* status, never regress. `saved → applied` remains manual (via the `resume-tailor` post-run prompt or direct edit). No skill auto-transitions to `interviewing`, `offer`, `closed`, or `hired` without explicit user confirmation.
- **Parse failures:** If `applications.md` can't be parsed, the skill reports the error and exits rather than overwriting.

### 5. Canonical Resume Frontmatter and Evidence Layer

**Canonical `resume.md` gets frontmatter:**

```yaml
---
version: 3
updated: 2026-04-08
---
```

- `version` — integer, incremented by `resume-builder` (and `resume-auditor` when it rewrites) on any non-trivial change.
- `updated` — ISO date of the last bump.

**Tailored resumes record their source version:**

```yaml
---
derived_from_version: 3
tailored_date: 2026-04-08
application_id: buffer-content-marketing-manager
---
```

This makes drift detection trivial: `resume-drift-check` compares `derived_from_version` against the current canonical `version`. If current is higher, the tailored file is potentially stale and gets a deeper scan.

**Evidence layer (priority order):**

1. **Canonical `resume.md`** — highest trust. Claims sourced here are automatically accepted.
2. **`story-bank.md`** — STAR-formatted stories with specifics (numbers, dates, context). Once populated by issue #2, this becomes the richest evidence source.
3. **`proof-assets/*.md`** — user-authored case studies. Claims sourced here are the most concrete.
4. **`reports/*.md`** — lowest priority. Useful for catching self-references the user made in prior sessions (e.g., "I mentioned in my Buffer interview prep that I ran the distributed team migration").

**Verification is a prompt, not a verdict.** The classification isn't perfect — the skill's output is a starting point for the user to review, not a final arbiter of truth.

### 6. Scope Boundaries

**In scope for issue #1:**

1. Create `my-documents/applications.md` with the Section 2 schema (empty table + header).
2. Create `my-documents/reports/` directory with `.gitkeep`.
3. Create `my-documents/proof-assets/` directory with `.gitkeep`.
4. Create `my-documents/story-bank.md` as a placeholder with a documented schema comment.
5. Update `resume-builder` to write canonical `resume.md` with `version: 1` frontmatter.
6. Update `company-radar`, `resume-tailor`, `resume-auditor`, `interview-coach`, `proof-asset-creator`, `linkedin-optimizer` per Section 4.
7. Create the new `resume-drift-check` skill per Section 5.
8. Update `README.md` and `GETTING-STARTED.md` to document the state layer.
9. Verify `.gitignore` covers `my-documents/`.

**Out of scope (deferred):**

- Populating `story-bank.md` with actual stories → issue #2.
- Sync to the Remotivated app → blocked on public API work.
- PDF export changes, portal scanner → separate issues.
- UI view of `applications.md` → the markdown table is the UI.

## Design Decisions (Log)

| Decision                                                             | Chose           | Alternatives considered                                         | Why                                                                                               |
|----------------------------------------------------------------------|-----------------|-----------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `applications.md` structure                                          | Index (table)   | Worklog (journal), Hybrid (table + journal)                     | Skills need O(1) dedup; humans need at-a-glance status scanning.                                  |
| `applications/` vs `reports/` separation                             | Two directories | Collapse into `reports/`, or put reports inside application folders | Artifacts (sent to employers) and evaluations (for the user) have different audiences and lifecycles. |
| Sync to in-app Remotivated tracker                                   | No, for v1      | One-way sync (repo → app), two-way sync                         | In-app tracker has no public API. Design schema so one-way sync is possible later.                |
| Status enum granularity                                              | 6 values        | 8+ values (separate `rejected`, `withdrawn`, `ghosted`)         | Distinction rarely drives skill behavior; detail goes in the report if it matters.                |
| `saved` as the initial status                                        | Yes             | `researching`                                                   | Mirrors in-app tracker vocabulary; simplifies future sync.                                        |
| Report numbering                                                     | Global counter  | Date-prefixed, slug-only with `-N` suffix                        | Short canonical IDs ("report 42"); matches career-ops; single-user = no parallel-run collisions.  |
| Dedup behavior                                                       | Warn, don't block | Hard block with `--force` flag                                 | Interactive CLI tool; users need escape hatches.                                                  |
| `resume-drift-check` vs `cv-sync-check`                              | Named `resume-drift-check` | `cv-sync-check`                                          | "CV" is technically a different document; focus is hallucination detection, not staleness.       |
| Hallucination check: standalone skill, embedded in tailor, or both   | Both            | Standalone only, embedded only                                  | Embedded catches drift at tailor time; standalone catches drift after canonical edits.            |
| `proof-assets/` as a fourth top-level directory                      | Yes             | Nest inside `applications/` or `reports/`                       | Proof assets are reusable across applications; they belong in neither of the other trees.         |
| Status auto-advancement by skills                                    | No (manual)     | Auto-advance to `applied` on tailor, etc.                       | Tailoring doesn't mean submitting. Only the user knows when they actually applied.                |

## Open Questions

None at this time. The design is complete and approved. Implementation plan to follow.

## References

- [santifer/career-ops](https://github.com/santifer/career-ops) — inspiration for the state layer pattern.
- [Remotivated/job-hunt-os#1](https://github.com/Remotivated/job-hunt-os/issues/1) — the issue this spec resolves.
- `.claude/skills/resume-tailor/SKILL.md` — existing skill this spec modifies.
