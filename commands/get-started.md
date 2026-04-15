---
description: Onboard to Job Hunt OS — scaffold the state layer and build your first canonical resume, CV, or cover letter (start here if you're new)
---

The user is starting with Job Hunt OS and may be on a fresh clone with nothing set up yet. Treat this as an onboarding moment, not a one-shot generator.

Invoke the `get-started` skill and run its full workflow:

1. **§1 Orient the user** — explain what's about to happen before asking anything.
2. **§2 Scaffold the state layer** — run `scripts/scaffold-state.mjs` even if `my-documents/` looks present.
3. **§3 Build the canonicals** — delegate to `resume-builder` for the interview and generation.
4. **§4 Seed the story bank** — offer (don't assume) to capture 2-3 STAR stubs.
5. **§5 Closing orientation** — name what was created and point to the next 1-2 skills.

These steps are load-bearing for a new user's first session. The rest of the repo (`resume-tailor`, `resume-drift-check`, `interview-coach`, etc.) assumes the state layer is scaffolded and the canonicals exist — don't leave the user with a half-built foundation.

If $ARGUMENTS is non-empty, treat it as a hint about which document(s) they want (e.g. "cv" → CV mode, "cover letter only" → cover-letter-only mode). Pass the hint through to `resume-builder` when the get-started skill hands off in §3.
