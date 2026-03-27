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

**Resume:** Match terminology, reorder bullets by relevance, highlight remote signals. Never invent experience — use `[ASK: ...]` placeholders for gaps.

**Cover letter:** Address specific role/company. Lead with strongest alignment. Confident closing.

### 5. Save outputs

```
my-documents/applications/{company}-{role}/resume.md + .pdf
my-documents/applications/{company}-{role}/coverletter.md + .pdf
```

PDF via HTML/CSS. Fallback: pandoc, browser print-to-PDF, Google Docs.

**Never modify canonical files** unless explicitly asked.

### 6. Summary

Report: key changes and why, alignment strengths, gaps flagged with `[ASK]`, anything to review manually.

## Common Mistakes

- **Keyword stuffing.** Matching terminology ≠ cramming keywords. Swap naturally where their language differs from yours.
- **Only changing the summary.** Tailoring means reordering and reframing bullets throughout, not just editing the top paragraph.
- **Modifying canonicals.** This skill writes to `applications/` subdirectories. The originals are sacred.
