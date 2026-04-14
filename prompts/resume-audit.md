# Resume Audit

> **Thin version.** This is the no-file-system version of the [resume-auditor](../skills/resume-auditor/SKILL.md) skill, for use with ChatGPT, Gemini, Claude.ai, or any LLM without file access. The skill reads your canonical resume from disk, writes a numbered audit report to `reports/`, and leaves the canonical untouched so version bumps stay owned by `resume-builder`. This prompt can't do any of that — you paste the resume in, you copy the output out, nothing is saved. Use the skill if you have Claude Code; use this if you don't.

## What you'll need

- Your resume, pasted as plain text
- A job description (optional — enables terminology alignment and missing-coverage checks)
- Background reading: [resume-philosophy.md](../guides/resume-philosophy.md), [ats-myths.md](../guides/ats-myths.md)

## The prompt

```
You are a hiring manager with 30 seconds to scan this resume. Your job is to find reasons to say no — that's what real screening looks like. Do NOT open with praise. Lead with what needs fixing.

MY RESUME:
[paste full resume text]

JOB DESCRIPTION (optional):
[paste JD, or write "General audit — no specific role"]

Produce the output in exactly this order:

1. 30-SECOND SCAN — what a hiring manager notices and misses on a fast pass.

2. THE STORY — in 2-3 sentences: what narrative does this resume tell? Is the angle clear (specialist, generalist, career changer)? Or does it read as a disconnected list?

3. BULLET RATINGS — rate EVERY bullet as STRONG / NEEDS WORK / WEAK. End with a count: "X STRONG, Y NEEDS WORK, Z WEAK." If 80%+ are WEAK, say so bluntly: "This needs a rewrite, not polish." Flag any bullet starting with "Responsible for / Worked on / Helped with / Assisted in" as WEAK by default. Flag any Skills section listing only soft skills ("team player, hard worker") as wasted space.

4. TOP 5 REWRITES — for the 5 weakest bullets:
   BEFORE: [original]
   AFTER: [Action verb + what you did + specific outcome]
   WHY: [what changed]
   Do NOT invent metrics. Where a number would strengthen a bullet but isn't in the source, use [ASK: what was the result?] as a literal placeholder.

5. REMOTE-READINESS — are there 1-2 bullets showing async work, self-direction, cross-timezone collaboration, documentation, or independent delivery? If missing, suggest additions grounded in experience already on the resume. Do not invent new experience.

6. TERMINOLOGY — if a JD was provided, flag language mismatches and suggest swaps. Skip this section entirely if no JD. This is readability matching, NOT keyword stuffing.

7. WHAT'S MISSING — gaps that would make a hiring manager hesitate, and what would make them want to talk to you.

Be decisive. Reserve NEEDS WORK for genuinely borderline bullets — most bullets are clearly STRONG or WEAK.
```

## What you'll get

Every bullet rated, the five weakest rewritten, narrative assessment, remote-readiness check, and a concrete "what's missing" list. If the reply opens with "Your resume is impressive," the prompt didn't take — tell the model to skip the praise and start with the weakest section.
