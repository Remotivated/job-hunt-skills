---
name: linkedin-optimizer
description: Use when the user wants to improve their LinkedIn profile, rewrite their headline, about, or experience sections, or audit individual profile fields.
---

## Overview

Audit and rewrite LinkedIn profile sections, grounded in the user's source work document and story bank. LinkedIn is a narrative — not a resume copy. It's where hiring managers go to understand how you think, what you care about, and whether you'd be a good fit culturally. The profile should tell a compelling story that complements your resume.

## Workflow

> **State layer:** writes a LinkedIn audit report to `reports/`. No tracker touch. Reads from source work documents, `story-bank.md`, and `proof-assets/` as evidence sources. See [state-layer contract](../_shared/state-layer.md).

### 1. Gather evidence

**Primary sources (read in priority order):**
1. `my-documents/resume.md` or `my-documents/cv.md` — whichever exists (both if both)
2. `my-documents/story-bank.md` — STAR+R stories for narrative material
3. `my-documents/proof-assets/` — concrete case studies

See [state-layer §8](../_shared/state-layer.md#8-evidence-layer) for the evidence-priority rules.

**Current LinkedIn state:** ask the user to attach a PDF of their profile. To generate it: navigate to your own profile, click the **⋯** (three dots) button just below your profile header, then choose **Save to PDF** — the file downloads immediately. One file captures headline, about, all experience, education, skills, and certifications.

The PDF doesn't reliably capture a few audit-relevant items — ask separately:
- Banner image (default blue gradient or custom?)
- Custom URL (default numeric form or a clean firstname-lastname?)
- Open-to-Work — on or off; if on, public (#OPENTOWORK badge) or recruiter-only?
- Featured section — what's pinned, if anything?
- Top-3 Skills — which 3 are pinned to the top (PDF skill order is unreliable)?
- Location — set to a city or "Remote + region"?

Fall back to paste (headline, about, experience descriptions, skills list, plus the items above) if the user can't or won't generate the PDF.

If source work documents are missing, warn the user — this skill works best grounded in saved evidence. Offer to run `resume-builder` first, or proceed on paste-only input knowing that evidence verification will be limited.

### 2. Inline evidence verification

Every concrete claim in your rewrites (metrics, role scope, outcomes, tool names, dates) must trace back to a primary source. If you can't find a match, mark it `[ASK: verify X]` — never invent. LinkedIn is public and indexed; hallucinated claims cost more here than in a resume draft.

### 3. Audit and rewrite each section

For each section: rate the current version **STRONG** / **NEEDS WORK** / **WEAK**, then provide rewrites in this format:

```
BEFORE: [original]  →  AFTER: [improved]  →  WHY: [what changed]
```

**Headline** — 220 char limit. Framework: `[Function] + [Focus/Specialization] + [Audience or Keyword]`. The headline shows in search results, DMs, and connection requests — the single most-seen field.

Produce **3 variants** labeled A/B/C. Each variant gets a one-line **angle label** stating what it leads with — e.g. *"A: leads with the function + audience pairing. B: leads with a specialization keyword recruiters search. C: leads with an outcome signal."* The angles must be substantively different, not synonym rewrites. If you can only produce two honestly distinct angles, output two with a note explaining why.

- Bad: "Marketing Manager at Acme Corp"
- Good: "B2B Marketing Leader | Demand Gen & Content Strategy for SaaS"

**About Section** — 2,600 char limit. **Above the fold (~220 chars) must hook** — that's what shows before "see more." Narrative, first person. Never open with "Results-driven professional..."

The hook and the full draft each get the variant treatment because both are angle decisions, not just wording:

- **Above-the-fold hook (≤220 chars):** produce **3 variants** with angle labels — e.g. *"A: leads with what you build for. B: leads with a signature outcome. C: leads with the customer pain you remove."* Same distinctness rule as Headline.
- **Full About draft:** once the hook angle is picked, produce **3 full-draft variants** with angle labels at the structure level — e.g. *"A: chronological, identity-first. B: problem-statement-first, then proof. C: values-first, then how it shows up in the work."* The hook of each variant flows from the chosen above-the-fold direction.

Default structure (any variant may diverge if its angle calls for it):
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

**Save as a report:** `my-documents/reports/{###}-linkedin-audit-{YYYY-MM-DD}.md`. Frontmatter: `report_id`, `company: null`, `role: null`, `application_id: null`, `skill: linkedin-optimizer`, `date`, `summary` (e.g., `"Headline + About rewritten; top-3 Skills flagged"`). Body: ratings, rewrites, and any `[ASK: ...]` placeholders. **For Headline, About hook, and About full draft: record all variants with their angle labels, then mark which one the user chose** — so a future rerun can revisit unchosen angles without redrafting from scratch.

## Common Mistakes

- **Resume paste.** The about section is narrative, not bullets. If it reads like a resume, rewrite it.
- **Leading with availability.** "Open to opportunities" is fine as a secondary signal, but lead with value.
- **Inventing claims.** LinkedIn is public and stays indexed. Anything unverifiable against primary sources gets `[ASK: ...]`, not a guess.
- **Ignoring top-3 Skills.** They drive recruiter search. Not decoration.
- **Char-limit overflow.** Headline 220, About 2,600, Experience 2,000. Always show counts.
- **Duplicating resume-auditor.** Experience rewrites are voice-only. Defer bullet-strength critique.

## Reference

- [`guides/proof-assets.md`](../../guides/proof-assets.md) — formats and curation rules for the Featured section.
- [`guides/networking-guide.md`](../../guides/networking-guide.md) — the 3/1/1 rhythm and "engage before you DM" approach LinkedIn rewrites should support, not compete with.
