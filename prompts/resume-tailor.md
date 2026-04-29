# Resume Tailor

Use this prompt when you have one real job posting and want to tailor your resume and cover letter in ChatGPT, Gemini, Claude.ai, or another LLM. The prompt asks the model to flag any claim it adds or tightens so you can verify it before sending.

## What you'll need

- Your resume, pasted as plain text
- The job posting, pasted as plain text
- Why this company or role interests you, optional
- Story notes, proof assets, or case studies, optional
- Background reading: [resume-philosophy.md](../guides/resume-philosophy.md)

## The prompt

```
Tailor my resume and write a matching cover letter for this specific role. This is not keyword stuffing. It is reshaping which experiences lead and how they are framed.

MY RESUME:
[paste full resume text]

JOB POSTING:
[paste full posting text]

WHY THIS COMPANY / WHY THIS ROLE:
[paste notes, or write "not sure yet"]

SOURCE NOTES / PROOF ASSETS:
[paste relevant story notes, case studies, or write "resume only"]

Follow this process:

0. INPUT CHECK - if the resume, job posting, and optional notes do not contain enough evidence to tailor responsibly, ask up to 5 targeted questions before drafting. Prioritize questions about missing outcomes, scope, why this company/role, and any honest gaps. If the inputs are sufficient, continue.

1. ANALYZE THE POSTING - extract the top 3-5 requirements, terminology, values, and any remote/timezone specifics.

2. IDENTIFY THE ANGLE - for this role, which of my experiences maps hardest to their priorities? What story should lead? How should emphasis shift from my current resume?

3. CHANGE MAP - provide a compact table with:
   - Current emphasis
   - Tailored emphasis
   - Why the shift helps for this posting

4. TAILOR THE RESUME - match terminology where my language differs, reorder bullets by relevance, and surface remote-readiness signals where relevant. You may add or reshape a Summary section, but do not remove sections from my resume. Do not invent experience.

5. CLAIM GUARDRAIL:
   - For any bullet you add, rewrite, or reframe where the specific claim is not clearly supported by the resume I pasted, append [VERIFY: claim - what I should check] on the same line.
   - Flag inference tightening, such as connecting two facts my resume states separately.
   - Flag harder verbs that may overstate scope, such as "contributed to" becoming "led."
   - Keep proficiency qualifiers such as "intermediate," "scripting only," "~1 year," or "learning."
   - Do not turn broad tools into specific ones. If my resume says AWS, do not write AWS Lambda or S3 unless I named those services.
   - For quantitative gaps, use [ASK: what was the result?] instead of inventing a number.

6. TAILOR A COVER LETTER - 250-400 words. Opening: why this role at this company, specifically. Use the WHY notes if provided; if they are missing, do not invent enthusiasm or company knowledge. Body: 1-2 strongest alignment points using their need, my evidence, and the outcome. Closing: confident and direct. The same [VERIFY] and [ASK] rules apply.

7. SUMMARY:
   - Key changes made and why
   - Alignment strengths
   - Every [ASK] gap
   - Every [VERIFY] flag I must confirm before sending

Output the posting analysis, angle, change map, full tailored resume, cover letter, and summary.
```

## What you'll get

A reordered and reframed resume, a matching cover letter, and a closing summary listing every `[ASK]` gap and every `[VERIFY]` flag you need to confirm before sending. Treat the `[VERIFY]` list as a required manual pass.
