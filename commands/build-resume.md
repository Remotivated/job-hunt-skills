---
description: Build or update your resume/CV-format work document or cover letter
---

The user wants to build or update their source work document in resume or CV (UK/EU) format. Unlike `/get-started`, this command skips the onboarding framing. Use it when the user already has their workspace set up and is iterating on an existing document.

Invoke the `resume-builder` skill and run its workflow: scaffold if needed, gather existing materials, run the structured interview if necessary, generate outputs with claim checks, save, then generate DOCX/PDF.

If the user appears to be on a fresh clone or clearly unfamiliar with the tooling, suggest `/get-started` instead and hand off.

If `$ARGUMENTS` is non-empty, treat it as a hint about which document(s) they want, such as `cv`, `cover letter only`, `resume only`, or `update`.
