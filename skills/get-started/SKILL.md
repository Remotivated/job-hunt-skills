---
name: get-started
description: Use when the user is new to Job Hunt Skills and wants to set up the local workspace and build their first source work document in resume or CV format, and/or a cover letter. Triggers on "I'm new to Job Hunt Skills", "help me get started", "set me up", "first time using this", or when the user explicitly invokes /get-started. Also use when `my-documents/` has not been scaffolded yet. Once the user has existing source documents and is just iterating, prefer `resume-builder` directly.
---

The onboarding wrapper for Job Hunt Skills. Walk a first-time user from a fresh clone to a scaffolded local workspace with at least one source document built and ready. The document generation itself lives in `resume-builder`; this skill adds orientation, scaffolding, and post-build framing.

## Workflow

### 1. Orient the user

Before the interview starts, give a short orientation in plain language. You're talking to a jobseeker, not a developer. Lower the stakes and explain the shape of the work.

Convey:

- Job Hunt Skills treats the user's main work document, whether they call it a resume or CV, as a source-of-truth document. Build it honestly once, then tailor copies for specific roles.
- The next 15-25 minutes will gather work history, target roles, and proof points. If they already have a resume or LinkedIn export, use it.
- The output is their main work document, plus a cover letter only if there is enough specificity to write one worth sending.
- Later, the same material can support company research, tailored applications, honest feedback, and interview prep.

Vocabulary:

- Mirror the user's word. If they say "CV," say "CV." If they say "resume," say "resume."
- If they have not signaled a word yet, use "your main work document" until they do.
- Avoid internal terms in user-facing text: canonical, state layer, drift check, scaffolding, DOCX, PATH, LibreOffice.

End the orientation with a plain-language scope question:

- If they have already said "CV" or "resume": "Want a resume, a cover letter, or both?"
- If they have not signaled a word: "Want a resume, a cover letter, or both? For the resume, do you want a short achievement-focused version or a longer CV-style version with a personal statement?"
- If they want a cover letter, ask whether they have a specific role/company or tightly defined target lane. Do not force a generic cover letter.
- If they have not mentioned source material, also ask whether they have an existing resume or LinkedIn export to work from.

### 2. Scaffold the workspace

Run `node scripts/scaffold-state.mjs` once before handing off to `resume-builder`. The script is idempotent and creates only missing files/directories.

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
