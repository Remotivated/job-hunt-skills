---
type: tool_order
arm: with-only
before: {tool: Skill, input_match: '"skill"\s*:\s*"(?:[\w-]+:)?claim-check"'}
after: {tool: Write, input_match: 'coverletter\.md'}
---
