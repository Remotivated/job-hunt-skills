---
name: get-started
description: Use when the user is new to Job Hunt Skills and wants to set up the local workspace and build their first source work document in resume or CV format, and/or a cover letter. Triggers on "I'm new to Job Hunt Skills", "help me get started", "set me up", "first time using this", or when the user explicitly invokes /get-started. Also use when `my-documents/` has not been scaffolded yet. Once the user has existing source documents and is just iterating, prefer `resume-builder` directly.
---

The onboarding wrapper for Job Hunt Skills. Walk a first-time user from a fresh clone to a scaffolded local workspace with at least one source document built and ready. The document generation itself lives in `resume-builder`; this skill adds orientation, scaffolding, and post-build framing.

## Workflow

### 1. Orient the user — BEFORE any questions, forms, or input gathering

Give a short orientation in plain language **before** asking for any information. You're talking to a jobseeker, not a developer. Lower the stakes and explain the shape of the work.

This step is load-bearing: a tester reported being handed a long input form first and only being told what was happening (and that fields could be skipped) afterwards — at which point the form was already filled. Orientation MUST land first, and the user MUST acknowledge scope before any structured prompt — single question, multi-field form, or batched interview — appears.

Convey:

- Job Hunt Skills treats the user's main work document, whether they call it a resume or CV, as a source-of-truth document. Build it in depth once, then tailor copies for specific roles.
- The next 15-25 minutes will gather work history, target roles, and proof points. If they already have a resume or LinkedIn export, use it.
- It's fine to leave fields blank or say "skip" — gaps are surfaced later, not invented.
- The output is their main work document, plus a cover letter only if there is enough specificity to write one worth sending.
- Later, the same material can support company research, tailored applications, honest feedback, and interview prep.

Vocabulary:
- Avoid internal terms in user-facing text: canonical, state layer, drift check, scaffolding, DOCX, PATH, LibreOffice.

End the orientation with a plain-language scope question:

- If they have already said "CV" or "resume": "Want a resume, a cover letter, or both?"
- If they have not signaled a word: "Want a resume, a cover letter, or both? For the resume, do you want a short achievement-focused version or a longer CV-style version with a personal statement?"
- If they want a cover letter, ask whether they have a specific role/company or tightly defined target lane. Do not force a generic cover letter.
- If they have not mentioned source material, also ask whether they have an existing resume or LinkedIn export to work from.

Wait for the user's reply on scope before scaffolding or invoking `resume-builder`.

### 2. Confirm the workspace, then scaffold

Many users are not developers and will not know what a "working directory" is. Walk them through where their files will live in plain language, and **do not scaffold until they have confirmed a real folder on their own computer**. This step exists because early testers had Claude generate a resume that was never actually saved anywhere they could find — the file landed in the plugin install folder, invisible on the next session.

Follow the [Workspace Preflight (state-layer §10)](../_shared/state-layer.md#10-workspace-preflight). Concretely:

**2a. Show the current location and ask.**

Resolve the absolute path where files would land and ask plainly:

> Your job-hunt files will live in a folder on your computer. Right now I'd save them under:
>
> `{absolute path of cwd}`
>
> Does that look like the right place — a folder you picked for your job search? If you're not sure, just tell me and I'll help you set one up.

**2b. Handle the response.**

- **"Yes, that's right"** → proceed to 2d.

- **"I want a subfolder under that"** (e.g. they want files inside `{cwd}/job-hunt/` rather than mixed into `{cwd}/`):
  - Confirm the name they want.
  - Warn before creating: "I'll need to create a new folder there. You may see a permission prompt — accept it if you want me to continue."
  - Create the subfolder, then re-confirm the new path before scaffolding.

- **"I haven't picked a folder" / "I don't know what this is" / "That path looks wrong"** → see 2c. Do **not** scaffold a guess.

- **The resolved path looks like the plugin install location** (no `my-documents/` exists there and the path matches the plugin directory) → treat as "haven't picked a folder" and go to 2c.

**2c. Help a novice set up a folder.**

If the user doesn't have a folder yet, give them the platform-specific recovery and stop until they come back:

- **Cowork:** "Cowork doesn't know which folder of yours to use yet. Open Cowork's settings, find **Customize → Folders**, and pick a folder where your job-hunt files should live — your Documents folder is a fine choice. Then come back to this conversation and tell me to start over."

- **Claude Code:** "Exit Claude Code (Ctrl+D or `/exit`), open a terminal, navigate into the folder where you want your files (e.g. `cd ~/Documents/job-hunt-skills` — create that folder first if it doesn't exist), then run `claude` again from there."

Do not try to "just save it somewhere reasonable" — that is the bug. Wait for the user to fix the folder, then restart cleanly.

**2d. Scaffold, with fallback, then verify.**

Once a real workspace folder is confirmed, build the structure under that folder. Two paths, same on-disk result:

- **Preferred:** run `node scripts/scaffold-state.mjs`. The script is idempotent and creates only missing files. If it exits non-zero with the "working directory is the plugin install dir" message, surface that message verbatim and go back to 2c.
- **Fallback** (Node not installed, no shell access, command-not-found, or any other non-zero exit *except* the workspace-binding refusal): scaffold manually with native file tools per [state-layer §10 step 5](../_shared/state-layer.md#10-workspace-preflight). Cowork users are typically not developers; do not require them to install Node, and do not skip the scaffold because the script failed.

**Verify before continuing.** List the workspace folder and confirm all of these exist:

- Directories: `my-documents/`, `my-documents/applications/`, `my-documents/reports/`, `my-documents/proof-assets/`
- Files: `my-documents/applications.md`, `my-documents/story-bank.md`

If anything is missing, create it. Every downstream skill assumes this structure is in place; a half-scaffolded workspace is what stranded a tester's resume in chat. Verification is the gate, not the script's exit code.

On success, briefly recap: "Your files will live under `{absolute path}`, and I've set up the folders for resumes, applications, reports, and proof assets." One sentence, then move on to building.

**Vocabulary for this step:** "folder" not "directory", "your computer" not "filesystem", show the actual path (not a placeholder) so the user can read it.

### 3. Build the source documents

Invoke `resume-builder` and run its workflow end-to-end: gather existing materials, run the structured interview, generate outputs with claim checks, save, and generate Word/PDF files where possible.

If the user signaled scope, pass it through so `resume-builder` can route to the right mode.

### 4. Seed the story bank

After saving the source document(s), offer to capture the richest 2-3 accomplishments as STAR+R stubs in `my-documents/story-bank.md`. Do not assume. If they decline, move on.

If they accept, append each story using the canonical H2 + YAML + Situation / Task / Action / Result / Reflection schema from [state-layer section 7](../_shared/state-layer.md#7-story-bank-schema). Mark gaps with `[ASK: ...]` placeholders rather than inventing specifics.

### 5. Close the run

End with a short recap:

- Files created, with paths.
- Reminder that these source documents are what later skills read.
- Best next step:
  - "Want honest feedback on what we just built? Use `resume-auditor`."
  - "Found a specific role? Use `company-research` first, then `resume-tailor`."

## When not to use this skill

If the user already has `my-documents/resume.md` or `my-documents/cv.md` and is asking for an update, tweak, or rebuild, invoke `resume-builder` directly.
