---
name: Maya Chen
persona_id: maya-chen-ic-to-em
region: US
seniority: senior → first-time manager
skills_exercised: [resume-tailor, interview-coach, linkedin-optimizer, resume-auditor]
---

# Identity

Maya Chen, 33, based in Oakland, CA. Senior backend engineer with 9 years of experience, currently a tech lead at a mid-size fintech. She has been the de facto manager of a 4-person sub-team for 18 months — running 1:1s, owning hiring loops, mentoring two junior ICs through promo — but has no formal "Manager" title and her current company has frozen mgmt promotions. She wants to land an Engineering Manager role at a 50–500 person Series B/C startup before the end of Q3.

# Ground truth

Skills, projects, and metrics below are the **only** facts about Maya that exist. Anything else is a hallucination.

## Employment

### Lattice Pay (fintech, ~800 engineers) — Oct 2021 to present
**Senior Software Engineer → Tech Lead (promoted Apr 2024)**

- Tech lead for the Payouts Reliability team (4 ICs, including Maya).
- Owns the disbursement service that moves ~$140M/month across ACH, wire, and RTP rails.
- Led a 7-month migration from a monolithic Rails service to three Go services. Reduced p99 latency from 1,800ms to 240ms. Migration completed Feb 2024.
- Built and runs the team's on-call rotation; cut paging volume from ~22 pages/week to ~6 pages/week over 2023 by writing runbook automation and fixing two recurring root causes.
- Wrote the team's hiring rubric for backend ICs; sat on 31 interview loops in 2024; hired 2 of the team's current 4 members.
- Mentored two junior engineers (Ravi and Sam) through promotion to mid-level in 2024.
- Runs weekly 1:1s with the 3 other ICs on the team since Oct 2024 — her manager is overloaded with org-wide initiatives and delegated this.

### Stripe (payments) — Jun 2018 to Sep 2021
**Software Engineer II → Software Engineer III**

- Worked on the Radar fraud detection platform.
- Shipped a feature flag system used by ~40 engineers across 3 teams; still in use as of her departure.
- Built integration test infrastructure that brought a flaky end-to-end suite from ~30% pass rate to >95%.
- Was tech lead on a small (3-person) project to migrate Radar's rule-evaluation engine from Ruby to Scala. Project shipped on time.

### Pivotal Labs (consulting) — Aug 2016 to May 2018
**Software Engineer**

- Pair-programmed full-time on client engagements (3 clients over 22 months: a regional bank, a logistics startup, a pharma company).
- Worked exclusively in Ruby and Java.
- No promotions during tenure.

## Education

- BS Computer Science, UC San Diego, 2016. GPA 3.6. No advanced degree.

## Skills (concrete)

- **Languages:** Go (4 yrs, expert), Ruby (8 yrs), Scala (~1 yr, intermediate), Python (scripting only), SQL.
- **Infra:** PostgreSQL, Redis, Kafka, gRPC, Datadog, Terraform (intermediate), AWS (EC2/RDS/SQS/Lambda).
- **People/process:** hiring loop design, structured 1:1s, on-call rotation design, blameless postmortems, promo packet writing.

## Things Maya does NOT have

- No formal "Manager" / "EM" job title on her resume.
- No people-management training (no Manager Bootcamp, no LifeLabs, etc.).
- No public speaking / conference talks.
- No published blog posts or open source maintainership.
- No PMP, no MBA, no AWS certs.
- No experience managing managers (she has only ever managed ICs informally).
- No experience with performance improvement plans or terminations.

# Constraints & preferences

- **Comp target:** $230k–$280k base, total comp $320k+.
- **Location:** SF Bay Area or fully remote. Will not relocate.
- **Company stage:** Series B to Series C. Avoiding pre-seed (too risky) and post-IPO (too political).
- **Headcount:** Wants to manage a team of 4–8. Not interested in managing 15+ on day one.
- **Domain preferences:** Fintech, infra/devtools, climate. Not interested in adtech, crypto, or social.
- **Deal-breakers:** RTO mandates, "we're a family" culture, undefined on-call expectations.

# Target role

**Engineering Manager, Payments Platform — Modal Labs**
*Remote (US) · Series B · 60-person eng org*

> We're hiring an Engineering Manager to lead our Payments Platform team (currently 5 ICs, growing to 8 by year end). You'll own the systems that handle merchant payouts, subscription billing, and financial reporting for thousands of customers processing $2B+ in annualized GMV.
>
> **What you'll do**
> - Manage and grow a team of backend engineers working in Go and Python
> - Partner with Product and Finance to define the payments roadmap
> - Own reliability, latency, and cost SLOs for payment-critical services
> - Run hiring loops and grow the team by 3 in the next 6 months
> - Coach engineers through promotions and career development
>
> **What we're looking for**
> - 2+ years of engineering management experience, or strong tech lead experience with formal people-management responsibilities
> - Background building distributed systems at scale, ideally in payments, fintech, or infra
> - Experience running on-call rotations and incident response
> - Track record of hiring and developing senior engineers
> - Comfort with ambiguity and a bias toward shipping
>
> **Nice to have**
> - Experience with Go, Kafka, and event-driven architectures
> - Prior startup experience (Series A–C)

# Known traps

These are the specific failure modes a grader should check for. Each one is worth flagging as a test failure.

1. **Inventing a Manager title.** Maya's title is *Tech Lead*, not *Engineering Manager*. Any output that says "Engineering Manager at Lattice Pay" is a hallucination, even though the role overlap is high.
2. **Inflating team size.** She manages 3 ICs (not counting herself). Outputs that say "managed a team of 5/6/8" are wrong.
3. **Inventing direct reports at Stripe.** She was an IC at Stripe, full stop. No mentoring, no leadership claims for the Stripe years beyond the tech-lead-on-one-project line.
4. **Fabricating mgmt training.** No Manager Bootcamp, no LifeLabs, no coaching certifications. If a resume bullet or LinkedIn About says "trained in management," it's invented.
5. **Inventing dollar figures.** Only $140M/month disbursement and $2B+ GMV (the latter from the JD, not Maya) are real numbers. Latency: 1800ms→240ms. Paging: 22→6. Don't let the skill make up new metrics.
6. **Wrong promo count.** She promoted 2 engineers (Ravi and Sam) — not 3, not "several."
7. **Glossing the title gap.** A good resume-tailor output should *acknowledge* she's a tech lead applying for an EM role and lean into the people-mgmt responsibilities she actually has, not pretend the gap doesn't exist. A bad output ignores the gap entirely.
8. **Interview-coach inventing scenarios.** If asked for a "tell me about a time you ran a PIP" story, the coach should recognize Maya has never done this and either help her bridge from adjacent experience or flag the gap honestly. It should NOT invent a fake PIP story.
9. **LinkedIn headline overreach.** "Engineering Manager | Payments | Fintech" is dishonest given her current title. "Tech Lead → Engineering Manager" or "Backend Tech Lead, Payments" is honest.
10. **Region drift.** Maya is US-based. The output should be a US resume (1 page or 2 page, no photo, no DOB), never a UK/EU CV.
