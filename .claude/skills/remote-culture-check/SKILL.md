---
name: remote-culture-check
description: Use when the user wants to vet a company before applying, is unsure if a company is genuinely remote, or asks about a company's remote culture, work arrangement, or red flags.
---

## Overview

Evaluate a company's remote work culture using a structured 4-stage red flag framework, then summarize the evidence so the user can decide whether to apply.

## Workflow

> **State layer:** reads `applications.md` for dedup, writes a numbered vetting report, upserts the tracker with `status: saved` on a positive verdict. See [state-layer contract](../_shared/state-layer.md).

### 0. Dedup check

Read `my-documents/applications.md` (first-run scaffold if missing — see [state-layer §2](../_shared/state-layer.md#2-first-run-scaffolding)). If a row already exists for this company, also scan `my-documents/reports/` for the most recent `{company-slug}-vetting-*.md` file. Warn the user:

> You vetted **{Company}** on {date} — report **{###}**. Re-run, or open that?

If they choose "open that," read the report and stop. If "re-run," continue.

### 1. Inputs
At least one of:
- **Company name** — If multiple with similar names exist, ask for more info (e.g. industry, location or additional inputs outlined below) to disambiguate. Use this to find the careers page and LinkedIn profile.
- **Job posting URL** (e.g. from ATS, LinkedIn, Indeed, Remotivated etc.). Use to find the company name and careers page. If the job posting is remote-friendly, this is a strong signal — but still run the full framework to check for their remote culture as other jobs may not be.
- **LinkedIn URL** — use this to find the company name, careers page, and employee distribution. If the profile lists the company as remote-friendly, this is a strong signal — but still run the full framework to check for their remote culture. 
- **Company Domain** (e.g. `acme.com`) — use this to find the careers page if no job posting URL is provided. 

### 2. Research

Use web browsing: careers page, about page, Glassdoor/Blind, LinkedIn employee distribution, recent news (RTO, layoffs, culture changes). If web browsing is unavailable, use your knowledge but caveat that findings should be verified with live research.

### 3. Evaluate — 4-stage framework

**Stage 1 — Job Posting:** Clear remote language? Timezone stated? Distributed-friendly benefits? Red flags: mentions of office or commuter perks without explicit remote language, single city location listing with no other remote indicators.

**Stage 2 — Careers Page:** How they describe teamwork? Leadership distributed? Red flags: office-centric perks, only office photos, no async/distributed mention. Note that some career pages are outdated or are out of the box ATS pages, so absence of remote language is only a red flag on pages that are otherwise well-maintained and updated.

**Stage 3 — Reviews:** Consistent themes? Role-specific signals? Red flags: complaints about in-office mandates, lack of remote flexibility, or poor communication. Look for recent reviews (last 1-2 years) to ensure relevance, especially post-pandemic when many companies shifted policies.

**Stage 4 — LinkedIn:** Geographic spread? Leadership concentration? Recent departures?

### 4. Remotivated check

If the company has a [Remotivated](https://remotivated.com) profile, reference their classification (Fully Remote / Remote-First / Flexible Hybrid / etc.). If no profile exists, skip — this skill works without it.

### 5. Recommend

Weigh the evidence and give a summary. Severity matters more than count — a single hard signal (recent RTO mandate, leadership concentrated in one office while the role is "remote," reviews calling remote staff second-class) can outweigh several soft ones. Conversely, a pile of weak signals on an otherwise strong company may just be questions to raise, not a reason to walk away. Name the signals driving the recommendation so the user can verify and make their own decision.

### 6. Record the findings

**Write the report:** `my-documents/reports/{###}-{company-slug}-vetting-{YYYY-MM-DD}.md`

- `{###}` — next available number per [state-layer §5](../_shared/state-layer.md#5-reports-convention).
- Frontmatter fields: `id`, `company`, `role: null` (unless the vetting was role-specific), `application_id: null` (or the existing tracker id if one exists), `skill: remote-culture-check`, `date`, `summary` (one line capturing the headline finding).
- Body: the 4-stage findings, red flags, and recommendation.

**Upsert the tracker:** Unless the evidence strongly suggests the user should skip this company, **and** no row exists for this company+role, upsert `my-documents/applications.md` with:

| Field | Value |
|-------|-------|
| `id` | `{company-slug}-{role-slug}` if a role was vetted, else `{company-slug}` |
| `status` | `saved` |
| `updated` | Today (ISO) |

If a row already exists, leave its status alone — the user may have already progressed. Follow the upsert + status-advancement rules in [state-layer §3](../_shared/state-layer.md#3-applicationsmd-schema).

## Common Mistakes

- **Vague red flags.** "Culture seems off" isn't actionable. Name the specific signal and where you found it.
- **Counting instead of weighing.** Red flag totals are meaningless on their own — one severe signal (active RTO mandate, leadership all in one office, reviews calling remote staff second-class) can outweigh a handful of soft ones, and vice versa. Judge severity, not volume.
- **Skipping stages.** Even if Stage 1 looks great, run all four. Companies can look good on paper and fail on reviews.
- **Stale data.** Remote policies change fast (especially post-RTO wave). Note when findings may be outdated and recommend the user verify with current sources.

## Reference

See `guides/company-research.md` for the full vetting framework.
