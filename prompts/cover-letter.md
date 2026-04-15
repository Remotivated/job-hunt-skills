# Cover Letter

> **Thin version.** This is the no-file-system version of the cover-letter mode in the [resume-builder](../skills/resume-builder/SKILL.md) skill, for use with ChatGPT, Gemini, Claude.ai, or any LLM without file access. The skill version reads your canonical resume from disk, writes the cover letter to `my-documents/coverletter.md`, and triggers PDF generation. This prompt can't read, save, or render — you paste the resume in, you copy the letter out. Use the skill if you have Claude Code; use this if you don't.

## What you'll need

- Your resume, pasted as plain text
- The job posting, pasted as plain text
- Background reading: [resume-philosophy.md](../guides/resume-philosophy.md)

## The prompt

```
Write a cover letter for this role. The letter should COMPLEMENT my resume, not duplicate it — expand on 1-2 key achievements with context that doesn't fit in a bullet. Do not restate bullet points.

MY RESUME:
[paste full resume text]

JOB POSTING:
[paste full posting text]

Structure:

Opening (2-3 sentences) — LEAD WITH PROOF, NOT PRAISE:
- **Default pattern — Problem → proof.** Name a specific challenge from the job posting, then immediately show you've solved it. Example: "You're hiring a [role] to [specific problem from the JD]. I spent the last [timeframe] doing exactly that at [Company] — [one-line outcome with a number]."
- **Alternate A — Point of view.** Open with a sharp, specific opinion about the problem space that signals domain fluency. Risky but memorable; only use when the POV genuinely matches how they seem to think.
- **Alternate B — Insider observation.** Something only someone who actually used the product, read the docs, or shipped in that space would notice. Rare but devastating when it lands.
- **Do NOT write** "I am writing to express my interest in..." — that's filler, cut it.
- **Do NOT open with** "I saw your recent post / blog / announcement / funding round about X." That's the exact pattern of AI-generated application spam and hiring managers pattern-match it as slop. Lead with your evidence before any reference to the company.

Body paragraph 1 (3-4 sentences):
- Strongest alignment point: their need → my evidence → the outcome.
- Expand on one resume achievement with context that a bullet couldn't carry.
- Show I understand what the role actually requires.

Body paragraph 2 (3-4 sentences, optional):
- A second dimension if it adds something new — leadership, remote readiness, domain depth, or cultural fit. Skip this paragraph entirely if it would just repeat body 1. One strong paragraph beats two weak ones.

Closing (2-3 sentences):
- Genuine enthusiasm, confident not desperate.
- A clear next step ("I'd welcome the chance to discuss...").
- Do NOT write "I would be honored and grateful" — be direct.

Constraints:
- 250-400 words total
- First person, professional but human tone
- Match their terminology where natural, but do not stuff keywords
- Include a remote-readiness signal only if relevant to the role
- Do NOT invent details that aren't in my resume. If a claim would strengthen the letter but isn't in what I pasted, mark it [ASK: ...] and move on — do not fabricate.
```

## What you'll get

A 250-400 word cover letter ready to copy-paste, specific to the role and company, leading with your strongest alignment point. If you see an `[ASK]` placeholder in the output, fill it in before sending.
