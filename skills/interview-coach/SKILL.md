---
name: interview-coach
description: Use when the user has an upcoming interview, received an interview invitation, or wants to prepare for a specific role at a specific company.
---

## Overview

Generate an interview prep brief with likely questions, talking points from the user's actual experience, evaluative questions to ask the company, and honest assessment of weaknesses. Reuse and grow a persistent STAR+R story bank so every prep session compounds instead of starting from zero.

## Workflow

> **State layer:** reads `applications.md` to check for a tracker row; if missing, offers to create one (the only place a row can be created directly at `status: interviewing`). Reads and appends to `story-bank.md`. Writes the prep brief as both an artifact and a report. See [state-layer contract](../_shared/state-layer.md).

### 0. Tracker check

Read `my-documents/applications.md` (first-run scaffold if missing). If no row exists for this company + role, **warn (do not block)**:

> I don't see a tracked application for **{Role} at {Company}**. Interview prep still works — want me to create a tracker row with `status: interviewing`, or skip the tracker?

Users may have interviews for applications submitted before they started using the tracker; that's why this warns instead of blocking.

If the user confirms tracker creation, insert a new row with `status: interviewing`. This is the one case where a row legitimately enters the tracker directly at `interviewing`, skipping `saved` and `applied`. It's a row *creation*, not a status regression — see [state-layer §4](../_shared/state-layer.md#4-status-enum).

### 1. Gather inputs

- **Job posting** — URL or pasted text. If URL can't be accessed, ask for pasted text. If no posting is available, ask what the user knows about the role's requirements.
- **Company name** — required
- **Resume** — read `my-documents/resume.md`

### 2. Research the company

If web browsing available: website, careers page, recent news, reviews, culture signals.
If not: ask what the user knows about the company.

### 3. Load the story bank

Read `my-documents/story-bank.md`. If it doesn't exist, scaffold it from the template in the [Story bank format](#story-bank-format) section below and tell the user you've created an empty bank that will grow with each prep session.

Parse every story's YAML metadata block. Build an internal index of `{id, themes, archetypes, title}`. You'll use this in step 4 to match existing stories against the role before inventing new ones.

### 4. Generate prep brief

**Likely Questions (8-12):**
- Role-specific behavioral questions from the posting's requirements
- Technical/domain questions relevant to the role
- Remote-work questions (async communication, independent work, distributed collaboration)
- For each behavioral question, **try to match an existing story bank entry first** by theme and archetype. Reference the story by title and note the reflection beat that applies. Only propose generating a new story when no existing story fits the question's archetype.
- For each question, talking points must come from the user's ACTUAL resume or story bank, not generic advice.

**Questions to Ask (5-8):**
Categorized: How They Work, Career Growth, Culture, Remote Operations. Include green/red flags for their answers. See [guides/interview-framework.md](../../../guides/interview-framework.md).

**Angles to Highlight:**
Specific resume experiences and story bank entries mapping to this role. Remote-readiness talking points. The narrative to lead with.

**Potential Weaknesses:**
Gaps between resume and requirements. How to address honestly — acknowledge and redirect, don't spin.

### 5. Capture new stories

For every gap identified in step 4 (behavioral question with no matching story), work with the user to elicit a new story in STAR+R format:

1. Ask for the **Situation** and **Task** first — where, when, and what was on the line.
2. Probe for the **Action** in first person. Push back on "we" — ask "what did *you* specifically do?"
3. Get the **Result** with a concrete metric if possible. If the user can't quantify, capture scope and impact qualitatively.
4. **Always elicit the Reflection beat.** Ask directly: *"Looking back, what would you do differently? What did that experience change about how you approach similar situations?"* Don't accept a shrug — the reflection is the seniority signal, and refusing to dig for it wastes the story. If the user truly can't produce one, note that explicitly in the Reflection field rather than fabricating something.

Don't invent specifics. If the user is vague, **ask a targeted follow-up** before falling back to `TBD — user to fill`. The user is already in the conversation — one more question is cheap, and a filled-in Action is worth far more than a bank of TBDs. A half-drafted story is still an asset; a fabricated one is a landmine. Reserve TBD for non-interactive contexts where the user isn't available to answer in the moment (rebuilding a bank from old notes, fixture-driven testing, etc.).

### 6. Save

Save four things:

1. **Artifact** (per-application folder): `my-documents/applications/{id}/interview-prep.md` — the version the user actually references before the interview.
2. **Report** (state-layer archive): `my-documents/reports/{###}-{id}-interview-prep-{YYYY-MM-DD}.md` — frontmatter: `id`, `company`, `role`, `application_id: {id}`, `skill: interview-coach`, `date`, `summary` (one-line angle). Body: the same prep brief content.
3. **Story bank updates** (`my-documents/story-bank.md`):
   - For every **reused** story, append an entry to its `usage` list with `date`, `company`, `role`, and `question`.
   - For every **new** story captured in step 5, append a new story section at the end of the file following the schema.
4. Display the brief in conversation.

## Story bank format

`my-documents/story-bank.md` holds STAR+R stories as a growing markdown file. One section per story. The file scaffold and per-story schema below are the canonical format — don't invent variants.

**First-run scaffold** (write this verbatim if the file is missing):

````markdown
# Story Bank

STAR+R stories for behavioral interviews. Each entry is a reusable asset — tag with themes so `interview-coach` can match it against future questions. See [guides/interview-framework.md](../guides/interview-framework.md) for the STAR+R format and why the Reflection beat matters.

<!--
Schema — one section per story:

## {Short memorable title}

```yaml
id: {kebab-case-slug, unique}
themes: [leadership, delivery, conflict, failure-learning, scope, stakeholder, crisis, ambiguity]
archetypes: [technical-leadership, scope-negotiation, cross-functional, turnaround, mentorship]
created: YYYY-MM-DD
usage:
  - date: YYYY-MM-DD
    company: {Company}
    role: {Role}
    question: {The question this story answered}
```

**Situation:** Where and when. One or two sentences of context.

**Task:** What you were responsible for. Make the stakes visible.

**Action:** What YOU specifically did. First person, concrete verbs.

**Result:** Quantified outcome. Metrics, scope, business impact.

**Reflection:** What you'd do differently, what you learned, how this changed your subsequent approach. The seniority tell.
-->
````

**Canonical themes:** `leadership`, `delivery`, `conflict`, `failure-learning`, `scope`, `stakeholder`, `crisis`, `ambiguity`. Add new themes sparingly — consistency makes matching cheaper.

**Parsing:** stories are H2 sections. Metadata lives in a fenced `yaml` block immediately under the title. STAR+R fields are bolded labels. Treat any parse failure the same way as `applications.md` parse failures: report the offending region and exit without overwriting.

## Common Mistakes

- **Generic questions.** "Tell me about yourself" is obvious. Generate questions specific to THIS role's requirements.
- **Generic talking points.** "I'm a team player" is useless. Reference specific achievements from the resume or a specific story from the bank.
- **Hiding weaknesses.** Hiring managers respect self-awareness. Acknowledge gaps honestly, then redirect to strengths. Include a scripted response for each weakness, not just the gap identification.
- **Skipping the story bank.** If you generate new behavioral answers without reading `story-bank.md` first, the user has to re-tell the same stories every session and the bank never compounds. Always read first.
- **Skipping the Reflection beat.** A STAR answer without a reflection is a junior answer. Always ask "what would you do differently?" — and if the user resists, tell them *why* it matters.
- **Fabricating story details.** If the user is vague on a metric or outcome, ask a follow-up — and mark the field `TBD` only if they still can't answer. Never invent plausible-sounding numbers. A single fabricated claim can blow up an interview when the interviewer probes.
- **Padding Action fields with plausible HOW details.** The Action field is where interviewers probe hardest — "walk me through exactly how you did that." If the user hasn't told you *how* they implemented something, *how* they traced a bug, or *what* tradeoffs they surfaced to a stakeholder, don't fill those details in yourself, even when a reasonable-sounding version is obvious. Plausible-but-invented Actions give the candidate a script that collapses under the first follow-up question. **Ask the user directly** — "How did you actually implement that?", "What did that conversation look like?" — interview-coach is conversational, so asking is cheap. Reserve `TBD — user to fill` for cases where the user genuinely isn't available (rebuilding a bank from old notes, fixture testing) or where they've tried and truly can't reconstruct the detail.
- **Leaking internal notes into the prep brief.** The prep brief artifact (`my-documents/applications/{id}/interview-prep.md`) is candidate-facing — it's what the user opens five minutes before the interview. Keep verification notes, self-grading scaffolding, "I wasn't sure about this," and TBD checklists *out* of it. If you have uncertainty, resolve it in conversation and save a clean brief. (The story bank is different — TBD Reflections there are expected and documented in step 5.)
