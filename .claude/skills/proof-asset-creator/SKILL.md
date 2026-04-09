---
name: proof-asset-creator
description: Use when the user wants to create a case study, portfolio piece, personal site content, or any artifact that demonstrates their skills to employers. Also use when they mention "proof," "portfolio," or "show my work."
---

## Overview

Build proof-of-value assets that demonstrate capability instead of just claiming it. A resume says you can do the job — a proof asset shows it.

## Workflow

> **State layer:** writes reusable case studies to `my-documents/proof-assets/`. No tracker touch, no report. Proof assets are reusable evidence, not per-application artifacts. See [state-layer contract](../_shared/state-layer.md).

### 1. Choose format

Help user pick based on their situation:

| Format | Best for | Time |
|--------|----------|------|
| **Case study** (SAOL structure) | Anyone with a project they're proud of | 1-2 hrs |
| **Personal site** | Ongoing professional home base | 2-4 hrs |
| **Portfolio** | Creative, design, writing, marketing roles | 1-3 hrs |
| **Proof link** | Quick turnaround, one strong artifact | 30-60 min |
| **Creative artifact** | Technical roles, standing out | Varies |

### 2. Interview about the project

Push for specifics:
- What was the situation or challenge?
- What specifically did YOU do? (Not the team — your decisions)
- What was the outcome? (Numbers help, clarity matters more)
- What did you learn? What would you do differently?

### 3. Handle confidentiality

Proactively offer: anonymize details, focus on process over results, use a different project, or create something new for an imaginary company.

### 4. Produce the asset

**Save location:** `my-documents/proof-assets/{slug}.md` where `{slug}` is a kebab-case descriptor (e.g., `distributed-team-migration`, `content-strategy-overhaul`). First-run scaffold the `proof-assets/` directory if missing (see [state-layer §2](../_shared/state-layer.md#2-first-run-scaffolding)).

**Case study:** SAOL structure — Situation → Approach → Outcome → Learning. Target 500-800 words (1-2 pages).

**Personal site:** Content brief with headline, sections, copy, project highlights, tool recommendations. Save as `{slug}-site-brief.md`.

**Portfolio:** 4-6 curated pieces with context (problem, role, result) per piece. Save as `{slug}-portfolio.md`.

**Proof link:** Video script or writeup — hook, walkthrough, results, takeaway. Save as `{slug}-proof-link.md`.

**Creative:** Guidance on what to build and how to present it. Save as `{slug}-creative-brief.md`.

Proof assets are reusable across applications. Reference them by filename from cover letters, LinkedIn, or tailored resumes.

## Common Mistakes

- **Including everything.** 3-5 strong pieces beats 15 mediocre ones. Curate ruthlessly.
- **No context.** Work samples without explanation are hard to evaluate. Always include the situation and your role.
- **Skipping confidentiality.** Proactively offer anonymization — don't wait for the user to worry about it.

## Reference

See `guides/proof-assets.md` for role-specific examples and the SAOL framework.
