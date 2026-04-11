# State Layer Contract

Single source of truth for the `my-documents/` state layer. All skills that read or write `applications.md`, `reports/`, `story-bank.md`, or the canonical resume version MUST follow these rules.

**Not a skill.** The `_shared/` prefix and missing frontmatter prevent Claude from auto-activating this file.

## 1. File Layout

```
my-documents/
├── resume.md              # canonical (frontmatter: version, updated)
├── coverletter.md         # canonical
├── applications.md        # tracker (flat table + optional ## Notes)
├── story-bank.md          # STAR+R stories (read by interview-coach, resume-tailor, resume-drift-check)
├── applications/          # artifacts sent to employers
│   └── {id}/
│       ├── resume.md      # tailored (frontmatter: derived_from_version, tailored_date, application_id)
│       ├── coverletter.md
│       └── *.pdf
├── reports/               # evaluations, flat, read-only after creation
│   └── {###}-{slug}-{YYYY-MM-DD}.md
└── proof-assets/          # reusable case studies
    └── {slug}.md
```

## 2. First-Run Scaffolding

If any of the following are missing when a skill needs them, the skill runs `node scripts/scaffold-state.mjs` once before proceeding. The script is idempotent — safe to call repeatedly, never overwrites existing files.

Scaffolded paths:

| Path | Purpose |
|------|---------|
| `my-documents/` (with `.gitkeep`) | Root |
| `my-documents/applications/` (with `.gitkeep`) | Tailored artifacts |
| `my-documents/reports/` (with `.gitkeep`) | Evaluations from skill runs |
| `my-documents/proof-assets/` (with `.gitkeep`) | Reusable case studies |
| `my-documents/applications.md` | Empty-table tracker (see §3) |
| `my-documents/story-bank.md` | STAR+R schema scaffold (see §7) |

Skills should not duplicate the scaffolding logic inline.

## 3. `applications.md` Schema

**Empty-table template** (used for first-run scaffolding):

```markdown
# Applications

| id | company | role | status | updated | link |
|----|---------|------|--------|---------|------|

## Notes
```

**Columns:**

| Column    | Format                         | Notes                                                       |
|-----------|--------------------------------|-------------------------------------------------------------|
| `id`      | `{company}-{role}` kebab-case  | Must match `applications/{id}/` folder. Future sync key.    |
| `company` | Display name (`Buffer`)        | Human-readable.                                             |
| `role`    | Display name                   | Human-readable.                                             |
| `status`  | Enum (see §4)                  | Lowercase, from the six allowed values.                     |
| `updated` | ISO `YYYY-MM-DD`               | **No other formats.** Update whenever status changes.       |
| `link`    | URL or `-`                     | `-` if the posting is gone.                                 |

**Parsing rules:**

1. Parse the first markdown table in the file with a standard table regex (header row + separator + data rows).
2. Sort rows by `updated` descending when writing. Don't force users to maintain sort by hand.
3. Empty table = header + separator, no data rows. Handle gracefully.
4. **Malformed table → report the parse error and exit.** Never overwrite a table you can't parse.
5. Preserve the `## Notes` section (and anything after it) verbatim when rewriting the table.

**Upsert rules:**

- **Lookup key:** the `id` column.
- **Insert:** new row, `updated` = today (ISO).
- **Update:** set the specified fields. Update `updated` only when `status` changes (not on cosmetic edits).
- **Status advancement only:** skills may only advance status forward along the enum order. Never regress. If a skill's logical result would regress status, leave the existing value untouched and warn the user.

## 4. Status Enum

Six values, in lifecycle order:

1. `saved` — vetted, intending to apply, not yet submitted
2. `applied` — materials submitted
3. `interviewing` — at least one interview scheduled or completed
4. `offer` — offer in hand
5. `closed` — terminal non-offer (rejected, withdrawn, or ghosted, collapsed)
6. `hired` — terminal positive

`saved` mirrors the in-app Remotivated tracker vocabulary for future sync alignment.

**Direct-to-`interviewing` creation is allowed.** Only `interview-coach` may create a row directly at `status: interviewing` (for interviews scheduled before the user started using the tracker). This is a row *creation*, not a status regression, so it doesn't violate the "advance only" rule.

## 5. `reports/` Convention

**Filename format:** `{###}-{slug}-{YYYY-MM-DD}.md`

- `{###}` — zero-padded global counter. Width grows naturally past `999`.
- `{slug}` — kebab-case descriptor. Includes the company for company-specific reports, plus the skill type. Examples: `buffer-vetting`, `zapier-interview-prep`, `resume-audit`, `linkedin-audit`, `resume-drift-check`.
- `{YYYY-MM-DD}` — ISO date of generation.

**Next-number algorithm:**

1. `ls my-documents/reports/`
2. Filter to files matching the regex `^\d{3,}-.*\.md$` (ignores `.gitkeep`, `README.md`, and any user-dropped notes).
3. Extract the numeric prefix from each, parse as integer.
4. `next = max(numbers) + 1` if any match, else `1`.
5. Zero-pad to at least 3 digits.

**Required frontmatter** (every report):

```yaml
---
id: 007
company: Buffer                                  # null if no company
role: Content Marketing Manager                  # null if not role-specific
application_id: buffer-content-marketing-manager # null if no tracked application
skill: company-radar                             # which skill produced this
date: 2026-04-08
summary: One-line takeaway for at-a-glance scanning.
---
```

`application_id` is the load-bearing link to `applications.md`. Set it whenever the report is about a tracked application.

**Read-only after creation.** Re-runs create a *new* numbered report, never edit the old one.

**Flat directory.** No subfolders until someone has 500+ reports.

## 6. Canonical Resume Frontmatter

```yaml
---
version: 3
updated: 2026-04-08
---
```

- `version` — integer, incremented by `resume-builder` on any non-trivial change.
- `updated` — ISO date of the last bump.
- Only `resume-builder` bumps `version`. `resume-auditor` is read-only and MUST NOT write to the canonical.

**Tailored resume frontmatter:**

```yaml
---
derived_from_version: 3
tailored_date: 2026-04-08
application_id: buffer-content-marketing-manager
---
```

`resume-drift-check` compares `derived_from_version` to the current canonical `version` to decide how deep to scan.

## 7. Evidence Layer (priority order)

1. **Canonical `resume.md`** — highest trust. Claims sourced here are auto-accepted.
2. **`story-bank.md`** — STAR stories with specifics. Richest source once populated.
3. **`proof-assets/*.md`** — user-authored case studies. Most concrete.
4. **`reports/*.md`** — lowest priority. Catches self-references from prior sessions.

Any claim in a tailored resume that has no match in sources 1–3 is classified as **unverifiable**. A match only in source 4 is **unverifiable but plausible**. A conflict with any source is **contradicted**.

## 8. Dedup & Parse-Failure Rules

- **Dedup behavior:** warn, never block. Users can always proceed.
- **Parse failures:** report the error, show the offending region, exit. Never overwrite a file the skill can't parse cleanly.
