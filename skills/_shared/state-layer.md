# State Layer Contract

Single source of truth for the `my-documents/` state layer. All skills that read or write `applications.md`, `reports/`, `story-bank.md`, or work-document versions MUST follow these rules.

**Not a skill.** The `_shared/` prefix and missing frontmatter prevent Claude from auto-activating this file.

## 1. File Layout

```text
my-documents/
|- resume.md              # source work document in resume format
|- cv.md                  # source work document in CV format
|- coverletter.md         # source letter, optional until enough specificity exists
|- applications.md        # tracker: flat table + optional ## Notes
|- story-bank.md          # STAR+R stories used as interview and claim evidence
|- applications/          # artifacts sent to employers
|  `- {id}/
|     |- resume.md        # tailored work document when source/output format is resume
|     |- cv.md            # tailored work document when source/output format is CV
|     |- coverletter.md
|     |- interview-prep.md
|     |- interview-log.md
|     `- *.pdf
|- reports/               # evaluations, flat, read-only after creation
|  `- {###}-{slug}-{YYYY-MM-DD}.md
`- proof-assets/          # reusable case studies
   `- {slug}.md
```

`resume.md` and `cv.md` are format variants of the same work-document concept, not separate product lines. Every resume-oriented skill must be able to work with either format. If only one exists, use it. If both exist and the user, role, or region does not make the choice clear, ask which work document to use.

## 2. First-Run Scaffolding

If any of the following are missing when a skill needs them, the skill runs `node scripts/scaffold-state.mjs` once before proceeding. The script is idempotent: safe to call repeatedly and never overwrites existing files.

Scaffolded paths:

| Path | Purpose |
|------|---------|
| `my-documents/` with `.gitkeep` | Root |
| `my-documents/applications/` with `.gitkeep` | Tailored artifacts |
| `my-documents/reports/` with `.gitkeep` | Evaluations from skill runs |
| `my-documents/proof-assets/` with `.gitkeep` | Reusable case studies |
| `my-documents/applications.md` | Empty-table tracker |
| `my-documents/story-bank.md` | Empty STAR+R story-bank scaffold |

Skills should not duplicate scaffolding logic inline.

## 3. `applications.md` Schema

**Empty-table template** used for first-run scaffolding:

```markdown
# Applications

| id | company | role | status | comp_expected | source | next_action_date | updated | link |
|----|---------|------|--------|---------------|--------|------------------|---------|------|

## Notes
```

**Columns:**

| Column | Format | Notes |
| --- | --- | --- |
| `id` | `{company}-{role}` kebab-case | Must match `applications/{id}/` folder. |
| `company` | Display name | Human-readable. |
| `role` | Display name | Human-readable. |
| `status` | Enum | Lowercase, from the six allowed values. |
| `comp_expected` | Free text or `-` | What the user has told the employer — recruiter call, application form, or screen. Keeps their stated number consistent across touchpoints so they don't contradict themselves later. Examples: `$140-160k`, `£70k`, `OTE $200k`, `-`. |
| `source` | Enum or `-` | One of `referral`, `board`, `cold`, `recruiter`, `watch`, or `-`. Where the lead came from. |
| `next_action_date` | ISO `YYYY-MM-DD` or `-` | When the user plans the next concrete action (follow-up, prep, deadline). |
| `updated` | ISO `YYYY-MM-DD` | Update whenever status changes. |
| `link` | URL or `-` | `-` if the posting is gone. |

**Parsing rules:**

1. Parse the first markdown table in the file with a standard table parser or a table regex covering header, separator, and data rows.
2. Sort rows by `updated` descending when writing.
3. Empty table means header + separator and no data rows. Handle gracefully.
4. Malformed table means report the parse error and exit. Never overwrite a table you cannot parse.
5. Preserve the `## Notes` section and anything after it verbatim when rewriting the table.
6. **Back-compat:** if the table header is missing one or more of `comp_expected`, `source`, or `next_action_date`, treat the missing columns as `-` for every row and continue. Do not error.
7. **Unknown columns are preserved.** If the existing header has a column the schema does not list (user-added), keep that column and its values intact when rewriting. Append schema columns the table is missing in canonical order before `updated`.

**Upsert rules:**

- **Lookup key:** the `id` column.
- **Insert:** new row, `updated` = today in ISO format. Set `comp_expected`, `source`, `next_action_date` from caller context where known; otherwise `-`.
- **Update:** set the specified fields. Update `updated` only when `status` changes, not on cosmetic edits.
- **Status advancement only:** skills may only advance status forward along the enum order. Never regress. If a skill's logical result would regress status, leave the existing value untouched and warn the user.
- **Schema upgrade on write:** when writing a table that was read with missing columns (back-compat case 6), emit the full schema header and fill the missing-column cells with `-` for every existing row. The next read of the file then sees the canonical schema.

## 4. Status Enum

Six values, in lifecycle order:

1. `saved` - vetted, intending to apply, not yet submitted
2. `applied` - materials submitted
3. `interviewing` - at least one interview scheduled or completed
4. `offer` - offer in hand
5. `closed` - terminal non-offer: rejected, withdrawn, ghosted, or collapsed
6. `hired` - terminal positive

`saved` means the user has researched or prepared the opportunity and may apply, but has not submitted yet.

**Direct-to-`interviewing` creation is allowed.** `interviewing` and `interview-coach` may create a row directly at `status: interviewing` for interviews scheduled before the user started using the tracker. This is row creation, not status regression.

## 5. Reports Convention

**Filename format:** `{###}-{slug}-{YYYY-MM-DD}.md`

- `{###}` - zero-padded global counter. Width grows naturally past `999`.
- `{slug}` - kebab-case descriptor. Includes the company for company-specific reports, plus the skill type. Examples: `buffer-research`, `zapier-interview-prep`, `resume-audit`, `linkedin-audit`, `claim-check`.
- `{YYYY-MM-DD}` - ISO date of generation.

**Next-number algorithm:**

1. List `my-documents/reports/`.
2. Filter to files matching `^\d{3,}-.*\.md$`.
3. Extract the numeric prefix from each and parse as integer.
4. `next = max(numbers) + 1` if any match, else `1`.
5. Zero-pad to at least 3 digits.

**Required frontmatter** for every report:

```yaml
---
report_id: 007
company: Buffer
role: Content Marketing Manager
application_id: buffer-content-marketing-manager
skill: company-research
date: 2026-04-08
summary: One-line takeaway for at-a-glance scanning.
---
```

Use `company: null`, `role: null`, or `application_id: null` when a field does not apply. `application_id` is the load-bearing link to `applications.md`; set it whenever the report is about a tracked application. Do not use `id` for application slugs in report frontmatter.

**Read-only after creation.** Re-runs create a new numbered report, never edit the old one.

**Flat directory.** No subfolders until someone has 500+ reports.

## 6. Work Document Frontmatter and Selection

Both `resume.md` and `cv.md` use the same frontmatter shape:

```yaml
---
version: 3
updated: 2026-04-08
label: resume
---
```

- `version` - integer, incremented by `resume-builder` on any non-trivial change to that file.
- `updated` - ISO date of the last version bump.
- `label` - the user's preferred word in user-facing prose, such as `resume` or `CV`.
- Only `resume-builder` bumps `version`. Audit, tailor, interview, claim-check, LinkedIn, and proof-asset skills are read-only against source work documents unless the user explicitly asks to rebuild/update.
- If both `resume.md` and `cv.md` exist, they version independently because they are separate files. Skills still treat them as work-document format variants and choose the relevant one for the task.

**Selection rule:**

1. If the user names a format, use that file.
2. If the role region or posting clearly implies a format, use the matching file when it exists.
3. If only one source work document exists, use it.
4. If both exist and the choice is ambiguous, ask which one to use.
5. If neither exists, offer `resume-builder` first or proceed on pasted input with limited evidence checking.

**Vocabulary rule:**

Any skill that references a source work document in user-facing prose MUST use the `label` field from its frontmatter. If the field is missing, fall back to filename-based defaults: `resume.md` -> `resume`, `cv.md` -> `CV`.

**Capture rule for `resume-builder`:**

`resume-builder` sets `label` on first save and preserves it on rebuild/update. Use the word the user has been using in conversation. If ambiguous, default from filename: `cv.md` -> `CV`, `resume.md` -> `resume`.

**Tailored work-document frontmatter:**

```yaml
---
source_document: my-documents/resume.md
source_version: 3
source_label: resume
tailored_date: 2026-04-08
application_id: buffer-content-marketing-manager
---
```

`resume-tailor` writes this frontmatter to the tailored `resume.md` or `cv.md` in `applications/{id}/`. `claim-check` compares `source_version` to the current version of `source_document` to decide how deep to scan. Legacy tailored files with `derived_from_version` but no `source_version` are still valid; treat `derived_from_version` as `source_version` and infer `source_document` from the filename.

## 7. Story Bank Schema

`my-documents/story-bank.md` holds reusable STAR+R stories. The scaffold contains instructions only, not fake example stories. Real stories are H2 sections with a fenced YAML block immediately under the title, followed by the five STAR+R fields.

````markdown
# Story Bank

STAR+R stories for behavioral interviews and claim evidence. Add one H2 section per story.

<!--
Schema - one section per story:
-->

## {Short memorable title}

```yaml
id: {kebab-case-slug}
themes: [leadership, delivery, conflict, failure-learning, scope, stakeholder, crisis, ambiguity]
archetypes: [technical-leadership, scope-negotiation, cross-functional, turnaround, mentorship]
created: YYYY-MM-DD
usage: []
```

**Situation:** Where and when. One or two sentences of context.

**Task:** What you were responsible for. Make the stakes visible.

**Action:** What you specifically did. First person, concrete verbs.

**Result:** Quantified outcome where possible; scope and qualitative impact where numbers are not available.

**Reflection:** What you would do differently, what you learned, or how this changed your approach.
````

Canonical themes: `leadership`, `delivery`, `conflict`, `failure-learning`, `scope`, `stakeholder`, `crisis`, `ambiguity`. Add new themes sparingly.

Treat story-bank parse failures the same way as `applications.md` parse failures: report the offending region and exit without overwriting.

## 8. Evidence Layer

Priority order:

1. Source work documents: `resume.md` and `cv.md`
2. `story-bank.md`
3. `proof-assets/*.md`
4. `reports/*.md`

Claims sourced from priority 1-3 are supported. A match only in reports is weaker and should be classified as unverifiable but plausible. A conflict with any higher-priority source is contradicted.

## 9. Dedup and Parse-Failure Rules

- **Dedup behavior:** warn, never block. Users can always proceed.
- **Parse failures:** report the error, show the offending region, and exit. Never overwrite a file the skill cannot parse cleanly.

## 10. Workspace Preflight

Skills that read or write `my-documents/` MUST verify the user is operating in their own bound local workspace before the first scaffold call or write. If this step is skipped, files can be written into the plugin install directory — invisible to the user, lost on the next session — which is exactly what happened to early Cowork testers.

**Applies to:** `get-started`, `resume-builder`, `resume-tailor`, `interviewing`, `interview-coach`, `company-research`, `linkedin-optimizer`, `proof-asset-creator`, `resume-auditor`, `cover-letter`, `claim-check`.

**Required sequence on first state-layer touch per session:**

1. Resolve where `my-documents/` would land — i.e. `process.cwd()` joined with `my-documents/`.
2. **Confirm the path with the user before scaffolding.** Show the resolved absolute path in plain language and wait for explicit acceptance. Do not scaffold first and announce afterwards — early testers had files land in unexpected places because confirmation came too late or not at all. Handle the user's response:
   - **Accepted** → proceed to step 3.
   - **Different subfolder under the same location** → adjust the target (e.g. `{cwd}/job-hunt-skills/` instead of `{cwd}/`), offer to create the subfolder, and warn that creating a new folder may require a permission prompt. Re-confirm before scaffolding.
   - **User has no folder yet / doesn't know what to pick** → guide them: in Cowork, the recovery path is Customize → Folders → pick a local folder, then restart the conversation; in Claude Code, exit and re-launch `claude` from the desired folder. Do NOT scaffold a "best guess" location on their behalf.
   - **Path looks like a plugin install or system temp location** → treat as "no folder yet" and instruct as above.
3. Run `node scripts/scaffold-state.mjs`. The script enforces the same preflight in code: it exits with a non-zero status and a Cowork/Claude-Code-specific message when the working directory looks like the plugin install dir rather than a user workspace.
4. If the scaffolder exits non-zero with the workspace-binding message, **surface the message verbatim to the user and stop**. Do not retry, do not silently fall back to in-context writes, and do not generate documents that have nowhere to be saved. The recovery path is user-side: bind a folder in Cowork, or `cd` into a workspace before launching Claude Code.
5. **Fallback when the Node script cannot run** (Node not installed, no shell access, command not found, non-zero exit for any reason *other* than the workspace-binding refusal): scaffold manually using native file tools. Cowork users are typically not developers; Node is not a safe prerequisite. The structure to create is fixed and small:
   - Directories: `my-documents/`, `my-documents/applications/`, `my-documents/reports/`, `my-documents/proof-assets/`. Each gets an empty `.gitkeep`.
   - Files: `my-documents/applications.md` with the empty-table template from §3; `my-documents/story-bank.md` with the schema-only scaffold from §7.
   - Do not invent example rows or example stories — both files are intentionally empty/instructional on first scaffold.
   The fallback is not a workaround — it produces the same on-disk state as the script. Skills must not branch behavior based on which path was used.
6. **Verify the scaffold before any downstream write.** After running the script or fallback, confirm the four directories and two markdown files actually exist at the resolved path. If any are missing, create them. A skill that proceeds to write a resume, report, or tracker row into an unscaffolded workspace is the failure mode that left an early tester's resume floating in chat — verification is what makes the gate enforceable, not assumed.
7. Subsequent skills in the same session may skip the path confirmation but MUST still run the verification check in step 6 before their first write. Verification is cheap (a directory listing); silently writing into a half-scaffolded tree is not.

**Novice vocabulary:** when surfacing this to a user, prefer "folder" over "directory", "where your files live on your computer" over "working directory" or "cwd". Show the actual absolute path so the user can recognize it (e.g. `C:\Users\you\Documents\job-hunt\`).

**Pre-existing source documents:** when a downstream skill (e.g. `resume-tailor`) cannot find an expected source like `my-documents/resume.md`, distinguish two failure modes before recovering:

- `my-documents/` does not exist or is empty → workspace likely not bound. Run the preflight; do not offer `resume-builder` until the workspace is confirmed.
- `my-documents/` exists with other files but the source work document is missing → offer `resume-builder` or `get-started`.

Conflating these two cases caused testers to rebuild from scratch when their actual file was sitting in the plugin dir from a prior unbound run.
