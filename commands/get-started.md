---
description: Onboard to Job Hunt Skills - scaffold the state layer and build your first resume/CV-format work document or cover letter
---

The user is starting with Job Hunt Skills and may be on a fresh clone with nothing set up yet. Treat this as an onboarding moment, not a one-shot generator.

Invoke the `get-started` skill and run its full workflow:

1. Orient the user before asking for inputs.
2. Scaffold the state layer by running `scripts/scaffold-state.mjs` even if `my-documents/` looks present.
3. Delegate the document build to `resume-builder`.
4. Offer to seed 2-3 STAR story stubs after the document build.
5. Close by naming what was created and the best next skill.

These steps matter because the rest of the repo assumes the local workspace and source documents exist.

If `$ARGUMENTS` is non-empty, treat it as a hint about which document(s) they want, such as `cv`, `cover letter only`, or `resume only`. Pass the hint through to `resume-builder` when the get-started skill hands off.
