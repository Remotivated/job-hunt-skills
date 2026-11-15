---
name: workspace-scaffold
description: Creates the empty Job Hunt Skills folder structure (my-documents/ with its tracker and story bank) in a confirmed workspace using a Node script. Use when a Job Hunt Skills skill hands off scaffolding and this companion is installed.
---

# Workspace scaffold

Part of Job Hunt Skills Tools, the optional companion to Job Hunt Skills. A Job Hunt Skills skill hands scaffolding to this skill by name when it is available; without it, that skill creates the same files with ordinary file tools. The script creates only what is missing and never overwrites an existing file, so it is safe to run again after an interrupted run.

## Before you run anything

1. **Workspace.** The command runs with its working folder set to the job-hunt folder the user already confirmed, the one that holds (or will hold) `my-documents/`. If no folder has been confirmed in this conversation, stop and hand the step back: the calling skill confirms the folder first. Never run a command from inside this plugin, the Job Hunt Skills plugin, or a checkout that contains them.
2. **Plugin root.** Resolve `{tools_root}` from this skill file, not from the working folder: take the absolute path of this `SKILL.md`, go to its parent folder, then `../..`. Check that `{tools_root}/scripts/` exists. If it does not, report that the companion cannot run here and hand the step back.
3. **Node.** The scripts need Node 22 or newer. If `node` is missing or the command cannot be started, report that the companion cannot run and hand the step back.

## Command

```bash
node "{tools_root}/scripts/scaffold-state.mjs"
```

It creates `my-documents/` with `applications/`, `reports/`, and `proof-assets/` (each with an empty `.gitkeep`), an empty tracker at `my-documents/applications.md`, and an instructions-only `my-documents/story-bank.md`. Each line of output says whether a path was created or already existed.

## Reading the result

- **Exit `0`:** done. Confirm the four folders and two files exist before the calling skill writes anything else.
- **Exit `2`, the workspace-binding message:** show the message verbatim and stop. The folder is a plugin folder or a checkout. Do not create the files another way; the user picks or confirms a different folder.
- **Any other failure, or Node missing:** hand the step back as **not completed**. The calling skill lists what already exists, keeps it, and creates only what is still missing.
