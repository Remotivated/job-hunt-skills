# Cowork Setup Screenshots

Remotion's `staticFile()` reads from this directory. The `CoworkSetup` composition expects six PNGs here:

1. `01-github-releases.png` — GitHub releases page showing `job-hunt-skills.zip` asset
2. `02-cowork-main.png` — Cowork main view with Customize menu item visible
3. `03-customize-panel.png` — Customize panel with Browse plugins / Custom upload visible
4. `04-file-picker.png` — System file picker dialog
5. `05-folder-prompt.png` — Cowork folder-selection prompt after ZIP install
6. `06-chat-input.png` — Chat input ready for first prompt

Aim for consistent dimensions (1920×1080 preferred).

**See Task 7 of the launch-content plan for full capture instructions.** Until these PNGs exist, `npm run render:cowork` will fail.

The canonical copies should also live at `../src/assets/screenshots/` for source-of-truth, then be copied here for Remotion to consume.
