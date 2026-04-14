---
name: linkedin-optimizer
description: Use when the user wants to improve their LinkedIn profile, rewrite their headline, about, or experience sections, or audit individual profile fields.
---

## Overview

Audit and rewrite LinkedIn profile sections, grounded in the user's canonical resume and story bank. LinkedIn is a narrative — not a resume copy. It's where hiring managers go to understand how you think.

## Workflow

> **State layer:** writes a LinkedIn audit report to `reports/`. No tracker touch. Reads from canonical `resume.md`/`cv.md`, `story-bank.md`, and `proof-assets/` as evidence sources. See [state-layer contract](../_shared/state-layer.md).

### 1. Gather evidence

**Primary sources (read in priority order):**
1. `my-documents/resume.md` or `my-documents/cv.md` — whichever exists (both if both)
2. `my-documents/story-bank.md` — STAR+R stories for narrative material
3. `my-documents/proof-assets/` — concrete case studies

See [state-layer §7](../_shared/state-layer.md#7-evidence-layer-priority-order) for the evidence-priority rules.

**Current LinkedIn state:** ask the user to paste their current headline, about section, experience descriptions, skills list (especially the top 3 pinned), location, and custom URL. Ask whether Open-to-Work is on, and if so, whether it's public or recruiter-only.

If canonical files are missing, warn the user — this skill works best grounded in canonical sources. Offer to run `resume-builder` first, or proceed on paste-only input knowing that evidence verification will be limited.

### 2. Inline evidence verification

Every concrete claim in your rewrites (metrics, role scope, outcomes, tool names, dates) must trace back to a primary source. If you can't find a match, mark it `[ASK: verify X]` — never invent. LinkedIn is public and indexed; hallucinated claims cost more here than in a resume draft.

### 3. Audit and rewrite each section

For each section: rate the current version **STRONG** / **NEEDS WORK** / **WEAK**, then provide rewrites in this format:

```
BEFORE: [original]  →  AFTER: [improved]  →  WHY: [what changed]
```

**Headline** — 220 char limit. Framework: `[Function] + [Focus/Specialization] + [Audience or Keyword]`. The headline shows in search results, DMs, and connection requests — the single most-seen field. Provide 2–3 options.
- Bad: "Marketing Manager at Acme Corp"
- Good: "B2B Marketing Leader | Demand Gen & Content Strategy for SaaS"

**About Section** — 2,600 char limit. **Above the fold (~220 chars) must hook** — that's what shows before "see more." Narrative, first person. Never open with "Results-driven professional..."
- Hook: one line stating value and identity
- Para 1: what you do + what drives you
- Para 2: how you approach work
- Para 3: what you're looking for (optional)

Source narrative material from `story-bank.md` where possible — those stories already have specifics attached.

**Experience bullets** — 2,000 chars per role. Rewrite for *voice only*: first-person, narrative, outcome-framed — distinct from resume voice. **Defer bullet-strength critique to `resume-auditor`.** If the underlying bullets are weak, say so and point the user there. This skill converts voice, not content.

**Skills** — 100 max, top 3 pinned. Top-3 Skills drive recruiter search more than the headline does. Audit the top 3 hard: are they the terms recruiters in the target role actually search? Flag any soft skills in the top 3.

**Featured Section** — what to pin: case studies, articles, projects, presentations. One strong piece beats an empty section. Cross-reference `proof-asset-creator` if they need to create something.

**Location** — if targeting remote, "Remote" + country/region beats a city-only value, which can filter them out of remote searches.

**Custom URL** — should be `linkedin.com/in/firstname-lastname` or close. Flag if it's still the default numeric URL.

**Banner** — free real estate. Flag if it's the default blue gradient. Suggest a visual that reinforces positioning (not a stock photo).

**Open-to-Work** — if on and public (green #OPENTOWORK badge), note the tradeoff: higher recruiter visibility, but some hiring managers read it as a negative signal. Recruiter-only is the safer default unless the user is urgently searching.

### 4. Output

All rewritten sections ready to copy-paste, with char counts shown for any field with a limit.

**Save as a report:** `my-documents/reports/{###}-linkedin-audit-{YYYY-MM-DD}.md`. Frontmatter: `id`, `company: null`, `role: null`, `application_id: null`, `skill: linkedin-optimizer`, `date`, `summary` (e.g., `"Headline + About rewritten; top-3 Skills flagged"`). Body: ratings, rewrites, and any `[ASK: ...]` placeholders.

## Common Mistakes

- **Resume paste.** The about section is narrative, not bullets. If it reads like a resume, rewrite it.
- **Leading with availability.** "Open to opportunities" is fine as a secondary signal, but lead with value.
- **Inventing claims.** LinkedIn is public and stays indexed. Anything unverifiable against primary sources gets `[ASK: ...]`, not a guess.
- **Ignoring top-3 Skills.** They drive recruiter search. Not decoration.
- **Char-limit overflow.** Headline 220, About 2,600, Experience 2,000. Always show counts.
- **Duplicating resume-auditor.** Experience rewrites are voice-only. Defer bullet-strength critique.
