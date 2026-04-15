---
description: Build or update your canonical resume, CV, or cover letter (focused mode — if you're new to Job Hunt OS, use /get-started instead)
---

The user wants to build or update their canonical resume, CV, and/or cover letter. Unlike `/get-started`, this command skips the onboarding framing — use it when the user already has their state layer set up and is iterating on an existing document.

Invoke the `resume-builder` skill and run its workflow: scaffold if needed → gather existing materials → structured interview → generate outputs with drift check → save → DOCX/PDF. Do **not** run the orientation, story-bank-seed, or closing-recap steps that live in `get-started` — this command is for users who already know the system.

If the user appears to be on a fresh clone (no `my-documents/` yet, or clearly unfamiliar with the tooling), suggest `/get-started` instead and hand off rather than trying to onboard them from inside `resume-builder`.

If $ARGUMENTS is non-empty, treat it as a hint about which document(s) they want (e.g. "cv" → CV mode, "cover letter only" → cover-letter-only mode, "update" → update mode).
