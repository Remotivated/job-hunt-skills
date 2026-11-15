# Job Hunt Skills Repository Guidance

This repository ships one shared set of Agent Skills to Codex, Claude Code, and Cowork. Keep `plugins/job-hunt-skills/skills/` as the single source of truth; do not duplicate skill bodies under provider-specific directories. The one generated exception is each skill's `references/` folder, described below.

The installable plugin is `plugins/job-hunt-skills/`. Users and the plugin directory receive only that folder, so anything a skill needs at runtime must live inside it and must not reference files outside it. It is text only: Markdown, plain text, JSON, YAML, its icon, and its license. Never add a script, font, HTML or Typst template, or any other code to it, and never make a skill run `node`, name a script path, or install or fetch anything; `npm run test:text-only` enforces this.

The optional companion is `plugins/job-hunt-skills-tools/`. It holds the Node scripts, vendored modules, fonts, and code templates, and thin skills that run them. Main-plugin skills address a companion skill by name only (state-layer §14) and keep a complete written procedure for every step it performs. Examples, prompts, tests, CI, and build tooling stay at the repository root.

## Before editing workflows

- Read `plugins/job-hunt-skills/skills/_shared/state-layer.md` before changing any skill that reads or writes `my-documents/`, and `plugins/job-hunt-skills/skills/_shared/truth-and-content.md` before changing how a skill handles postings, claims, research, or candidate-facing wording.
- Edit the shared rule files only in `plugins/job-hunt-skills/skills/_shared/`, then run `npm run sync:shared`. It copies them into every skill's `references/` folder, because some hosts let a skill read only files inside its own folder. Skills link `references/<file>.md`, never `../_shared/`. Never edit a copy by hand; `npm run check:shared` and `npm run test:plugin` fail when a copy is missing or out of date.
- Preserve truthful-claim rules, workspace confirmation before first write, report numbering, tracker schemas, and resume/CV selection behavior.
- Tracker and report writes follow the written procedure in state-layer §12; the companion's `plugins/job-hunt-skills-tools/scripts/state.mjs` applies the same rules. Rule changes update the state-layer rule list, `scripts/fixtures/state/`, and the companion script together.
- Opportunity envelopes and snapshots follow state-layer §13; the companion's `plugins/job-hunt-skills-tools/scripts/opportunity.mjs` applies the same OP rules. The rules, `scripts/fixtures/opportunity/`, and the script change together.
- Document export follows `plugins/job-hunt-skills/skills/_shared/document-export.md`. A layout change updates it and the companion's exporter and templates together.
- Plugin-owned paths for the main plugin are listed in state-layer §0; the companion's own paths and the shared user paths are in `plugins/job-hunt-skills-tools/scripts/workspace.mjs`. A new top-level file or folder in either plugin folder must be added to its list.
- Keep provider-specific installation metadata in the plugin's `.codex-plugin/` and `.claude-plugin/`, or in the repository's `.agents/`, `.claude-plugin/marketplace.json`, or `.claude/`. Keep skill behavior provider-neutral unless a surface genuinely needs different recovery instructions.
- Bundled guides and templates come from the plugin installation root, and the companion's scripts from the companion's own root. User documents always come from the confirmed working folder.

## Required checks

Run the narrow check for the files you changed, then run the complete set before handoff:

```bash
npm run check:shared
npm run test:codex
python3 scripts/test_skill_contracts.py
python3 scripts/check-content-hygiene.py
python3 scripts/check-internal-links.py
npm run test:strength
npm run test:state
npm run test:opportunity
npm run test:export
npm run test:plugin
npm run test:text-only
```

When `plugins/job-hunt-skills-tools/scripts/vendor/` or `package-lock.json` changes, also run:

```bash
npm ci
npm run build:vendor
git diff --exit-code plugins/job-hunt-skills-tools/scripts/vendor
```

## Compatibility

- Preserve Claude Code and Cowork support while adding or changing Codex support.
- An MCP server may be added as an optional connected path. Every skill must keep working without it, and the local and pasted-material path stays complete. The change that adds one also updates the plugin README and the package tests that currently assert the plugin ships no MCP servers.
- Do not add telemetry or hosted service code. User data leaves the user's machine only through a connection the user explicitly chose, and only the records they selected: no implicit uploads, whole-workspace sharing, or background sync.
- Do not write job-search files into a plugin cache or repository checkout unless the user explicitly chose that folder as their workspace.
