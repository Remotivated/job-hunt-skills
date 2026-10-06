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

```bash
python3 scripts/check-content-hygiene.py
python3 scripts/check-internal-links.py
python3 scripts/test_skill_contracts.py
npm run test:codex
npm run test:state
npm run test:export
npm run test:plugin
```

The hygiene check catches unresolved placeholders and HTML comments leaking into rendered samples. The link checker validates that internal markdown links point at files that exist. The skill contract tests catch missing skills, schema drift, and stale state-layer conventions. The Codex checks cover plugin metadata and public Codex documentation. The state tests cover tracker and report writes, status transitions, and the plugin/user path split, using the fixtures in `scripts/fixtures/state/`. The export tests cover the document renderer. The plugin package tests check that the plugin folder stays self-contained and within the plugin directory's limits, and that the release ZIP contains only that folder.
