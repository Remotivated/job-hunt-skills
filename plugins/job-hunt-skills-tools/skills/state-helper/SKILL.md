---
name: state-helper
description: Locked, validated writes to the Job Hunt Skills tracker (my-documents/applications.md) and numbered reports (my-documents/reports/) using a Node script. Use when a Job Hunt Skills skill hands off a tracker upsert, a tracker check, or a report write and this companion is installed.
---

# State helper

Part of Job Hunt Skills Tools, the optional companion to Job Hunt Skills. A Job Hunt Skills skill hands a tracker or report write to this skill by name when it is available; without it, that skill follows its own written procedure. The script applies the same rules, adds a workspace lock so two sessions never interleave a write, and writes through a temporary file so a failed run leaves the file as it was.

## Before you run anything

1. **Workspace.** The command runs with its working folder set to the job-hunt folder the user already confirmed, the one that holds (or will hold) `my-documents/`. If no folder has been confirmed in this conversation, stop and hand the step back: the calling skill confirms the folder first. Never run a command from inside this plugin, the Job Hunt Skills plugin, or a checkout that contains them.
2. **Plugin root.** Resolve `{tools_root}` from this skill file, not from the working folder: take the absolute path of this `SKILL.md`, go to its parent folder, then `../..`. Check that `{tools_root}/scripts/` exists. If it does not, report that the companion cannot run here and hand the step back.
3. **Node.** The scripts need Node 22 or newer. If `node` is missing or the command cannot be started, report that the companion cannot run and hand the step back.
4. **Confirmation.** Add `--user-confirmed` only after the user said yes, in this conversation, to the status change or to a new row that starts at anything but `saved`. Without it the script refuses the change and writes nothing.

## Commands

Tracker row, inserted or updated (omit any flag you have no value for; omit `--status` to keep a row's current status):

```bash
node "{tools_root}/scripts/state.mjs" tracker upsert --id {id} --company "{Company}" --role "{Role}" [--status {status}] [--source {source}] [--comp-expected "{text}"] [--next-action-date {YYYY-MM-DD}] [--link {url}] [--user-confirmed]
```

Tracker check, which validates the table and writes nothing:

```bash
node "{tools_root}/scripts/state.mjs" tracker check
```

Report, numbered and created in one locked step. Write the draft, with its frontmatter, to a file outside `my-documents/reports/` (for example the system temp folder), or pipe it on stdin:

```bash
node "{tools_root}/scripts/state.mjs" report write --slug {slug} --file {draft path}
```

The result names the report's final path and its `report_id`. An existing report is never overwritten.

## Reading the result

Each command prints one JSON line and exits with one of these codes:

| Exit | Meaning | What to do |
| --- | --- | --- |
| `0` | Done, or `"action": "unchanged"` | Continue. Show any `warnings` to the user. |
| `2` | The working folder is a plugin folder or a checkout, not a user workspace | Show the message verbatim and stop. Do not retry the step any other way. |
| `3` | Refused: a parse error, an invalid field, a missing confirmation, or a conflict. Nothing was written. | Show the `message` (and `region` for a parse error) and stop that step. Do not retry it through the written procedure or by hand-editing the file. The one exception is `"error": "conflict"`: another writer changed the file mid-run, so hand the step back for the calling skill to re-read and hand over once more. |
| `4` | Another session holds the workspace lock. Nothing was written. | Wait a moment and retry once; if it is still busy, tell the user. |
| `1`, or no result at all | Unexpected error, or the script could not run | Hand the step back as **not completed**, with the error. The calling skill re-reads the files to see what, if anything, changed before it continues. |

A refusal (`2` or `3`) is an answer, not a failure: the calling skill stops that step and reports it. Only a step that could not run (`1`, Node missing, a crash) goes back to the written procedure.
