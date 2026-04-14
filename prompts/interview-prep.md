# Interview Prep

> **Thin version.** This is the no-file-system version of the [interview-coach](../skills/interview-coach/SKILL.md) skill, for use with ChatGPT, Gemini, Claude.ai, or any LLM without file access. The skill version loads a persistent STAR+R **story bank** (`story-bank.md`), matches new behavioral questions against stories you've already told, and appends any new stories captured during prep so every session compounds. This prompt cannot do that — every session starts from zero, you re-tell the same stories each time, and nothing is saved. If you interview often, the compounding story bank is the main reason to run the skill. Use the skill if you have Claude Code; use this if you don't.

## What you'll need

- Job posting, pasted as plain text
- Company name
- Your resume, pasted as plain text
- Anything you already know about the company (optional — culture page text, Glassdoor themes, news)
- Background reading: [interview-framework.md](../guides/interview-framework.md)

## The prompt

```
Help me prepare for an interview. I want to evaluate THEM as much as they evaluate me.

COMPANY: [company name]

JOB POSTING:
[paste full posting text]

MY RESUME:
[paste full resume text]

WHAT I KNOW ABOUT THE COMPANY (optional):
[paste notes, or write "nothing yet"]

Generate the prep brief in this order:

1. LIKELY QUESTIONS (8-12):
   - 3-4 behavioral questions specific to this role's requirements
   - 2-3 technical/domain questions from the posting
   - 2-3 remote-work questions (async communication, independent delivery, distributed collaboration)
   For EACH question, provide talking points drawn from MY ACTUAL RESUME. Reference specific achievements. Do NOT give generic advice like "be a team player."

2. QUESTIONS I SHOULD ASK (5-8), categorized as:
   - How They Work (typical week, decision-making, meetings vs. focused time)
   - Career Growth (what success looks like at 6 months, how people advance)
   - Culture (hardest part about working here, how disagreements get handled)
   - Remote Operations (timezones, async norms, onboarding distributed hires)
   For each, include a green-flag answer and a red-flag answer so I know what to listen for.

3. ANGLES TO HIGHLIGHT:
   - My 3 strongest selling points for THIS role, each tied to a specific resume line
   - Remote-readiness talking points
   - The narrative to lead with in "tell me about yourself"

4. POTENTIAL WEAKNESSES:
   - Gaps between my resume and their requirements, named specifically
   - For each, a scripted response that acknowledges the gap honestly and redirects to a strength. Do not spin or hide — self-awareness is a green flag.

5. STAR+R STORY ELICITATION (for each behavioral question above, if my resume doesn't already contain the answer):
   Ask me to draft a story in STAR+R format — Situation, Task, Action (first person — push back if I say "we"), Result (concrete metric if possible, otherwise scope and impact), and Reflection ("what would you do differently? what did this change about how you approach similar situations?"). The Reflection beat is the seniority signal — always ask for it.

Do NOT invent specifics about my experience. If a story would benefit from a number I haven't provided, use [ASK: what was the outcome?] as a placeholder.
```

## What you'll get

A prep brief with role-specific likely questions (each with talking points tied to your resume), questions to ask the company with green/red flags, angles to highlight, honest weakness scripts, and a STAR+R elicitation pass for behavioral gaps. Save the output somewhere you'll find it before the interview — this prompt has no memory.
