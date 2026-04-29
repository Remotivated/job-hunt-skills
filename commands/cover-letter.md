---
description: Build or update a cover letter — tailored to a specific role, or a reusable source letter for a tight target lane
---

The user wants a cover letter. The `cover-letter` skill owns the classification, evidence-gathering, and quality bar — invoke it and run its full workflow.

Invoke the `cover-letter` skill and follow its workflow:

1. Classify the request as specific application, source letter for a lane, or too broad.
2. If too broad, pause and ask for specificity rather than drafting.
3. Gather evidence from the selected source work document, story bank, and proof assets.
4. Delegate the draft to `resume-tailor` (specific application) or `resume-builder` (source letter).
5. Run `claim-check` before saving.

If `$ARGUMENTS` is non-empty, treat it as context about the target — a company name, role, application id, or lane description. Pass it through when the cover-letter skill hands off to the underlying builder.
