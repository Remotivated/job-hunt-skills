#!/usr/bin/env bash
# Seeds this case's workspace before the run. Everything here is invented for the
# eval suite: the person, the employers, the postings and the documents.
set -euo pipefail

mkdir -p my-documents/applications my-documents/reports my-documents/proof-assets
touch my-documents/.gitkeep my-documents/applications/.gitkeep \
  my-documents/reports/.gitkeep my-documents/proof-assets/.gitkeep

cat > my-documents/story-bank.md <<'EOF'
# Story Bank

STAR+R stories for behavioral interviews and claim evidence. Add one H2 section per story.

<!--
Schema - one section per story:

## {Short memorable title}

```yaml
id: {kebab-case-slug}
themes: [leadership, delivery, conflict, failure-learning, scope, stakeholder, crisis, ambiguity]
archetypes: [technical-leadership, scope-negotiation, cross-functional, turnaround, mentorship]
created: YYYY-MM-DD
usage: []
```

**Situation:** Where and when. One or two sentences of context.

**Task:** What you were responsible for. Make the stakes visible.

**Action:** What you specifically did. First person, concrete verbs.

**Result:** Quantified outcome where possible; scope and qualitative impact where numbers are not available.

**Reflection:** What you would do differently, what you learned, or how this changed your approach.
-->
EOF

cat > my-documents/applications.md <<'EOF'
# Applications

| id | company | role | status | comp_expected | source | next_action_date | updated | link |
|----|---------|------|--------|---------------|--------|------------------|---------|------|

## Notes
EOF

cat > my-documents/resume.md <<'EOF'
---
version: 1
updated: 2026-09-14
label: resume
---

# Jordan Avery

jordan.avery@example.com · 555-0142 · Porto, Portugal (remote)

## Summary

Customer support lead who makes busy queues calmer. Six years in retail and e-commerce support, the last three leading a team.

## Experience

### Support Team Lead, Brightwater Outfitters

2021 – 2024 · Remote

- Led a team of 6 support agents across email and chat for an outdoor-gear retailer.
- Cut median first response time from 9 hours to 3 hours by reorganising the queue into tiers.
- Wrote and maintained about 120 Zendesk macros used by the whole team.
- Ran the weekly ticket-trend review with the product and warehouse leads.
- Co-led the move of 3 regional help desks onto one shared queue, with the IT lead.
- Supported the billing team's refund-policy rollout: the policy was theirs; I trained our agents on it.

### Support Specialist, Harborline Books

2018 – 2021 · Lisbon

- Answered email and phone tickets for an online bookshop, about 60 a day.
- Used Zendesk daily and flagged recurring shipping issues to the operations team.

## Skills

Zendesk (daily user, macros) · Google Sheets · Written English and Portuguese
EOF
