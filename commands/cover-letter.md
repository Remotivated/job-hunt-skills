---
description: Build or update a cover letter — tailored to a specific role, or a reusable source letter for a tight target lane
---

The user wants a cover letter. The `cover-letter` skill owns the classification, evidence-gathering, quality bar, and routing to the right underlying builder.

Invoke the `cover-letter` skill and run its full workflow: classify the request (specific application, source letter for a lane, or too broad), pause and ask for specificity if too broad, gather evidence, draft, verify with `claim-check` and resolve findings with the user, save, then generate DOCX/PDF.

If `$ARGUMENTS` is non-empty, treat it as context about the target — a company name, role, application id, or lane description — and pass it through to the skill.
