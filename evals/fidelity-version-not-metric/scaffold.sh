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
