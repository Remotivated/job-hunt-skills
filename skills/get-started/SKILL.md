---
name: get-started
description: Use when the user is new to Job Hunt OS and wants to set up the state layer and build their first canonical resume, CV, and/or cover letter. Triggers on "I'm new to Job Hunt OS", "help me get started", "set me up", "first time using this", or when the user explicitly invokes /get-started. Also use when `my-documents/` has not been scaffolded yet. Once the user has existing canonicals and is just iterating, prefer `resume-builder` directly.
---

The onboarding wrapper for Job Hunt OS. Walks a first-time user from a fresh clone to a fully-scaffolded state layer with at least one canonical document built and ready. The document generation itself lives in `resume-builder`; this skill adds orientation, scaffolding, and post-build framing around it so a new user doesn't land on a half-built foundation.

## Workflow

### 1. Orient the user

Before asking any interview questions, give a short (4-6 sentence) orientation so a first-time user knows what's about to happen. Cover:

- **What we'll do together:** a structured interview about your work, then I draft the document(s), run a drift check, save them, and generate DOCX + PDF versions.
- **What will exist afterward:** canonical markdown under `my-documents/` (`resume.md` and/or `cv.md`, plus `coverletter.md`) and matching `.docx` files (and `.pdf` files if LibreOffice is on PATH). These are the foundation every other skill in this repo reads from.
- **Rough time:** plan for 15-25 minutes of back-and-forth — longer if you're starting from scratch with no existing resume.
- **What comes next:** once the canonicals exist, `resume-auditor` gives honest feedback and `resume-tailor` customizes for specific roles.

Keep it conversational, not a bulleted wall.

### 2. Scaffold the state layer

Run `node scripts/scaffold-state.mjs` once, before handing off to `resume-builder`. The script is idempotent — it only creates what's missing (`applications.md`, `story-bank.md`, the subdirectories with `.gitkeep`s). This is the state layer the rest of Job Hunt OS depends on, so don't skip it. See [state-layer contract §2](../_shared/state-layer.md#2-first-run-scaffolding).

### 3. Build the canonicals

Invoke the `resume-builder` skill and run its workflow end-to-end: gather existing materials → structured interview → generate outputs with drift check → save → DOCX/PDF generation. `resume-builder` owns document structure, interview depth, drift-checking, and file generation — don't duplicate those steps here.

If the user signaled scope ("just a CV", "cover letter only", "build a UK CV"), pass it through so `resume-builder` can route to the right mode (see [resume-builder §5 Modes](../resume-builder/SKILL.md)).

### 4. Seed the story bank (offer, don't assume)

The interview just collected concrete accomplishments — exactly the STAR material `story-bank.md` is designed to hold for `interview-coach` and `resume-drift-check`. After saving the canonicals, offer to capture the richest 2-3 as stubs:

> I noticed you mentioned [brief one-line summaries of 2-3 accomplishments from the interview]. Want me to capture those as STAR stubs in `story-bank.md` now? It seeds your evidence layer for interview prep and drift-checking, and you can flesh them out later.

If the user declines, move on without pushing — don't re-ask. If they accept, append each as a STAR+R entry (Situation / Task / Action / Result / Reflection) to `my-documents/story-bank.md` using whatever detail the interview surfaced, and mark gaps with `[ASK: …]` placeholders rather than inventing. Never fabricate specifics to round out a stub.

### 5. Closing orientation

End the run with a short recap so the user knows what now exists and what to do next. Keep it tight — the user just spent 20 minutes in an interview, don't bury the landing:

- **Files created** (with paths): the canonicals you wrote, plus their PDFs.
- **One-line reminder** that these are the canonicals every other skill reads from, and they live in the gitignored `my-documents/` tree.
- **The 1-2 skills most likely to be useful next**, framed as suggestions rather than a checklist:
  - "Want honest feedback on what we just built? → `resume-auditor`"
  - "Found a specific role you're interested in? → `remote-culture-check` first (vet the company), then `resume-tailor` (customize for the role)"

## When not to use this skill

If the user already has canonicals (`my-documents/resume.md` or `cv.md` exists) and is asking for an update, a tweak, or a rebuild, invoke `resume-builder` directly instead. Orientation and story-bank seeding are wasted steps for someone who already knows the system — and the closing recap reads as patronizing in update mode.
