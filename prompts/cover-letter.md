# Cover Letter

Use this prompt when you need one specific cover letter for one role. Paste your resume and the job posting; do not use it to produce a generic letter for a whole category of jobs.

## What you'll need

- Your resume, pasted as plain text
- The job posting, pasted as plain text
- Why this company or role interests you
- Any claims, gaps, or details you do not want overstated
- Background reading: [resume-philosophy.md](../guides/resume-philosophy.md)

## The prompt

```
Write a cover letter for this role. The letter should complement my resume, not duplicate it. Expand on 1-2 key achievements with context that does not fit in a bullet.

MY RESUME:
[paste full resume text]

JOB POSTING:
[paste full posting text]

WHY THIS COMPANY / WHY THIS ROLE:
[paste notes, or write "not sure yet"]

DO NOT OVERSTATE / KNOWN GAPS:
[paste gaps, constraints, or write "none"]

Before drafting, check whether the resume, job posting, and why-this-role notes contain enough concrete material for a specific letter. If not, ask up to 5 targeted questions before drafting. If you can draft from the inputs, proceed and mark unresolved gaps with [ASK: ...].

Structure:

Opening (2-3 sentences) - lead with proof, not praise:
- Default pattern: problem -> proof. Name a specific challenge from the job posting, then show I have solved something similar.
- Do not write "I am writing to express my interest in..."
- Do not open with "I saw your recent post / blog / announcement..." Lead with evidence before any reference to the company.
- If the WHY notes are thin, do not invent personal motivation or company knowledge.

Body paragraph 1 (3-4 sentences):
- Strongest alignment point: their need -> my evidence -> the outcome.
- Expand on one resume achievement with context a bullet could not carry.
- Show I understand what the role requires.

Body paragraph 2 (optional, 3-4 sentences):
- Add a second dimension only if it adds something new: leadership, remote readiness, domain depth, or an honest gap named directly.

Closing (2-3 sentences):
- Genuine enthusiasm, confident not desperate.
- Clear next step.
- Do not write "I would be honored and grateful."

Constraints:
- 250-400 words total
- First person, professional but human
- Match their terminology where natural, but do not stuff keywords
- Include a remote-readiness signal only if relevant to the role
- Do not invent details that are not in my resume. If a claim would strengthen the letter but is not in what I pasted, mark it [ASK: ...] and move on.
- Do not smooth over known gaps I named. Either address them directly or leave them out.
- After drafting, run a self-check: if this letter could be reused for five companies with only noun changes, rewrite it to be more specific.
```

## What you'll get

A 250-400 word cover letter specific to the role and company. If the output contains an `[ASK]` placeholder, fill it in or remove that claim before sending.
