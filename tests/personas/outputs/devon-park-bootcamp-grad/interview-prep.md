# Interview prep — Junior Frontend Engineer · Honeycomb

**Candidate:** Devon Park
**Role:** Junior Frontend Engineer (Web team)
**Company:** Honeycomb (observability platform, Series D, remote US)
**Date:** 2026-04-11

## Angle to lead with

You are a career-changer from six years of high school physics teaching into frontend engineering. Hack Reactor finished four months ago, you've been freelancing Next.js sites for local small businesses since January, and you have one merged OSS PR. Honeycomb's job description explicitly says "we hire from non-traditional backgrounds" and lists teaching/mentoring experience as a bonus — you are exactly the candidate they wrote that paragraph for. Lead with the scale of the teaching (six years, three courses, ~120 students per year), bridge through the Apps Script macro as evidence you build tooling when tooling is missing, and land on the freelance work as proof you can deliver for real clients. Do not apologize for being new to the industry; point at the evidence you've been building since you left the classroom.

## Likely questions

1. **"Walk me through your background and why you're making this career change."**
   Narrative. Six years at Roosevelt teaching AP Physics 1, AP Physics C, and Introductory Physics to about 120 students per year. Left in June 2025 to attend Hack Reactor (Aug–Dec 2025). Since January you've been freelancing Next.js sites to keep the muscle warm while job-searching. The pivot is deliberate, not a backup plan.

2. **"Tell me about a React project you're proud of."**
   Story: **StudyLoop spaced-repetition algorithm**. Four-person capstone team, three-week sprint, you owned the spaced-repetition algorithm implementation and the deck-import feature. React + Node + Postgres, deployed on Render. Be honest about scope: it was used by your cohort during the final showcase, not by external users.

3. **"Tell me about a bug you had to debug."**
   Story: **Fixing a date-parsing bug in an open-source markdown editor**. Single PR containing a 12-line fix to the date-parsing utility plus a README typo fix. The maintainer thanked you in the PR thread. Be precise about the size — "a small, focused fix" — and about it being your first OSS contribution.

4. **"Tell me about a time you had to teach yourself a new technology."**
   Story: **Automating progress reports with Google Apps Script**. At Roosevelt you had no training in Apps Script when you started — you built a macro to automate progress-report generation, and it ended up being adopted by four other teachers in the science department. This is one of your strongest cards because it shows you build tooling from scratch when tooling is missing.

5. **"How do you explain technical concepts to non-technical people?"**
   Strongest card. Six years of teaching physics to high school students is the baseline; the freelance client work (**Freelance client delivery for two small businesses**) is the recent evidence — you've been working directly with two non-technical small-business owners since January. Pair the two: "Teaching gave me the instinct; freelancing made me sharper about scoping and tradeoffs."

6. **"Tell me about a team project."**
   Story: **StudyLoop**. Four-person team, three-week sprint. Be honest about the split — you owned two features (spaced-rep algorithm, deck-import), not the whole app.

7. **"Tell me about a time you mentored someone."**
   Story: **Coaching FIRST Tech Challenge robotics**. Three consecutive seasons at Roosevelt while teaching full-time; the team reached regionals twice. Three years of commitment is the signal.

8. **"Why Honeycomb? Why observability?"**
   Honest: you do not have an observability background. Lean on *why Honeycomb specifically* — the JD's explicit welcome to bootcamp grads and career changers, the React + TypeScript stack matching where you want to grow, and the chance to pair with senior engineers on a product developers actually use.

9. **"What's your plan for learning TypeScript on the job?"**
   The JD explicitly says "willingness to learn TypeScript on the job" — this is a scripted answer, not a gotcha. Honest framing: you've read TypeScript but haven't written much of it. Your plan is to ramp via pairing in the first few weeks, lean heavily on code review, and convert your solo WeatherWear project to TS in your own time as the practice surface.

10. **"How do you stay accountable when working independently or remotely?"**
    The freelance work is the evidence. Two clients, no one handing you tickets — you've been running your own scope, delivery, and post-launch follow-up since January.

11. **"Tell me about a time you made a mistake."**
    You do not have a pre-built story for this in the bank. Take a beat, think of a real one from teaching, bootcamp, or freelancing, and tell it honestly. Do not reach for a generic "I committed to node_modules once" answer.

12. **"What does your first 30 / 60 / 90 days look like?"**
    30: ramp on the codebase, pair with a senior on small PRs, get fluent in the build and test flow. 60: own a small feature end-to-end, start writing TypeScript without pairing for the straightforward cases. 90: contributing reliably to the Web team's roadmap, with TS comfortable enough that it's not the bottleneck.

## Questions to ask Honeycomb

**How they work**

- What does a typical week look like for a junior engineer on the Web team? How much pairing with senior engineers happens in practice? *(Green flag: concrete answer with examples. Red flag: "as much as you need" with no specifics.)*
- How do code reviews work for a junior — what does the feedback loop look like for the first few PRs?

**Career growth**

- How long does Junior → Mid typically take at Honeycomb, and what does that progression look like? *(Green flag: someone has done it recently and you hear their name. Red flag: vague "depends on the person" with no examples.)*
- Is there a formal mentorship or buddy structure for new hires, especially for career changers?

**Culture**

- You mention hiring from non-traditional backgrounds — what does onboarding look like for someone without prior industry experience?
- What does the team do when a junior engineer ships a bug to production? *(Green flag: blameless, learning-oriented. Red flag: anything about "accountability" that sounds punitive.)*

**Technical and remote**

- "Learn TypeScript on the job" — in practice, what does that look like in the first three months? Pairing? Formal training? A buddy review every PR?
- What's the time-zone distribution of the Web team, and what's the default for sync vs async communication?

## Potential weaknesses

| Gap | Honest acknowledgment | Bridge |
|---|---|---|
| **No professional dev experience** | "This is my first dev role — four months of freelance, a bootcamp capstone, and one OSS PR." | "What I'm bringing instead is six years of teaching, the Apps Script macro that shows I build tooling when it's missing, and the freelance work that shows I can deliver for a real client end-to-end." |
| **TypeScript is shallow** | "I've read TypeScript but I haven't written much of it." | "The JD says willingness to learn on the job, and my plan is to pair heavily in the first few weeks and convert my solo WeatherWear project to TS as a practice surface on my own time." |
| **No observability or monitoring experience** | "I've never used an observability tool in production — my bootcamp projects and freelance sites don't have that kind of instrumentation." | "That's part of why this role is interesting — I'd be learning the product while I build on it, which is a useful position to be in as a junior on the Web team." |
| **No data visualization background** | "No. I know Honeycomb's dashboards are a big part of the product." | It's listed as a *bonus*, not a requirement. Don't over-apologize. |
| **Bootcamp projects have no real users** | "StudyLoop was used by my cohort at the final showcase, not external users. The freelance sites have small local audiences, not scale." | Redirect to the OSS PR (real code running in a real project) and the freelance sites (real clients, real money, however small). |

## Narrative checkpoint

Before the interview, re-read the three strongest beats:

1. **Teaching scale.** Six years, three courses, ~120 students per year. Lead with this when asked about communication or teaching someone difficult material.
2. **Apps Script macro.** Self-taught the language, built the tool, four other teachers adopted it. Use this for "learn something new" or "show initiative" questions.
3. **Freelance continuity.** January to present, two clients, full delivery cycle. Use this for "work independently" or "stakeholder communication" questions.

If an interviewer asks something you don't have a pre-built story for, pause, think of a real example, and tell it honestly. Do not fabricate.
