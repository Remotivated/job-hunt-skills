# Local State Layer Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a markdown-based local state layer (`my-documents/`) so every skill in `job-hunt-os` can read and write across sessions — turning each run into a compounding pipeline instead of a stateless one-off.

**Architecture:** Four directories under `my-documents/` (`applications/`, `reports/`, `proof-assets/`, plus root canonicals), one flat-table index (`applications.md`), and a shared state-layer contract that each skill references. Skills gain a "before-run dedup" and "after-run upsert" step. One new skill — `resume-drift-check` — detects hallucinated claims by comparing tailored resumes against an evidence layer.

**Tech Stack:** Markdown files only. No code, no runtime dependencies. Skills are `.claude/skills/*/SKILL.md` files that Claude reads and follows. "Tests" in this plan are manual verification steps (`ls`, `cat`, `git check-ignore`) rather than automated test suites — there is no test runner in this repo.

## Context Chain

- **Issue:** [Remotivated/job-hunt-os#1](https://github.com/Remotivated/job-hunt-os/issues/1) — the parent issue this plan resolves.
- **Spec:** `plans/specs/2026-04-08-local-state-layer-design.md` — approved design doc. Delete after this plan ships (see Chunk 7).
- **Inspiration:** [santifer/career-ops](https://github.com/santifer/career-ops) — the state-layer pattern this borrows from.
- **Existing skills that get modified:** `company-radar`, `resume-tailor`, `resume-auditor`, `resume-builder`, `interview-coach`, `proof-asset-creator`, `linkedin-optimizer`.
- **New skill:** `resume-drift-check`.
- **Deferred:** populating `story-bank.md` → issue #2; in-app sync → blocked on public API.

## Conventions for This Plan

- **All paths are relative to the repo root** (`c:\Projects\job-hunt-os\`).
- **"Test" steps are manual verification** — we inspect files with `ls`, `cat`, or `git check-ignore`. No test runner.
- **Every task ends with a commit.** Commit messages use conventional-commit prefixes (`feat:`, `docs:`, `chore:`).
- **Shell is bash** (use `/` in paths, not `\`). All commands below assume the repo root as CWD.
- **Skill files must preserve their frontmatter** (`---\nname: ...\ndescription: ...\n---`) exactly. Only the body changes.

## File Structure

### Created

| Path | Purpose |
|------|---------|
| `my-documents/applications.md` | Tracker — flat markdown table, one row per application. |
| `my-documents/story-bank.md` | Placeholder with schema doc comment; issue #2 will populate. |
| `my-documents/reports/.gitkeep` | Keeps empty `reports/` dir in-repo. |
| `my-documents/proof-assets/.gitkeep` | Keeps empty `proof-assets/` dir in-repo. |
| `.claude/skills/_shared/state-layer.md` | **Single source of truth** for state-layer conventions (parsing, filenames, status enum, frontmatter shapes, first-run scaffolding). Every modified skill references this file. Underscore prefix signals "not a skill." |
| `.claude/skills/resume-drift-check/SKILL.md` | New hallucination-detection skill. |

### Modified

| Path | Change |
|------|--------|
| `.gitignore` | Broaden from per-file ignores to `my-documents/**` + re-include gitkeeps. |
| `.claude/skills/company-radar/SKILL.md` | Add dedup step + write report + upsert tracker with `status: saved`. |
| `.claude/skills/resume-tailor/SKILL.md` | Add dedup-warn + inline claim verification + report stub + post-run "did you apply?" prompt. |
| `.claude/skills/resume-auditor/SKILL.md` | Add report write. Still read-only re: canonical. |
| `.claude/skills/resume-builder/SKILL.md` | Emit canonical frontmatter (`version`, `updated`); bump version on update. |
| `.claude/skills/interview-coach/SKILL.md` | Dedup-warn (not block); write report; optional tracker row at `status: interviewing`. |
| `.claude/skills/proof-asset-creator/SKILL.md` | Write case studies to `my-documents/proof-assets/{slug}.md`. |
| `.claude/skills/linkedin-optimizer/SKILL.md` | Write audit to `reports/`. |
| `README.md` | Mention state layer + new `resume-drift-check` skill in the skills table. |
| `GETTING-STARTED.md` | Document the state layer file tree and how skills interact with it. |

### Deleted

| Path | Reason |
|------|--------|
| `plans/specs/2026-04-08-local-state-layer-design.md` | Spec has served its purpose; this plan now contains all necessary context. |

---

## Chunk 1: Bootstrap the state layer (files + .gitignore)

**Why this comes first:** Every subsequent skill update assumes these files and directories exist. The new `.gitignore` rule has to land *before* any skill writes to the new directories, otherwise the first run could accidentally commit user content.

### Task 1: Broaden `.gitignore` to cover the full `my-documents/` tree

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Read current `.gitignore` to confirm baseline**

Run: `cat .gitignore`

Expected: contains the `# User's personal documents — never committed` block with per-file rules for `my-documents/resume.md`, `my-documents/coverletter.md`, `my-documents/resume.pdf`, `my-documents/coverletter.pdf`, `my-documents/applications/`, plus re-includes for `!my-documents/.gitkeep` and `!my-documents/applications/.gitkeep`, followed by an `# OS files` block.

- [ ] **Step 2: Replace the "User's personal documents" block**

Edit `.gitignore`. Replace the block that starts with `# User's personal documents — never committed` and ends with `!my-documents/applications/.gitkeep` with the following:

```gitignore
# User's personal documents — never committed.
# Pattern: ignore everything under my-documents/, then re-include specific
# directory entries and their .gitkeep files so the directory structure stays in-repo.
# See: https://git-scm.com/docs/gitignore#_pattern_format
my-documents/**
!my-documents/.gitkeep
!my-documents/applications/
!my-documents/applications/.gitkeep
!my-documents/reports/
!my-documents/reports/.gitkeep
!my-documents/proof-assets/
!my-documents/proof-assets/.gitkeep
```

Leave the `# OS files` block (`.DS_Store`, `Thumbs.db`) untouched below it.

- [ ] **Step 3: Verify the ignore rules behave correctly**

Create temporary test files, then check them:

```bash
mkdir -p my-documents/reports my-documents/proof-assets
touch my-documents/reports/.gitkeep my-documents/proof-assets/.gitkeep
touch my-documents/resume.md my-documents/reports/001-test.md my-documents/proof-assets/foo.md
git check-ignore -v my-documents/resume.md my-documents/reports/001-test.md my-documents/proof-assets/foo.md my-documents/reports/.gitkeep my-documents/proof-assets/.gitkeep
```

Expected output: the three content files (`resume.md`, `001-test.md`, `foo.md`) show an `.gitignore:<line>:my-documents/**` match. The two `.gitkeep` files show nothing (or an exit code indicating they are NOT ignored).

Then:

```bash
rm my-documents/resume.md my-documents/reports/001-test.md my-documents/proof-assets/foo.md
```

(Leave the `.gitkeep` files — they belong to Task 2/3.)

- [ ] **Step 4: Confirm a clean `git status`**

Run: `git status`

Expected: only `.gitignore` shows as modified. No untracked files under `my-documents/`.

- [ ] **Step 5: Commit**

```bash
git add .gitignore
git commit -m "chore(gitignore): broaden my-documents ignore rules for state layer"
```

---

### Task 2: Create the `reports/` directory with `.gitkeep`

**Files:**
- Create: `my-documents/reports/.gitkeep`

- [ ] **Step 1: Create the directory and gitkeep**

```bash
mkdir -p my-documents/reports
touch my-documents/reports/.gitkeep
```

- [ ] **Step 2: Verify git tracks the gitkeep**

Run: `git status my-documents/reports/`

Expected: `my-documents/reports/.gitkeep` shows as untracked (**not** ignored).

- [ ] **Step 3: Commit**

```bash
git add my-documents/reports/.gitkeep
git commit -m "feat(state): scaffold my-documents/reports directory"
```

---

### Task 3: Create the `proof-assets/` and `applications/` directories with `.gitkeep`

**Why both in one task:** They're symmetric (bare directory + single gitkeep file), both are required for the state layer, and both are already re-included in the `.gitignore` pattern from Task 1. Bundling them avoids an extra micro-task. The current `.gitignore` already references `!my-documents/applications/.gitkeep`, but that file doesn't exist on disk today — this task creates it alongside `proof-assets/.gitkeep`.

**Files:**
- Create: `my-documents/proof-assets/.gitkeep`
- Create: `my-documents/applications/.gitkeep`

- [ ] **Step 1: Create both directories and gitkeeps**

```bash
mkdir -p my-documents/proof-assets my-documents/applications
touch my-documents/proof-assets/.gitkeep my-documents/applications/.gitkeep
```

- [ ] **Step 2: Verify git tracks both gitkeeps**

```bash
git status my-documents/proof-assets/ my-documents/applications/
```

Expected: both `.gitkeep` files show as untracked (not ignored).

- [ ] **Step 3: Commit**

```bash
git add my-documents/proof-assets/.gitkeep my-documents/applications/.gitkeep
git commit -m "feat(state): scaffold my-documents/proof-assets and applications directories"
```

---

## Chunk 2: Shared state-layer contract

**Why this is a single file:** The algorithms for parsing `applications.md`, computing the next report number, upserting rows, and validating frontmatter are **non-trivial and will be invoked by six different skills**. Duplicating that logic across every `SKILL.md` is a maintenance trap — fix a bug once, miss it in five places. This file is the single source of truth; each skill links to it.

**Naming:** The `_shared/` prefix signals "this directory is not a skill." Claude Code only auto-activates directories that contain a `SKILL.md` with proper frontmatter, so `_shared/state-layer.md` is safely ignored by the skill auto-discovery loop.

### Task 4: Create `.claude/skills/_shared/state-layer.md`

**Files:**
- Create: `.claude/skills/_shared/state-layer.md`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p .claude/skills/_shared
```

- [ ] **Step 2: Write the contract file**

Create `.claude/skills/_shared/state-layer.md` with this exact content:

````markdown
# State Layer Contract

Single source of truth for the `my-documents/` state layer. All skills that read or write `applications.md`, `reports/`, `story-bank.md`, or the canonical resume version MUST follow these rules.

**Not a skill.** The `_shared/` prefix and missing frontmatter prevent Claude from auto-activating this file.

## 1. File Layout

```
my-documents/
├── resume.md              # canonical (frontmatter: version, updated)
├── coverletter.md         # canonical
├── applications.md        # tracker (flat table + optional ## Notes)
├── story-bank.md          # STAR stories (populated by issue #2)
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

If any of the following are missing when a skill needs them, the skill creates them from the template below **before** proceeding. No separate setup step.

| Path | Template |
|------|----------|
| `my-documents/applications.md` | Empty-table template (see §3) |
| `my-documents/reports/` | `mkdir` + `.gitkeep` |
| `my-documents/proof-assets/` | `mkdir` + `.gitkeep` |
| `my-documents/story-bank.md` | Placeholder with schema comment |

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
````

- [ ] **Step 3: Verify the file is well-formed**

Run: `head -20 .claude/skills/_shared/state-layer.md && echo --- && wc -l .claude/skills/_shared/state-layer.md`

Expected: First 20 lines show the title and §1 intro. Line count is roughly 140–180.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/_shared/state-layer.md
git commit -m "feat(state): add shared state-layer contract for all skills"
```

---

### Task 5: Create `my-documents/applications.md` from the empty-table template

**Files:**
- Create: `my-documents/applications.md` (gitignored — this is the starter template shipped via the skills, but we verify the format here)

**Note:** This file is user-owned and gitignored. We create it here to verify the template is correct and to give new users a starting file — the actual file is scaffolded lazily by skills on first use, but shipping a working template locally catches any typo before it reaches a skill.

- [ ] **Step 1: Write the empty-table template**

Create `my-documents/applications.md` with exactly this content:

```markdown
# Applications

| id | company | role | status | updated | link |
|----|---------|------|--------|---------|------|

## Notes
```

- [ ] **Step 2: Verify it's gitignored**

Run: `git check-ignore -v my-documents/applications.md`

Expected output: a line showing `.gitignore:<N>:my-documents/**    my-documents/applications.md`.

- [ ] **Step 3: Verify `git status` is clean**

Run: `git status`

Expected: nothing to commit. The file exists on disk but is correctly ignored.

- [ ] **Step 4: No commit needed**

This file is intentionally not committed — it's user state. Move on to Task 6.

---

### Task 6: Create `my-documents/story-bank.md` as a placeholder

**Files:**
- Create: `my-documents/story-bank.md` (gitignored)

- [ ] **Step 1: Write the placeholder**

Create `my-documents/story-bank.md` with this exact content:

```markdown
# Story Bank

Placeholder — to be populated by [issue #2](https://github.com/Remotivated/job-hunt-os/issues/2).

Each entry should follow the STAR format:

## {Story Title}

**Situation:** Context and setting.
**Task:** What you needed to accomplish.
**Action:** Specific steps you took (emphasize your own decisions).
**Result:** Quantified outcomes, learnings, follow-on impact.

**Tags:** `#remote`, `#distributed-team`, `#leadership`, etc.
**Related application IDs:** `buffer-content-marketing-manager`
```

- [ ] **Step 2: Verify it's gitignored**

Run: `git check-ignore -v my-documents/story-bank.md`

Expected: a line showing the `my-documents/**` rule matched.

- [ ] **Step 3: No commit needed** — user-owned file.

---

## Chunk 3: Skill updates — existing skills

**Pattern for every skill update:** each skill's SKILL.md gains a new numbered workflow step (or an amendment to an existing one) that references `.claude/skills/_shared/state-layer.md`. The SKILL.md stays compact — the *contract* lives in the shared file, the *behavior* lives in the skill.

Each task below specifies the exact text to insert/replace. Dry-run "tests" at the end of each task: read the updated SKILL.md and verify it parses, then commit.

### Task 7: Update `resume-builder` — write canonical frontmatter

**Files:**
- Modify: `.claude/skills/resume-builder/SKILL.md`

- [ ] **Step 1: Read the current file**

Run: `cat .claude/skills/resume-builder/SKILL.md`

- [ ] **Step 2: Amend the "Save to" line inside Step 3 ("Generate outputs") to add frontmatter guidance**

This is a single-line replacement — we're keeping the rest of Step 3 intact and just expanding the `**Save to:**` paragraph. Find this line:

```markdown
**Save to:** `my-documents/resume.md`, `my-documents/coverletter.md` + PDF versions via HTML/CSS. Fallback: pandoc, browser print-to-PDF, or Google Docs export.
```

Replace it with:

```markdown
**Save to:** `my-documents/resume.md`, `my-documents/coverletter.md` + PDF versions via HTML/CSS. Fallback: pandoc, browser print-to-PDF, or Google Docs export.

**Frontmatter (required on `resume.md`):**

```yaml
---
version: 1
updated: 2026-04-08
---
```

On first build: `version: 1`. On update (see §4 Modes below): read the current frontmatter, increment `version` by 1, set `updated` to today's ISO date. See [state-layer contract §6](../_shared/state-layer.md#6-canonical-resume-frontmatter) for the full rule. `coverletter.md` does not need frontmatter.
```

- [ ] **Step 3: Add a reference line at the top of the Workflow section**

Directly under `## Workflow` (before `### 1. Gather existing materials`), insert a blank line then:

```markdown
> **State layer:** this skill owns canonical `version` bumps. See [state-layer contract §6](../_shared/state-layer.md#6-canonical-resume-frontmatter).

```

- [ ] **Step 4: Verify the file still has valid frontmatter**

Run: `head -5 .claude/skills/resume-builder/SKILL.md`

Expected: the original `---\nname: resume-builder\ndescription: ...\n---` block, untouched.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/resume-builder/SKILL.md
git commit -m "feat(resume-builder): write canonical version frontmatter"
```

---

### Task 8: Update `company-radar` — dedup + write report + upsert tracker

**Files:**
- Modify: `.claude/skills/company-radar/SKILL.md`

- [ ] **Step 1: Read the current file**

Run: `cat .claude/skills/company-radar/SKILL.md`

- [ ] **Step 2: Insert a new "Before running" step at the start of the workflow**

Directly under `## Workflow` and before `### 1. Inputs`, insert:

```markdown
> **State layer:** reads `applications.md` for dedup, writes a numbered vetting report, upserts the tracker with `status: saved` on a positive verdict. See [state-layer contract](../_shared/state-layer.md).

### 0. Dedup check

Read `my-documents/applications.md` (first-run scaffold if missing — see [state-layer §2](../_shared/state-layer.md#2-first-run-scaffolding)). If a row already exists for this company, also scan `my-documents/reports/` for the most recent `{company-slug}-vetting-*.md` file. Warn the user:

> You vetted **{Company}** on {date} — report **{###}**. Re-run, or open that?

If they choose "open that," read the report and stop. If "re-run," continue.

```

(The existing `### 1. Inputs` stays as-is.)

- [ ] **Step 3: Replace the final section with a combined "Score, recommend, and record" step**

Find the section `### 5. Score and recommend` and everything between it and `## Common Mistakes`. Replace it with:

```markdown
### 5. Score and recommend

- **0-1 red flags:** Likely solid. Prioritize.
- **2-3 red flags:** Proceed with caution. Prepare specific questions.
- **4+ red flags:** Probably not worth your time unless the role is exceptional.

### 6. Record the findings

**Write the report:** `my-documents/reports/{###}-{company-slug}-vetting-{YYYY-MM-DD}.md`

- `{###}` — next available number per [state-layer §5](../_shared/state-layer.md#5-reports-convention).
- Frontmatter fields: `id`, `company`, `role: null` (unless the vetting was role-specific), `application_id: null` (or the existing tracker id if one exists), `skill: company-radar`, `date`, `summary` (a one-line verdict).
- Body: the 4-stage findings, red flags, and recommendation.

**Upsert the tracker:** If the verdict is positive (0-3 red flags) **and** no row exists for this company+role, upsert `my-documents/applications.md` with:

| Field | Value |
|-------|-------|
| `id` | `{company-slug}-{role-slug}` if a role was vetted, else `{company-slug}` |
| `status` | `saved` |
| `updated` | Today (ISO) |

If a row already exists, leave its status alone — the user may have already progressed. Follow the upsert + status-advancement rules in [state-layer §3](../_shared/state-layer.md#3-applicationsmd-schema).

```

- [ ] **Step 4: Verify the file still parses**

Run: `head -5 .claude/skills/company-radar/SKILL.md && echo --- && grep -c "^### " .claude/skills/company-radar/SKILL.md`

Expected: frontmatter intact; heading count is 7 (Dedup, Inputs, Research, Evaluate, Remotivated check, Score, Record).

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/company-radar/SKILL.md
git commit -m "feat(company-radar): dedup, write report, upsert tracker"
```

---

### Task 9: Update `resume-tailor` — dedup-warn, claim verification, report stub, post-run prompt

**Files:**
- Modify: `.claude/skills/resume-tailor/SKILL.md`

- [ ] **Step 1: Read the current file**

Run: `cat .claude/skills/resume-tailor/SKILL.md`

- [ ] **Step 2: Insert a "State layer" banner and new "Dedup check" step**

Directly under `## Workflow` and before `### 1. Accept inputs`, insert:

```markdown
> **State layer:** reads `applications.md` to dedup existing tailorings, runs claim verification against the evidence layer before saving, writes a tailor-report stub, and upserts the tracker at `status: saved`. See [state-layer contract](../_shared/state-layer.md).

### 0. Dedup check

Read `my-documents/applications.md` (first-run scaffold if missing). Compute the target `id` as `{company-slug}-{role-slug}`. If a row with that `id` already exists **or** `my-documents/applications/{id}/resume.md` already exists, warn:

> You have a tailored resume for **{Role} at {Company}**. Iterate on the existing version, or create a new one?

- **Iterate:** load the existing tailored file and continue from there.
- **New one:** the new version **overwrites** `applications/{id}/resume.md` in place. Rationale: parallel folders for the same role get messy. Git history on the canonical + the report stub preserve recoverability.
- **Genuine need for two simultaneous variants** (e.g., same role applied via two channels): the user picks a distinct suffix like `{id}-referral` and passes that as the target.

Warn, do not block — the user can always proceed.

```

- [ ] **Step 3: Replace Step 4 ("Tailor") to add inline claim verification**

Find this paragraph inside `### 4. Tailor`:

```markdown
**Resume:** Match terminology, reorder bullets by relevance, highlight remote signals. You may add a Summary section or reorganize structure if it strengthens the narrative, but don't remove sections from the canonical. Never invent experience — use `[ASK: ...]` placeholders for gaps. If the canonical lacks quantified achievements, flag each weak bullet with a specific `[ASK]`.
```

Replace with:

```markdown
**Resume:** Match terminology, reorder bullets by relevance, highlight remote signals. You may add a Summary section or reorganize structure if it strengthens the narrative, but don't remove sections from the canonical. Never invent experience.

**Claim verification (required before save):** For every added or rewritten bullet, classify each quantitative claim and named project against the evidence layer (canonical → story-bank → proof-assets → reports), using the rules in [state-layer §7](../_shared/state-layer.md#7-evidence-layer-priority-order). This is the **same mechanism** used by `resume-drift-check` — one shared pass, not two. Surface any **unverifiable** or **contradicted** claim inline as `[VERIFY: {claim} — {source-gap}]` so the user can confirm, adjust, or replace before the file is saved. Gaps in the canonical itself still use `[ASK: ...]` placeholders as before.
```

- [ ] **Step 4: Replace Step 5 ("Save outputs") with frontmatter-aware version**

Find this block:

```markdown
### 5. Save outputs

```
my-documents/applications/{company}-{role}/resume.md
my-documents/applications/{company}-{role}/coverletter.md
```

Use lowercase kebab-case for folder names (e.g., `buffer-content-marketing-manager`).

Generate PDF versions if tooling is available. If not, note the fallback: pandoc, browser print-to-PDF, or Google Docs export.

**Never modify canonical files** unless explicitly asked.
```

Replace with:

```markdown
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

**PDF:** Generate via HTML/CSS if tooling is available. Fallback: pandoc, browser print-to-PDF, or Google Docs export.

**Never modify canonical files** unless explicitly asked.
```

- [ ] **Step 5: Replace Step 6 ("Summary") with the post-run prompt**

Find this block:

```markdown
### 6. Summary

Report: key changes and why, alignment strengths, gaps flagged with `[ASK]`, anything to review manually.
```

Replace with:

```markdown
### 6. Summary and post-run prompt

Report to the user: key changes and why, alignment strengths, `[ASK]` gaps, `[VERIFY]` flags, and anything to review manually. Show the tracker row for this application.

Then ask:

> Did you submit this application? If so, I can update the status to `applied`.

If the user confirms, upsert `applications.md` with `status: applied` and `updated: {today ISO}`. Only the user can trigger this transition — the skill never auto-advances past `saved`.
```

- [ ] **Step 6: Verify file structure**

Run: `head -5 .claude/skills/resume-tailor/SKILL.md && grep -c "^### " .claude/skills/resume-tailor/SKILL.md`

Expected: frontmatter intact; heading count is 7 (Dedup, Accept inputs, Analyze, Identify angle, Tailor, Save, Summary).

- [ ] **Step 7: Commit**

```bash
git add .claude/skills/resume-tailor/SKILL.md
git commit -m "feat(resume-tailor): dedup, verify claims, report stub, post-run prompt"
```

---

### Task 10: Update `resume-auditor` — write report (still read-only for canonical)

**Files:**
- Modify: `.claude/skills/resume-auditor/SKILL.md`

- [ ] **Step 1: Read the current file**

Run: `cat .claude/skills/resume-auditor/SKILL.md`

- [ ] **Step 2: Add a "State layer" banner under `## Workflow`**

Directly under `## Workflow` and before `### 1. Read the resume`, insert:

```markdown
> **State layer:** writes an audit report to `reports/`. **Does NOT modify the canonical resume** — version bumps only happen in `resume-builder`. See [state-layer contract](../_shared/state-layer.md).

```

- [ ] **Step 3: Add a "Save the audit report" step after Step 6 (Output structure)**

Directly above the line `**This skill is read-only. Never modify files.**`, replace that line with:

```markdown
### 7. Save the audit report

Write the audit to `my-documents/reports/{###}-resume-audit-{YYYY-MM-DD}.md`. Frontmatter: `id`, `company: null`, `role: null`, `application_id: null`, `skill: resume-auditor`, `date`, `summary` (e.g., `"5 STRONG, 3 NEEDS WORK, 7 WEAK — rewrite recommended"`). Body: the full output from §6 (30-Second Scan through What's Missing).

**Canonical files remain untouched.** This skill never modifies `my-documents/resume.md` or any tailored resume. If the user wants to apply auditor suggestions, they re-run `resume-builder` or hand-edit, and the version bump happens there. See [state-layer §6](../_shared/state-layer.md#6-canonical-resume-frontmatter).
```

- [ ] **Step 4: Verify file structure**

Run: `head -5 .claude/skills/resume-auditor/SKILL.md && grep -c "^### " .claude/skills/resume-auditor/SKILL.md`

Expected: frontmatter intact; heading count is 7 (Read, Bullet-level, Narrative-level, Remote-readiness, Terminology, Output structure, Save).

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/resume-auditor/SKILL.md
git commit -m "feat(resume-auditor): save audit as a state-layer report"
```

---

### Task 11: Update `interview-coach` — dedup-warn + optional tracker creation + report

**Files:**
- Modify: `.claude/skills/interview-coach/SKILL.md`

- [ ] **Step 1: Read the current file**

Run: `cat .claude/skills/interview-coach/SKILL.md`

- [ ] **Step 2: Insert state-layer banner and new Step 0 (dedup-warn)**

Directly under `## Workflow` and before `### 1. Gather inputs`, insert:

```markdown
> **State layer:** reads `applications.md` to check for a tracker row; if missing, offers to create one (the only place a row can be created directly at `status: interviewing`). Writes the prep brief as both an artifact and a report. See [state-layer contract](../_shared/state-layer.md).

### 0. Tracker check

Read `my-documents/applications.md` (first-run scaffold if missing). If no row exists for this company + role, **warn (do not block)**:

> I don't see a tracked application for **{Role} at {Company}**. Interview prep still works — want me to create a tracker row with `status: interviewing`, or skip the tracker?

Users may have interviews for applications submitted before they started using the tracker; that's why this warns instead of blocking.

If the user confirms tracker creation, insert a new row with `status: interviewing`. This is the one case where a row legitimately enters the tracker directly at `interviewing`, skipping `saved` and `applied`. It's a row *creation*, not a status regression — see [state-layer §4](../_shared/state-layer.md#4-status-enum).

```

- [ ] **Step 3: Replace Step 4 ("Save") with report-aware version**

Find this block:

```markdown
### 4. Save

Save to `my-documents/applications/{company}-{role}/interview-prep.md` and display in conversation.
```

Replace with:

```markdown
### 4. Save

Save two copies:

1. **Artifact** (per-application folder): `my-documents/applications/{id}/interview-prep.md` — the version the user actually references before the interview.
2. **Report** (state-layer archive): `my-documents/reports/{###}-{id}-interview-prep-{YYYY-MM-DD}.md` — frontmatter: `id`, `company`, `role`, `application_id: {id}`, `skill: interview-coach`, `date`, `summary` (one-line angle). Body: the same prep brief content.

Display the brief in conversation.
```

- [ ] **Step 4: Verify file structure**

Run: `head -5 .claude/skills/interview-coach/SKILL.md && grep -c "^### " .claude/skills/interview-coach/SKILL.md`

Expected: frontmatter intact; heading count is 5 (Tracker check, Gather inputs, Research, Generate, Save).

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/interview-coach/SKILL.md
git commit -m "feat(interview-coach): dedup warn, optional tracker create, save report"
```

---

### Task 12: Update `proof-asset-creator` — write to `proof-assets/`

**Files:**
- Modify: `.claude/skills/proof-asset-creator/SKILL.md`

- [ ] **Step 1: Read the current file**

Run: `cat .claude/skills/proof-asset-creator/SKILL.md`

- [ ] **Step 2: Insert state-layer banner**

Directly under `## Workflow` and before `### 1. Choose format`, insert:

```markdown
> **State layer:** writes reusable case studies to `my-documents/proof-assets/`. No tracker touch, no report. Proof assets are reusable evidence, not per-application artifacts. See [state-layer contract](../_shared/state-layer.md).

```

- [ ] **Step 3: Replace Step 4 ("Produce the asset") to specify save location**

Find the block starting with `### 4. Produce the asset` and ending before `## Common Mistakes`. Replace it with:

```markdown
### 4. Produce the asset

**Save location:** `my-documents/proof-assets/{slug}.md` where `{slug}` is a kebab-case descriptor (e.g., `distributed-team-migration`, `content-strategy-overhaul`). First-run scaffold the `proof-assets/` directory if missing (see [state-layer §2](../_shared/state-layer.md#2-first-run-scaffolding)).

**Case study:** SAOL structure — Situation → Approach → Outcome → Learning. Target 500-800 words (1-2 pages).

**Personal site:** Content brief with headline, sections, copy, project highlights, tool recommendations. Save as `{slug}-site-brief.md`.

**Portfolio:** 4-6 curated pieces with context (problem, role, result) per piece. Save as `{slug}-portfolio.md`.

**Proof link:** Video script or writeup — hook, walkthrough, results, takeaway. Save as `{slug}-proof-link.md`.

**Creative:** Guidance on what to build and how to present it. Save as `{slug}-creative-brief.md`.

Proof assets are reusable across applications. Reference them by filename from cover letters, LinkedIn, or tailored resumes.

```

- [ ] **Step 4: Verify file structure**

Run: `head -5 .claude/skills/proof-asset-creator/SKILL.md && grep -c "^### " .claude/skills/proof-asset-creator/SKILL.md`

Expected: frontmatter intact; heading count is 4 (Choose format, Interview, Handle confidentiality, Produce the asset).

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/proof-asset-creator/SKILL.md
git commit -m "feat(proof-asset-creator): save to my-documents/proof-assets"
```

---

### Task 13: Update `linkedin-optimizer` — write audit to `reports/`

**Files:**
- Modify: `.claude/skills/linkedin-optimizer/SKILL.md`

- [ ] **Step 1: Read the current file**

Run: `cat .claude/skills/linkedin-optimizer/SKILL.md`

- [ ] **Step 2: Insert state-layer banner**

Directly under `## Workflow` and before `### 1. Gather current state`, insert:

```markdown
> **State layer:** writes a LinkedIn audit report to `reports/`. No tracker touch. See [state-layer contract](../_shared/state-layer.md).

```

- [ ] **Step 3: Replace Step 3 ("Output") with report-aware version**

Find this block:

```markdown
### 3. Output

All rewritten sections ready to copy-paste into LinkedIn. Include remote-readiness signals naturally throughout.
```

Replace with:

```markdown
### 3. Output

All rewritten sections ready to copy-paste into LinkedIn. Include remote-readiness signals naturally throughout.

**Save as a report:** `my-documents/reports/{###}-linkedin-audit-{YYYY-MM-DD}.md`. Frontmatter: `id`, `company: null`, `role: null`, `application_id: null`, `skill: linkedin-optimizer`, `date`, `summary` (e.g., `"Headline + About rewritten; 3 activity-plan items queued"`). Body: the full rewritten sections plus the activity plan.
```

- [ ] **Step 4: Verify file structure**

Run: `head -5 .claude/skills/linkedin-optimizer/SKILL.md && grep -c "^### " .claude/skills/linkedin-optimizer/SKILL.md`

Expected: frontmatter intact; heading count is 3 (Gather, Audit and rewrite, Output).

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/linkedin-optimizer/SKILL.md
git commit -m "feat(linkedin-optimizer): save audit as state-layer report"
```

---

## Chunk 4: New skill — `resume-drift-check`

### Task 14: Create `.claude/skills/resume-drift-check/SKILL.md`

**Files:**
- Create: `.claude/skills/resume-drift-check/SKILL.md`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p .claude/skills/resume-drift-check
```

- [ ] **Step 2: Write the skill file**

Create `.claude/skills/resume-drift-check/SKILL.md` with this exact content:

````markdown
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

> Reads the canonical resume, all tailored resumes, and the evidence layer. Writes a drift report to `my-documents/reports/`. See [state-layer contract](../_shared/state-layer.md).

## Workflow

### 1. Gather inputs

- **Canonical:** `my-documents/resume.md` (required). Read its `version` from frontmatter.
- **Tailored resumes:** `my-documents/applications/*/resume.md` (every subdirectory). Read each file's `derived_from_version` from frontmatter. If missing, treat as `derived_from_version: 0` and flag it.
- **Evidence layer** (priority order per [state-layer §7](../_shared/state-layer.md#7-evidence-layer-priority-order)):
  1. Canonical `resume.md`
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

Report counts, flagged claims per application, and which actions the user took. Suggest re-running if the user confirmed claims against story-bank (once populated per issue #2).

## v1 Degradation

Until `story-bank.md` has content (issue #2), the skill runs with canonical + proof-assets + reports only. This still catches obvious fabrications (contradicted numbers, named projects the user never mentioned). It gets significantly stronger once stories land.

## Common Mistakes

- **Treating classification as truth.** Classification is a prompt for review, not a verdict. A claim can be legitimate without appearing in the evidence layer yet.
- **Overflagging paraphrases.** If a bullet says the same thing in different words as the canonical, that's supported — not unverifiable.
- **Ignoring the reports tier.** Self-references the user made in prior sessions are weaker evidence than the canonical, but they're not nothing. Use them to downgrade "unverifiable" to "unverifiable but plausible."
- **Silent patching.** Never edit a tailored resume without explicit user confirmation on each claim.
````

- [ ] **Step 3: Verify the frontmatter parses**

Run: `head -5 .claude/skills/resume-drift-check/SKILL.md`

Expected: the `---\nname: resume-drift-check\ndescription: ...\n---` frontmatter block followed by `## Overview`.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/resume-drift-check/SKILL.md
git commit -m "feat(resume-drift-check): add hallucination-detection skill"
```

---

## Chunk 5: Documentation updates

### Task 15: Update `README.md` — add `resume-drift-check` to the skills table and mention the state layer

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Read the current file**

Run: `cat README.md`

- [ ] **Step 2: Add `resume-drift-check` row to the Skills table**

Find this line in the Skills table:

```markdown
| [linkedin-optimizer](.claude/skills/linkedin-optimizer/SKILL.md) | Audit and improve your LinkedIn profile |
```

Directly after it, insert:

```markdown
| [resume-drift-check](.claude/skills/resume-drift-check/SKILL.md) | Catch hallucinated claims in tailored resumes before you submit |
```

- [ ] **Step 3: Add a "State Layer" section before "Quick Start"**

Find this heading:

```markdown
## Quick Start
```

Directly above it, insert:

```markdown
## State Layer

Job Hunt OS keeps a local markdown-based memory under `my-documents/`:

```
my-documents/
├── resume.md              # your canonical resume
├── coverletter.md         # your canonical cover letter
├── applications.md        # tracker — one row per application
├── story-bank.md          # STAR stories (populated incrementally)
├── applications/{id}/     # tailored resumes and cover letters
├── reports/               # numbered evaluations from every skill run
└── proof-assets/          # reusable case studies
```

Every skill reads and writes this layer so each run builds on the last — `company-radar` dedupes against companies you already vetted, `resume-tailor` warns when a tailored version already exists, `resume-drift-check` catches hallucinated claims by comparing tailored resumes to your evidence layer. The entire `my-documents/` tree is gitignored; it's your state, not the project's.

Contract: [`.claude/skills/_shared/state-layer.md`](.claude/skills/_shared/state-layer.md).

---

```

- [ ] **Step 4: Update the "Your First Workflow" list** to mention drift check

Find this line:

```markdown
4. **Prepare for the interview** → `interview-coach` generates your prep brief
```

Directly after it, insert:

```markdown
5. **Sanity-check tailoring** → `resume-drift-check` catches hallucinated claims before you submit
```

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs(readme): document state layer and resume-drift-check skill"
```

---

### Task 16: Update `GETTING-STARTED.md` — document the state layer

**Files:**
- Modify: `GETTING-STARTED.md`

- [ ] **Step 1: Read the current file**

Run: `cat GETTING-STARTED.md`

- [ ] **Step 2: Replace the "How Canonical Files Work" section with the full state layer**

Find the section starting with `## How Canonical Files Work` and ending at the next `##` heading (`## The Guides`). Replace it with:

```markdown
## How the State Layer Works

Your master resume lives in one place. Tailored versions, reports, and evidence files each have their own directory. Here's the layout:

```
my-documents/
├── resume.md              ← Your master resume (created by resume-builder)
├── coverletter.md         ← Your master cover letter (created by resume-builder)
├── resume.pdf             ← PDF version
├── coverletter.pdf        ← PDF version
├── applications.md        ← Tracker — one row per application (status, dates, links)
├── story-bank.md          ← STAR stories (your evidence layer — populated over time)
├── applications/
│   ├── acme-sre/          ← Tailored for Acme Corp SRE role
│   │   ├── resume.md
│   │   ├── resume.pdf
│   │   ├── coverletter.md
│   │   ├── coverletter.pdf
│   │   └── interview-prep.md
│   └── buffer-marketing/  ← Tailored for Buffer Marketing role
│       ├── resume.md
│       └── ...
├── reports/               ← Every skill run saves a numbered report here
│   ├── 001-buffer-vetting-2026-04-08.md
│   ├── 002-resume-audit-2026-04-09.md
│   └── ...
└── proof-assets/          ← Reusable case studies and portfolio pieces
    └── distributed-team-migration.md
```

### The four directories

- **Root canonicals** (`resume.md`, `coverletter.md`) — sacred, never modified by per-application skills.
- **`applications/{id}/`** — artifacts you'd actually send to employers.
- **`reports/`** — evaluations, audits, and research for your own reference. Numbered, flat, read-only after creation.
- **`proof-assets/`** — case studies and portfolio pieces that get referenced across many applications.

### Key rules

- **`resume-builder` owns the canonicals** — it's the only skill that writes to `my-documents/resume.md` and `my-documents/coverletter.md`, and the only skill that bumps the canonical `version` frontmatter.
- **`resume-tailor` creates application folders** — reads the canonicals and writes to `my-documents/applications/{id}/`. It runs an inline claim-verification pass against your evidence layer before saving, flagging any bullet that can't be traced back to real source material.
- **`resume-auditor` is read-only** — writes its critique to `reports/` but never touches your canonical files.
- **`company-radar`, `interview-coach`, `linkedin-optimizer`** each save numbered reports under `reports/` after every run.
- **`resume-drift-check`** compares tailored resumes against the evidence layer (canonical, story-bank, proof-assets, reports) and flags hallucinated or contradicted claims.

### The applications tracker

`my-documents/applications.md` is a flat markdown table that every skill reads for dedup and writes to advance status. Columns: `id`, `company`, `role`, `status`, `updated`, `link`. Status values in lifecycle order: `saved → applied → interviewing → offer → closed | hired`.

You can edit it by hand at any time — it's just markdown. Skills only advance status forward, never backward.

### Privacy

The entire `my-documents/` directory is gitignored. Nothing under it is ever committed to the repo (except empty `.gitkeep` files that preserve the directory structure for new clones).

### Updating your canonical resume

As your career evolves, use `resume-builder` in "update" mode:

> "I want to update my resume — I just got promoted to Senior Engineer"

It reads your existing canonical files, asks what's changed, produces updated versions, and bumps the `version` in frontmatter. Any existing tailored resumes with a lower `derived_from_version` will get flagged for deep scanning the next time `resume-drift-check` runs.

---
```

- [ ] **Step 3: Verify the section boundaries**

Run: `grep -n "^## " GETTING-STARTED.md`

Expected: The section list now contains `## How the State Layer Works` (replacing the old `## How Canonical Files Work`), followed by `## The Guides`.

- [ ] **Step 4: Commit**

```bash
git add GETTING-STARTED.md
git commit -m "docs(getting-started): replace canonical-files section with state layer"
```

---

## Chunk 6: Integration verification

### Task 17: End-to-end dry-run verification

This task does not modify files — it verifies the implementation is consistent across every skill. If any check fails, go back and fix the relevant task in Chunk 3/4/5.

- [ ] **Step 1: Confirm every modified + new skill references `_shared/state-layer.md`**

Run: `grep -l "_shared/state-layer.md" .claude/skills/*/SKILL.md`

Expected output: exactly 8 files (7 modified skills + the new `resume-drift-check` skill):

```
.claude/skills/company-radar/SKILL.md
.claude/skills/interview-coach/SKILL.md
.claude/skills/linkedin-optimizer/SKILL.md
.claude/skills/proof-asset-creator/SKILL.md
.claude/skills/resume-auditor/SKILL.md
.claude/skills/resume-builder/SKILL.md
.claude/skills/resume-drift-check/SKILL.md
.claude/skills/resume-tailor/SKILL.md
```

- [ ] **Step 2: Confirm no skill accidentally lost its frontmatter**

Run: `for f in .claude/skills/*/SKILL.md; do head -1 "$f" | grep -q "^---$" || echo "BROKEN: $f"; done`

Expected output: empty (no "BROKEN" lines).

- [ ] **Step 3: Confirm `applications.md`, `story-bank.md`, `reports/`, and `proof-assets/` are all gitignored for user content but directories are tracked**

```bash
git check-ignore my-documents/applications.md my-documents/story-bank.md my-documents/reports/001-fake.md my-documents/proof-assets/fake.md
```

Expected: all four paths are reported as ignored.

```bash
git ls-files my-documents/
```

Expected: exactly four `.gitkeep` files — `my-documents/.gitkeep`, `my-documents/applications/.gitkeep`, `my-documents/reports/.gitkeep`, `my-documents/proof-assets/.gitkeep`.

- [ ] **Step 4: Confirm shared contract exists and is the single source of truth for key algorithms**

```bash
grep -l "Next-number algorithm" .claude/skills/_shared/state-layer.md && echo FOUND_IN_SHARED
grep -l "Next-number algorithm" .claude/skills/*/SKILL.md
```

Expected: `FOUND_IN_SHARED` prints. The second grep returns empty — no skill should duplicate the algorithm; they all link to the shared contract.

- [ ] **Step 5: Confirm the `resume-drift-check` skill exists and is discoverable**

```bash
ls -la .claude/skills/resume-drift-check/
head -5 .claude/skills/resume-drift-check/SKILL.md
```

Expected: directory exists with `SKILL.md`; frontmatter starts with `---\nname: resume-drift-check`.

- [ ] **Step 6: Confirm README and GETTING-STARTED reference the state layer**

```bash
grep -c "State Layer\|state-layer\|resume-drift-check" README.md
grep -c "State Layer\|state-layer\|applications.md\|reports/" GETTING-STARTED.md
```

Expected: both commands return counts ≥ 3.

- [ ] **Step 7: No commit** — verification only.

---

## Chunk 7: Spec cleanup

### Task 18: Delete the source spec now that the plan has shipped

**Files:**
- Delete: `plans/specs/2026-04-08-local-state-layer-design.md`

- [ ] **Step 1: Stage the deletion with `git rm`**

```bash
git rm plans/specs/2026-04-08-local-state-layer-design.md
```

This both removes the file from disk and stages the deletion in one step.

- [ ] **Step 2: Verify it's gone and staged**

```bash
ls plans/specs/
git status plans/specs/
```

Expected: `ls` shows no `2026-04-08-local-state-layer-design.md`. `git status` shows the deletion as staged.

- [ ] **Step 3: Commit**

```bash
git commit -m "chore(plans): remove spec now that implementation plan has shipped"
```

---

## Done

All 18 tasks complete. The state layer is live:

- `my-documents/` tree is scaffolded and correctly gitignored.
- Every existing skill reads `applications.md` for dedup, writes a numbered report on every run, and upserts the tracker where appropriate.
- Canonical resumes carry a `version` that `resume-tailor` records as `derived_from_version`.
- `resume-drift-check` is a new standalone skill AND runs embedded inside `resume-tailor` before every save — one shared verification pass.
- README and GETTING-STARTED document the state layer.
- Source spec has been removed.

Issue [Remotivated/job-hunt-os#1](https://github.com/Remotivated/job-hunt-os/issues/1) can be closed when this plan is fully executed.
