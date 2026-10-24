# Contributing

Thanks for improving Job Hunt Skills. This repo is meant to be useful to jobseekers first, so contributions should make the workflows clearer, more truthful, or easier to use.

## Standards

- **Truth first.** Do not add prompts or examples that encourage invented metrics, titles, tools, employers, credentials, or story details.
- **Human-readable output.** Resumes, letters, briefs, and guides should sound like something a real person would use.
- **No fear-based ATS claims.** If a guide or prompt makes a strong claim about hiring systems, source it or soften it.
- **Human in the Loop.** Contributions should not introduce paths for AI spam or slop such as auto-apply workflows, AI messaging or emails etc.

## Repository Structure

The installable plugin is `plugins/job-hunt-skills/`. Installers and the plugin directory receive only that folder, so everything a skill needs at runtime lives inside it, and nothing inside it may link or refer to files outside it.

| Path | What it is |
| --- | --- |
| `plugins/job-hunt-skills/skills/` | Shared Codex, Claude Code, and Cowork skills |
| `plugins/job-hunt-skills/skills/_shared/` | The state-layer and truth-and-content rules every skill follows. Edit them here, then run `npm run sync:shared` to refresh the generated copy in each skill's `references/` folder |
| `plugins/job-hunt-skills/scripts/` | State, profile-strength, and export scripts the skills run, plus the bundled `vendor/` dependencies |
| `plugins/job-hunt-skills/guides/` | Job search methodology |
| `plugins/job-hunt-skills/templates/` | Resume, CV, and cover letter scaffolds, fonts, and the Typst template |
| `plugins/job-hunt-skills/.claude-plugin/`, `.codex-plugin/` | Claude and Codex plugin manifests |
| `plugins/job-hunt-skills/README.md` | User-facing plugin description, shown as the plugin directory listing |
| `.claude-plugin/marketplace.json`, `.agents/plugins/` | Claude and Codex marketplace metadata (repository only) |
| `prompts/` | Copy/paste prompts for any LLM |
| `examples/` | Synthetic sample outputs |
| `scripts/` | Tests, quality checks, and build scripts (repository only) |

## Local Checks

You need:

- **Node 22 or later.** `engines.node` in `package.json` is the floor. CI runs every check on Node 22 and Node 24 (the newest LTS line), on Linux, macOS, and Windows.
- **Python 3.12**, with `markdown-it-py` installed (`python -m pip install markdown-it-py`) for the internal link check.
- **Typst v0.15.1** on `PATH`, optional. Without it, the export tests skip the Typst-typeset PDF tests; CI always runs them.

No `npm install` is needed: the export tests run against the checked-in vendor modules, as on a user's machine. Run every check with:

```bash
npm test
```

That is the command CI runs. Each check can also be run on its own:

```bash
npm run check:shared
python3 scripts/check-content-hygiene.py
python3 scripts/check-internal-links.py
python3 scripts/test_skill_contracts.py
npm run test:codex
npm run test:strength
npm run test:state
npm run test:opportunity
npm run test:export
npm run test:plugin
```

The shared-rules check fails when a skill's `references/` copy of a `skills/_shared/` file is missing or out of date. The hygiene check catches unresolved placeholders and HTML comments leaking into rendered samples. The link checker validates that internal markdown links point at files that exist. The skill contract tests catch missing skills, schema drift, and stale state-layer conventions. The Codex checks cover plugin metadata, public Codex documentation, and the CI and release workflows: `npm test` runs every `check:*` and `test:*` script, actions are pinned to commit SHAs, and workflows are read-only by default. The state tests cover tracker and report writes, status transitions, and the plugin/user path split, using the fixtures in `scripts/fixtures/state/`. The export tests cover the document renderer. The plugin package tests check that the plugin folder stays self-contained and within the plugin directory's limits, and that the release ZIP contains only that folder.

A new `check:*` or `test:*` script must be added to `npm test` in `package.json`; `npm run test:codex` fails until it is.

When `plugins/job-hunt-skills/scripts/vendor/` or `package-lock.json` changes, also rebuild the vendor modules and confirm nothing changed. CI runs this on Linux:

```bash
npm ci
npm run build:vendor
git diff --exit-code plugins/job-hunt-skills/scripts/vendor
```

## Release

Claude Code and Codex install the plugin from `main`, so a change reaches those users as soon as it lands there. Pull requests to `main` must pass the `all-checks` job in `.github/workflows/checks.yml`, which succeeds only when every check passed on every OS and Node version.

Cowork users install the release ZIP. Pushing a `v*` tag runs `.github/workflows/release.yml`, which runs the same checks first and builds and publishes the ZIP only if they all pass. Before tagging, align the version in `package.json`, `package-lock.json`, both plugin manifests, and the newest `CHANGELOG.md` heading; `npm run test:codex` checks that they match.

Workflow actions are pinned to full commit SHAs, with the version in a trailing comment, and Dependabot proposes updates monthly. The Typst download in CI is checked against the SHA-256 recorded in the workflow; when you change `TYPST_VERSION`, update each asset's hash from the release's published digests.
