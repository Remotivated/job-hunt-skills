---
name: interview-coach
description: Use when the user has an upcoming interview, received an interview invitation, or wants to prepare for a specific role at a specific company.
---

## Overview

Generate an interview prep brief with likely questions, talking points from the user's actual experience, evaluative questions to ask the company, and honest assessment of weaknesses.

## Workflow

> **State layer:** reads `applications.md` to check for a tracker row; if missing, offers to create one (the only place a row can be created directly at `status: interviewing`). Writes the prep brief as both an artifact and a report. See [state-layer contract](../_shared/state-layer.md).

### 0. Tracker check

Read `my-documents/applications.md` (first-run scaffold if missing). If no row exists for this company + role, **warn (do not block)**:

> I don't see a tracked application for **{Role} at {Company}**. Interview prep still works — want me to create a tracker row with `status: interviewing`, or skip the tracker?

Users may have interviews for applications submitted before they started using the tracker; that's why this warns instead of blocking.

If the user confirms tracker creation, insert a new row with `status: interviewing`. This is the one case where a row legitimately enters the tracker directly at `interviewing`, skipping `saved` and `applied`. It's a row *creation*, not a status regression — see [state-layer §4](../_shared/state-layer.md#4-status-enum).

### 1. Gather inputs

- **Job posting** — URL or pasted text. If URL can't be accessed, ask for pasted text. If no posting is available, ask what the user knows about the role's requirements.
- **Company name** — required
- **Resume** — read `my-documents/resume.md`

### 2. Research the company

If web browsing available: website, careers page, recent news, reviews, culture signals.
If not: ask what the user knows about the company.

### 3. Generate prep brief

**Likely Questions (8-12):**
- Role-specific behavioral questions from the posting's requirements
- Technical/domain questions relevant to the role
- Remote-work questions (async communication, independent work, distributed collaboration)
- For each: talking points drawn from the user's ACTUAL resume, not generic advice

**Questions to Ask (5-8):**
Categorized: How They Work, Career Growth, Culture, Remote Operations. Include green/red flags for their answers. See `guides/interview-framework.md`.

**Angles to Highlight:**
Specific resume experiences mapping to this role. Remote-readiness talking points. The narrative to lead with.

**Potential Weaknesses:**
Gaps between resume and requirements. How to address honestly — acknowledge and redirect, don't spin.

### 4. Save

Save two copies:

1. **Artifact** (per-application folder): `my-documents/applications/{id}/interview-prep.md` — the version the user actually references before the interview.
2. **Report** (state-layer archive): `my-documents/reports/{###}-{id}-interview-prep-{YYYY-MM-DD}.md` — frontmatter: `id`, `company`, `role`, `application_id: {id}`, `skill: interview-coach`, `date`, `summary` (one-line angle). Body: the same prep brief content.

Display the brief in conversation.

## Common Mistakes

- **Generic questions.** "Tell me about yourself" is obvious. Generate questions specific to THIS role's requirements.
- **Generic talking points.** "I'm a team player" is useless. Reference specific achievements from the resume.
- **Hiding weaknesses.** Hiring managers respect self-awareness. Acknowledge gaps honestly, then redirect to strengths. Include a scripted response for each weakness, not just the gap identification.
