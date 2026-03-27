---
name: resume-tailor
description: Use when the user has a job posting and wants to customize their resume and cover letter for that specific role. Reads canonical documents and outputs tailored versions without modifying originals.
---

## Workflow

### 1. Accept inputs

- **Job posting** — URL or pasted text. If the URL can't be accessed, ask the user to paste the job posting text directly.
- **Canonical files** — Read `my-documents/resume.md` and `my-documents/coverletter.md`

### 2. Analyze the posting

Extract:
- Key requirements and must-haves
- Nice-to-haves and preferred qualifications
- Language, terminology, and tone
- Company values and priorities (if discernible)
- Remote work specifics (timezone, async expectations, travel)

### 3. Identify the angle

- What's the strongest story to lead with for THIS role?
- Which experiences map most directly to their priorities?
- How should the narrative emphasis shift?

This is not keyword swapping. It's reshaping the narrative to lead with what matters most for this specific reader.

### 4. Tailor the resume

- **Match terminology** to the posting's language (they say "stakeholders," you say "stakeholders")
- **Reorder and emphasize** bullets that align with the role's priorities
- **Highlight remote-readiness** signals relevant to this posting
- **Adjust the angle** — if they want a leader, lead with leadership. If they want a builder, lead with building.

**Never invent experience or metrics.** Use `[ASK: what was the result?]` placeholders for information gaps that would strengthen the application.

### 5. Tailor the cover letter

- Address the specific role and company
- Opening: Reference something specific about the company or role
- Body: Lead with the 1-2 strongest alignment points between experience and their needs
- Closing: Confident, specific about next steps

### 6. Save outputs

```
my-documents/applications/{company}-{role}/resume.md
my-documents/applications/{company}-{role}/resume.pdf
my-documents/applications/{company}-{role}/coverletter.md
my-documents/applications/{company}-{role}/coverletter.pdf
```

Generate PDF versions using HTML with embedded CSS. If PDF generation doesn't produce satisfactory results, use the markdown and convert via pandoc, browser print-to-PDF, or Google Docs export.

**NEVER modify canonical files** (`my-documents/resume.md`, `my-documents/coverletter.md`) unless the user explicitly asks. These originals belong to the resume-builder skill.

### 7. Summary

After generating, provide a brief summary:
- Key changes made and why
- Alignment strengths (what matches well)
- Gaps flagged with `[ASK]` placeholders
- Anything the user should manually review
