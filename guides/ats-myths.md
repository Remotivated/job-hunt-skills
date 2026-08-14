# ATS Myths: What Actually Happens When You Hit "Apply"

There's an entire cottage industry built on ATS fear. Paid "Beat the ATS" resume optimization services, resume scanning tools, invisible keyword tricks — all selling solutions to a problem that mostly doesn't exist. At least not the way they describe it.

Here's what actually happens when you submit your resume.

---

## What ATS Systems Actually Do

An Applicant Tracking System is a database with a workflow engine on top. That's it. It helps recruiters manage the hiring pipeline — who applied, where they are in the process, and their information in a searchable format.

The major platforms -- Greenhouse, Lever, Ashby, Workday, iCIMS, Workable -- all do roughly the same thing:

1. **Parse** your resume into structured fields (name, email, work history, education, skills)
2. **Store** that parsed data in a database
3. **Let recruiters search and filter** candidates using that data
4. **Track** candidates through interview stages

That's the job. It's a filing system with search.

---

## The Myth: "ATS Auto-Rejects 75% of Resumes"

You've seen this stat everywhere. Blog posts, LinkedIn influencers, resume services -- all citing some version of "75% of resumes are rejected by ATS before a human ever sees them."

This is not how most ATS platforms work.

The better-supported claim is narrower: modern ATS products are not usually rejecting you because a parser disliked your resume phrasing. When you submit an application through Greenhouse, Lever, or Ashby, your resume gets parsed, stored, and routed into the employer's hiring workflow. The ATS is organizing information and applying employer-configured workflow rules.

The exception — and it's an important one — is **application rules tied to screening questions, sometimes called knockout questions**. Greenhouse and Ashby both support auto-reject rules based on answers to application questions (e.g., "Are you authorized to work in the US?" → "No" → automatic rejection). That's not your resume being algorithmically judged. It's an employer configuring a filter on information you submitted in the application flow.

Some ATS products do include automated stack ranking, so it's still important to have a polished resume in a legible format. Ranking orders a review queue; it is not a rejection, and no rejection rule fires when you land at the bottom of one. But be honest about what that means in practice: when a role pulls hundreds of applications, the order is what determines how far down the list anyone actually reads.

So there's a real advantage to being near the top of the stack, and tailoring your resume is worthwhile. Just keep two claims apart. "A hidden parser scored my wording, rejected me, and you can beat it with the right keywords" is the thing being sold, and it isn't how these systems work. "No human ever read my application" is a different claim — a plausible outcome of application volume and queue order — and it is not evidence that a secret resume score exists.

This is the distinction that matters:

- **Resume parsing/searching/sorting** is normal ATS behavior.
- **Application-question knockout rules** are real and can reject you automatically.
- **Secret resume scoring that auto-rejects 75% of applicants based only on resume wording** is the myth.

---

## What AI Changed, And What Nobody Knows

The section above is about resume parsers. Since 2023 the anxiety has moved: recruiters are visibly using AI, and candidates assume it is the thing rejecting them. Here is what the evidence actually supports.

**Recruiters are using AI, mostly to sort and to write.** In Employ's 2025 Recruiter Nation Report — a vendor survey run by Zogby Analytics in September 2025 with more than 1,200 U.S.-based recruiters and hiring managers — 65% of recruiting teams reported using AI to augment their recruiting technology, up from 63% in 2024 and 58% in 2023. Within that 65%, candidate matching is the most common use at 40% of AI users, down from 55% of AI users the year before; that works out to roughly 26% of everyone surveyed. Read those use-case numbers carefully, because they are shares of AI users, not of all recruiters.

What the same survey does not contain is any option describing AI making a reject-or-advance decision. All twelve use cases it asks about are ranking and surfacing (candidate matching, intelligent sourcing, engagement scoring), content generation (job descriptions, interview questions), or communication (chatbots, candidate messaging). The words "reject" and "disqualify" appear nowhere in the 43-page report. So the survey cannot tell you how often employers auto-reject — in either direction, including ours.

**Candidates believe they are being auto-rejected.** In Employ's 2026 Job Seeker Nation Report (Zogby again, March–April 2026, more than 1,500 U.S. adults), 34% of candidates said they believe they have been automatically rejected by AI: 46% of Gen Z, 38% of Millennials, 28% of Gen X, 15% of Boomers. That is a belief, and the report concedes it did not measure whether it happened. It is still a real fact about how the job hunt feels right now — and 91% said it matters to them that companies are upfront about when and how AI is used.

**Fully automated rejection is real, and it is actionable when it discriminates.** In September 2023 the EEOC settled with iTutorGroup for $365,000. The company had "programmed their tutor application software to automatically reject female applicants aged 55 or older and male applicants aged 60 or older," turning away more than 200 qualified applicants. The detail worth keeping: that was a hard-coded date-of-birth rule, not machine learning reading resumes. The proven automated-rejection surface is knockout questions and auto-disqualify rules — the same thing this guide already tells you to take seriously.

**Nobody knows how common it is.** Not us, and not the regulators who wrote disclosure laws specifically to find out. New York City's Local Law 144 requires a bias audit and public disclosure for automated employment decision tools, and its implementing rule (6 RCNY § 5-300) draws the line at relying solely on a tool's score or ranking with no other factors considered, weighting it above every other criterion, or using it to overrule human conclusions. The city's Department of Consumer and Worker Protection has confirmed the law covers screening, not just final hiring decisions. When researchers checked 391 NYC employers for compliance, only 18 had posted the required audit reports and 13 had posted transparency notices. That null result cannot distinguish "we do not automate" from "we decided we are out of scope," because the law lets employers make that call themselves. A New York State Comptroller audit in December 2025 found only two complaints filed in the law's first two years — and where the city agency had reviewed 32 companies and found one issue, state auditors reviewed the same 32 and found at least 17 potential violations.

Put those together and the honest position is narrower than either side of the argument wants. Automated rejection exists and has cost at least one employer a federal settlement. How often it happens has never been measured, so anyone quoting you a percentage is quoting a number nobody has. And the one case that was proven turned on an eligibility rule, not a resume score — which is exactly why the screening questions deserve more of your attention than the keywords.

> :bulb: **Tip:** Read every application question before you answer it. That is the part of the process with a documented history of rejecting people automatically.

---

## The Reality

Here's what can actually go wrong:

**Poor formatting breaks parsers.** Tables, multi-column layouts, text boxes, headers/footers, embedded graphics — any of these can turn your resume into garbled data. Your work history ends up in the education field. Your name doesn't get captured. This is a real problem, but the fix is clean formatting, not keyword optimization.

It's also worth noting that modern ATS systems are very flexible when it comes to formatting. We extensively researched this when building Job Hunt Skills, and the format we landed on plays well even with legacy ATS systems. But the truth is, as long as your resume uses a standard format and text instead of images, you're probably fine.

**Missing information means missing search results.** If a recruiter filters for "project management" and you wrote "PM" or "programme management," you won't appear in that search. Modern parsers are getting better at synonyms, but many still rely on close-to-exact matches. Spell it out the way the job description does.

This isn't just about the ATS either — matching your terminology to what the company uses is a good practice in general.

**"ATS-optimized" mostly means "well-written with clean formatting."** Clear section headings, standard layout, relevant language. That's just good resume writing. No paid service or secret formula required.

> :bulb: **Tip:** If your resume is text based and reads well to a human, it will work fine in an ATS. The two goals are not in conflict.

---

## What This Means For You

**Write for humans first.** The decision that matters is made by a person, and the ATS is just the filing cabinet your resume sits in until they open it. If your resume is compelling to a hiring manager, it will work fine in an ATS.

**Match language for readability, not keyword density.** If the job description says "stakeholder management," use that phrase naturally in your experience. Don't cram it in five times. Recruiters can see that, and it looks desperate.

**Use standard section headings.** "Experience" or "Work Experience," "Education," "Skills." Every parser on the planet knows what to do with these. Get creative elsewhere -- your section headings are not the place.

**Simple layouts parse everywhere.** Single column. Standard fonts. No tables. No text boxes. No graphics or icons embedded in the document.

---

## Formatting That Works

| Element | Recommendation |
| --- | --- |
| **File format** | Use the format the job post requests. If the portal accepts both, keep a clean text-based PDF and a clean .docx available. Text-based PDFs preserve formatting well; .docx is still a safe fallback for older or stricter portals. Never upload a scanned/image PDF. |
| **Fonts** | Calibri, Arial, Garamond, Helvetica. Nothing fancy. |
| **Hierarchy** | Company name, role title, dates, bullet points. Consistent formatting throughout. |
| **Headers/footers** | Keep name and contact info in the main document body. Some parsers skip header/footer content. |

---

## What NOT to Worry About

**Invisible text tricks.** Some people paste the job description in white text on a white background, thinking the ATS will "see" it but the recruiter won't. The problem: when an ATS parses your resume, it strips the formatting and shows the recruiter the raw text — white keyword salad included. Recruiters know the trick. It makes you look dishonest, not clever — and it doesn't work anyway.

**"ATS score" tools.** Services that give your resume a percentage match against a job description are measuring surface-level keyword overlap. They can't tell you if your experience is genuinely relevant or if your accomplishments are compelling.

**Paid "ATS optimization" services.** If someone is charging you money to "beat the ATS," they're selling you anxiety. The actual fixes — clean formatting, relevant language, standard headings — take 15 minutes and cost nothing.

**Gaming the system.** There is no hidden resume score to game. There's a database, a queue, and a recruiter. Write a clear, compelling resume. Make it easy for the recruiter to see why you're a fit. That's it.

---

## The Bottom Line

The "75% rejection" narrative sells courses and services. It doesn't reflect how modern hiring platforms work.

Your resume needs to do two things: parse cleanly into structured data, and convince a human to pick up the phone. Formatting solves the first. Everything in the [resume philosophy guide](resume-philosophy.md) solves the second.

---

## Sources

- **Greenhouse Support** — `Application rules overview` and `Auto-Reject` documentation describing automatic rejection based on custom application-question responses, not resume parsing. [support.greenhouse.io](https://support.greenhouse.io/hc/en-us/articles/203105595-Application-rules-overview)
- **Ashby** — `Auto-Reject Applications` documentation describing employer-configured rejection conditions on application submissions. [docs.ashbyhq.com](https://docs.ashbyhq.com/auto-reject-applications)
- **Lever** — Official ATS myth guide explaining that ATS and AI features support recruiter review rather than replacing human hiring decisions. [lever.co](https://www.lever.co/blog/applicant-tracking-system-myths/)
- **Axios / Greenhouse** — Interview with Greenhouse co-founder Jon Stross describing application order, referral visibility, and average application volume. [axios.com](https://www.axios.com/2024/04/11/how-to-get-hired-new-job-greenhouse)
- **Employ** — `2025 Recruiter Nation Report`, a vendor survey conducted by Zogby Analytics in September 2025 with more than 1,200 U.S.-based HR recruiters and hiring managers. Source of the 65% AI adoption figure and the use-case shares, which are percentaged on AI users only. Survey data, not platform data; none of its twelve use-case options describes AI making a reject-or-advance decision. [pages.employinc.com](https://pages.employinc.com/rs/659-JST-226/images/2025-Employ-Recruiter-Nation-Report.pdf)
- **Employ** — `2026 Job Seeker Nation Report`, a vendor survey conducted by Zogby Analytics in March–April 2026 with more than 1,500 U.S. adults. Source of the 34% who believe they were automatically rejected by AI and the 91% AI-transparency figure. Self-reported belief; the report states it did not measure whether automated rejection occurred. [pages.employinc.com](https://pages.employinc.com/rs/659-JST-226/images/2026-Job-Seeker-Nation-Report.pdf) ([archived copy](https://web.archive.org/web/20260813191128/https://pages.employinc.com/rs/659-JST-226/images/2026-Job-Seeker-Nation-Report.pdf))
- **EEOC** — `iTutorGroup to Pay $365,000 to Settle EEOC Discriminatory Hiring Suit` (settled September 11, 2023), describing application software programmed to reject applicants automatically by age. A hard-coded eligibility rule, not machine learning. [eeoc.gov](https://www.eeoc.gov/newsroom/itutorgroup-pay-365000-settle-eeoc-discriminatory-hiring-suit)
- **NYC Department of Consumer and Worker Protection** — Local Law 144 guidance on automated employment decision tools: bias audit, public disclosure, and candidate notice requirements. The implementing rule (6 RCNY § 5-300) defines the threshold for substantially assisting or replacing discretionary decision making. [nyc.gov](https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page)
- **Wright et al.** — `Null Compliance: NYC Local Law 144 and the Challenges of Algorithm Accountability`, ACM FAccT 2024. Peer-reviewed audit of 391 NYC employers: 18 posted the required audit reports, 13 posted transparency notices. Also explains why the null result is ambiguous — employers self-determine whether a tool is in scope. [arxiv.org](https://arxiv.org/abs/2406.01399)
- **New York State Comptroller** — `Enforcement of Local Law 144: Automated Employment Decision Tools` (December 2, 2025). Two complaints in the law's first two years; the city agency reviewed 32 companies and found 1 issue, while state auditors reviewed the same 32 and found at least 17 potential violations. [osc.ny.gov](https://www.osc.ny.gov/state-agencies/audits/2025/12/02/enforcement-local-law-144-automated-employment-decision-tools)
