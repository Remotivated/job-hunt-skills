---
name: proof-asset-creator
description: Use when the user wants to figure out what proof-of-value asset to build — case study, portfolio piece, personal site content, or any artifact that demonstrates their skills to employers. Ideation and scoping only; once an idea is chosen, the user works with Claude directly to produce the asset. Triggers on "proof," "portfolio," "show my work," or "what should I build."
---

## Overview

Help the user figure out what proof-of-value asset to build, tailored to their target roles, experience, and technical ability — then save a brief they can hand off. A resume says you can do the job; a proof asset shows it.

This skill is an ideation partner, not a producer. The hard part — and the only part this skill does — is matching *what the user already has* against *what their target roles need* against *what they can actually ship*. Once that match is decided and a brief is saved, the skill is done.

Drafting the actual case study, building the demo, or designing the portfolio piece is a job for Claude in a normal conversation, where it has full context-window flexibility instead of being constrained by a skill workflow. Hand off the brief and continue there.

## Workflow

> **State layer:** reads source work documents (`resume.md`/`cv.md`), `story-bank.md`, existing `proof-assets/`, and `applications.md`. Writes one file to `my-documents/proof-assets/{slug}.md`. No tracker touch, no report. See [state-layer contract](../_shared/state-layer.md).

### 1. Read the evidence layer

Before suggesting anything, read in priority order (see [state-layer §8](../_shared/state-layer.md#8-evidence-layer)):

1. `my-documents/resume.md` or `my-documents/cv.md` — for experience and technical capability
2. `my-documents/story-bank.md` — STAR+R stories that could expand into case studies
3. `my-documents/proof-assets/` — what the user already has (avoid duplicates, find gaps)
4. `my-documents/applications.md` — target roles the user is actively pursuing

**Applications.md fallback:** if the tracker is empty, thin, or the roles don't point in a clear direction, ask the user what kind of roles they're targeting. Don't make them opt in — just read it, and fall through to asking only when the data isn't there.

If source work documents are missing entirely, warn the user and offer `resume-builder` first. The skill still works on paste-only input, but evidence verification will be limited and every concrete claim will need `[ASK: ...]`.

First-run scaffold `proof-assets/` if missing. See [state-layer §2](../_shared/state-layer.md#2-first-run-scaffolding).

### 2. Discovery

Synthesize from the reads:

- **Target role(s)** — from `applications.md` or the user's answer
- **Technical capability** — from resume. Can they ship code? Design in Figma? Write long-form? Build in no-code? This bounds what they can realistically produce.
- **Existing proof** — what's already in `proof-assets/` and story-bank
- **Gap** — what the target role wants evidence of that the user hasn't demonstrated yet

State the gap back to the user in one or two sentences before suggesting ideas. "You're targeting content marketing roles; 3 of the 4 postings emphasize SEO, and nothing in your current proof set shows SEO work." That sentence is load-bearing — it's what makes the ideas feel tailored instead of generic.

### 3. Divergent — surface 3-5 concrete ideas

Not formats. Actual projects. Each idea should be:

- **Concrete enough to picture** — "A teardown of 3 B2B SaaS landing pages with what you'd change and why," not "a blog post about marketing."
- **Matched to capability** — don't suggest a working demo to someone who doesn't code; don't suggest a Figma prototype to someone who's never opened it.
- **Fills the gap** — each idea should close a specific hole in the user's current proof set.
- **Sized honestly** — rough effort estimate (hours or days, not weeks).

Push back when a project isn't proof-worthy. "Updated the team's onboarding doc" is a resume bullet, not a portfolio piece. Say so and offer alternatives from story-bank or the gap analysis.

### 4. Convergent — pick one

Help the user choose based on effort vs. leverage vs. which gap it closes. If they're torn between two, ask which target role matters most and let that break the tie.

### 5. Save the brief and hand off

**Every session ends with a brief saved to `my-documents/proof-assets/{slug}.md`.** Slug is a kebab-case descriptor (e.g., `b2b-landing-page-teardown`, `distributed-team-migration`). One slug, one file — no suffixes.

```markdown
# {Idea title}

**Chosen idea:** one sentence.

**Why it fits:** role match + which gap it closes. Reference the target role(s) from applications.md or the user's stated target.

**Rough scope:** what's in, what's out. Effort estimate.

**What it proves:** the specific capability this asset demonstrates to an employer.

**Acceptance criteria:** 3-5 bullets the user can check off to know it's done.

**Next step:** the single next action.
```

**Hand off, don't draft.** The skill ends with the brief saved. To actually write the case study, build the demo, or design the portfolio piece, the user takes the brief to a fresh Claude conversation — drafting is better done natively than inside a skill workflow. The brief file persists in `proof-assets/`; the user can iterate it in place as the asset takes shape.

### 6. Confidentiality

Before saving, proactively offer: anonymize the employer, focus on process over numbers, use a different project, or reframe as a hypothetical ("what I would do if"). Don't wait for the user to worry.

### 7. Cross-skill linkage

Once saved, tell the user what to do with it:

- **LinkedIn Featured section** — pin the finished asset (see `linkedin-optimizer`)
- **Resume Projects section** — cite it by filename in `resume-builder`
- **Cover letters** — reference it from `resume-tailor` ("see my case study on X")

## Common Mistakes

- **Generic "a case study" suggestion.** If the idea isn't tailored to the user's specific role, capability, and gap, you skipped discovery. Go back and read the evidence layer.
- **Rescuing a non-story.** If the project's outcome is "we shipped it," say so and suggest a different one. Don't spend 2 hours writing up something that won't move the needle.
- **Fabricating outcomes.** Proof assets are public and stay indexed. Every metric, scope claim, and outcome traces to a primary source or gets `[ASK: ...]`. Never guess.
- **Ending without a file.** A session that ends with "great ideas, I'll think about it" is a failed run. Save the brief, even if the artifact itself will be built later.
- **Ignoring existing proof-assets.** If the user already has a case study on X, don't suggest another one on X. Find the gap.
- **Drafting the asset inside the skill.** This skill produces a brief, not finished prose or built artifacts. If the user asks "now write the case study," save the brief and tell them to start a fresh Claude conversation — context-window and tool flexibility there beats anything we can cram into a skill workflow.

## Reference

See [`guides/proof-assets.md`](../../guides/proof-assets.md) for the four formats (case study, personal site, portfolio, proof link), confidentiality strategies, and role-specific examples that ground this skill.
