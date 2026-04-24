---
purpose: Persona fixtures for agent-driven testing of job-hunt-os skills
---

# Persona test fixtures

These files are **internal evaluation fixtures**, not polished public samples.

The persona inputs and anything under `tests/personas/outputs/` may include:

- grader-only notes
- synthetic edge cases
- intentionally incomplete or stress-test artifacts

If you want polished sample outputs to browse as a user, use [`examples/`](../../examples/) instead.

These are synthetic candidates used to dry-run skills end-to-end and catch regressions. They are **not** real people. Each persona is a self-contained markdown file with everything a skill needs as input and everything a grader needs to score the output.

## File structure

Every persona has the same sections:

1. **Identity** — name, location, current situation in one paragraph.
2. **Ground truth** — the *only* career facts a skill is allowed to use. If a skill output mentions a job, metric, tool, or achievement not in this section, that is a hallucination and a test failure.
3. **Skills & education** — same rule: only what's listed exists.
4. **Constraints & preferences** — comp, location, work style, deal-breakers.
5. **Target role** — a paste-in job posting the persona is applying to. Used by `resume-tailor`, `interview-coach`, `remote-culture-check`.
6. **Known traps** — specific things a skill is *likely* to invent or mishandle for this persona. The grader checks each trap explicitly.
7. **Skills exercised** — which skills this persona is designed to stress.

## How an agent should use these

A grading agent runs roughly like this for each `(persona, skill)` pair:

1. Load the persona file as the only candidate context.
2. Invoke the skill (e.g. `resume-tailor` against the persona's Target role).
3. Capture the output.
4. Score it against:
   - **Hallucination check** — every concrete claim (employer, date, metric, tool, certification) must trace to the Ground truth section. Flag any that don't.
   - **Trap check** — walk the Known traps list and verify each one was avoided.
   - **Skill-specific rubric** — e.g. for `resume-builder`: ATS-friendly format, quantified bullets, no objective statement, correct region (US resume vs UK/EU CV). For cover letters: specific role/company problem, concrete proof, no unresolved placeholders, no broad "I'm targeting X/Y/Z roles" market-summary language.
5. Report pass / fail per check with the offending span quoted.

The grader is itself an LLM, so calibrate it against a few human-reviewed runs before trusting verdicts.

## Running tests

Personas are inputs only — they don't run themselves. The expected workflow is:

- **Manual** — open a worktree, load a persona, invoke the skill, eyeball results.
- **Agent-driven** — spawn a subagent per `(persona, skill)` combo with the persona file + this README + the skill's rubric, have it return a structured pass/fail report.

## Current personas

| File | Persona | Primary skills exercised |
|---|---|---|
| [maya-chen-ic-to-em.md](maya-chen-ic-to-em.md) | Senior backend IC pivoting to Engineering Manager (US, remote) | resume-tailor, interview-coach, linkedin-optimizer, resume-auditor |
| [devon-park-bootcamp-grad.md](devon-park-bootcamp-grad.md) | Career-changer from teaching, first dev job (US, remote) | resume-builder, proof-asset-creator, resume-auditor, interview-coach |
| [aisha-okonkwo-academic-to-industry.md](aisha-okonkwo-academic-to-industry.md) | UK postdoc moving to industry data science (London, hybrid) | resume-builder (CV mode), resume-tailor, remote-culture-check, resume-auditor |

## Adding a new persona

Pick a gap the existing 3 don't cover (different region, seniority, gap in employment, contractor history, non-linear career). Mirror the section headers above. The Ground truth section is the contract — be specific enough that hallucinations are unambiguous, but don't overstuff it (real candidates have messy gaps too; that's part of what we're testing skills against).
