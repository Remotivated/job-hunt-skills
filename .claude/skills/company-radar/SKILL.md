---
name: company-radar
description: Use when the user wants to vet a company before applying, is unsure if a company is genuinely remote, or asks about a company's remote culture, work arrangement, or red flags.
---

## Overview

Evaluate a company's remote work culture using a structured 4-stage red flag framework. Produces a score-based recommendation.

## Workflow

> **State layer:** reads `applications.md` for dedup, writes a numbered vetting report, upserts the tracker with `status: saved` on a positive verdict. See [state-layer contract](../_shared/state-layer.md).

### 0. Dedup check

Read `my-documents/applications.md` (first-run scaffold if missing — see [state-layer §2](../_shared/state-layer.md#2-first-run-scaffolding)). If a row already exists for this company, also scan `my-documents/reports/` for the most recent `{company-slug}-vetting-*.md` file. Warn the user:

> You vetted **{Company}** on {date} — report **{###}**. Re-run, or open that?

If they choose "open that," read the report and stop. If "re-run," continue.

### 1. Inputs

- **Company name** — required
- **Job posting URL** — optional. If URL can't be fetched, ask for pasted text.

### 2. Research

Use web browsing: careers page, about page, Glassdoor/Blind, LinkedIn employee distribution, recent news (RTO, layoffs, culture changes). If web browsing is unavailable, use your knowledge but caveat that findings should be verified with live research.

### 3. Evaluate — 4-stage framework

**Stage 1 — Job Posting (2 min):** Clear remote language? Timezone stated? Distributed-friendly benefits? Red flags: "flexible arrangements," city + "remote," vague travel.

**Stage 2 — Careers Page (5 min):** How they describe teamwork? Leadership distributed? Red flags: office-centric perks, only office photos, no async/distributed mention.

**Stage 3 — Reviews (5 min):** Consistent themes? Role-specific signals? Red flags: "great if you're in the office," "remote = second class," "flexible means 9-5 their timezone."

**Stage 4 — LinkedIn (3 min):** Geographic spread? Leadership concentration? Recent departures?

### 4. Remotivated check

If the company has a [Remotivated](https://remotivated.com) profile, reference their classification (Fully Remote / Remote-First / Flexible Hybrid / etc.). If no profile exists, skip — this skill works without it.

### 5. Score and recommend

- **0-1 red flags:** Likely solid. Prioritize.
- **2-3 red flags:** Proceed with caution. Prepare specific questions.
- **4+ red flags:** Probably not worth your time unless the role is exceptional.

### 6. Record the findings

**Write the report:** `my-documents/reports/{###}-{company-slug}-vetting-{YYYY-MM-DD}.md`

- `{###}` — next available number per [state-layer §5](../_shared/state-layer.md#5-reports-convention).
- Frontmatter fields: `id`, `company`, `role: null` (unless the vetting was role-specific), `application_id: null` (or the existing tracker id if one exists), `skill: company-radar`, `date`, `summary` (a one-line verdict).
- Body: the 4-stage findings, red flags, and recommendation.

**Upsert the tracker:** If the verdict is positive (0-3 red flags) **and** no row exists for this company+role, upsert `my-documents/applications.md` with:

| Field | Value |
|-------|-------|
| `id` | `{company-slug}-{role-slug}` if a role was vetted, else `{company-slug}` |
| `status` | `saved` |
| `updated` | Today (ISO) |

If a row already exists, leave its status alone — the user may have already progressed. Follow the upsert + status-advancement rules in [state-layer §3](../_shared/state-layer.md#3-applicationsmd-schema).

## Common Mistakes

- **Vague red flags.** "Culture seems off" isn't actionable. Name the specific signal and where you found it.
- **Binary thinking.** Red flags aren't disqualifiers — they're questions to ask. 2-3 flags means prepare, not abandon.
- **Skipping stages.** Even if Stage 1 looks great, run all four. Companies can look good on paper and fail on reviews.
- **Stale data.** Remote policies change fast (especially post-RTO wave). Note when findings may be outdated and recommend the user verify with current sources.

## Reference

See `guides/company-research.md` for the full vetting framework.
