---
description: "Protects: [state layer §10, workspace preflight](../../plugins/job-hunt-skills/skills/_shared/state-layer.md#10-workspace-preflight)"
expected_outcome: >-
  A first-time user asks to be set up. The skill orients them briefly, then either
  offers the in-chat start (paste a resume and a posting) or asks them to confirm
  where their files will live. Nothing is created in this turn, and nothing is called
  saved.
tags: [chat-no-workspace, trigger, get-started]
plugins: ["../../plugins/job-hunt-skills"]
max_turns: 20
timeout_seconds: 400
allowed_tools: [Read, Glob, Grep, Skill]
---

I'm new to Job Hunt Skills. Can you set me up?
