# LinkedIn Audit

> **Thin version.** This is the no-file-system version of the [linkedin-optimizer](../skills/linkedin-optimizer/SKILL.md) skill, for use with ChatGPT, Gemini, Claude.ai, or any LLM without file access. The skill version reads your canonical `resume.md`, `story-bank.md`, and `proof-assets/` as primary evidence before rewriting anything, and writes a numbered audit report to `reports/` so you can track how your profile has evolved over time. This prompt can't do any of that — you paste everything in, and nothing is saved. Use the skill if you have Claude Code; use this if you don't.

## What you'll need

- **Your resume**, pasted as plain text — used as the evidence layer for claim verification
- **Your current LinkedIn headline**
- **Your current About section**
- **Your current Experience section** — text of your 2-3 most recent roles
- **Your top 3 pinned Skills** (the three at the top of your Skills section)
- **Your Featured section** contents (or "empty")
- **Your location field value** (e.g. "Austin, TX" or "Remote")
- **Your custom URL** (e.g. `linkedin.com/in/firstname-lastname` or "default numeric")
- **Open-to-Work status** — off / recruiter-only / public green badge
- **A description of your recent activity** (posts, comments, shares, or "mostly inactive")
- **Your target roles**
- Background reading: [resume-philosophy.md](../guides/resume-philosophy.md) (LinkedIn is narrative, not resume copy)

## The prompt

```
Audit my LinkedIn profile and rewrite each section ready to copy-paste. LinkedIn is a NARRATIVE — it's where hiring managers go to understand how I think, not to re-read my resume.

EVIDENCE-LAYER RULE — read before rewriting: LinkedIn is public and stays indexed. Hallucinated claims cost more here than in a resume draft. Every concrete claim in your rewrites (metrics, role scope, outcomes, tool names, dates) must trace back to something in the resume I paste below. If you can't find a match, mark it [ASK: verify X] — never invent.

MY RESUME (for evidence verification — do not copy-paste into LinkedIn):
[paste full resume text]

MY CURRENT HEADLINE:
[paste current headline]

MY CURRENT ABOUT SECTION:
[paste current About section]

MY CURRENT EXPERIENCE SECTION (most recent 2-3 roles):
[paste current experience text]

MY TOP 3 PINNED SKILLS:
[list the three Skills pinned at the top]

MY FEATURED SECTION:
[describe what's pinned, or "empty"]

MY LOCATION FIELD:
[paste current location value]

MY CUSTOM URL:
[paste or "default numeric URL"]

MY OPEN-TO-WORK STATUS:
[off / recruiter-only / public green badge]

MY RECENT ACTIVITY:
[describe posting/commenting patterns, or "mostly inactive"]

MY TARGET ROLES:
[roles and industries I'm aiming at]

Rate each section STRONG / NEEDS WORK / WEAK, then provide rewrites in this format:

BEFORE: [original]  →  AFTER: [improved]  →  WHY: [what changed]

Deliver the audit in this order, and show char counts on any field with a limit:

1. HEADLINE (220 char limit) — provide 2-3 options using the framework [Function] + [Focus/Specialization] + [Audience or Keyword]. The headline shows in search results, DMs, and connection requests — it's the single most-seen field on the profile.
   Bad: "Marketing Manager at Acme Corp" (title + company is not a headline)
   Good: "B2B Marketing Leader | Demand Gen & Content Strategy for SaaS"
   "Open to opportunities" can follow but must not lead.

2. ABOUT SECTION (2,600 char limit) — full rewrite. THE FIRST ~220 CHARACTERS MUST HOOK — that's what shows above the fold before "see more." Lead with a one-line value-and-identity statement, then:
   Para 1: What I do and what drives me.
   Para 2: How I approach my work — methodology or philosophy.
   Para 3 (optional): What I'm looking for, if I'm actively searching.
   First person. Narrative, not biographical. Do NOT paste resume bullets. Do NOT open with "Results-driven professional..." or similar template filler.

3. EXPERIENCE BULLETS (2,000 chars per role) — rewrite for VOICE ONLY: first-person, narrative, outcome-framed. This is a voice conversion, not a bullet-strength critique — if the underlying bullets in the resume are weak, say so and tell me to run a separate resume audit. Do NOT rewrite the substance of the bullet here; converting tone is enough.

4. TOP 3 PINNED SKILLS — Top-3 Skills drive recruiter search more than the headline does. Audit them hard: are these the exact terms recruiters in my target role actually search? Flag any soft skills ("leadership," "communication," "team player") in the top 3 as wasted slots. Suggest specific swaps where a better recruiter-search term exists.

5. FEATURED SECTION STRATEGY — what to pin (case studies, articles, presentations, projects), what order (strongest first). If I have nothing pinnable, name ONE specific piece I should create, grounded in experience already on my resume.

6. LOCATION — if I'm targeting remote, "Remote" or "Remote · [country/region]" beats a city-only value, which can filter me out of remote searches. Flag if my current value is city-only and I'm remote-targeting.

7. CUSTOM URL — should be linkedin.com/in/firstname-lastname or close. Flag if it's still the default numeric URL.

8. OPEN-TO-WORK — if on and public (green #OPENTOWORK badge), note the tradeoff: higher recruiter visibility, but some hiring managers read it as a negative signal. Recruiter-only is the safer default unless I'm urgently searching.

9. ACTIVITY PLAN for the next 7 days:
   - Days 1, 3, 5: thoughtful comments on 3 specific kinds of posts. "Great post!" is not a comment — add actual insight.
   - Day 2: share one article with 3-4 sentences of my take.
   - Day 4: send 1 DM with no ask, just connection.
   - Day 7: 1 original post, 150-250 words, showing how I think about my field.

10. REMOTE-READINESS — weave remote signals (async communication, distributed team experience, self-direction, documentation) naturally into the rewritten sections above. Do not bolt them on; integrate them where they fit the narrative.

Do not invent experience I haven't mentioned. Anything in a rewrite that can't be sourced from the resume I pasted gets [ASK: ...] as a placeholder, not a guess.
```

## What you'll get

Three headline options, a complete About rewrite with an above-the-fold hook, voice-only experience rewrites, a top-3 Skills audit, a Featured section strategy, flags on your Location / Custom URL / Open-to-Work settings, a seven-day activity plan, and remote-readiness integration — all copy-paste ready for LinkedIn. Every concrete claim in the output should trace back to your resume; any `[ASK: verify X]` placeholders are things you must fill in before posting.
