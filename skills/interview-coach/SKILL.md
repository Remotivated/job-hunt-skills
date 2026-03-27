---
name: interview-coach
description: Use when the user has an upcoming interview and wants to prepare with likely questions, talking points, questions to ask, and angles to highlight for a specific role and company.
---

## Workflow

### 1. Gather inputs

- **Job posting** — URL or pasted text. If the URL can't be accessed, ask the user to paste the job posting text directly.
- **Company name** — Required
- **Resume** — Read `my-documents/resume.md` for background

### 2. Research the company

If web browsing is available:
- Company website and careers page
- Recent news, blog posts, press releases
- Glassdoor/review signals
- Company culture and stated values
- How they describe how they work (remote, hybrid, distributed)

If not available, ask the user to share what they know about the company.

### 3. Generate interview prep brief

**Likely Questions (8-12):**

Generate questions the user is likely to face, drawn from:
- Role-specific behavioral questions based on the posting's requirements
- Technical or domain questions relevant to the role
- Remote-work questions ("How do you handle async communication?", "Describe a time you worked independently on a complex project")

For each question, provide **suggested talking points drawn from the user's actual resume** — not generic advice. Reference specific achievements and experiences.

**Questions to Ask (5-8):**

From the "evaluating them too" framework (see `guides/interview-framework.md`):

- **How They Work:** Meeting culture, decision-making, onboarding
- **Career Growth:** Advancement paths, success metrics
- **Culture:** Hardest parts, disagreement handling
- **Remote Operations:** Async vs. sync balance, timezone expectations, distributed team practices

Include green flags and red flags for their answers.

**Angles to Highlight:**
- Specific experiences from the resume that map to this role's priorities
- Remote-readiness talking points
- The narrative to lead with (what makes this person a strong candidate for THIS role)

**Potential Weaknesses:**
- Gaps between the resume and the role's requirements
- How to address them honestly — acknowledge and redirect to strengths
- Don't spin or hide gaps. Hiring managers respect self-awareness.

### 4. Save output

Save to `my-documents/applications/{company}-{role}/interview-prep.md` and display in conversation.

### 5. Methodology reference

See `guides/interview-framework.md` for the question bank philosophy and evaluation framework.
