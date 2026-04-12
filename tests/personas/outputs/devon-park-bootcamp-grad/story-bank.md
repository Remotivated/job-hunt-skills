# Story Bank

STAR+R stories for behavioral interviews. Each entry is a reusable asset — tag with themes so `interview-coach` can match it against future questions. See [guides/interview-framework.md](../../../../guides/interview-framework.md) for the STAR+R format and why the Reflection beat matters.

---

## Automating progress reports with Google Apps Script

```yaml
id: roosevelt-apps-script-macro
themes: [delivery, leadership]
archetypes: [self-taught-technical, cross-functional, initiative]
created: 2026-04-11
usage:
  - date: 2026-04-11
    company: Honeycomb
    role: Junior Frontend Engineer
    question: Tell me about a time you taught yourself a new technology.
```

**Situation:** At Roosevelt High School, generating grade-progress reports was a recurring manual task for teachers in the science department.

**Task:** I decided to automate it for myself, using Google Apps Script (which I hadn't written before).

**Action:** I wrote a Google Apps Script macro that automated the progress-report generation against the department's existing gradebook spreadsheets. TBD — user to fill in the specifics of how the macro was built, whether documentation accompanied it, and how it was introduced to the rest of the department.

**Result:** The macro was adopted by four other teachers in the science department by the time I left teaching in June 2025.

**Reflection:** TBD — user to fill.

---

## Coaching FIRST Tech Challenge robotics

```yaml
id: roosevelt-ftc-robotics-coach
themes: [leadership, delivery]
archetypes: [mentorship, team-leadership, long-commitment]
created: 2026-04-11
usage:
  - date: 2026-04-11
    company: Honeycomb
    role: Junior Frontend Engineer
    question: Tell me about a time you mentored someone.
```

**Situation:** Roosevelt High School needed a coach for its FIRST Tech Challenge robotics club. I coached the club for three consecutive seasons while also teaching full-time.

**Task:** My job was to get the team ready to compete each season — technical skills, team dynamics, and deadline management.

**Action:** TBD — user to fill. The persona establishes the commitment (three seasons) and the outcome (regionals twice); the specific coaching approach, how practices were structured, and how technical decisions were scoped should come from Devon directly before this story is used in an interview.

**Result:** The team qualified for regional competition twice across the three seasons I coached.

**Reflection:** TBD — user to fill.

---

## StudyLoop spaced-repetition algorithm

```yaml
id: studyloop-spaced-rep-ownership
themes: [delivery, scope]
archetypes: [technical-ownership, collaboration, capstone]
created: 2026-04-11
usage:
  - date: 2026-04-11
    company: Honeycomb
    role: Junior Frontend Engineer
    question: Tell me about a React project you're proud of.
```

**Situation:** StudyLoop was my Hack Reactor capstone — a spaced-repetition flashcard web app built by a team of four across a three-week capstone sprint, in React + Node/Express + PostgreSQL.

**Task:** I owned two pieces of the app: the spaced-repetition algorithm implementation and the deck-import feature.

**Action:** TBD — user to fill in the specifics of how the algorithm was chosen and implemented, and how the deck-import feature handled user input. Devon averaged around 50 lines of code per day across the three-week capstone.

**Result:** We shipped StudyLoop on time, deployed on Render. The app was used by our classmates during the final showcase. There were no external users beyond the cohort.

**Reflection:** TBD — user to fill.

---

## Fixing a date-parsing bug in an open-source markdown editor

```yaml
id: oss-markdown-editor-date-fix
themes: [delivery, failure-learning]
archetypes: [debugging, open-source]
created: 2026-04-11
usage:
  - date: 2026-04-11
    company: Honeycomb
    role: Junior Frontend Engineer
    question: Tell me about a bug you debugged.
```

**Situation:** My first open-source contribution was to a small markdown editor that had a bug in its date-parsing utility.

**Task:** Identify the bug, write a small reviewable fix, and submit a pull request.

**Action:** I submitted a single pull request containing a 12-line bug fix to the date-parsing utility along with a typo fix in the README. TBD — user to fill in how the bug was identified and reproduced.

**Result:** The pull request was merged. The maintainer thanked me in the PR thread.

**Reflection:** TBD — user to fill.

---

## Freelance client delivery for two small businesses

```yaml
id: freelance-client-communication
themes: [stakeholder, delivery]
archetypes: [client-communication, cross-functional, requirements-gathering]
created: 2026-04-11
usage:
  - date: 2026-04-11
    company: Honeycomb
    role: Junior Frontend Engineer
    question: How do you communicate technical concepts to non-technical stakeholders?
```

**Situation:** Since January 2026 I've been freelancing while job-searching — two local small-business clients, a dog daycare and a yoga studio, each wanting a simple marketing site.

**Task:** Own the full cycle: working directly with non-technical clients, building the sites, and deploying them.

**Action:** I built both sites as static Next.js + Tailwind deployments on Vercel. TBD — user to fill in the specifics of how requirements were gathered, what tradeoffs were surfaced to each client, and how post-launch changes are handled.

**Result:** Two sites delivered, roughly $3,400 total earned across both projects. The yoga studio client reported a noticeable increase in trial bookings after launch, though the site has no analytics instrumentation so the effect is not measured.

**Reflection:** TBD — user to fill.

---

## Gaps — stories that do NOT exist in this bank

These archetypes are likely to come up in interviews and Devon does not have a real story for them. The interview-coach should flag them honestly rather than fabricate.

- **Production incident or on-call.** Devon has never been on-call or responded to a production incident — the bootcamp projects have no real users and the freelance sites are static. For "tell me about a production incident" questions, bridge from a bootcamp debugging experience or the OSS fix, and acknowledge the gap directly.
- **Workplace conflict.** The persona ground truth does not contain a specific resolved-conflict story from either teaching or the dev work. Do not invent one. If asked, offer to think of a real example rather than fabricate.
- **Shipping to real users at scale.** StudyLoop and WeatherWear had no external users; freelance sites have small local audiences. Do not claim scale Devon doesn't have.
- **Deadline pressure at a software company.** The StudyLoop capstone had a three-week deadline, which is the closest bridge — use that story rather than inventing a workplace deadline story.
