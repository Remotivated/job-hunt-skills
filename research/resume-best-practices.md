# Resume Best Practices & ATS Reality Check

> Research notes for Job Hunt OS. Last updated: 2026-03-27.
> This document synthesizes findings from recruiter surveys, ATS vendor documentation, career educators, and hiring manager accounts to provide an evidence-based foundation for all resume-related content in the project.

---

## Table of Contents

1. [Formatting Consensus](#formatting-consensus)
2. [ATS Findings](#ats-findings)
3. [Bullet Point Frameworks](#bullet-point-frameworks)
4. [Resume Length & Format Guidance](#resume-length--format-guidance)
5. [Key Quotes and Citations](#key-quotes-and-citations)

---

## Formatting Consensus

### What Recruiters Actually Want

Based on the Enhancv/HR Gazette survey of 25 U.S. recruiters (September-October 2025), recruiter formatting priorities rank as follows:

| Priority | % of Recruiters |
|---|---|
| Clear, skimmable structure | 92% |
| Relevant experience/skills | 88% |
| Natural keyword use | 76% |
| Short bullet points | 72% |
| Simple formatting | 68% |
| One to two pages | 64% |
| Measurable results | 52% |

Source: [HR Gazette - Debunking the ATS Rejection Myth](https://hr-gazette.com/debunking-the-ats-rejection-myth/)

### Structure Principles (Alison Green / Ask a Manager)

Alison Green, one of the most widely-read voices on hiring from the manager's perspective, emphasizes:

- **Focus on accomplishments, not duties.** "Managed website" tells a hiring manager nothing. "Increased web traffic by 20% over 12 months" tells them you performed well.
- **Use bullet points, short sentences, and bold the important bits.** Readers scan; help them.
- **Kill the objectives section.** It "adds nothing and takes up space" and restates that you want a job, which the employer already knows.
- **Don't include your street address.** Outdated convention.
- **Three pages will actively hurt you.** It signals you can't distill information to what matters.

Sources:
- [Ask a Manager - Step-by-step guide to writing a resume](https://www.askamanager.org/2020/02/my-step-by-step-guide-to-writing-a-resume.html)
- [Ask a Manager - How to write a resume that doesn't suck](https://www.askamanager.org/2018/06/how-to-write-a-resume-that-doesnt-suck.html)
- [Ask a Manager - The right way to format your resume](https://www.askamanager.org/2017/10/heres-the-right-way-to-format-your-resume.html)

### Formatting Do's and Don'ts

**Do:**
- Use standard section headers (Experience, Education, Skills)
- Use a single-column layout
- Use standard fonts (Calibri, Arial, Garamond, etc.)
- Export as text-based PDF (not scanned image) or clean .docx
- Use reverse chronological order

**Don't:**
- Use two-column layouts (ATS reads left-to-right across both columns, mixing content)
- Place text in headers or footers (many parsers skip these entirely)
- Use images, graphics, icons, or charts
- Use tables for layout (parsing breaks frequently)
- Use creative section names ("Where I've Made My Mark" instead of "Experience")

Source: [CaffeinatedKyle - ATS Myths Debunked](https://caffeinatedkyle.com/applicant-tracking-systems-3-ats-myths-debunked/)

---

## ATS Findings

### How ATS Systems Actually Work

An ATS is fundamentally a **database and workflow tool for recruiters**, not an AI judge. As Dr. Kyle Elliott (CaffeinatedKyle) puts it: "An ATS is merely a digital file cabinet for job applications and resumes. Applicant tracking systems are unable to think on their own, and ultimately, any actions an ATS makes are the result of humans."

**What ATS systems do:**
1. **Parse resumes into structured data** -- extract name, contact info, work history, education, skills
2. **Store applications** in a searchable database
3. **Enable keyword search** so recruiters can filter candidates
4. **Manage workflow** -- track candidates through hiring stages
5. **Apply knockout questions** -- binary eligibility filters (work authorization, required licenses, location)

**What ATS systems mostly do NOT do:**
- Automatically reject resumes based on formatting or content (only 8% of recruiters configure this)
- Score and rank candidates with AI as a hard filter (56% of recruiters ignore or disable AI fit scores)
- "Read" your resume like a human and make quality judgments

Source: [HR Gazette - Debunking the ATS Rejection Myth](https://hr-gazette.com/debunking-the-ats-rejection-myth/)

### The "75% Rejection Rate" Is Unverifiable

The viral claim that "75% of resumes are rejected by ATS before a human sees them" has **no verifiable source**. When surveyed, 68% of recruiters said they first heard this claim from job seekers on social media. Another 20% traced it to career coaches recycling outdated advice. Only 12% blamed unsourced mainstream media headlines.

The real problem is **volume, not software**: entry-level roles attract 400-600 applicants, customer service and remote roles get 1,000+, and tech/engineering roles can see 2,000+ applicants. Humans simply cannot review every application in depth.

Source: [HR Gazette - Debunking the ATS Rejection Myth](https://hr-gazette.com/debunking-the-ats-rejection-myth/)

### Platform-by-Platform Breakdown

#### Greenhouse
- **Does NOT auto-score resumes.** Greenhouse's CEO has stated that "any kind of automated scoring system of a document is subject to the biases of the people building the algorithm."
- Uses keyword search: a candidate with 5 mentions of "customer service" surfaces higher than one with 2 mentions. This is search ranking, not rejection.
- Provides **structured scorecards** for consistent human evaluation.
- Recruiters see the original uploaded resume alongside parsed data.
- AI screening features come from third-party integrations, not native Greenhouse.

Sources:
- [Greenhouse ATS Review (People Managing People)](https://peoplemanagingpeople.com/tools/greenhouse-review/)
- [ZYTHR + Greenhouse Integration Guide](https://zythr.com/resources/the-best-greenhouse-ats-integrations-a-practical-guide/ai-resume-screening-candidate-ranking)

#### Lever
- Combines ATS and CRM -- emphasis on relationship management, not algorithmic filtering.
- Relatively modern parser that handles PDF formatting reliably.
- Emphasizes recruiter workflow over algorithmic filtering, meaning **human review tends to happen earlier** in the process.
- Popular with mid-size tech and professional services firms.
- Structures resume data into rich candidate profiles for search, tagging, and nurturing.

Source: [Lever - ATS Myths Debunked](https://www.lever.co/blog/applicant-tracking-system-myths/)

#### iCIMS
- Common in retail, healthcare, manufacturing, and government.
- Older platform with **stricter parsing requirements**.
- DOCX files parse more reliably than PDFs on iCIMS.
- Table-based resume layouts frequently break.
- Maintains a visual version of every uploaded resume file, so recruiters see exactly what you uploaded.
- Can score resumes on a 0-100 scale, but this is configurable per organization.

Source: [Jobscan - iCIMS ATS Guide](https://www.jobscan.co/blog/icims-ats/)

#### Workday
- Built-in resume parsing feeds directly into core HCM (Human Capital Management).
- Has an AI screening layer that uses NLP -- understands "Python programming," "Python development," and "Python scripting" refer to the same competency.
- Understands that "Staff Engineer" implies senior-level experience even without the word "senior."
- Data consistency from application through onboarding.

Source: [LinkedIn - Workday's ATS and How to Make It Work](https://www.linkedin.com/pulse/workdays-ats-application-tracking-system-how-make-work-charles-webb-tj4ke)

#### Ashby
- Rising fast in tech startups.
- Modern architecture, generally better at handling varied formats.
- Less documentation available on parsing specifics.

### What "Keyword Matching" Actually Means in 2026

Modern ATS systems have moved well beyond exact string matching:

- **Semantic understanding**: Systems trained on millions of job descriptions and resumes understand synonyms and related terms. "Project management" matches "managed projects" and "project manager."
- **Context awareness**: Systems evaluate whether experience genuinely matches requirements, not just whether keywords appear.
- **Search, not scoring**: In most systems (especially Greenhouse), keywords power recruiter search queries, not automated rejection. When a recruiter searches "React," candidates with React on their resume appear. Those without it simply don't surface in that specific search.

**Practical implication**: Use natural, relevant terminology from the job description. Keyword stuffing is counterproductive -- modern NLP catches it, and humans definitely notice.

### Knockout Questions: The Real Auto-Rejection

100% of surveyed recruiters use knockout/eligibility questions. These are the actual source of automated rejection:

- "Are you authorized to work in [country]?"
- "Do you have [required license/certification]?"
- "Are you willing to relocate to [city]?"
- "How many years of experience do you have in [field]?"

These are compliance and eligibility checks, not resume quality judgments. If you receive an instant rejection at 2 AM, a knockout question is likely the cause, not your resume formatting.

Source: [CaffeinatedKyle - ATS Myths Debunked](https://caffeinatedkyle.com/applicant-tracking-systems-3-ats-myths-debunked/)

### Timing Matters More Than Optimization

52% of recruiters review applications in arrival order. 36% process in batches. **52% say applying within the first 48-72 hours significantly boosts visibility**, as many recruiters pause postings or fill shortlists early.

This is arguably the single most actionable finding in all ATS research: submit early.

Source: [HR Gazette - Debunking the ATS Rejection Myth](https://hr-gazette.com/debunking-the-ats-rejection-myth/)

---

## Bullet Point Frameworks

### Google's XYZ Formula

Origin: Laszlo Bock, former Google SVP of People Operations.

**Formula**: "Accomplished [X] as measured by [Y], by doing [Z]"

| Component | What It Captures | Example |
|---|---|---|
| X (Accomplishment) | The result or impact, starting with action verb | Increased mobile app performance |
| Y (Measurement) | A number: %, $, users, time | Score from 45 to 92 |
| Z (Method) | Technical approach or tools | Optimizing image loading and lazy rendering |

**Full example**: "Increased mobile app performance score from 45 to 92 by optimizing image loading and implementing lazy rendering, resulting in 500K additional monthly active users."

Sources:
- [Inc.com - Google Recruiters Say Using the X-Y-Z Formula](https://www.inc.com/bill-murphy-jr/google-recruiters-say-these-5-resume-tips-including-x-y-z-formula-will-improve-your-odds-of-getting-hired-at-google.html)
- [Teal - XYZ Method Resume Guide](https://www.tealhq.com/post/xyz-resume)

### STAR Method and Its Limitations

**STAR**: Situation, Task, Action, Result

Originally designed for behavioral interview answers, STAR has been adapted for resume bullets. However, it has notable limitations:

- **Too verbose for bullet points** -- the Situation and Task components add context that's often unnecessary in a resume line
- **Doesn't fit all roles** -- creative and artistic fields struggle to quantify impact in STAR format
- **Forces artificial structure** -- not every achievement revolves around a clear "task"

**Better for resumes**: XYZ or CAR (Challenge, Action, Result), which are more concise and impact-focused.

**Better alternatives by situation**:
- **CAR** (Challenge, Action, Result) -- quick, punchy, problem-solving focused
- **PAR** (Problem, Action, Result) -- similar to CAR, common in consulting
- **SOAR** (Situation, Obstacle, Action, Result) -- good for leadership/adaptability stories
- **SHARE** -- better for teamwork-heavy roles

Source: [Resumeble - Behavioral Interview Techniques: SHARE, CAR, SOAR & PAR vs STAR](https://www.resumeble.com/career-advice/behavioral-interview-techniques)

### Before/After Transformations

These examples come from career education offices and career coaches:

**Weak**: "Responsible for customer service"
**Strong**: "Resolved 90+ daily client inquiries via Zendesk, maintaining 98% satisfaction rating"

**Weak**: "Responsible for supervising undergraduate researchers"
**Strong**: "Supervised 7-12 undergraduate research students each year who have all since gone on to graduate school in astrophysics, physics, or mathematics"

**Weak**: "Completed first editing pass on articles"
**Strong**: "Reviewed and evaluated 40-50 topical articles per week and made the decision to either pass articles to the editorial team or send articles back to authors for further revisions"

**Weak**: "Streamlined inspection process by upgrading sensing and marking devices"
**Strong**: "Managed project to upgrade defect sensing and marking devices, resulting in the elimination of human inspection on line, saving $200,000 to $350,000 per year"

**Weak**: "Responsible for chairing the Student Event Promotional Committee"
**Strong**: "Chaired promotional committee of 12 and presented marketing plans to an audience of 40 to 60 students"

Source: [The Muse - How to Quantify Resume Bullets When You Don't Work With Numbers](https://www.themuse.com/advice/how-to-quantify-your-resume-bullets-when-you-dont-work-with-numbers)

### Quantifying Impact Without Hard Numbers

Three strategies from The Muse (originally from career coaches):

1. **Range**: Use estimated ranges. "Managed 7-12 research students" is vastly better than "managed students."
2. **Frequency**: How often you do something. "Reviewed 40-50 articles per week" demonstrates volume.
3. **Scale**: How many people you served, how large the budget, how big the team. "Chaired committee of 12, presented to audiences of 40-60."

Additional quantification options when exact metrics are unavailable:
- **Money**: Budget managed, costs saved, revenue influenced
- **People**: Team size, customers served, stakeholders managed
- **Time**: Hours saved, turnaround time reduced, deadlines met
- **Rankings**: Awards, percentile performance, competitive positioning

Source: [The Muse - How to Quantify Resume Bullets When You Don't Work With Numbers](https://www.themuse.com/advice/how-to-quantify-your-resume-bullets-when-you-dont-work-with-numbers)

### Role-Specific Bullet Point Guidance

#### Software Engineering
Focus on: system impact, performance metrics, scale, reliability improvements.

**Strong examples**:
- "Automated testing and deployments via GitHub Actions, reducing release cycles from 2 days to 4 hours and boosting coverage from 48% to 85%"
- "Designed Redis cache layer for leak-data endpoints, cutting DB load by 40% and slashing API latency from 850ms to 190ms (77% faster)"
- "Led migration to Kubernetes, cutting deployment errors by 88% and accelerating release cycles by 4 days"

**Key metrics**: Latency reduction, uptime improvement, deployment frequency, test coverage, user scale, cost reduction.

**When you lack exact numbers**: Use scale indicators -- "codebase of 500K lines," "serving 10K daily active users," "team of 8 engineers."

Sources:
- [Tech Interview Handbook - Resume Guide](https://www.techinterviewhandbook.org/resume/)
- [Beam Jobs - Software Engineer Resume Examples](https://www.beamjobs.com/resumes/software-engineer-resume-examples)

#### Product Management
Focus on: user outcomes, business metrics, cross-functional leadership.

**Strong examples**:
- "Built and monitored self-serve funnel conversion rates on Amplitude. A/B tested new onboarding flows, achieving 100% increase in conversion"
- "Launched feature used by 50K+ users in first month, driving 15% increase in monthly active users"

**Key metrics**: User growth, retention, conversion rates, revenue impact, feature adoption, NPS changes.

Source: [IGotAnOffer - Product Manager Resume Examples](https://igotanoffer.com/blogs/product-manager/product-manager-resume)

#### Marketing
Focus on: pipeline impact, campaign performance, content reach, cost efficiency.

**Key metrics**: ROI, CAC reduction, pipeline generated, content engagement, conversion rates, traffic growth.

#### Operations
Focus on: process improvement, cost reduction, efficiency gains, compliance.

**Key metrics**: Time saved, error reduction, cost savings, throughput increases, compliance rates.

### Action Verbs That Signal Impact

Avoid weak verbs: "helped," "worked on," "responsible for," "assisted with," "participated in."

**Use instead**: developed, launched, optimized, generated, reduced, accelerated, transformed, architected, spearheaded, consolidated, automated, negotiated, pioneered, redesigned, streamlined.

---

## Resume Length & Format Guidance

### One Page vs. Two Pages: The Data

The one-page-only rule is dead for experienced professionals. Current data:

- **2025 survey of 1,013 HR professionals**: 82.1% say ideal length is 1-2 pages. 51% specifically prefer two pages. Only 31% still insist on one page.
- **Separate survey**: 68.6% of recruiters prefer two-page resumes; only 21.6% think one page is ideal.
- **Indeed's 2025 update**: Two-thirds of recruiters are "perfectly happy" with two pages for mid-career candidates.

**The modern guideline**:
- **< 5 years experience**: One page
- **5-15 years experience**: One to two pages (lean toward two if you have relevant content)
- **Senior / executive / C-suite**: Two pages (almost always)
- **Academic CV**: No page limit (different document entirely)

**Critical insight**: Recruiters spend 15-30 seconds per resume. Page count matters less than density of relevant, scannable information. A bloated one-pager and a thin two-pager are both worse than a well-structured document of either length.

**Federal jobs note**: Starting September 27, 2025, USAJOBS restricts all resumes to two pages.

Sources:
- [AI Apply - One Page vs Two Page Resume Guide](https://aiapply.co/blog/one-page-resume-vs-two-page-resume)
- [Indeed - How Long Should a Resume Be](https://www.indeed.com/career-advice/resumes-cover-letters/how-long-should-a-resume-be)
- [OPM - Agency Guidance on Two-Page Limit](https://www.opm.gov/policy-data-oversight/hiring-information/merit-hiring-plan-resources/agency-guidance-on-the-two-page-limit-on-resume-length/)

### PDF vs. DOCX

**The nuanced answer**: It depends on the submission method.

| Scenario | Recommended Format | Why |
|---|---|---|
| Online ATS portal (unknown system) | .docx | Broadest parsing compatibility, especially for older systems like iCIMS |
| Online ATS portal (modern system) | Either works | Greenhouse, Lever, Ashby handle text-based PDFs well |
| Emailing a recruiter directly | PDF | Preserves formatting, looks professional |
| Job posting specifies a format | Whatever they asked for | Always follow explicit instructions |

**Critical distinction**:
- **Text-based PDF** (exported from Word, Google Docs, or a resume builder): ATS can read these fine
- **Image-based PDF** (scanned from a printed document): ATS cannot extract text, will fail

**Best practice**: Maintain both a clean .docx version and a well-formatted PDF. Use .docx for ATS portals unless you're confident in the platform, and PDF for direct human-facing submissions.

Sources:
- [Resumemate - PDF vs DOCX for Resumes in 2025](https://www.resumemate.io/blog/pdf-vs-docx-for-resumes-in-2025-what-recruiters-ats-really-prefer/)
- [Smallpdf - Can ATS Read PDF Resumes? 2026 Guide](https://smallpdf.com/blog/do-applicant-tracking-systems-prefer-resumes-in-pdf-format)

---

## Key Quotes and Citations

### On ATS Reality

> "We have to go in and do it ourselves -- the system doesn't disposition people automatically."
> -- Recruitment manager, Enhancv study (2025)

> "It's a false narrative that takes advantage of people."
> -- Los Angeles recruiter, on the 75% rejection myth

> "The earlier you apply, the better your chances of being among the resumes actually looked at."
> -- Fortune 500 recruiter

> "An ATS is merely a digital file cabinet for job applications and resumes. Applicant tracking systems are unable to think on their own."
> -- Dr. Kyle Elliott, CaffeinatedKyle

> "What AI doesn't do is replace the human element of recruiting. Recruiters and hiring managers still review applications, assess experience, conduct interviews, collaborate on decisions, and determine who moves forward."
> -- Lever (ATS vendor)

### On Resume Writing

> "The two most common problems are that the resume just lists job duties but doesn't reveal anything about how the person actually performed."
> -- Alison Green, Ask a Manager

> "Numbers make such a huge difference in resumes -- no matter what your work involves."
> -- The Muse

> "Every bullet point should answer: What got better because I was here?"
> -- Tech Interview Handbook

### Survey Methodology Notes

**Enhancv/HR Gazette Study (2025)**:
- 25 structured interviews with U.S. recruiters
- Company sizes: 100 to 50,000+ employees
- Sectors: tech, healthcare, finance, and others
- Conducted September-October 2025
- Published November 2025

**Resume Length Survey (2025)**:
- 1,013 HR professionals surveyed
- Results published 2025

---

## Summary: What Actually Matters

Based on all research, here is the priority-ordered list of what makes a resume effective:

1. **Apply early** (within 48-72 hours of posting) -- single biggest controllable factor
2. **Write accomplishments, not duties** -- use XYZ/CAR frameworks with metrics
3. **Use clean, single-column formatting** -- no tables, graphics, headers/footers with critical info
4. **Match language naturally to the job description** -- not keyword stuffing, but genuine alignment
5. **Keep it scannable** -- short bullet points, clear section headers, logical structure
6. **Right length for experience level** -- one page for junior, two for experienced
7. **Choose the right file format** -- .docx for unknown ATS portals, PDF for human readers
8. **Answer knockout questions carefully** -- these are the actual source of automated rejection

What does NOT matter (despite the fear-based industry around it):
- "ATS score" tools (most recruiters ignore or disable AI scoring)
- Invisible white text keywords (modern systems detect and penalize this)
- Exact keyword density matching
- Specific fonts (as long as they're standard and readable)
- Whether you use a period at the end of bullets

---

*This research was compiled from recruiter surveys, ATS vendor documentation, university career offices, and established career advice sources. All sources are linked inline. Last verified March 2026.*
