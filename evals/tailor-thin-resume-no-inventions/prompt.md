---
description: "Protects: [resume-tailor §5, never invent experience](../../plugins/job-hunt-skills/skills/resume-tailor/SKILL.md#5-tailor-the-work-document)"
expected_outcome: >-
  A thin resume tailored to a posting that asks for tools, results and a team size the
  user does not have. The saved tailored resume reorders and reframes real experience
  and adds none of the posting's tools (Kustomer, Looker, SQL), its cost-per-ticket
  result or its team of 15; the reply names those gaps instead of hiding them.
tags: [no-invented-claims, trigger, resume-tailor]
plugins: ["../../plugins/job-hunt-skills"]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit]
---

I'm applying to this role. Can you tailor my resume to it? File it under the application id `lumen-freight-support-operations-lead`.

My job-hunt folder is the folder you're working in, and my files are in `my-documents/` here. I confirm that's the right place, so there's no need to ask. Please do this in one pass without stopping for questions: make your best judgement, save it, and I'll review it afterwards. Skip the Word and PDF export for now.

```text
Lumen Freight — Support Operations Lead (Remote, Europe)

Lumen Freight moves pallets for 3,000 small manufacturers. Our support team is growing fast.

You will
- Hire and manage a team of 15 support agents
- Administer our Kustomer instance and build its workflows
- Build Looker dashboards for support leadership
- Cut cost per ticket by 20% or more within a year

You have
- 5+ years in support, 2+ leading a team
- Hands-on SQL
- A track record of reducing cost per ticket
```
