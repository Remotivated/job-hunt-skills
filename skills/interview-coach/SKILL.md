---
name: interview-coach
description: Use when the user has an upcoming interview, received an interview invitation, or wants to prepare for a specific role at a specific company.
---

## Overview

Generate an interview prep brief with likely questions, talking points from the user's actual experience, evaluative questions to ask the company, and honest assessment of weaknesses.

## Workflow

### 1. Gather inputs

- **Job posting** — URL or pasted text. If URL can't be accessed, ask for pasted text.
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

Save to `my-documents/applications/{company}-{role}/interview-prep.md` and display in conversation.

## Common Mistakes

- **Generic questions.** "Tell me about yourself" is obvious. Generate questions specific to THIS role's requirements.
- **Generic talking points.** "I'm a team player" is useless. Reference specific achievements from the resume.
- **Hiding weaknesses.** Hiring managers respect self-awareness. Acknowledge gaps honestly, then redirect to strengths.
