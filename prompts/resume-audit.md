# Resume Audit

Use this prompt when you want direct resume feedback in ChatGPT, Gemini, Claude.ai, or another LLM. Paste your resume, optionally paste a job description, and ask for the kind of critique a busy hiring manager would actually give.

## What you'll need

- Your resume, pasted as plain text
- A job description, optional
- Background reading: [resume-philosophy.md](../guides/resume-philosophy.md), [ats-myths.md](../guides/ats-myths.md)

## The prompt

```
You are a hiring manager with 30 seconds to scan this resume. What parts of this resume would give you pause? What parts would keep you engaged and reading?

MY RESUME:
[paste full resume text]

JOB DESCRIPTION:
[paste JD, or write "General audit - no specific role"]

Produce the output in exactly this order:

1. 30-SECOND SCAN - what a hiring manager notices and misses on a fast pass.

2. THE STORY - in 2-3 sentences: what narrative does this resume tell? Is the angle clear (specialist, generalist, career changer), or does it read as a disconnected list?

3. STRUCTURE AND POSITIONING - assess length, chronology clarity, title/seniority alignment, section order, formatting readability, and ATS-safe formatting. Flag anything that would make a fast human scan harder.

4. BULLET RATINGS - rate every bullet as STRONG / NEEDS WORK / WEAK. End with a count: "X STRONG, Y NEEDS WORK, Z WEAK." If 80%+ are WEAK, say: "This needs a rewrite, not polish." Flag "Responsible for / Worked on / Helped with / Assisted in" as WEAK by default. Flag soft-skill-only Skills sections as wasted space.

5. TOP 3 FIXES IN ORDER - the three highest-leverage changes I should make first. Be specific and order them by impact.

6. TOP 5 REWRITES - for the 5 weakest bullets:
   BEFORE: [original]
   AFTER: [Action verb + what you did + specific outcome]
   WHY: [what changed]
   Do not invent metrics. Where a number would strengthen a bullet but is not in the source, use [ASK: what was the result?].

7. REMOTE-READINESS - are there 1-2 bullets showing async work, self-direction, cross-timezone collaboration, documentation, or independent delivery? If missing, suggest additions grounded in experience already on the resume.

8. TERMINOLOGY - if a JD was provided, flag language mismatches and suggest natural swaps. Skip this section entirely if no JD was provided. This is readability matching, not keyword stuffing.

9. WHAT'S MISSING - gaps that would make a hiring manager hesitate, and what would make them want to talk to me.

Be decisive. Reserve NEEDS WORK for genuinely borderline bullets.
```

## What you'll get

Every bullet rated, the five weakest rewritten, a narrative assessment, a structure check, top-priority fixes, a remote-readiness check, and a concrete list of what is missing.
