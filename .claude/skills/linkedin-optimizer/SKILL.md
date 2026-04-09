---
name: linkedin-optimizer
description: Use when the user wants to improve their LinkedIn profile, rewrite their headline or about section, or asks about LinkedIn strategy for job searching.
---

## Overview

Audit and rewrite LinkedIn profile sections. LinkedIn is a narrative — not a resume copy. It's where hiring managers go to understand how you think.

## Workflow

> **State layer:** writes a LinkedIn audit report to `reports/`. No tracker touch. See [state-layer contract](../_shared/state-layer.md).

### 1. Gather current state

Ask for: headline, about section, featured section contents, recent activity description. If web browsing available, offer to read their profile directly.

### 2. Audit and rewrite each section

**Headline** — Framework: `[Function] + [Focus/Specialization]`
- Bad: "Marketing Manager at Acme Corp"
- Good: "B2B Marketing Leader | Demand Gen & Content Strategy"
- Provide 2-3 options.

**About Section** — Narrative, not biography.
- Para 1: What you do + what drives you
- Para 2: How you approach work
- Para 3: What you're looking for (optional)
- First person. Never open with "Results-driven professional..."

**Featured Section** — What to pin: case studies, articles, projects, presentations. One strong piece beats an empty section. Cross-reference with proof-asset-creator if they need to create something.

**Activity Plan** — Day-by-day plan for next 7 days:
- Days 1, 3, 5: Thoughtful comment (not "Great post!" — add actual insight)
- Day 2: Share an article with 3-4 sentences of your take
- Day 4: Send 1 DM (no ask, just connection)
- Day 7: Write 1 short original post (150-250 words)

### 3. Output

All rewritten sections ready to copy-paste into LinkedIn. Include remote-readiness signals naturally throughout.

**Save as a report:** `my-documents/reports/{###}-linkedin-audit-{YYYY-MM-DD}.md`. Frontmatter: `id`, `company: null`, `role: null`, `application_id: null`, `skill: linkedin-optimizer`, `date`, `summary` (e.g., `"Headline + About rewritten; 3 activity-plan items queued"`). Body: the full rewritten sections plus the activity plan.

## Common Mistakes

- **Resume paste.** The about section is narrative, not bullets. If it reads like a resume, rewrite it.
- **Leading with availability.** "Open to opportunities" is fine as a secondary signal, but lead with value.
- **Empty activity.** "Great post!" comments signal disengagement. Add actual insight or don't comment.
