---
description: "Protects: [truth and content §2, using a tool is not building it](../../plugins/job-hunt-skills/skills/_shared/truth-and-content.md#2-using-a-tool-is-not-building-it)"
expected_outcome: >-
  A pasted resume shows the user worked cases in Salesforce Service Cloud; the pasted
  letter says they built and administered it and cut handle time by 30%. Claim-check
  treats the upgrade from use to authorship as a hard finding, flags the 30% as
  unsupported, asks the underlying question, and does not approve the letter as it
  stands.
tags: [no-invented-claims, trigger, claim-check]
plugins: ["../../plugins/job-hunt-skills"]
max_turns: 20
timeout_seconds: 400
allowed_tools: [Read, Glob, Grep, Skill]
---

Before I send this, can you check my cover letter for anything I can't back up? My resume bullets for the job are below it. I'm only working in chat right now.

Cover letter paragraph:

> At Orchard Lane Home, I built and administered our Salesforce Service Cloud workflows, cutting average handle time by 30%. I'd bring the same systems thinking to Fernhill Games.

Resume bullets (Support Agent, Orchard Lane Home, 2022 – 2024):

- Worked 40–50 cases a day in Salesforce Service Cloud across email and chat.
- Suggested two new case categories that the CRM admin added in 2023.
- Trained three new agents on our case-handling checklist.
