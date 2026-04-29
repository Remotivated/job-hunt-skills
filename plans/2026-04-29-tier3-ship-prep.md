# Tier 3 Ship-Prep Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Get the repo into shippable state by closing four Tier 3 cleanup items from issue #21. The fifth Tier 3 item (directory rename) is deferred — the user will publish under a fresh repo named `job-hunt-skills` after this work lands.

**Architecture:** Four independent, parallelizable tasks. Three are pure file edits (slash command, settings, README/docs cleanup). One touches CI and adds a soffice integration test. No shared state between tasks; each ends in its own commit.

**Tech Stack:** Markdown skills/commands, JSON settings, Python tests, GitHub Actions YAML.

**Context Chain:**
- GitHub issue: https://github.com/Remotivated/job-hunt-os/issues/21 (Tier 3 - structural cleanup)
- Audit commit: `24a075e` (v1.0.0 cutover + Tier 1)
- State-layer contract: `skills/_shared/state-layer.md`

---

## File Structure

| Path | Action | Responsibility |
|------|--------|---|
| `.claude/commands/cover-letter.md` | Create | Slash command that invokes the `cover-letter` skill |
| `research/` (entire dir) | Delete | Reference notes — claims now live in `guides/` |
| `README.md` | Modify | Remove `research/` row from repo-structure table |
| `scripts/generate-docx.py` | Modify | Update two comments that cite `research/resume-format-options.md` |
| `.claude/settings.json` | Modify | Collapse 9 per-skill `Edit` entries to one `Edit(/skills/**)` |
| `.github/workflows/checks.yml` | Modify | Install LibreOffice; run new PDF render test |
| `scripts/test_generate_docx.py` | Modify | Add soffice integration test, gated on `soffice` availability |

Each task ends in a focused commit. Final task: open a PR.

---

## Task 1: Add `/cover-letter` slash command

**Goal:** Provide a slash-command entry point that invokes the existing `cover-letter` skill, mirroring the pattern of `/get-started` and `/build-resume`. The skill stays as-is.

**Files:**
- Create: `.claude/commands/cover-letter.md`

**Reference pattern:** `.claude/commands/get-started.md` (15 lines, thin invoker).

- [ ] **Step 1: Read the reference command file**

Read `.claude/commands/get-started.md` and `.claude/commands/build-resume.md` to confirm the established frontmatter shape and the "invoke the skill, run its workflow" pattern.

- [ ] **Step 2: Read the cover-letter skill to understand the workflow it owns**

Read `skills/cover-letter/SKILL.md` (lines 1-50 are enough). Note the three-way classification (specific application / source letter / too broad) and the minimum-specificity rules. The slash command should defer all of that to the skill, not duplicate it.

- [ ] **Step 3: Create the slash command file**

Create `.claude/commands/cover-letter.md`:

```markdown
---
description: Build or update a cover letter — tailored to a specific role, or a reusable source letter for a tight target lane
---

The user wants a cover letter. The `cover-letter` skill owns the classification, evidence-gathering, and quality bar — invoke it and run its full workflow.

Invoke the `cover-letter` skill and follow its workflow:

1. Classify the request as specific application, source letter for a lane, or too broad.
2. If too broad, pause and ask for specificity rather than drafting.
3. Gather evidence from the selected source work document, story bank, and proof assets.
4. Delegate the draft to `resume-tailor` (specific application) or `resume-builder` (source letter).
5. Run `claim-check` before saving.

If `$ARGUMENTS` is non-empty, treat it as context about the target — a company name, role, application id, or lane description. Pass it through when the cover-letter skill hands off to the underlying builder.
```

- [ ] **Step 4: Verify the file lands where slash commands are discovered**

Run: `ls .claude/commands/`
Expected output includes: `build-resume.md  cover-letter.md  get-started.md`

- [ ] **Step 5: Sanity-check skill discovery is unaffected**

Run: `python scripts/test_skill_contracts.py`
Expected: all tests pass. The contract tests scan `skills/`, not `.claude/commands/`, so the new command must not affect them. If anything fails, the slash command file is malformed or in the wrong place — fix before committing.

- [ ] **Step 6: Commit**

```bash
git add .claude/commands/cover-letter.md
git commit -m "feat: add /cover-letter slash command alongside the cover-letter skill"
```

---

## Task 2: Delete `research/` directory and clean up references

**Goal:** Remove `research/` entirely. The user wants a clean repo for publication — old reference notes are not valuable to consumers, and the canonical claims have already been absorbed into `guides/`.

**Files:**
- Delete: `research/` (the whole directory: `README.md`, `interview-and-negotiation.md`, `remote-work-signals.md`, `resume-best-practices.md`, `resume-format-options.md`)
- Modify: `README.md` (remove the table row)
- Modify: `scripts/generate-docx.py` (two comments referencing `research/resume-format-options.md`)

- [ ] **Step 1: Confirm reference inventory**

Run: `grep -rn "research/" --include="*.md" --include="*.py" --include="*.json" --include="*.mjs" --include="*.yml"`

Expected matches (from prior audit; verify nothing new):
- `README.md:161` — repo structure table row
- `scripts/generate-docx.py:35` — comment ("See research/resume-format-options.md…")
- `scripts/generate-docx.py:299` — comment ("matches Option B in research/resume-format-options.md…")
- `.claude/settings.json:12` — `Edit(/skills/company-research/**)` — **NOT a reference to `research/`**, this is the `company-research` skill. Leave it alone.

If new references exist, update them too. The line that mentions `company-research` is unrelated and must not be touched.

- [ ] **Step 2: Delete the directory**

```bash
git rm -r research/
```

- [ ] **Step 3: Update README.md**

Remove the row `| `research/` | Source notes behind the guides |` from the repository-structure table (currently line ~161). Delete just that one row; do not reformat the table or touch other rows.

- [ ] **Step 4: Update `scripts/generate-docx.py` comment at line ~35**

Old comment (around line 35):

```python
# Design tokens — match templates/shared.css from the prior pipeline so the
# DOCX output is visually equivalent to "single-column serif with restrained
# navy accent." See research/resume-format-options.md for the full rationale.
```

New comment — drop the dangling reference, keep the design intent:

```python
# Design tokens — match templates/shared.css from the prior pipeline so the
# DOCX output is visually equivalent to "single-column serif with restrained
# navy accent."
```

- [ ] **Step 5: Update `scripts/generate-docx.py` comment at line ~299**

Old comment (around line 299):

```python
            # Navy is reserved for name and section headers (set via
            # default_color by emit_header/emit_h2). Body-level **bold**
            # inherits the paragraph default so role titles and skill
            # labels stay near-black — matches Option B in
            # research/resume-format-options.md ("accent in 2-3 places,
            # never more").
```

New comment — preserve the rule, drop the citation:

```python
            # Navy is reserved for name and section headers (set via
            # default_color by emit_header/emit_h2). Body-level **bold**
            # inherits the paragraph default so role titles and skill
            # labels stay near-black — accent in 2-3 places, never more.
```

- [ ] **Step 6: Verify no stale references remain**

Run: `grep -rn "research/" --include="*.md" --include="*.py" --include="*.json" --include="*.mjs" --include="*.yml"`

Expected: only `.claude/settings.json` matches (the `company-research` skill — unrelated). Nothing else.

- [ ] **Step 7: Run tests to verify nothing broke**

Run: `python scripts/test_generate_docx.py`
Expected: all tests pass.

Run: `python scripts/check-content-hygiene.py`
Expected: passes.

- [ ] **Step 8: Commit**

```bash
git add -u research/ README.md scripts/generate-docx.py
git commit -m "chore: remove research/ reference notes — claims now live in guides/"
```

(`git add -u` re-stages the deletions and modifications cleanly; the directory is already tracked.)

---

## Task 3: Tighten `.claude/settings.json`

**Goal:** Replace 9 per-skill `Edit(/skills/<name>/**)` entries with one `Edit(/skills/**)`. Adding a new skill should not require a settings edit.

**Files:**
- Modify: `.claude/settings.json`

- [ ] **Step 1: Read the current settings file**

Read `.claude/settings.json`. Confirm the per-skill entries match the audit:
- `Edit(/skills/_shared/**)`
- `Edit(/skills/resume-drift-check/**)`
- `Edit(/skills/resume-builder/**)`
- `Edit(/skills/resume-tailor/**)`
- `Edit(/skills/interview-coach/**)`
- `Edit(/skills/company-research/**)`
- `Edit(/skills/linkedin-optimizer/**)`
- `Edit(/skills/proof-asset-creator/**)`
- `Edit(/skills/claim-check/**)`
- `Edit(/skills/cover-letter/**)`
- `Edit(/skills/interviewing/**)`

(That's 11 entries total including `_shared`. Audit said 9; either way, all of them collapse into one.)

- [ ] **Step 2: Rewrite the file**

Replace the entire file with:

```json
{
  "permissions": {
    "allow": [
      "Edit(/skills/**)",
      "Bash(git add:*)",
      "Bash(git commit -m ':*)",
      "Bash(git push:*)",
      "Bash(git pull:*)",
      "Bash(python scripts/test_skill_contracts.py)",
      "Bash(python scripts/check-content-hygiene.py)",
      "Bash(node scripts/scaffold-state.mjs)"
    ]
  }
}
```

Order: skills edit first (most-used), then git verbs grouped together, then the three project-specific bash commands. Trailing comma rules of JSON: none after the last array item.

- [ ] **Step 3: Validate JSON**

Run: `python -c "import json; json.load(open('.claude/settings.json'))"`
Expected: no output (valid JSON). If it raises, fix the syntax.

- [ ] **Step 4: Commit**

```bash
git add .claude/settings.json
git commit -m "chore: collapse per-skill Edit permissions to Edit(/skills/**)"
```

---

## Task 4: CI — install LibreOffice and exercise PDF rendering

**Goal:** Today's `checks.yml` is Ubuntu without LibreOffice, so `generate-docx.py`'s soffice→PDF step is untested. Install LibreOffice in the existing job and add one integration test that asserts the .pdf artifact actually gets produced.

**Files:**
- Modify: `.github/workflows/checks.yml`
- Modify: `scripts/test_generate_docx.py`

**Why install on the existing Ubuntu job rather than add a Mac/Windows matrix:** the Cowork sandbox is Linux. Ubuntu is the production-relevant target. Matrix triples runtime to test code that's mostly platform-independent Python.

- [ ] **Step 1: Update `.github/workflows/checks.yml` to install LibreOffice**

Read the current file. Add a LibreOffice install step between "setup-python" and "Install Python dependencies". The full updated file should be:

```yaml
name: Checks

on:
  push:
  pull_request:

jobs:
  content-and-docx:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install LibreOffice (for soffice headless PDF render)
        run: |
          sudo apt-get update
          sudo apt-get install -y --no-install-recommends libreoffice
          soffice --version

      - name: Install Python dependencies
        run: python -m pip install python-docx markdown-it-py

      - name: Run content hygiene
        run: python scripts/check-content-hygiene.py

      - name: Run DOCX tests
        run: python scripts/test_generate_docx.py

      - name: Run skill contract tests
        run: python scripts/test_skill_contracts.py
```

The `soffice --version` line is a fast smoke check — if the install silently failed, the job fails here with a clear message instead of deep inside a test.

- [ ] **Step 2: Add a soffice integration test class to `scripts/test_generate_docx.py`**

Read the current end of the file. The test framework is `unittest`, with classes like `BuildDocumentTests` and `RenderValidationTests`. Add a new class **before** the `if __name__ == "__main__":` block at the bottom.

The test must:
1. Skip when `soffice` is not on PATH (so local dev runs without LibreOffice still pass).
2. Write a valid resume markdown to a temp file.
3. Call `gd.md_to_docx(path)` then convert to PDF using whatever pathway `generate-docx.py` exposes.
4. Assert the .pdf exists and is non-empty.

Read `scripts/generate-docx.py` first to see the exact PDF-conversion entry point. Likely names: `docx_to_pdf`, `convert_to_pdf`, or it's inlined inside `md_to_docx`. Use whatever's there — do **not** invent a new public API. If the PDF step is only reachable via `python scripts/generate-docx.py <path>`, shell out via `subprocess`.

Add the test class. Template (adjust to actual API):

```python
import os
import shutil
import subprocess
import tempfile

# ... existing classes ...

class SofficeIntegrationTests(unittest.TestCase):
    """End-to-end test that the .docx -> .pdf step produces a real PDF.
    Skipped when LibreOffice (`soffice`) is not on PATH so local runs
    without LibreOffice still pass. CI installs LibreOffice and exercises
    this path."""

    @unittest.skipUnless(
        shutil.which("soffice"), "LibreOffice (soffice) not on PATH"
    )
    def test_resume_renders_to_pdf(self):
        with tempfile.TemporaryDirectory() as tmp:
            md_path = Path(tmp) / "resume.md"
            md_path.write_text(SAMPLE_RESUME, encoding="utf-8")
            # Run generate-docx.py against the fixture. Use the script
            # entry point so this exercises the same path users hit.
            script = _HERE / "generate-docx.py"
            result = subprocess.run(
                [sys.executable, str(script), str(md_path)],
                capture_output=True, text=True, check=False,
            )
            self.assertEqual(
                result.returncode, 0,
                f"generate-docx.py failed:\nstdout: {result.stdout}\nstderr: {result.stderr}",
            )
            pdf_path = md_path.with_suffix(".pdf")
            self.assertTrue(
                pdf_path.exists(),
                f"expected {pdf_path}, got: {list(Path(tmp).iterdir())}",
            )
            self.assertGreater(
                pdf_path.stat().st_size, 1024,
                "PDF is suspiciously small — render likely produced an empty file",
            )
```

If `subprocess` is the right call, also add `import subprocess`, `import shutil`, `import tempfile`, `import os` to the imports at the top of the file if not already present. (Verify against current imports before adding duplicates.)

- [ ] **Step 3: Run the test locally**

If LibreOffice is installed locally:
- Run: `python scripts/test_generate_docx.py`
- Expected: all tests pass, including the new `SofficeIntegrationTests`.

If LibreOffice is **not** installed locally:
- Run: `python scripts/test_generate_docx.py`
- Expected: all tests pass, with `SofficeIntegrationTests::test_resume_renders_to_pdf` reported as `skipped`.

- [ ] **Step 4: Validate the YAML**

Run: `python -c "import yaml; yaml.safe_load(open('.github/workflows/checks.yml'))"`
Expected: no output. If yaml isn't installed, run `python -m pip install pyyaml` first or skip and rely on CI.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/checks.yml scripts/test_generate_docx.py
git commit -m "ci: install LibreOffice and exercise the soffice PDF render path"
```

- [ ] **Step 6: Push and confirm CI passes**

Push to a feature branch (do not push direct to master). After CI runs, confirm the new step is green:
- "Install LibreOffice (for soffice headless PDF render)" — passes
- "Run DOCX tests" — passes, including new soffice integration test (no skip on CI)

If CI fails, diagnose root cause. Common failure modes:
- `apt-get install libreoffice` is too large and times out → switch to `--no-install-recommends libreoffice-core libreoffice-writer` (smaller).
- `soffice` not on PATH after install → on Ubuntu it usually is; if not, `which libreoffice` and create a symlink, or invoke as `libreoffice --headless --convert-to pdf ...`.
- Test asserts a `.pdf` next to the input, but `soffice --convert-to pdf --outdir <dir>` puts it in `<dir>` — verify the `generate-docx.py` invocation matches what the test expects.

---

## Task 5: Open the PR

**Goal:** Bundle all four commits into one PR so the user can review and merge as one shippable unit. (Per the user's bundling preference for tightly-coupled changes.)

- [ ] **Step 1: Confirm clean working tree on a feature branch**

Run: `git status`
Expected: clean. If there are uncommitted changes from Tasks 1-4, stop and figure out which task they belong to before continuing.

Run: `git branch --show-current`
Expected: not `master`. If it is, create a feature branch first:
```bash
git checkout -b tier3-ship-prep
```

- [ ] **Step 2: Push the branch**

```bash
git push -u origin tier3-ship-prep
```

- [ ] **Step 3: Open the PR**

```bash
gh pr create --title "Tier 3 ship-prep: cover-letter slash command, research/ deletion, settings + CI cleanup" --body "$(cat <<'EOF'
## Summary

Closes the four actionable Tier 3 items from #21 to get the repo to shippable state. The fifth item (directory rename) is intentionally deferred — the user plans to publish under a fresh repo named `job-hunt-skills`.

- Add `/cover-letter` slash command alongside the existing skill
- Delete `research/` reference notes (claims live in `guides/`)
- Collapse 11 per-skill `Edit` permissions to one `Edit(/skills/**)`
- Install LibreOffice in CI and exercise the soffice PDF render path

## Test plan

- [ ] CI green on this branch (content hygiene, DOCX tests including new soffice integration, skill contract tests)
- [ ] `/cover-letter` is discoverable as a slash command
- [ ] `grep -rn "research/" --include="*.md" --include="*.py"` returns only the unrelated `company-research` skill match
- [ ] `.claude/settings.json` validates as JSON

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: Surface the PR URL to the user**

Print the URL `gh pr create` returns.

---

## Deferred: directory rename via fresh repo

**Not part of this plan.** After this PR merges, the user will:

1. Create a new GitHub repo `Remotivated/job-hunt-skills`.
2. Copy the working tree (no `.git/`) into a fresh local clone of that repo.
3. Initial commit. No issue or commit-history baggage.
4. Publish to the marketplace under the new name.
5. Archive `Remotivated/job-hunt-os` (GitHub auto-redirects old URLs).

This is the user's manual final step. Do not attempt it inside this plan.
