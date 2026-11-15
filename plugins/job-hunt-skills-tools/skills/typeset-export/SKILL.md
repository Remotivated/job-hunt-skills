---
name: typeset-export
description: Exports a saved Job Hunt Skills resume, CV, or cover letter to Word, PDF, and an HTML preview next to its markdown using a Node script, typesetting the PDF with Typst when it is installed. Use when a Job Hunt Skills skill hands off document export and this companion is installed.
---

# Typeset export

Part of Job Hunt Skills Tools, the optional companion to Job Hunt Skills. A Job Hunt Skills skill hands document export to this skill by name when it is available, after its own pre-export checklist; without it, that skill asks the host for Word and PDF files from its written layout specification. The exporter needs no install step: its JavaScript dependencies ship as readable modules in `scripts/vendor/`, and it makes no network requests.

## Before you run anything

1. **Workspace.** The command runs with its working folder set to the job-hunt folder the user already confirmed, the one that holds (or will hold) `my-documents/`. If no folder has been confirmed in this conversation, stop and hand the step back: the calling skill confirms the folder first. Never run a command from inside this plugin, the Job Hunt Skills plugin, or a checkout that contains them.
2. **Plugin root.** Resolve `{tools_root}` from this skill file, not from the working folder: take the absolute path of this `SKILL.md`, go to its parent folder, then `../..`. Check that `{tools_root}/scripts/` exists. If it does not, report that the companion cannot run here and hand the step back.
3. **Node.** The scripts need Node 22 or newer. If `node` is missing or the command cannot be started, report that the companion cannot run and hand the step back.

## Command

Pass every document to export in one run, as paths relative to the workspace:

```bash
node "{tools_root}/scripts/export-documents.mjs" my-documents/applications/{id}/resume.md my-documents/applications/{id}/coverletter.md
```

For each input it writes `.html`, `.docx`, and `.pdf` next to the markdown, all three together or none. Pages are US Letter only; hand back an A4 document (such as a UK/EU CV) so the calling skill exports it another way. It leaves the frontmatter out and refuses a document that still holds HTML comments, `[ASK: …]` or `[VERIFY: …]` markers, bracket placeholders, or "year TBD", and names what to fix.

## Reading the result

- The last line is `EXPORT_TIER=3` when the PDF was typeset with Typst, or `EXPORT_TIER=2` when the built-in renderer made it. On tier 2, mention that installing Typst (one command, about 50 MB: `brew install typst`, `winget install --id Typst.Typst`, or `snap install typst`) upgrades future PDFs. Typst runs locally only if it is already installed.
- **Exit `0`:** every document was exported. Name the files.
- **Exit `1` with a "not ready to render" message:** show it; the user fixes the markdown and exports again. This is a refusal, not a reason to export the document some other way.
- **Exit `1` for one document of several, a crash, or Node missing:** hand the step back as **not completed**, with the "Wrote" lines that did print. The calling skill keeps the files that were written and produces only the missing ones.
