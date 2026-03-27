---
name: resume-builder
description: Use when the user wants to create a resume and cover letter from scratch, rebuild their existing resume, or update their canonical resume. Produces both resume and cover letter through conversational Q&A.
---

## Workflow

### 1. Gather existing materials

Ask: "Do you have an existing resume or LinkedIn profile URL I can work from? This helps me ask better questions."

- **If provided:** Read and analyze. Identify strengths, gaps, and areas to improve. Ask targeted follow-ups to fill gaps (outcomes, metrics, remote signals).
- **If starting from scratch:** Run the structured interview below.

### 2. Structured interview (scratch or gap-filling)

Ask about each area. Probe for outcomes, not just responsibilities.

**Current/most recent role:**
- What's your title and what do you actually do day-to-day?
- What are 2-3 things you've accomplished that you're proudest of? (Push for specifics — numbers, timeframes, scope)

**Prior relevant experience:**
- What roles led to where you are now?
- For each: What did you deliver? What changed because of your work?

**Skills and tools:**
- What technologies, tools, or platforms do you use regularly?
- Any certifications or specialized training?

**Target roles and industries:**
- What kind of roles are you targeting?
- Any specific companies or industries?

**Remote signals:**
- Have you worked remotely before? If so, how did you stay visible and productive?
- If not: Have you led projects independently, worked across teams or time zones, built documentation, or delivered without daily oversight?

**Education:** Brief — degree, school, year. Only probe deeper if early career.

**The story/angle:**
- "What's the narrative? Are you a specialist deepening expertise, a generalist with breadth, or a career changer bringing transferable skills?"
- This shapes how the resume is structured and what leads.

### 3. Generate outputs

**Resume:**
- Use the outcome-oriented bullet structure: `[Action verb] + [what you did] + [specific outcome]`
- Ensure 1-2 bullets per role demonstrate remote-readiness (async work, self-direction, cross-timezone collaboration, documentation)
- Follow the structure in `templates/resume-template.md`
- Lead with the strongest evidence for the user's target roles

**Cover letter:**
- Follow the structure in `templates/coverletter-template.md`
- Opening: Hook — why this role, why this company (or leave as template if no specific target yet)
- Body: Map strongest experience to goals
- Closing: Clear, confident, not desperate

**Save locations:**
- `my-documents/resume.md`
- `my-documents/coverletter.md`
- Generate PDF versions alongside markdown using HTML with embedded CSS styling. If PDF generation doesn't produce satisfactory results, use the markdown and convert via pandoc, browser print-to-PDF, or Google Docs export.

This skill writes to canonical files by default. All other skills only read from them.

### 4. Flags and modes

- **"Just resume"** or **"just cover letter"** — Skip the other if user already has one.
- **"Update" mode** — When the user wants to revise their existing canonical files (new role, new achievements, career shift). Read current files first, ask what's changed, produce updated versions.

### 5. Important guardrails

- **Never invent metrics or details.** If a bullet would be stronger with a number you don't have, use `[ASK: what was the team size?]` or `[ASK: what % improvement?]` as placeholders.
- **Don't over-polish.** The resume should sound like the user at their most articulate, not like a different person.
- **Reference methodology:** See `guides/resume-philosophy.md` for the philosophy and `guides/ats-myths.md` for formatting guidance.
