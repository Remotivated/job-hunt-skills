---
name: resume-tailor
description: Use when the user has a specific job posting and wants to customize their resume and cover letter for that role. Also use when they say "I'm applying to..." or share a job link.
---

## Overview

Reshape the resume narrative for a specific role. This is not keyword swapping — it's adjusting which experiences lead and how they're framed. Never modifies canonical files.

## Workflow

### 1. Accept inputs

- **Job posting** — URL or pasted text. If URL can't be accessed, ask for pasted text.
- **Canonical files** — Read `my-documents/resume.md` and `my-documents/coverletter.md`

### 2. Analyze the posting

Extract: top requirements, terminology, company values, remote specifics.

### 3. Identify the angle

What's the strongest story for THIS role? Which experiences map to their priorities? How should emphasis shift?

### 4. Tailor

**Resume:** Match terminology, reorder bullets by relevance, highlight remote signals. You may add a Summary section or reorganize structure if it strengthens the narrative, but don't remove sections from the canonical. Never invent experience — use `[ASK: ...]` placeholders for gaps. If the canonical lacks quantified achievements, flag each weak bullet with a specific `[ASK]`.

**Cover letter:** Address specific role/company. Lead with strongest alignment. Confident closing.

### 5. Save outputs

```
my-documents/applications/{company}-{role}/resume.md
my-documents/applications/{company}-{role}/coverletter.md
```

Use lowercase kebab-case for folder names (e.g., `buffer-content-marketing-manager`).

Generate PDF versions if tooling is available. If not, note the fallback: pandoc, browser print-to-PDF, or Google Docs export.

**Never modify canonical files** unless explicitly asked.

### 6. Summary

Report: key changes and why, alignment strengths, gaps flagged with `[ASK]`, anything to review manually.

## Common Mistakes

- **Keyword stuffing.** Matching terminology ≠ cramming keywords. Swap naturally where their language differs from yours.
- **Only changing the summary.** Tailoring means reordering and reframing bullets throughout, not just editing the top paragraph.
- **Modifying canonicals.** This skill writes to `applications/` subdirectories. The originals are sacred.
