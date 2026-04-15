# Resume Tailor

> **Thin version.** This is the no-file-system version of the [resume-tailor](../skills/resume-tailor/SKILL.md) skill, for use with ChatGPT, Gemini, Claude.ai, or any LLM without file access. The skill dedups against an `applications.md` tracker, runs a claim-verification pass against the canonical resume + story bank + proof assets + prior reports before saving (the same mechanism as `resume-drift-check`), writes tailored artifacts to a per-application folder, and upserts the tracker to `status: saved`. This prompt can't verify claims against any evidence layer — so it instructs the model to mark every added or reframed claim with `[VERIFY: ...]` for you to manually check before you send the resume. Use the skill if you have Claude Code; use this if you don't.

## What you'll need

- Your resume, pasted as plain text
- The job posting, pasted as plain text (URL-fetching isn't reliable in a thin prompt)
- Background reading: [resume-philosophy.md](../guides/resume-philosophy.md)

## The prompt

```
Tailor my resume and write a matching cover letter for this specific role. This is NOT keyword stuffing — it's reshaping which experiences lead and how they're framed.

MY RESUME:
[paste full resume text]

JOB POSTING:
[paste full posting text]

Follow this process:

1. ANALYZE THE POSTING — extract top 3-5 requirements, their terminology, their values, and any remote/timezone specifics.

2. IDENTIFY THE ANGLE — for THIS role, which of my experiences maps hardest to their priorities? What story should lead? How should emphasis shift from my current resume?

3. TAILOR THE RESUME — match their terminology where my language differs, reorder bullets by relevance, surface remote-readiness signals relevant to this posting. You may add or reshape a Summary section, but do not remove sections from my resume. Do not invent experience.

4. CLAIM GUARDRAIL (critical — read carefully):
   - You cannot verify my claims against any evidence layer. I am running you without file access.
   - For ANY bullet you add, rewrite, or reframe where the specific claim is not verbatim in the resume I pasted, append [VERIFY: {claim} — {what I should check}] on the same line. Example: "Led migration of 40-service platform to Kubernetes [VERIFY: service count — confirm 40 matches your actual scope]".
   - Watch specifically for these four drift patterns — they are the most common ways tailoring quietly inflates beyond what the resume says, and each one must be flagged [VERIFY:] or left unchanged:
     * **Inference tightening** — asserting a connection between two facts the resume states separately. If the resume says "pipeline X processes Y data" and "I worked on project Z" without linking them, the tailored version cannot claim "I applied Y to project Z."
     * **Paraphrase-that-tightens** — swapping a soft verb for a harder one: "contributed to" → "built", "co-supervised" → "managed", "helped design" → "designed". The harder verb may be true, but if the resume used the softer one I need to confirm before you tighten it.
     * **Dropped proficiency qualifiers** — removing hedges like "intermediate," "scripting only," "~1 year," or "learning" from skills. Leave qualifiers in place; don't silently upgrade.
     * **Invented tool specifics** — promoting "AWS" → "AWS (S3, EC2, Lambda)" or "databases" → "PostgreSQL, MySQL" when the resume didn't name the specific services. Don't fill in plausible defaults — recruiters probe exactly these items in screens.
   - For quantitative gaps the resume never provided, use [ASK: what was the result?] instead of inventing a number.
   - Do NOT silently smooth these over. Erring on the side of more [VERIFY] flags is correct behavior here.

5. TAILOR A COVER LETTER — 250-400 words. Opening: why this role at this company, specifically. Body: 1-2 strongest alignment points (their need → my evidence → outcome). Closing: confident, direct, clear next step. Same [VERIFY]/[ASK] rules apply.

6. SUMMARY at the end:
   - Key changes made and why
   - Alignment strengths
   - Every [ASK] gap listed
   - Every [VERIFY] flag listed — these are the claims I must manually confirm before sending

Output the full tailored resume, the cover letter, and the summary.
```

## What you'll get

A reordered and reframed resume, a matching cover letter, and a closing summary listing every `[ASK]` gap and every `[VERIFY]` flag you need to confirm before sending. Treat the `[VERIFY]` list as a required manual pass — it's the one thing the skill version does automatically that this prompt can't.
