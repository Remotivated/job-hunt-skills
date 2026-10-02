# Job Hunt Skills

AI-assisted skills for a practical, truthful job search. Installs as a plugin into both Claude Code and Cowork.

The state-layer contract below governs every skill that reads or writes `my-documents/`. It is auto-loaded on folder bind so every skill run operates under the same rules.

@skills/_shared/state-layer.md

The truth and content contract governs what any skill reads from outside material and writes into candidate-facing documents.

@skills/_shared/truth-and-content.md
