---
name: profile-strength
description: Computes the Job Hunt Skills profile-strength line and the tracker momentum line from the files in my-documents/ using a Node script. Use when a Job Hunt Skills skill closes a run with the strength or pulse line and this companion is installed.
---

# Profile strength

Part of Job Hunt Skills Tools, the optional companion to Job Hunt Skills. A Job Hunt Skills skill hands the closing strength or momentum line to this skill by name when it is available; without it, that skill derives the same line from its written definitions. The script reads files only and writes nothing.

## Before you run anything

1. **Workspace.** The command runs with its working folder set to the job-hunt folder the user already confirmed, the one that holds (or will hold) `my-documents/`. If no folder has been confirmed in this conversation, stop and hand the step back: the calling skill confirms the folder first. Never run a command from inside this plugin, the Job Hunt Skills plugin, or a checkout that contains them.
2. **Plugin root.** Resolve `{tools_root}` from this skill file, not from the working folder: take the absolute path of this `SKILL.md`, go to its parent folder, then `../..`. Check that `{tools_root}/scripts/` exists. If it does not, report that the companion cannot run here and hand the step back.
3. **Node.** The scripts need Node 22 or newer. If `node` is missing or the command cannot be started, report that the companion cannot run and hand the step back.

## Commands

```bash
node "{tools_root}/scripts/profile-strength.mjs"           # Profile strength: N/7 — next step
node "{tools_root}/scripts/profile-strength.mjs" --json    # the same, structured
node "{tools_root}/scripts/profile-strength.mjs" --pulse   # tracker momentum line
```

Show the printed line to the user as the calling skill frames it. If the command fails or Node is missing, hand the step back: the calling skill derives the line itself. Nothing was written either way.
