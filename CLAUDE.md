# Job Hunt Skills

AI-assisted skills for a practical, truthful job search. Installs as a plugin into Claude Code, Cowork, and Codex. The installable plugin is `plugins/job-hunt-skills/`; everything else at the repository root (examples, prompts, contributor scripts, CI) stays in the repository and is not shipped to users.

The state-layer contract below governs every skill that reads or writes `my-documents/`. It is auto-loaded on folder bind so every skill run operates under the same rules.

@plugins/job-hunt-skills/skills/_shared/state-layer.md

The truth and content contract governs what any skill reads from outside material and writes into candidate-facing documents.

@plugins/job-hunt-skills/skills/_shared/truth-and-content.md
