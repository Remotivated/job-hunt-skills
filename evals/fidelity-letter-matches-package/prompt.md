---
description: "Protects: [claim-check §6, checks across the package](../../plugins/job-hunt-skills/skills/claim-check/SKILL.md#6-classify-each-claim)"
expected_outcome: >-
  Source: a tailored resume already saved for this application (Support Team Lead,
  Brightwater Outfitters, 2021 – 2024, a team of 6, 9 hours to 3) and two earlier
  letters that share an opening and a closing sentence. Allowed meaning: the same true
  story told for this employer, in new words. Forbidden change: a fact that disagrees
  with the saved resume (another title, team size, dates or figures), or the earlier
  letters' opening or closing reused. Graded in the saved letter and in the reply.
tags: [no-invented-claims, fidelity, cover-letter, claim-check]
plugins: ["../../plugins/job-hunt-skills"]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit]
---

Now I need the cover letter for my Fernhill Games application (`fernhill-games-player-support-lead`). The tailored resume for it is already saved in that folder. Please write the letter and save it there too. Pick whichever opening you think is strongest.

My job-hunt folder is the folder you're working in, and my files are in `my-documents/` here. I confirm that's the right place, so there's no need to ask. Please do this in one pass without stopping for questions: make your best judgement, save it, and I'll review it afterwards. Skip the Word and PDF export for now.

```text
Fernhill Games — Player Support Lead (Remote, Europe)

Fernhill runs a cosy farming game with 2 million monthly players. You'll lead a team of
10 player support agents through launches and seasonal events.

You bring
- Experience leading a support team through busy periods
- Clear written communication with players
- Queue design and response-time improvements
```
