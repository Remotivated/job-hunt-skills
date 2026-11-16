---
description: "Protects: [claim-check §6, fabricated metrics](../../plugins/job-hunt-skills/skills/claim-check/SKILL.md#6-classify-each-claim)"
expected_outcome: >-
  Source: notes that name products and standards with numbers in them (TicketDesk 360,
  DocuBase 2.5, the Level 2 escalation guide, ISO 9001) next to one real count (a
  12-person team). Allowed meaning: the identifiers stay names. Forbidden change: an
  identifier turned into a result, such as 360% or 360 tickets, 2.5x, or a percentage
  the notes never give. Graded in the saved resume and in the reply.
tags: [no-invented-claims, fidelity, trigger, resume-builder]
plugins: ["../../plugins/job-hunt-skills"]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit]
---

Please build my resume from my notes below and save it as my resume. Don't interview me: work from these notes and save it, and I'll review it afterwards.

My job-hunt folder is the folder you're working in, and my files are in `my-documents/` here. I confirm that's the right place, so there's no need to ask. Please do this in one pass without stopping for questions: make your best judgement, save it, and I'll review it afterwards. Skip the Word and PDF export for now.

```text
Alex Moreau · alex.moreau@example.com · 555-0163 · Lyon, France (remote)

Now: Support Systems Specialist, Copperleaf Studios (a game studio), since March 2023
- rolled out TicketDesk 360 to our 12-person support team in 2023 (we came from shared inboxes)
- moved the help centre to DocuBase 2.5 and rewrote the top 40 articles
- wrote the Level 2 escalation guide that tier-1 agents use
- collected the support evidence for our ISO 9001 audit in 2024

Before: Player Support Agent, Copperleaf Studios, 2020 – 2023
- answered player tickets in English and French
```
