# Job Hunt Skills Repository Guidance

This repository ships one shared set of Agent Skills to Codex, Claude Code, and Cowork. Keep `skills/` as the single source of truth; do not duplicate skill bodies under provider-specific directories.

## Before editing workflows

- Read `skills/_shared/state-layer.md` before changing any skill that reads or writes `my-documents/`, and `skills/_shared/truth-and-content.md` before changing how a skill handles postings, claims, research, or candidate-facing wording.
- Preserve truthful-claim rules, workspace confirmation before first write, report numbering, tracker schemas, and resume/CV selection behavior.
- Tracker and report writes go through `scripts/state.mjs` when Node is available. Rule changes update the state-layer rule list, `scripts/fixtures/state/`, and the helper together.
- Opportunity envelopes and snapshots go through `scripts/opportunity.mjs` (state-layer §13). Its OP rules, `scripts/fixtures/opportunity/`, and the helper change together.
- Plugin-owned and user-owned paths are listed in `scripts/workspace.mjs` and state-layer §0. A new top-level file or folder must be added to both.
- Keep provider-specific installation metadata in `.codex-plugin/`, `.agents/`, `.claude-plugin/`, or `.claude/`. Keep skill behavior provider-neutral unless a surface genuinely needs different recovery instructions.
- Bundled scripts and templates come from the plugin installation root. User documents always come from the confirmed working folder.

## Required checks

Run the narrow check for the files you changed, then run the complete set before handoff:

```bash
npm run test:codex
python3 scripts/test_skill_contracts.py
python3 scripts/check-content-hygiene.py
python3 scripts/check-internal-links.py
npm run test:strength
npm run test:state
npm run test:opportunity
npm run test:export
```

When `scripts/vendor/` or `package-lock.json` changes, also run:

```bash
npm ci
npm run build:vendor
git diff --exit-code scripts/vendor
```

## Compatibility

- Preserve Claude Code and Cowork support while adding or changing Codex support.
- Do not add an MCP server, hosted service, telemetry, or user-data upload path.
- Do not write job-search files into a plugin cache or repository checkout unless the user explicitly chose that folder as their workspace.
