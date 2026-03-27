---
name: resume-builder
description: Use when the user wants to create a resume or cover letter from scratch, rebuild an existing resume, or update their canonical resume after a career change, promotion, or new achievements.
---

## Overview

Build a resume and cover letter through conversational Q&A. This is the only skill that writes to canonical files (`my-documents/resume.md`, `my-documents/coverletter.md`).

## Workflow

### 1. Gather existing materials

Ask: "Do you have an existing resume or LinkedIn profile URL I can work from?"

- **If provided:** Read, analyze, identify gaps. Ask targeted follow-ups for outcomes, metrics, remote signals.
- **If starting from scratch:** Run the structured interview below.

### 2. Structured interview

Probe for outcomes, not responsibilities.

- **Current role:** Title, day-to-day, 2-3 proudest accomplishments (push for numbers, timeframes, scope)
- **Prior experience:** What did you deliver? What changed because of your work?
- **Skills/tools:** Technologies, platforms, certifications
- **Target roles:** What roles and industries are you aiming for?
- **Remote signals:** Remote experience? Or: independent projects, cross-timezone work, documentation, self-directed delivery?
- **Education:** Brief — degree, school, year
- **Story/angle:** "Are you a specialist, generalist, or career changer? This shapes what leads."

### 3. Generate outputs

**Resume:** Bullet structure: `[Action verb] + [what you did] + [specific outcome]`. Include 1-2 remote-readiness bullets per role. Follow `templates/resume-template.md`.

**Cover letter:** Hook → body mapping experience to goals → confident closing. Follow `templates/coverletter-template.md`.

**Save to:** `my-documents/resume.md`, `my-documents/coverletter.md` + PDF versions via HTML/CSS. Fallback: pandoc, browser print-to-PDF, or Google Docs export.

### 4. Modes

- **"Just resume"** or **"just cover letter"** — skip the other
- **"Update"** — read existing canonicals, ask what's changed, revise

## Common Mistakes

- **Inventing metrics.** Never fabricate numbers. Use `[ASK: what was the result?]` placeholders for gaps.
- **Over-polishing.** The resume should sound like the user at their most articulate, not a different person.
- **Ignoring the angle.** Every resume tells a story — specialist, generalist, career changer. If you don't identify it, the resume reads as a disconnected list.
- **Skipping remote signals.** Even users without remote experience have evidence of self-direction, async work, or independent delivery. Surface it.

## Reference

See `guides/resume-philosophy.md` for methodology and `guides/ats-myths.md` for formatting.
