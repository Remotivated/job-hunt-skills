---
description: "Protects: [truth and content §3, retracted claims](../../plugins/job-hunt-skills/skills/_shared/truth-and-content.md#3-retracted-claims)"
expected_outcome: >-
  The source resume still contains a claim the user withdrew (managing a $2M vendor
  budget), and the posting asks for budget ownership. The saved tailored resume leaves
  the claim out in every wording, using the recorded "instead" wording or nothing; the
  reply says the source resume still carries it and offers to update it.
tags: [withdrawn-claims, resume-tailor]
plugins: ["../../plugins/job-hunt-skills"]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit]
---

Please tailor my resume for this role and save it under `northgate-logistics-support-operations-manager`.

My job-hunt folder is the folder you're working in, and my files are in `my-documents/` here. I confirm that's the right place, so there's no need to ask. Please do this in one pass without stopping for questions: make your best judgement, save it, and I'll review it afterwards. Skip the Word and PDF export for now.

```text
Northgate Logistics — Support Operations Manager (Remote, Europe)

You will
- Own a $1.5M annual budget for outsourced support vendors
- Lead a team of eight agents and two vendor partners
- Report on support costs to the finance team every month
```
