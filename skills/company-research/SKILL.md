---
name: company-research
description: Use when the user wants to vet a company or role before applying, understand whether an employer is worth their time, check remote/hybrid culture, or prepare questions about the company.
---

## Overview

Evaluate whether a company and role are worth the user's time. The research covers the job posting, company direction, work model, reviews, team signals, and red flags that would affect whether to apply or what to ask in interviews.

Remote/hybrid fit is an important section, not the whole workflow. Use it when relevant, especially for roles advertised as remote, hybrid, distributed, flexible, or location-independent.

## Workflow

> **State layer:** reads `applications.md` for dedup, writes a numbered research report, and upserts the tracker with `status: saved` on a positive verdict. See [state-layer contract](../_shared/state-layer.md).

### 0. Dedup check

Read `my-documents/applications.md` (first-run scaffold if missing - see [state-layer §2](../_shared/state-layer.md#2-first-run-scaffolding)). If a row already exists for this company, also scan `my-documents/reports/` for the most recent `{company-slug}-research-*.md` or `{company-slug}-vetting-*.md` file. Warn the user:

> You researched **{Company}** on {date} - report **{###}**. Re-run, or open that?

If they choose "open that," read the report and stop. If they choose "re-run," continue.

### 1. Inputs

At least one of:

- **Company name** - If multiple companies have similar names, ask for industry, location, domain, or posting details to disambiguate.
- **Job posting URL or pasted posting** - Use it to identify the role, company, requirements, work model, and possible concerns.
- **LinkedIn URL** - Use it to inspect company identity, employee distribution, and team signals.
- **Company domain** - Use it to find the careers page if no posting is provided.

### 2. Research

Use web browsing when available: job posting, careers page, about page, product pages, leadership page, LinkedIn company profile, employee distribution, recent news, funding, layoffs, return-to-office changes, and review themes from Glassdoor/Blind or similar sources. If web browsing is unavailable, ask the user for pasted source material and caveat that findings should be verified with current sources.

### 3. Evaluate - 5-stage framework

**Stage 1 - Job posting:** What problem is the role meant to solve? Are the must-haves realistic? Are scope, seniority, compensation, location, and work model clear? Red flags: vague scope, unrealistic stack of requirements, missing compensation where expected, misaligned title and responsibilities, unclear hiring process.

**Stage 2 - Company direction:** What does the company do, who buys or uses it, and why now? Look for funding, business model, customer signals, layoffs, pivots, and recent news. Red flags: unclear product, churny strategy, major layoffs with aggressive hiring, or public signals that contradict the role.

**Stage 3 - Work model and remote/hybrid fit:** Does the posting clearly state remote, hybrid, onsite, timezone, travel, or office expectations? Does the careers page show distributed habits such as documentation, async communication, remote onboarding, and location-transparent benefits? Red flags: "remote" with office-first perks and no distributed practices, city-only signals for a remote role, vague "flexibility," recent return-to-office pressure, or leadership concentrated in one office while remote staff are secondary.

**Stage 4 - Reviews and reputation:** What recent review themes repeat? Separate role-specific signals from company-wide noise. Red flags: consistent comments about poor management, second-class remote employees, chaotic priorities, unpaid overtime, high churn, or interview bait-and-switches.

**Stage 5 - Team and LinkedIn signals:** Is the team geographically distributed? Is leadership concentrated? Are there recent departures from the relevant function? Do people in similar roles appear to stay long enough to grow?

### 4. Optional Remotivated check

If the company has a [Remotivated](https://remotivated.com) profile, reference its work-model classification as one external source.

### 5. Recommend

Weigh the evidence and give one of three verdicts:

- **Prioritize** - worth applying or preparing seriously.
- **Proceed with caution** - worth pursuing, but with specific questions to ask.
- **Skip for now** - hard signals suggest the user should spend time elsewhere.

Severity matters more than count. A single hard signal can outweigh several soft positives; a pile of weak concerns may only mean the user should ask better questions. Name the exact signals driving the recommendation so the user can verify and make their own decision.

### 6. Record the findings

**Write the report:** `my-documents/reports/{###}-{company-slug}-research-{YYYY-MM-DD}.md`

- `{###}` - next available number per [state-layer §5](../_shared/state-layer.md#5-reports-convention).
- Frontmatter fields: `report_id`, `company`, `role: null` (unless the research was role-specific), `application_id: null` (or the existing tracker id if one exists), `skill: company-research`, `date`, `summary` (one line capturing the headline finding).
- Body: the 5-stage findings, role fit, work-model evidence, red flags, recommendation, and interview questions to ask if proceeding.

**Upsert the tracker:** Unless the evidence strongly suggests the user should skip this company, **and** no row exists for this company+role, upsert `my-documents/applications.md` with:

| Field | Value |
| --- | --- |
| `id` | `{company-slug}-{role-slug}` if a role was researched, else `{company-slug}` |
| `status` | `saved` |
| `comp_expected` | `-` at this stage. The field tracks what the user has told the employer (recruiter call, application form, screen) — they have not stated a number yet at the research/save stage. See [state-layer §3](../_shared/state-layer.md#3-applicationsmd-schema). |
| `source` | Whichever fits how the user found the role: `referral`, `board`, `cold`, `recruiter`, `watch`, or `-`. Ask once if it's not in conversation. |
| `next_action_date` | Today + 3 days for `Prioritize` verdicts; today + 7 days for `Proceed with caution`; `-` for `Skip for now`. |
| `updated` | Today (ISO) |

If a row already exists, leave its status alone - the user may have already progressed. Follow the upsert + status-advancement rules in [state-layer §3](../_shared/state-layer.md#3-applicationsmd-schema). If the existing table was read with the back-compat path (missing new columns), emit the full canonical schema on write.

## Common Mistakes

- **Vague red flags.** "Culture seems off" is not actionable. Name the specific signal and where you found it.
- **Counting instead of weighing.** Red flag totals are meaningless on their own. Judge severity, recency, and relevance.
- **Treating remote as the whole decision.** Work model matters, but so do role scope, company direction, manager quality, and compensation signals.
- **Skipping stages.** A clean job posting can still point to a messy company. Run the whole pass.
- **Stale data.** Policies and company health change quickly. Note when findings may be outdated and recommend current verification.

## Reference

- [`guides/company-research.md`](../../guides/company-research.md) — full 15-minute employer research framework with verdict definitions and red-flag patterns.
- [`guides/remote-job-market.md`](../../guides/remote-job-market.md) — the 9% / 44% application-volume ratio for remote roles, "remote washing" patterns, and the strategy-first vs. job-board-first distinction. Use this when a posting is advertised as remote, hybrid, or distributed.
