# Job Hunt Skills Tools

An optional companion to [Job Hunt Skills](https://github.com/Remotivated/job-hunt-skills). It adds local Node scripts for the steps that Job Hunt Skills otherwise does with your assistant's ordinary file tools and your host's own document abilities. Job Hunt Skills works fully without it; install this only if you want what the scripts add.

## What it adds

- **Typeset Word and PDF export.** Turns a saved resume, CV, or cover letter into `.docx`, `.pdf`, and an `.html` preview next to the markdown, with a consistent layout on every computer. If [Typst](https://typst.app) is already installed, the PDF is typeset with it.
- **Locked tracker and report writes.** Tracker rows and numbered reports are written under a workspace lock, through a temporary file, so two sessions never interleave a write and a failed run leaves the file as it was.
- **Posting fingerprints.** Saved postings get a fingerprint of their text, so a re-pasted or re-fetched posting is recognised even without an address or id.
- **Scaffolding and progress lines** computed from your files.

## Install

Install it next to Job Hunt Skills, from the same marketplace.

Claude Code:

```text
/plugin marketplace add Remotivated/job-hunt-skills
/plugin install job-hunt-skills-tools@remotivated
```

Codex:

```bash
codex plugin marketplace add Remotivated/job-hunt-skills
codex plugin add job-hunt-skills-tools@remotivated
```

Node 22 or newer must be installed. There is no `npm install` step: the exporter's JavaScript dependencies ship as readable modules in `scripts/vendor/`.

## How it works with Job Hunt Skills

Job Hunt Skills hands a step to one of this plugin's skills by name when it is available in your session, and follows its own written procedure when it is not:

| Skill | Step |
| --- | --- |
| [state-helper](skills/state-helper/SKILL.md) | Tracker rows and numbered reports |
| [workspace-scaffold](skills/workspace-scaffold/SKILL.md) | Creating `my-documents/` in your folder |
| [opportunity-helper](skills/opportunity-helper/SKILL.md) | Checking and saving job-posting snapshots |
| [profile-strength](skills/profile-strength/SKILL.md) | The progress and momentum lines |
| [typeset-export](skills/typeset-export/SKILL.md) | Word, PDF, and HTML export |

If a script cannot run (for example, Node is missing), Job Hunt Skills checks what the failed step changed and finishes the rest with its written procedure. If a script refuses a step, because you declined a change or the folder is not a workspace, the step stops; it is not retried another way.

## What runs on your computer

- **Node scripts, only when a skill hands them a step.** They read and write files only under `my-documents/` in the folder you confirmed, and refuse to run inside either plugin's folder or a checkout that contains them.
- **Typst, only if you installed it.** The exporter runs it locally with the template and fonts in `templates/`.
- **No network calls.** None of the scripts sends or fetches anything over the network. The vendored PDF library's remote-download code is replaced with a stub that refuses remote resources.

The plugin has no hooks, no MCP servers, no telemetry, and no account to create. Third-party licenses for the vendored modules and fonts are in `scripts/vendor/LICENSES.md` and `templates/fonts/OFL.txt`.

## License

MIT, see [LICENSE](LICENSE).
