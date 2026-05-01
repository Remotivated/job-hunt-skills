# LinkedIn Audit

Use this prompt when you want to improve your LinkedIn headline, About section, experience copy, skills, and profile signals. Paste your resume as the evidence source so the model does not invent public claims.

## What you'll need

- Your resume, pasted as plain text
- Current LinkedIn headline
- Current About section
- Current Experience section for your 2-3 most recent roles
- Top 3 pinned Skills
- Full Skills list, if available
- Featured section contents, or "empty"
- Banner image description, or "default"
- Location field
- Custom URL
- Open-to-Work status
- Recent activity
- Target roles
- Story snippets, case studies, or proof assets, optional
- Background reading: [resume-philosophy.md](../guides/resume-philosophy.md)

## The prompt

```
Audit my LinkedIn profile and rewrite each section ready to copy-paste. LinkedIn is a narrative. It is where hiring managers go to understand how I think, not to re-read my resume.

EVIDENCE RULE:
LinkedIn is public and indexed. Every concrete claim in your rewrites - metrics, role scope, outcomes, tool names, dates - must trace back to something in the resume I paste below. If you cannot find a match, mark it [ASK: verify X]. Never invent.

INPUT RULE:
Skip any field below I leave blank or mark "not available." Audit only what I provide. In the final output, list under MISSING INPUTS the sections you could not audit and what I would need to paste to unlock them. Do not guess at fields I did not give you.

MY RESUME:
[paste full resume text]

MY STORY / PROOF ASSETS:
[paste relevant STAR stories, case studies, project links, or write "resume only"]

MY CURRENT HEADLINE:
[paste current headline]

MY CURRENT ABOUT SECTION:
[paste current About section]

MY CURRENT EXPERIENCE SECTION:
[paste current experience text]

MY TOP 3 PINNED SKILLS:
[list the three Skills pinned at the top]

MY FULL SKILLS LIST:
[paste full LinkedIn Skills list if available, or write "not available"]

MY FEATURED SECTION:
[describe what is pinned, or write "empty"]

MY BANNER:
[describe the banner, or write "default"]

MY LOCATION FIELD:
[paste current location value]

MY CUSTOM URL:
[paste or write "default numeric URL"]

MY OPEN-TO-WORK STATUS:
[off / recruiter-only / public green badge]

MY RECENT ACTIVITY:
[describe posting/commenting patterns, or write "mostly inactive"]

MY TARGET ROLES:
[roles and industries I am aiming at]

Rate each section STRONG / NEEDS WORK / WEAK, then provide rewrites in this format:

BEFORE: [original]
AFTER: [improved]
WHY: [what changed]

Deliver the audit in this order, and show character counts on fields with limits:

1. HEADLINE (220 char limit) - provide 2-3 options using [Function] + [Focus/Specialization] + [Audience or Keyword].

2. ABOUT SECTION (2,600 char limit) - full rewrite. The first roughly 220 characters must hook. First person. Narrative, not biographical. Do not paste resume bullets. Do not open with "Results-driven professional."

3. EXPERIENCE COPY (2,000 chars per role) - rewrite for voice only: first-person, narrative, outcome-framed. Do not change the substance beyond what my resume supports.

4. SKILLS - audit whether my top 3 pinned Skills are recruiter-search terms for my target roles. Flag soft skills in the top 3 as wasted slots. If I pasted the full Skills list, recommend which skills to keep, remove, add, or pin.

5. FEATURED SECTION STRATEGY - what to pin and in what order. If I have nothing pinnable, name one specific piece I should create, grounded in experience already on my resume.

6. BANNER - flag whether the banner reinforces my positioning or looks default/generic. Suggest one concrete visual direction that fits my target roles. Do not suggest a stock-photo cliche.

7. LOCATION - if I am targeting remote roles, flag whether my location helps or hurts discoverability.

8. CUSTOM URL - flag if it is still the default numeric URL.

9. OPEN-TO-WORK - explain the tradeoff if the public green badge is on.

10. ACTIVITY PLAN FOR 7 DAYS - specific, low-volume actions that show how I think.

11. REMOTE-READINESS - weave remote signals naturally into the rewritten sections where relevant.

Do not invent experience I have not mentioned. Anything in a rewrite that cannot be sourced from the resume gets [ASK: ...].
```

## What you'll get

Headline options, a complete About rewrite, voice-only Experience rewrites, a Skills audit, Featured section strategy, profile-field flags, and a short activity plan. Every concrete claim should trace back to your pasted resume.
