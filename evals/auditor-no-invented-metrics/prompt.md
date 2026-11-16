---
description: "Protects: [resume-auditor §2, bullet and section evaluation](../../plugins/job-hunt-skills/skills/resume-auditor/SKILL.md#2-bullet-and-section-evaluation)"
expected_outcome: >-
  An honest audit of a pasted resume with no numbers in it. The audit asks for real
  figures with placeholders or questions instead of inventing them, and any rewritten
  bullet keeps to what the user wrote.
tags: [no-invented-claims, trigger, resume-auditor]
plugins: ["../../plugins/job-hunt-skills"]
max_turns: 20
timeout_seconds: 400
allowed_tools: [Read, Glob, Grep, Skill]
---

My resume isn't getting callbacks and I don't know why. Can you be honest with me about what's wrong? Here it is (I haven't saved it anywhere, it's just pasted):

```text
Sam Okonjo
sam.okonjo@example.org · 555-0177

Customer Success Associate, Pinecrest Analytics (2022 – present)
- Responsible for onboarding new customers
- Helped customers with questions about dashboards
- Worked with the sales team on renewals
- Created help articles

Retail Associate, Fieldstone Market (2019 – 2022)
- Customer service at the tills
- Trained new staff

Skills: Customer service, teamwork, communication, Excel
```
