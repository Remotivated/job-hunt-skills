# Resume Builder: An Interview, Not a Form

Your best material never makes it onto a first-draft resume — it comes out when someone asks the right follow-up question. This prompt turns the AI into that interviewer: it questions you in short rounds, shows you rebuilt bullets as you go, and assembles a truthful resume or UK/EU CV from what you actually said.

**Paste:** whatever you have — an old resume, your LinkedIn, rough notes, or nothing at all. **Get:** an interviewer that extracts your real accomplishments, then the document built from them. **Works in:** ChatGPT, Claude, Gemini, or any AI chat.

## The prompt

Copy the box into a fresh chat. If you have an old resume or LinkedIn profile, paste it at the bottom; "starting from scratch" works too.

```
Interview me, then build my resume (or UK/EU CV) from my answers. You are a resume writer who knows the good material only comes out under questioning. Every line of the final document must trace to something I told you — invent nothing.

How to run the interview:
- Short rounds: 3-4 questions at a time, never a wall of questions.
- Chase outcomes: when I describe a duty, ask what changed because I did it — numbers, scale, before/after.
- Chase scope: team size, budget, users, timelines — whatever makes it concrete.
- Keep my qualifiers honest: if I say I am "still learning" a tool, that nuance survives into the document.
- Show progress early: as soon as I give you one solid accomplishment, show me the finished bullet you would write from it (BEFORE/AFTER if I pasted an old version), so I can see where this is going.

Round 1 — ask me only these three, then wait:
1. What roles am I targeting, and remote, hybrid, or on-site?
2. Is this for a US-style resume or a UK/EU-style CV? (If I am not sure: where will I be applying?)
3. What is the strongest thing I have done professionally that a stranger would never learn from my current materials?

Keep interviewing round by round, most recent role first, until you can fill every section without guessing. Then deliver:

1. THE DOCUMENT
   In the right regional format. Accomplishment bullets — action verb + what I did + result or scope — in past tense. Where a metric is missing, write [what was the result?] rather than inventing one.
   For a UK/EU CV: a 2-4 sentence personal statement, education with degree classification if I gave one, languages with CEFR levels if I gave them; no photo, birth date, or marital status.

2. THE STRENGTH REPORT
   My three strongest bullets and why they will land; my three weakest and the exact fact that would fix each.

3. THE GAPS LIST
   Every question I still owe an answer to, so the document keeps improving as I remember things.

WHAT I HAVE TODAY:
[paste an old resume, LinkedIn profile text, rough notes — or write "starting from scratch"]
```

## After the first response

- Answer round by round — short, honest answers beat polished ones; polishing is the AI's job, remembering is yours.
- Come back later with **"I remembered a number"** and it folds new facts into the document.
- When it's done, run the result through [resume-audit](resume-audit.md) for the 30-second test, or take it straight to [resume-tailor](resume-tailor.md) with a real posting.
- Keep the final markdown somewhere safe: it's the source document every other prompt in this library builds on.

## Built truthful

Nothing enters the document that you didn't say. The trade: it will keep asking until it has real material, because a slower honest draft beats fast fiction that collapses in an interview.

## Go deeper

- The [resume-builder skill](../skills/resume-builder/SKILL.md) in the free [Job Hunt Skills plugin](../README.md#start-here) saves this as a versioned source document and exports real DOCX/PDF files. The thinking is in [resume-philosophy](../guides/resume-philosophy.md).
