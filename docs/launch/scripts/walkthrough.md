# Walkthrough Video — Beat Outline

Jim narrates throughout. Never speaks AS Avery — always third-person about Avery's situation. Avery's source files are pre-built in `examples/avery-castillo/`.

## Cold open (0:00–0:30) — TALKING HEAD

Memorize verbatim:

> "I'm Jim Coughlin, founder of Remotivated. I built Job Hunt Skills because most AI job-hunt tools optimize for application volume over honest representation. The next 10 minutes are an end-to-end walkthrough using Avery Castillo — a synthetic Solutions Engineer persona we ship in examples so you can clone the files and follow along."

## resume-builder (0:30–1:30)

- Show `examples/avery-castillo/my-documents/resume.md` already in shape
- Invoke `resume-builder` skill briefly to confirm version and label
- Quick edit beat: rewording one bullet to demonstrate the skill is alive

## company-research (1:30–3:00)

- Invoke `company-research` skill on the Polaris Data posting
- Watch the report generate into `my-documents/reports/`
- Open and skim the report — pull out 2 findings to mention aloud (product depth, GTM signals)

## resume-tailor (3:00–5:00)

- Invoke `resume-tailor` skill
- Show the new file appear at `applications/polaris-data-senior-se/resume.md`
- Open both source and tailored side-by-side
- Narrate what got reframed and what didn't (lead with the multi-threaded enterprise angle, etc.)

## claim-check — KEYSTONE BEAT (5:00–6:30)

This is the moment that earns the entire video.

- Invoke `claim-check` skill
- Skill flags the "$4.2M in pipeline" claim as unsupported
- Jim narrates the moment: "Right — I (Avery) can defend the activity but not the dollar figure attached. Let's soften it."
- Show the soft replacement landing in the tailored resume
- Verify the diff is visible on screen

**Critical:** Dry-run this beat *before* recording. If `claim-check` doesn't reject as expected, fall back to a pre-recorded screen capture (see Task 31).

## cover-letter (6:30–7:30)

- Invoke `cover-letter` skill
- Show the generated `coverletter.md`
- Skim aloud — pull out the demo-storytelling angle

## interview-coach (7:30–9:00)

- Invoke `interview-coach` skill
- Show the generated interview-prep brief
- Pull one likely question and read aloud
- Mention this brief uses the story-bank.md content as evidence

## applications.md + generate-docx (9:00–9:30)

- Show applications.md updated with the Polaris Data row
- Run `python scripts/generate-docx.py examples/avery-castillo/my-documents/applications/polaris-data-senior-se/resume.md examples/avery-castillo/my-documents/applications/polaris-data-senior-se/coverletter.md`
- Watch `.docx` and `.pdf` materialize in the same folder
- Open one to show the formatted output

## Wrap (9:30–10:00) — TALKING HEAD

Memorize verbatim:

> "That's 10 minutes start to finish. Avery's full files are in examples slash avery dash castillo. Repo URL's below. If you've got your own application in mind, install the plugin and type 'Help me get started' — it'll take you from zero."

## Production notes

- Single 16:9 export
- Captions auto-generated then reviewed
- Jim in PiP (lower-right) during screen sections
- Full-frame Jim for cold open and wrap only
- Filming approach: each skill demo can be its own clip — join in Descript by transcript
