# Interview Prep

Use this prompt when you have an interview coming up and want role-specific questions, talking points, and questions to ask the company. Paste your resume and the job posting so the model can ground the prep in your actual experience.

## What you'll need

- Job posting, pasted as plain text
- Company name
- Your resume, pasted as plain text
- Interview stage, interviewer role, format, and duration, if known
- Company research brief, optional
- Anything you already know about the company, optional
- Background reading: [interview-framework.md](../guides/interview-framework.md)

## The prompt

```
Help me prepare for an interview. I want to evaluate them as much as they evaluate me.

COMPANY:
[company name]

INTERVIEW STAGE:
[recruiter screen / hiring manager / technical / panel / final / unknown]

INTERVIEWER(S):
[names and roles if known, or write "unknown"]

FORMAT AND DURATION:
[video/phone/onsite, expected length, presentation or coding exercise if any, or write "unknown"]

JOB POSTING:
[paste full posting text]

MY RESUME:
[paste full resume text]

COMPANY RESEARCH BRIEF:
[paste research notes, or write "not available"]

WHAT I KNOW ABOUT THE COMPANY:
[paste notes, or write "nothing yet"]

Generate the prep brief in this order:

0. INTERVIEW STRATEGY:
   - What this stage is likely testing
   - What the interviewer probably cares about
   - How I should spend my preparation time

1. LIKELY QUESTIONS (8-12):
   - 3-4 behavioral questions specific to this role's requirements
   - 2-3 technical/domain questions from the posting
   - 2-3 remote-work or collaboration questions if relevant
   For each question, provide talking points drawn from my actual resume. Reference specific achievements. Do not give generic advice like "be a team player."

2. TOP 3 ANSWER SKELETONS:
   For the three most likely or highest-stakes questions, draft a 60-90 second answer structure:
   - Opening thesis
   - Evidence from my resume
   - Result or impact
   - Bridge back to this role
   Do not invent story details. Use [ASK: ...] for missing specifics.

3. QUESTIONS I SHOULD ASK (5-8), categorized as:
   - How They Work
   - Career Growth
   - Culture
   - Remote/Hybrid Operations, if relevant
   For each, include a green-flag answer and a red-flag answer so I know what to listen for.

4. ANGLES TO HIGHLIGHT:
   - My 3 strongest selling points for this role, each tied to a specific resume line
   - Remote-readiness or self-direction talking points where relevant
   - The narrative to lead with in "tell me about yourself"

5. POTENTIAL WEAKNESSES:
   - Gaps between my resume and their requirements, named specifically
   - For each, a scripted response that acknowledges the gap honestly and redirects to a strength. Do not spin or hide.

6. STAR+R STORY ELICITATION:
   For each behavioral question where my resume does not already contain the answer, ask me to draft a story in STAR+R format:
   - Situation
   - Task
   - Action, first person
   - Result, concrete if possible
   - Reflection, what I learned or would do differently

Do not invent specifics about my experience anywhere in the brief. If a story would benefit from a number I have not provided, use [ASK: what was the outcome?].
```

## What you'll get

A prep brief with stage-specific strategy, likely questions, answer skeletons tied to your resume, questions to ask the company, weakness scripts, and prompts for stronger STAR+R stories.
