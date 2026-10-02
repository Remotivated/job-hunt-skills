# State Layer Contract

Single source of truth for the `my-documents/` state layer. All skills that read or write `applications.md`, `reports/`, `story-bank.md`, or work-document versions MUST follow these rules.

**Not a skill.** The `_shared/` prefix and missing frontmatter prevent Claude from auto-activating this file.

Content rules that apply to every skill — untrusted external content, truthful claims, retracted claims, research budget, and the user's voice — live in the companion [truth and content contract](truth-and-content.md).

## 0. Plugin and User Paths

Two path sets, disjoint by construction. `scripts/workspace.mjs` holds the same lists, and `scripts/test-state.mjs` fails if this section, that module, and the files tracked in the repository drift apart.

**Plugin-owned paths** — relative to `job_hunt_skills_root`. Read-only at runtime: skills read prompts, guides, templates, and scripts from here and never write job-search files here.

```text
.agents/
.claude/
.claude-plugin/
.codex-plugin/
.gitattributes
.github/
.gitignore
AGENTS.md
CHANGELOG.md
CLAUDE.md
CONTRIBUTING.md
GETTING-STARTED.md
LICENSE
README.md
assets/
examples/
guides/
package-lock.json
package.json
prompts/
scripts/
skills/
templates/
```

**User-owned paths** — relative to the confirmed user workspace. Only these paths hold job-search state, and only after the workspace preflight (§10) confirms the folder.

```text
my-documents/
my-documents/applications/
my-documents/applications.md
my-documents/coverletter.md
my-documents/cv.md
my-documents/proof-assets/
my-documents/reports/
my-documents/resume.md
my-documents/retracted-claims.md
my-documents/story-bank.md
```

- The user workspace is never the plugin root or a folder inside it, including through a symlink. `scaffold-state.mjs` and `state.mjs` both refuse with exit code 2 and the workspace-binding message in that case.
- Installing, updating, or removing the plugin changes plugin-owned paths only. Nothing under `my-documents/` is created, moved, or rewritten by an update.
- Skills write only under user-owned paths: the listed files, files inside the listed folders, and exported `.docx`, `.pdf`, and `.html` files next to their markdown source.
- The repository's own `my-documents/` holds only empty `.gitkeep` placeholders. User documents are never committed.
- The helper's lock folder (`my-documents/.state.lock/`) and `.tmp-*` files are transient and removed when a run ends.

## 1. File Layout

```text
my-documents/
|- resume.md              # source work document in resume format
|- cv.md                  # source work document in CV format
|- coverletter.md         # source letter, optional until enough specificity exists
|- applications.md        # tracker: flat table + optional ## Notes
|- story-bank.md          # STAR+R stories used as interview and claim evidence
|- retracted-claims.md    # claims the user withdrew; created on first retraction
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

## Bundled resource root

At skill activation, resolve `job_hunt_skills_root` from the active skill file, not from the shell working folder:

1. Start with the absolute path of the active `skills/{skill-name}/SKILL.md`.
2. Take its parent directory, then resolve `../..`.
3. The result is `job_hunt_skills_root`; verify it contains the `scripts`, `templates`, and `skills` directories.
4. Invoke bundled scripts with an absolute path such as `node "{job_hunt_skills_root}/scripts/scaffold-state.mjs"`.
5. Keep the command working folder set to the confirmed user workspace. This is what makes `process.cwd()` and relative `my-documents/` inputs resolve to the user's files rather than the installed plugin.

If the active skill path is unavailable or the resolved root does not contain the expected directories, do not guess an installation path. Use the documented native-file fallback for scaffolding and profile strength. For document export, produce markdown plus the browser preview with native file tools and explain that the bundled exporter could not be located.

## 2. First-Run Scaffolding

If any of the following are missing when a skill needs them, the skill runs `node "{job_hunt_skills_root}/scripts/scaffold-state.mjs"` once before proceeding. The script is idempotent: safe to call repeatedly and never overwrites existing files.

Scaffolded paths (`retracted-claims.md` is not scaffolded; it is created the first time the user retracts a claim, per the [truth and content contract](truth-and-content.md#3-retracted-claims)):

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

**Use the state helper for every tracker write when Node is available:**

```bash
node "{job_hunt_skills_root}/scripts/state.mjs" tracker upsert --id {id} --company "{Company}" --role "{Role}" [--status {status}] [--source {source}] [--comp-expected "{text}"] [--next-action-date {YYYY-MM-DD}] [--link {url}] [--user-confirmed]
```

It applies the rules below and in §12, writes atomically, and prints one JSON line. `node "{job_hunt_skills_root}/scripts/state.mjs" tracker check` validates the table without writing. When Node is unavailable, apply the same rules with native file tools (§12).

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
- **Status advancement only:** skills may only advance status forward along the enum order. Never regress. If a skill's logical result would regress status, leave the existing value untouched and warn the user. The allowed transitions are listed in §4.
- **The user confirms every status change.** Pass `--user-confirmed` only after the user said yes in this conversation; the helper refuses a status change, or a new row that starts after `saved`, without it.
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

**Documented transitions.** These are the only status moves a skill may make, and each one needs the user's confirmation in the conversation:

| From | May move to |
| --- | --- |
| *(new row)* | `saved` by default; `applied` or `interviewing` when the user confirms the application or interview already happened |
| `saved` | `applied`, `interviewing`, `offer`, `closed`, `hired` |
| `applied` | `interviewing`, `offer`, `closed`, `hired` |
| `interviewing` | `offer`, `closed`, `hired` |
| `offer` | `closed`, `hired` |
| `closed` | nothing — terminal |
| `hired` | nothing — terminal |

Setting a row to the status it already has is a no-op, not a transition. A new row cannot start at `offer`, `closed`, or `hired`: create it at `interviewing`, then advance it with the user's confirmation.

## 5. Reports Convention

**Filename format:** `{###}-{slug}-{YYYY-MM-DD}.md`

- `{###}` - zero-padded global counter. Width grows naturally past `999`.
- `{slug}` - kebab-case descriptor. Includes the company for company-specific reports, plus the skill type. Examples: `buffer-research`, `zapier-interview-prep`, `resume-audit`, `linkedin-audit`, `claim-check`.
- `{YYYY-MM-DD}` - ISO date of generation.

**Allocate the number and write the report in one step with the state helper when Node is available.** Put `report_id: {###}` (or omit it) in the frontmatter, then:

```bash
node "{job_hunt_skills_root}/scripts/state.mjs" report write --slug {slug} --file {draft path}
```

The draft can also arrive on stdin. The helper takes the workspace lock, allocates the next number, stamps `report_id`, and creates `{###}-{slug}-{YYYY-MM-DD}.md` exclusively, so two sessions can never share a number and an existing report is never overwritten. It prints the final path and `report_id`. Keep the draft outside `my-documents/reports/` (for example in the system temp folder) or pipe it on stdin. When Node is unavailable, use the native procedure in §12.

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

`retracted-claims.md` sits above this order as a negative record: a claim that matches a retracted entry is contradicted even when an older source document, story, or report still contains it. See the [truth and content contract](truth-and-content.md#3-retracted-claims).

## 9. Dedup and Parse-Failure Rules

- **Dedup behavior:** warn, never block. Users can always proceed.
- **Parse failures:** report the error, show the offending region, and exit. Never overwrite a file the skill cannot parse cleanly.

## 10. Workspace Preflight

Skills that read or write `my-documents/` MUST verify the user is operating in their own bound local workspace before the first scaffold call or write. If this step is skipped, files can be written into the plugin install directory — invisible to the user, lost on the next session.

**Applies to:** `get-started`, `resume-builder`, `resume-tailor`, `interviewing`, `interview-coach`, `company-research`, `linkedin-optimizer`, `proof-asset-creator`, `resume-auditor`, `cover-letter`, `claim-check`.

**Required sequence on first state-layer touch per session:**

1. Resolve where `my-documents/` would land — i.e. `process.cwd()` joined with `my-documents/`.
2. **Confirm the path with the user before scaffolding.** Show the resolved absolute path in plain language and wait for explicit acceptance. Do not scaffold first and announce afterwards: when confirmation comes late or not at all, files land where the user will not find them. Handle the user's response:
   - **Accepted** → proceed to step 3.
   - **Different subfolder under the same location** → adjust the target (e.g. `{cwd}/job-hunt-skills/` instead of `{cwd}/`), offer to create the subfolder, and warn that creating a new folder may require a permission prompt. Re-confirm before scaffolding.
   - **User has no folder yet / doesn't know what to pick** → guide them with the matching recovery path. Do NOT scaffold a "best guess" location on their behalf:
     - **Codex CLI/IDE:** close the current run if necessary, open a terminal or IDE workspace at the folder the user wants, and start Codex from that folder. Example: create `~/Documents/job-hunt`, `cd` into it, then run `codex`; in an IDE, open that folder as the workspace before starting the skill again.
     - **Desktop agents with folder controls (Codex in the ChatGPT desktop app, Work mode, or Cowork):** use the app's folder/workspace control to select a folder the user owns, then start a new conversation with that folder available. Use the current product label shown in the app; do not invent a settings-menu path that was not verified.
     - **Claude Code:** exit Claude Code, `cd` into the chosen folder, then run `claude` again.
   - **Path looks like a plugin install or system temp location** → treat as "no folder yet" and instruct as above.
3. Run `node "{job_hunt_skills_root}/scripts/scaffold-state.mjs"`. The script enforces the same preflight in code: it exits with a non-zero status and a surface-specific message when the working directory looks like the plugin install dir rather than a user workspace. `state.mjs` enforces the same check with the same message before any tracker or report write.
4. If the scaffolder exits non-zero with the workspace-binding message, **surface the message verbatim to the user and stop**. Do not retry, do not silently fall back to in-context writes, and do not generate documents that have nowhere to be saved. The recovery path is user-side: follow the matching Codex CLI/IDE, desktop agent, or Claude Code branch above.
5. **Fallback when the Node script cannot run** (Node not installed, no shell access, command not found, non-zero exit for any reason *other* than the workspace-binding refusal): scaffold manually using native file tools. Cowork users are typically not developers; Node is not a safe prerequisite. The structure to create is fixed and small:
   - Directories: `my-documents/`, `my-documents/applications/`, `my-documents/reports/`, `my-documents/proof-assets/`. Each gets an empty `.gitkeep`.
   - Files: `my-documents/applications.md` with the empty-table template from §3; `my-documents/story-bank.md` with the schema-only scaffold from §7.
   - Do not invent example rows or example stories — both files are intentionally empty/instructional on first scaffold.
   The fallback is not a workaround — it produces the same on-disk state as the script. Skills must not branch behavior based on which path was used.
6. **Verify the scaffold before any downstream write.** After running the script or fallback, confirm the four directories and two markdown files actually exist at the resolved path. If any are missing, create them. A skill that proceeds to write a resume, report, or tracker row into an unscaffolded workspace is the failure mode this gate exists to prevent — verification is what makes it enforceable, not assumed.
7. Subsequent skills in the same session may skip the path confirmation but MUST still run the verification check in step 6 before their first write. Verification is cheap (a directory listing); silently writing into a half-scaffolded tree is not.

**Novice vocabulary:** when surfacing this to a user, prefer "folder" over "directory", "where your files live on your computer" over "working directory" or "cwd". Show the actual absolute path so the user can recognize it (e.g. `C:\Users\you\Documents\job-hunt\`).

**Pre-existing source documents:** when a downstream skill (e.g. `resume-tailor`) cannot find an expected source like `my-documents/resume.md`, distinguish two failure modes before recovering:

- `my-documents/` does not exist or is empty → workspace likely not bound. Run the preflight; do not offer `resume-builder` until the workspace is confirmed.
- `my-documents/` exists with other files but the source work document is missing → offer `resume-builder` or `get-started`.

Conflating these two cases leads to rebuilding from scratch when the real file is sitting in the plugin dir from a prior unbound run.

## 11. Progress and Reward

A job search is long and demoralizing, and the compounding value of the state layer is invisible if nothing surfaces it. Every skill closes by showing the user the ground they just gained. This is not decoration — it is what keeps the search sustainable. The rules below keep it consistent and keep it honest.

**Reward depth and follow-through, never volume.** This product sells a *truthful* search. Progress signals celebrate evidence depth (stories banked, claims verified, proof assets) and momentum (applications advancing, next actions kept). Never invent urgency, never reward raw application count, never nudge toward spray-and-pray. A user who sends three well-evidenced applications is further ahead than one who sends thirty generic ones, and the framing must say so.

**Two closing beats.** Skills that touch `my-documents/` end their run with, in this order:

1. **What you just unlocked** — one sentence naming the concrete new capability this run earned, in terms of what the user can now *do*. Not "saved 3 files"; instead "these 3 stories now back claims in future tailors and feed interview prep." State the next capability, not the file count.
2. **Strength + next unlock** — the profile-strength line (below). Skip this beat only when the run did not change the state layer (a pure read, e.g. an audit with no save).

**Profile strength.** `node "{job_hunt_skills_root}/scripts/profile-strength.mjs"` prints `Profile strength: N/7 — <single highest-leverage next step>`. The score is a live checklist over the state layer — source work document, audited, story bank (≥3), a proof asset, a tailored application, a verified claim, a source cover letter — computed fresh each call with no stored state. `--json` returns the structured form for skills that render it themselves; `--pulse` returns the tracker momentum line instead. Prefer running the script. When Node is unavailable, derive the same line natively: count the seven signals present under `my-documents/` and name the first missing one as the next unlock, using the priority order the script encodes.

**Tracker pulse.** Any skill that writes `applications.md` prints the momentum line (`node "{job_hunt_skills_root}/scripts/profile-strength.mjs" --pulse`, or the native equivalent) after the write: in-flight count, interviewing count, and the nearest kept next action. The tracker is the user's scoreboard; surface it every time it changes. Frame it around progress and the next concrete action, never as pressure.

**Vocabulary.** Keep the internal terms out of user-facing prose (`state layer`, `signal`, `score` are fine internally; to the user say "your job-hunt profile", "what this unlocked", "where things stand"). Use the work document's `label` per §6 when naming it.

## 12. Validated Mutations: Helper and Native Fallback

`scripts/state.mjs` is the deterministic boundary for tracker and report writes. It is a capability upgrade, not a prerequisite: when Node cannot run, the skill applies the same numbered rules with native file tools. Both paths are held to one fixture set in `scripts/fixtures/state/`: `scripts/test-state.mjs` runs every fixture against the helper, and `scripts/test_skill_contracts.py` fails if a rule below has no fixture or a fixture names a rule that is not here.

**Helper exit codes.** The helper prints one JSON line and exits:

| Exit | Meaning | What the skill does |
| --- | --- | --- |
| `0` | Written, or `"action": "unchanged"` | Continue. Show any `warnings` to the user. |
| `2` | Workspace-binding refusal | Surface the message verbatim and stop, per §10 step 4. |
| `3` | Refused: parse error, invalid field, invalid transition, missing confirmation, or conflict. Nothing was written. | Show the `message` (and `region` for a parse error) to the user and stop that write. Do not retry the same write natively, and never hand-edit around a refusal. |
| `4` | Another session holds the workspace lock. Nothing was written. | Wait a moment and retry once; if it is still busy, tell the user. |
| `1` | Unexpected error | Report it. Fall back to the native path only after re-reading the file and confirming it parses under the rules below. |

Fall back to the native path when the helper cannot run at all: Node is missing, the command is not found, or there is no shell.

**Tracker read rules**

- **TR-1** The tracker is the first markdown table in `applications.md`. Everything before it and everything from the first non-table line after it (including `## Notes`) is preserved verbatim. A file with no table is malformed.
- **TR-2** The header must contain `id` and `status`. Column names are case-insensitive and must be unique and non-empty.
- **TR-3** A separator row (`|---|---|`) with the same number of cells must sit directly under the header.
- **TR-4** Every data row has exactly as many cells as the header. `\|` inside a cell is a literal pipe, not a cell boundary.
- **TR-5** Every `status` is one of the six values in §4, compared case-insensitively and written lowercase.
- **TR-6** Every `id` is non-empty and unique.
- **TR-7** A header missing `comp_expected`, `source`, or `next_action_date` is the legacy layout: read those cells as `-`.
- **TR-8** Columns the schema does not list are kept, with their header text and values, on every rewrite. An existing custom column may be set; new columns are never added.

**Tracker write rules**

- **TW-1** A rewrite keeps the existing column order and inserts missing schema columns, in canonical order, before `updated` (or at the end when `updated` is missing), filled with `-`.
- **TW-2** Rows are written newest `updated` first; rows with the same date keep their order.
- **TW-3** An insert sets `updated` to today. An update changes `updated` only when `status` changes. An update that changes nothing leaves the file byte-identical.
- **TW-4** Written values are validated: `id` is kebab-case; `source` is one of the §3 values; `next_action_date` is `YYYY-MM-DD` or `-`; `link` is an http(s) URL or `-`; no value contains a line break or is blank (use `-`); a `|` in a value is written as `\|`. `updated` is set by the rules above, never by the caller.
- **TW-5** The new table is written to a temporary file and moved into place. If the tracker changed between the read and the move, nothing is written and the run is reported as a conflict. The helper holds the workspace lock while it does this, so two helper runs never interleave.
- **TW-6** A new row for a company and role that another row already tracks is written with a warning, never blocked (§9).

**Status transition rules**

- **ST-1** A new row starts at `saved`. It may start at `applied` or `interviewing` only with the user's confirmation, and never at `offer`, `closed`, or `hired`.
- **ST-2** An existing row may move only to a later status listed in §4, and only with the user's confirmation. Setting the current status again is a no-op.
- **ST-3** A move to an earlier status is refused. The existing row, and the rest of the file, stay exactly as they were, and the user is told why.
- **ST-4** `closed` and `hired` are terminal: nothing moves out of them.

**Report rules**

- **RP-1** The next number is one more than the highest numeric prefix among files in `reports/` matching `^\d{3,}-.*\.md$`, zero-padded to at least three digits. Other files are ignored.
- **RP-2** A report file is created exclusively: if a file with that name already exists, nothing is overwritten and the run is reported as a conflict. The helper allocates the number and creates the file under the workspace lock, so concurrent runs never share a number.
- **RP-3** Report frontmatter must contain `company`, `role`, `application_id`, `skill`, `date` (as `YYYY-MM-DD`), and `summary` (§5). `report_id` is set to the allocated number, and added as the first field when it is missing.
- **RP-4** A failed write leaves no partial report behind, and existing reports are never modified.

**Parse failures**

- **PF-1** When any read rule fails, report the line number and the surrounding lines, then stop without writing. The same applies to the story bank (§7).

**Native procedure (no Node).** Apply the rules above in this order:

1. Read `applications.md` and check TR-1 through TR-6. On the first failure, show the user the line number and the surrounding lines, and stop (PF-1). Never "repair" the table on your own.
2. Compute the change, including the transition check against §4 (ST-1 to ST-4) and the field checks in TW-4. If the user has not confirmed a status change in this conversation, ask before writing.
3. Rebuild the whole table per TW-1 and TW-2, keeping everything outside it verbatim (TR-1, TR-8).
4. Immediately before saving, re-read `applications.md`. If it differs from what you read in step 1, discard your change and start again from step 1 (TW-5).
5. For a report, list `reports/`, compute the number (RP-1), check that the target name does not exist, and create it as a new file (RP-2). If it already exists, list again and take the next number. Never overwrite an existing report.

**Known limit:** native file tools cannot take the workspace lock, so steps 4-5 narrow a concurrent-write race rather than close it. Two sessions writing the same workspace at once should use the helper.
