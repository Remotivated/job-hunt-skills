# Company Research

> **Thin version.** This is the no-file-system version of the [remote-culture-check](../skills/remote-culture-check/SKILL.md) skill, for use with ChatGPT, Gemini, Claude.ai, or any LLM without file access. The skill version dedups against prior vettings (so you don't re-research a company you looked at last week), writes a numbered vetting report to `reports/`, and upserts the tracker to `status: saved` on a positive verdict. It can also use live web browsing when available. This prompt can't browse, dedup, or save — you gather the raw inputs, you paste them in, you keep the output yourself. Use the skill if you have Claude Code; use this if you don't.

## What you'll need

- Company name
- As much raw input as you can gather: job posting, careers/about page text, Glassdoor or Blind themes, LinkedIn observations, recent news. The more you paste, the sharper the evaluation.
- Background reading: [company-research.md](../guides/company-research.md) (the full 15-minute vetting methodology this prompt applies)

## The prompt

```
Evaluate this company's remote work culture using a structured 4-stage red flag framework. I want to know if it's worth my time.

COMPANY: [company name]

JOB POSTING:
[paste posting, or "not available"]

CAREERS / ABOUT PAGE:
[paste relevant text, or "not available"]

REVIEWS (Glassdoor, Blind, etc.):
[paste reviews or summarize themes, or "not available"]

LINKEDIN OBSERVATIONS:
[describe employee geographic spread, leadership concentration, recent departures, or "not checked"]

RECENT NEWS:
[paste RTO announcements, layoffs, acquisitions, leadership changes, or "nothing notable"]

Run all four stages. Do not skip a stage just because the first looks clean — companies can look great on paper and fail on reviews.

Stage 1 — Job Posting (2 min): Clear remote language or vague "flexible arrangements"? Timezone stated? Benefits signaling distributed investment? Red flags: city + "remote" tacked on, vague travel expectations.

Stage 2 — Careers / About Page (5 min): How do they describe teamwork? Is leadership distributed or concentrated at HQ? Office-centric perks vs. distributed-friendly benefits? Red flags: only office photos, no async or distributed-work mention.

Stage 3 — Reviews (5 min): Consistent themes, especially recent ones? Role-specific remote signals? Red flag patterns: "great if you're in the office," "remote workers are second-class," "flexible means 9-5 their timezone."

Stage 4 — Team Distribution (3 min): Geographic spread? Leadership concentration? Departure patterns?

For every red flag you raise, name the specific signal and where it came from. "Culture seems off" is not actionable — point to the exact sentence or pattern.

WEIGH AND RECOMMEND — severity matters more than count:
**Do not tally red flags and score by total.** A single hard signal — a recent RTO mandate, leadership concentrated in one office while the role is "remote," reviews calling remote staff second-class — can outweigh several soft ones. Conversely, a pile of weak signals on an otherwise strong company may just be questions to raise, not a reason to walk away. Name the specific signals driving the recommendation so I can verify them and make my own call.

Deliver one of three verdicts, each justified by the signals you named:
- **Likely solid** — worth prioritizing.
- **Proceed with caution** — worth pursuing, but list specific questions I should ask in the interview to probe each flagged signal.
- **Probably not worth my time** — explain which hard signals drove the call, and note whether any could be verified false with current sources.

Red flags are questions to ask, not automatic disqualifiers. Note which findings may be outdated and recommend I verify them against current sources — remote policies shift fast, especially around RTO waves.
```

## What you'll get

A stage-by-stage evaluation with specific red flags (each tied to a source), a score-based verdict, and — if you proceed — interview questions designed to probe the flagged areas.
