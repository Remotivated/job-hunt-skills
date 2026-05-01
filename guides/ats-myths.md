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

Some ATS products do include automated stack ranking, so it's still important to have a polished resume in a legible format. But stack ranking helps recruiters determine the order of review; it doesn't reject anyone.

Of course, there's still an advantage to being at the top of the stack, so tailoring your resume is absolutely worthwhile — but the "humans never even see your resume" angle promoted by AI application tools and resume coaches is just fearmongering.

This is the distinction that matters:

- **Resume parsing/searching/sorting** is normal ATS behavior.
- **Application-question knockout rules** are real and can reject you automatically.
- **Secret resume scoring that auto-rejects 75% of applicants based only on resume wording** is the myth.

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

**Write for humans first.** Your resume WILL be read by a person. The ATS is just the filing cabinet it sits in. If your resume is compelling to a hiring manager, it will work fine in an ATS.

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

**Gaming the system.** There is no system to game. There's a database and a recruiter. Write a clear, compelling resume. Make it easy for the recruiter to see why you're a fit. That's it.

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
