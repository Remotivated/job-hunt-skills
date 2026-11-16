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
| fernhill-games-player-support-lead | Fernhill Games | Player Support Lead | saved | - | board | - | 2026-11-10 | https://jobs.example.com/fernhill-games/player-support-lead |
| quillfield-health-patient-support-team-lead | Quillfield Health | Patient Support Team Lead | applied | - | board | - | 2026-10-28 | https://jobs.example.com/quillfield-health/patient-support-team-lead |
| lantern-ridge-software-customer-support-team-lead | Lantern Ridge Software | Customer Support Team Lead | applied | - | board | - | 2026-10-14 | https://jobs.example.com/lantern-ridge/customer-support-team-lead |

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

### Support Specialist, Harborline Books

2018 – 2021 · Lisbon

- Answered email and phone tickets for an online bookshop, about 60 a day.
- Used Zendesk daily and flagged recurring shipping issues to the operations team.

## Skills

Zendesk (daily user, macros) · Google Sheets · Written English and Portuguese
EOF

mkdir -p my-documents/applications/fernhill-games-player-support-lead
cat > my-documents/applications/fernhill-games-player-support-lead/resume.md <<'EOF'
---
source_document: my-documents/resume.md
source_version: 1
source_label: resume
tailored_date: 2026-11-10
application_id: fernhill-games-player-support-lead
---

# Jordan Avery

jordan.avery@example.com · 555-0142 · Porto, Portugal (remote)

## Summary

Support team lead who keeps busy queues calm, with six years in retail and e-commerce support.

## Experience

### Support Team Lead, Brightwater Outfitters

2021 – 2024 · Remote

- Led a team of 6 support agents across email and chat.
- Cut median first response time from 9 hours to 3 hours by reorganising the queue into tiers.
- Wrote and maintained about 120 Zendesk macros used by the whole team.

### Support Specialist, Harborline Books

2018 – 2021 · Lisbon

- Answered email and phone tickets, about 60 a day.
EOF

mkdir -p my-documents/applications/lantern-ridge-software-customer-support-team-lead
cat > my-documents/applications/lantern-ridge-software-customer-support-team-lead/coverletter.md <<'EOF'
Busy support queues don't have to feel chaotic, and I've spent six years proving it.

At Brightwater Outfitters I led a team of 6 agents and cut median first response from 9 hours to 3 hours by reorganising our queue into tiers. Lantern Ridge's gym owners need quick answers on busy evenings, and that is the problem I like solving.

I'd welcome the chance to bring that calm to your team.

Jordan Avery
EOF

mkdir -p my-documents/applications/quillfield-health-patient-support-team-lead
cat > my-documents/applications/quillfield-health-patient-support-team-lead/coverletter.md <<'EOF'
Busy support queues don't have to feel chaotic, and I've spent six years proving it.

Quillfield's appointment line has the same pressure I handled at Brightwater Outfitters, where my team of 6 moved median first response from 9 hours to 3 hours after I split the queue into tiers.

I'd welcome the chance to bring that calm to your team.

Jordan Avery
EOF
