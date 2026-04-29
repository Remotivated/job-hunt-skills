# Company Research

Use this prompt when you want to decide whether a company or role is worth your time. It works in ChatGPT, Gemini, Claude.ai, or another LLM if you paste the raw source material yourself.

## What you'll need

- Company name
- Job posting text, if you have it
- Careers/about page text
- Review themes from Glassdoor, Blind, Reddit, or similar sources
- LinkedIn observations about team location, leadership concentration, or churn
- Recent news about funding, layoffs, return-to-office changes, leadership changes, or product shifts
- Source URLs and dates, if your LLM can browse or you collected them
- Background reading: [company-research.md](../guides/company-research.md)

## The prompt

```
Evaluate this company and role using a practical employer research framework. I want to know whether this is worth my time, what I should verify, and what questions I should ask if I proceed.

COMPANY:
[company name]

ROLE / JOB POSTING:
[paste posting, or write "not available"]

CAREERS / ABOUT PAGE:
[paste relevant text, or write "not available"]

REVIEWS:
[paste review excerpts or summarize repeated themes, or write "not available"]

LINKEDIN OBSERVATIONS:
[describe employee geography, leadership concentration, recent departures, or write "not checked"]

RECENT NEWS:
[paste funding, layoffs, RTO announcements, acquisitions, leadership changes, or write "nothing notable"]

BROWSING / SOURCE MODE:
[write "can browse current web" or "pasted sources only"]

Source rule:
- If you can browse current web, cite the source and date for each major signal.
- If you cannot browse, use only the source material I pasted and mark stale or missing areas clearly.
- Do not treat uncited memory as current evidence.

Run all five stages. Do not skip a stage just because the job posting looks good.

Start with SOURCES AND CONFIDENCE:
| Signal | Source | Date observed/published | Confidence |
| --- | --- | --- | --- |
Use High / Medium / Low confidence. Low confidence means stale, secondhand, uncited, or thin evidence.

Stage 1 - Job posting:
- What problem is this role meant to solve?
- Are the must-haves realistic?
- Are scope, seniority, compensation, location, and work model clear?
- Name any red flags: vague scope, unrealistic requirements, missing compensation where expected, title/scope mismatch, unclear hiring process.

Stage 2 - Company direction:
- What does the company do, who buys or uses it, and why now?
- Look for business model, product clarity, customer signals, funding, layoffs, pivots, or public contradictions.
- Name what looks strong and what needs verification.

Stage 3 - Work model and remote/hybrid fit:
- Does the posting clearly state remote, hybrid, onsite, timezone, travel, or office expectations?
- Does the company show distributed habits: documentation, async communication, remote onboarding, location-transparent benefits?
- Name red flags such as vague "flexibility," city-only signals for a remote role, recent return-to-office pressure, or remote workers appearing second-class.

Stage 4 - Reviews and reputation:
- What recent themes repeat?
- Separate role-specific signals from general noise.
- Watch for poor management, chaotic priorities, unpaid overtime, high churn, interview bait-and-switches, or second-class remote employees.

Stage 5 - Team and LinkedIn signals:
- Is the relevant team geographically distributed?
- Is leadership concentrated in one office?
- Do people in similar roles appear to stay long enough to grow?
- Are there recent departures from the relevant function?

For every red flag, name the specific signal and where it came from. "Culture seems off" is not actionable.

WEIGH AND RECOMMEND:
Severity matters more than count. One hard signal can outweigh several soft positives. A pile of weak concerns may only mean I should ask sharper questions.

Deliver one of three verdicts:
- PRIORITIZE - worth applying or preparing seriously.
- PROCEED WITH CAUTION - worth pursuing, but only with specific questions to ask.
- SKIP FOR NOW - hard signals suggest I should spend time elsewhere.

End with:
1. The 3-5 signals driving the verdict.
2. Specific questions I should ask in interviews.
3. Anything that may be stale or needs current verification.
```

## What you'll get

A company research brief with role fit, company direction, remote/hybrid evidence, review themes, team signals, a clear verdict, and questions to ask if you proceed.
