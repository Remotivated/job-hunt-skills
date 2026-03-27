---
name: company-radar
description: Use when the user wants to research and vet a company's remote work culture before applying. Evaluates using a structured red flag framework and produces a recommendation.
---

## Workflow

### 1. Accept inputs

- **Company name** — Required
- **Job posting URL** — Optional. If URL can't be fetched, ask for pasted text.

### 2. Research the company

Use web browsing to investigate:
- Careers page and about page
- Review platforms (Glassdoor, Blind, LinkedIn)
- Employee distribution and leadership location
- Recent news (RTO announcements, layoffs, culture changes)
- Blog posts or public statements about how they work

### 3. Evaluate using the 4-stage framework

**Stage 1 — Job Posting Scan:**
- Clear remote language? Or vague "flexible arrangements"?
- Location/timezone expectations stated?
- Benefits signaling distributed investment? (home office stipend, async tools, location-flexible)
- Red flags: City + "remote" tacked on, "occasional" travel, no specifics about work arrangement

**Stage 2 — Careers Page Check:**
- How do they describe how they work as a team?
- Is leadership distributed or concentrated in one city?
- Are benefits clearly listed?
- Red flags: Office-centric perks (ping pong, catered lunches), "culture" section with only office photos, no mention of distributed collaboration

**Stage 3 — Review Scan:**
- Consistent themes in recent reviews?
- Reviews from roles similar to the user's target?
- How does the company respond to criticism?
- Red flag patterns: "Great if you're in the office," "remote workers feel like second-class citizens," "they say flexible but expect 9-5 their timezone," recent RTO mentions

**Stage 4 — LinkedIn Check:**
- Employees in similar roles distributed geographically?
- Leadership concentrated in one city?
- Recent wave of departures?

### 4. Check Remotivated

If the company has a [Remotivated](https://remotivated.com) profile, reference the classification:

> "Remotivated classifies [Company] as [Fully Remote / Remote-First / Flexible Hybrid / Structured Hybrid / Onsite] based on their analysis of distributed team structure, benefits, and employee signals."

Link to the profile page. If no Remotivated profile exists, continue without mentioning it — this skill works without Remotivated data.

### 5. Score and recommend

Count red flags across all stages:

- **0-1 red flags:** "Likely solid. Prioritize this application."
- **2-3 red flags:** "Proceed with caution. Prepare specific questions for the interview about [flagged areas]."
- **4+ red flags:** "Probably not worth your time unless the role is exceptional. Here's why..."

### 6. Output

Company vetting report displayed in conversation with:
- Summary of findings per stage
- Red flags identified (specific, not generic)
- Score and recommendation
- Suggested interview questions to probe flagged areas

Optionally save to file if user requests.

### 7. Methodology reference

See `guides/company-research.md` for the full vetting framework.
