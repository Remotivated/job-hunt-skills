---
name: get-started
description: Use when the user is new to Job Hunt OS and wants to set up the state layer and build their first canonical resume, CV, and/or cover letter. Triggers on "I'm new to Job Hunt OS", "help me get started", "set me up", "first time using this", or when the user explicitly invokes /get-started. Also use when `my-documents/` has not been scaffolded yet. Once the user has existing canonicals and is just iterating, prefer `resume-builder` directly.
---

The onboarding wrapper for Job Hunt OS. Walks a first-time user from a fresh clone to a fully-scaffolded state layer with at least one canonical document built and ready. The document generation itself lives in `resume-builder`; this skill adds orientation, scaffolding, and post-build framing around it so a new user doesn't land on a half-built foundation.

## Workflow

### 1. Orient the user

Before the interview starts, give a short, warm orientation — prose with a bit of structure (2-3 light section headers are fine, but no bulleted walls and no numbered intake forms). You're talking to a jobseeker, not a developer. The goal is twofold: lower the stakes for the next 20 minutes, and position today's work in the larger arc of their job search.

**Convey, in plain language:**

- **The shape of the tool (lead with this):** Job Hunt OS treats their main work document (resume or CV, whichever they call it), and when it makes sense to write one, their cover letter, as source-of-truth documents — we invest in them once, then reuse them for every application. When they find a role, we tailor a copy from these. When they want honest feedback, we check against these. Everything downstream works best when these are accurate, which is why today matters.
- **What happens in the next 15-25 minutes:** you'll ask about their work history and target roles, then draft the documents we can write honestly today, verify nothing's invented, and hand them back polished Word and PDF files saved locally. Faster if they already have a resume or LinkedIn export to start from. If the cover letter would be generic, skip it rather than force it.
- **What they'll have at the end:** their main work document, and a cover letter only if you have enough specificity to make it sound like something they would actually send.
- **One line about later (optional):** once the documents exist you can help them tailor for a specific role or get honest feedback. Don't name the skills.

**Vocabulary — mirror the user's word, don't translate:**

- If the user says "CV," say "CV" throughout the session. If they say "resume," say "resume." Never override their word.
- That word gets written to the canonical's `label` frontmatter field at save time (resume-builder handles this) and is the source of truth for every downstream skill. See [state-layer contract §6](../_shared/state-layer.md#6-canonical-resume-frontmatter).
- If the user hasn't signaled a word yet, use neutral phrasing ("your main work document") until they do. Don't force a choice just to pick a label.

**Vocabulary to keep OUT of user-facing text:**

| Don't say | Say instead (or omit) |
|---|---|
| canonical / canonical markdown | master / source-of-truth / your main [resume/CV] |
| drift check | check that nothing's invented |
| `my-documents/` | saved locally (or omit) |
| `resume.md` / `cv.md` / `coverletter.md` | resume / CV / cover letter (per the user's word) |
| `resume-auditor` / `resume-tailor` | honest feedback / tailoring for a specific role |
| state layer / scaffolding / workflow / hand off | — (internal only, omit) |
| DOCX / PATH / LibreOffice | Word files / PDFs |

**Asking about scope:** End the orientation with a plain-language question pitched to where the user is:

- If they've already said "CV" or "resume," use their word: "Want a resume, a cover letter, or both?" (swap "CV" for "resume" if that's what they said). If they want a cover letter, also ask whether they have a specific role/company in mind or at least a tightly-defined target lane; a generic cover letter is worse than none.
- If they haven't signaled a word, ask about **document style** (not region — Job Hunt OS users apply globally and region-based framing is exclusionary for anyone not in the US/UK/EU): "Want a resume, a cover letter, or both? And for the resume, which style — a US-style 1-pager (achievement-focused, short) or a longer CV-style with a personal statement?" The style answer determines the format and filename (`resume.md` vs `cv.md`); the word they use in their reply is what you'll mirror from there on. If they want a cover letter, also ask whether they have a specific role/company in mind or at least a tightly-defined target lane. Users can volunteer their target market if it's relevant — don't prompt for it.

Don't present a numbered menu, don't put filenames in parentheses. If they also haven't mentioned an existing resume, fold that into the same turn: "…and do you have an existing resume or LinkedIn export I can work from?"

### 2. Scaffold the state layer

Run `node scripts/scaffold-state.mjs` once, before handing off to `resume-builder`. The script is idempotent — it only creates what's missing (`applications.md`, `story-bank.md`, the subdirectories with `.gitkeep`s). This is the state layer the rest of Job Hunt OS depends on, so don't skip it. See [state-layer contract §2](../_shared/state-layer.md#2-first-run-scaffolding).

### 3. Build the canonicals

Invoke the `resume-builder` skill and run its workflow end-to-end: gather existing materials → structured interview → generate outputs with drift check → save → DOCX/PDF generation. `resume-builder` owns document structure, interview depth, drift-checking, and file generation — don't duplicate those steps here. If the user wants a cover letter but can't give enough specificity to avoid a broad, reusable-to-anyone draft, let `resume-builder` skip the cover letter for now.

If the user signaled scope ("just a CV", "cover letter only", "build a UK CV"), pass it through so `resume-builder` can route to the right mode (see [resume-builder §5 Modes](../resume-builder/SKILL.md#5-modes)).

### 4. Seed the story bank (offer, don't assume)

The interview just collected concrete accomplishments — exactly the STAR material `story-bank.md` is designed to hold for `interview-coach` and `resume-drift-check`. After saving the canonicals, offer to capture the richest 2-3 as stubs:

> I noticed you mentioned [brief one-line summaries of 2-3 accomplishments from the interview]. Want me to capture those as STAR stubs in `story-bank.md` now? It seeds your evidence layer for interview prep and drift-checking, and you can flesh them out later.

If the user declines, move on without pushing — don't re-ask. If they accept, append each as a STAR+R entry (Situation / Task / Action / Result / Reflection) to `my-documents/story-bank.md` using whatever detail the interview surfaced, and mark gaps with `[ASK: …]` placeholders rather than inventing. Never fabricate specifics to round out a stub.

### 5. Closing orientation

End the run with a short recap so the user knows what now exists and what to do next. Keep it tight — the user just spent 20 minutes in an interview, don't bury the landing:

- **Files created** (with paths): the canonicals you wrote, plus their PDFs.
- **One-line reminder** that these are the canonicals every other skill reads from, and they live in the gitignored `my-documents/` tree.
- **The 1-2 skills most likely to be useful next**, framed as suggestions rather than a checklist:
  - "Want honest feedback on what we just built? → `resume-auditor`"
  - "Found a specific role you're interested in? → `remote-culture-check` first (vet the company), then `resume-tailor` (customize for the role)"

## When not to use this skill

If the user already has canonicals (`my-documents/resume.md` or `cv.md` exists) and is asking for an update, a tweak, or a rebuild, invoke `resume-builder` directly instead. Orientation and story-bank seeding are wasted steps for someone who already knows the system — and the closing recap reads as patronizing in update mode.
