# LinkedIn Audit

> **Thin version.** This is the no-file-system version of the [linkedin-optimizer](../skills/linkedin-optimizer/SKILL.md) skill, for use with ChatGPT, Gemini, Claude.ai, or any LLM without file access. The skill version writes a numbered audit report to `reports/` so you can track how your profile has evolved over time. This prompt can't save anything — copy the output somewhere useful before you close the tab. Use the skill if you have Claude Code; use this if you don't.

## What you'll need

- Your current LinkedIn headline
- Your current About section
- What's in your Featured section (or "empty")
- A description of your recent activity (posts, comments, shares, or "mostly inactive")
- Your target roles
- Background reading: [resume-philosophy.md](../guides/resume-philosophy.md) (LinkedIn is narrative, not resume copy)

## The prompt

```
Audit my LinkedIn profile and rewrite each section ready to copy-paste. LinkedIn is a NARRATIVE — it's where hiring managers go to understand how I think, not to re-read my resume.

MY CURRENT HEADLINE:
[paste current headline]

MY CURRENT ABOUT SECTION:
[paste current About section]

MY FEATURED SECTION:
[describe what's pinned, or "empty"]

MY RECENT ACTIVITY:
[describe posting/commenting patterns, or "mostly inactive"]

MY TARGET ROLES:
[roles and industries I'm aiming at]

Deliver these sections, in order:

1. HEADLINE — provide 3 options using the framework [Function] + [Focus/Specialization].
   Bad: "Marketing Manager at Acme Corp" (title + company is not a headline)
   Good: "B2B Marketing Leader | Demand Gen & Content Strategy"
   Lead with value. "Open to opportunities" can follow but must not lead.

2. ABOUT SECTION — full rewrite.
   Para 1: What I do and what drives me.
   Para 2: How I approach my work — methodology or philosophy.
   Para 3 (optional): What I'm looking for, if I'm actively searching.
   First person. Narrative, not biographical. Do NOT paste resume bullets. Do NOT open with "Results-driven professional..." or similar template filler.

3. FEATURED SECTION STRATEGY — what to pin (case studies, articles, presentations, projects), what order (strongest first), and if I have nothing pinnable, ONE specific piece I should create.

4. ACTIVITY PLAN for the next 7 days:
   - Days 1, 3, 5: thoughtful comments on 3 specific kinds of posts. "Great post!" is not a comment — add actual insight.
   - Day 2: share one article with 3-4 sentences of my take.
   - Day 4: send 1 DM with no ask, just connection.
   - Day 7: 1 original post, 150-250 words, showing how I think about my field.

5. REMOTE-READINESS — weave remote signals (async communication, distributed team experience, self-direction, documentation) naturally into the rewritten sections above. Do not bolt them on; integrate them where they fit the narrative.

Do not invent experience I haven't mentioned. If a rewrite would be stronger with a detail I haven't provided, use [ASK: ...] as a placeholder.
```

## What you'll get

Three headline options, a complete About rewrite, a Featured section strategy, and a seven-day activity plan — all copy-paste ready for LinkedIn.
