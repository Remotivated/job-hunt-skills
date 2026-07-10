# Company Research: Is This Job Worth Your Time?

The worst job-search outcome isn't rejection — it's spending twenty hours winning a role you should have skipped. Before you tailor anything, get a verdict.

**Paste:** a company name and a role (the posting if you have it). **Get:** a verdict, a graded report card, and the questions to ask them. **Works in:** ChatGPT, Claude, Gemini, or any AI chat — with or without web browsing.

## The prompt

Copy the box into a fresh chat and fill in the two lines at the bottom. You don't need to gather research first — the prompt tells you what's worth adding later.

```
Evaluate whether this company and role are worth my time. Be the skeptical friend who has seen every hiring red flag, not a cheerleader.

Evidence rules — these matter:
- If you can browse the web, check current sources and date every major claim.
- If you cannot browse, say so up front, then keep two layers clearly separate: (a) what I pasted below, and (b) what you remember about this company, always marked "as of my training data" and possibly stale.
- Never present a stale or assumed fact as current. An honest "unknown" beats a confident guess.

Give me exactly this, in this order:

1. THE VERDICT
   One of: PRIORITIZE / PROCEED WITH CAUTION / SKIP FOR NOW — with a two-sentence justification. Severity beats quantity: one hard signal (layoffs while hiring, fake-remote, exec exodus) outweighs five soft positives.

2. THE REPORT CARD
   Grade each A-F, one line of evidence, and a confidence tag (solid / thin / stale):
   - Role clarity — is this a real, scoped job with realistic requirements and stated pay?
   - Business direction — do they make money, and do they know where they are going?
   - Remote reality — if they claim remote or hybrid: does the evidence say genuinely distributed, or office-culture-with-exceptions? Watch for "remote (within 30 miles of office)," timezone restrictions, and leadership all in one city.
   - Reputation — themes that repeat across recent reviews, not one angry outlier.
   - Stability — funding, layoffs, leadership churn, pivots.
   Grade what you cannot support as "?" — never fill a gap with optimism.

3. RED FLAGS AND GREEN FLAGS
   Specific and sourced. "Culture seems off" is not a flag; "three of five engineering leaders left within a year (LinkedIn)" is.

4. ASK THEM THIS
   Three to five pointed interview questions aimed at the thin or red areas above — phrased so I can say them out loud without burning the room.

5. WHAT WOULD CHANGE THE GRADE
   The two or three checks that would firm up your lowest-confidence grades — recent Glassdoor/Blind themes, the team's LinkedIn geography, funding news. Tell me to paste any of them and you will re-grade.

COMPANY:
[company name]

ROLE / JOB POSTING:
[paste the posting or the role title — or "just vetting the company"]

WHAT I ALREADY KNOW OR FOUND:
[optional — reviews, news, LinkedIn observations. Or delete this line and add it later.]
```

## After the first response

The report card is built to be improved in-place:

- Paste review themes, LinkedIn observations, or news from section 5 and say **"re-grade."**
- **"compare with [other company]"** — same report card, side by side, when you're choosing where to spend your week.
- **"draft the ask-them-this questions for a recruiter screen"** — softer phrasings of the same probes.

## Honest by construction

The prompt forces the model to separate what it verified, what you told it, and what it merely remembers — and to grade unknowns as unknowns. A "?" on the report card is a research task, not a reassurance.

## Go deeper

- The [company-research skill](../skills/company-research/SKILL.md) in the free [Job Hunt Skills plugin](../README.md#start-here) saves every verdict as a numbered report and tracks the company in your application pipeline. The full vetting method is in the [company research guide](../guides/company-research.md).
- The "Remote reality" grade is Remotivated's whole thesis: [remotivated.com](https://remotivated.com/?utm_source=github&utm_medium=repo&utm_campaign=job-hunt-skills&utm_content=prompts) lists remote jobs vetted to actually be remote.
