---
description: Build your canonical resume, CV, or cover letter (start here if you're new to Job Hunt OS)
---

The user wants to build their canonical resume, CV, and/or cover letter. This is the primary entry point to Job Hunt OS — the user may be on a fresh clone with nothing set up yet, so treat this as an onboarding moment, not a one-shot generator.

Invoke the `resume-builder` skill and follow its workflow start to finish. Do **not** skip any of the onboarding-critical steps:

1. **§1 Orient the user** — explain what's about to happen before asking anything.
2. **§2 First-run scaffolding** — run `scripts/scaffold-state.mjs` even if `my-documents/` looks present.
3. **§6 Seed the story bank** — offer (don't assume) to capture 2-3 STAR stubs from the interview answers.
4. **§7 Closing orientation** — name what was created and point to the next 1-2 skills.

These steps are load-bearing for a new user's first session. The rest of the repo (`resume-tailor`, `resume-drift-check`, `interview-coach`, etc.) assumes the state layer is scaffolded and the canonicals exist — don't leave the user with a half-built foundation.

If $ARGUMENTS is non-empty, treat it as a hint about which document(s) they want (e.g. "cv" → CV mode, "cover letter only" → cover-letter-only mode). If empty, let the user lead.
