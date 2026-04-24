# Interview prep - Engineering Manager, Payments Platform - Modal Labs

**Candidate:** Maya Chen
**Role:** Engineering Manager, Payments Platform
**Company:** Modal Labs (Series B, ~60-person eng org, remote US)
**Date:** 2026-04-11

## Angle to lead with

You are a backend tech lead with 9 years of experience who is *already operating as an EM* - running 1:1s for three ICs, owning the team's hiring rubric and 31 interview loops in 2024, designing the on-call rotation, and mentoring two engineers through promotion to mid-level - without the formal title, because Lattice Pay's management-track promos are frozen. The Modal JD asks for "2+ years of EM experience *or* strong tech lead experience with formal people-management responsibilities," which is the exact bridge you need. Lead with that framing and let the rest of the resume map cleanly onto the JD's payments-platform requirements.

## Likely questions (with story matches)

1. **"Walk me through your background and why you're looking for an EM role."**
   - Talking points: 9 years backend -> 3 years at Stripe (Radar) -> tech lead at Lattice Pay since Apr 2024. People-management work has been the center of the role since Oct 2024. Honest framing: title is frozen, not the work.

2. **"Tell me about a major technical migration you've led."**
   - Story: **Rails-to-Go disbursement migration** ($140M/month, 7 months, p99 1,800ms -> 240ms).

3. **"How do you design and run an on-call rotation?"**
   - Story: **On-call paging reduction** (22 -> 6 pages/week across 2023). Emphasize the weekly pager-review meeting as the people-process piece.

4. **"Tell me about a time you helped an engineer grow into the next level."**
   - Story: **Mentoring Ravi and Sam through promotion**. Two promos to mid-level in 2024, you wrote the packets.

5. **"Walk me through your hiring philosophy. How would you grow this team from 5 to 8?"**
   - Story: **Authoring the backend hiring rubric** + 31 loops in 2024 + 2 of the team's 4 current members hired through your loop. Map directly to the JD's "grow the team by 3 in the next 6 months."

6. **"Tell me about a time you had a difficult performance conversation."**
   - **GAP - no story in the bank.** Honest bridge: "I haven't run a PIP - Lattice Pay's management-track was frozen so the formal performance process sat with my own manager. The closest thing I've owned is the positive side of that - running the promo packet work for Ravi and Sam, and having the harder weekly 1:1 conversations about specific gaps that were keeping them below the bar. I'm clear-eyed that the PIP/termination muscle is something I'd be developing for the first time in this role, and I'd want to know what support looks like at Modal for a first-time EM going through that."

7. **"How do you balance shipping velocity with reliability for payment-critical services?"**
   - Combine **Rails-to-Go migration** (delivery under reliability constraints) and **On-call paging reduction** (the team-health side).

8. **"Tell me about a time you disagreed with a peer or your manager?"**
   - **GAP - no specific resolved-conflict story in the bank.** Either bridge from a technical disagreement on the Rails-to-Go design (if a real one exists - capture it as a new story before the interview), or acknowledge: "I want to give you a real example rather than a manufactured one - let me think for a moment." Better to pause than to fabricate.

9. **"How would you measure the health of your team?"**
   - Talking points: pager load, promo readiness, 1:1 cadence and topic drift, hiring loop signal quality.

10. **"Why Modal specifically? Why now?"**
    - Talking points: Series B is the right stage, payments-platform team is the right size (4-8 ICs), Go is your strongest language, and the JD's bridge from tech lead to EM is the window you've been waiting for.

11. **"How do you handle being a first-time EM in a remote-first org?"** *(remote-readiness)*
    - Talking points: async on-call documentation, runbook automation work, and written 1:1 habits. Acknowledge you have not previously been in a fully remote role.

12. **"What's the first 30 / 60 / 90 days for you in this role?"**
    - 30: Listen tour, read the last 6 months of incidents, sit in on 1:1s as observer, understand the on-call rotation.
    - 60: Take ownership of the hiring loop for the 3 open headcount.
    - 90: Have a point of view on the team's reliability roadmap and the SLO targets the JD calls out.

## Questions to ask Modal

**How they work**
- How does the Payments Platform EM split time between people work and technical work? What's the IC contribution expectation?
- What does the on-call rotation look like for the team today, and what's the EM's role in it?

**Career growth**
- What does the growth path from EM look like at Modal? Is there a director track or a Staff EM track?
- How does Modal support a first-time EM specifically? Coaching, management training, peer EM cohort?

**Culture**
- How does the team handle disagreements between an EM and a senior IC on technical direction?
- Walk me through a recent incident - what did the postmortem look like, and what changed because of it?

**Remote operations**
- What's the time-zone distribution of the Payments Platform team today, and what does sync vs async default look like?
- What does the hiring loop look like for backend ICs at Modal - and would I own it from day one or inherit a shared loop?

## Potential weaknesses (acknowledge and bridge)

| Gap | Honest acknowledgment | Bridge |
|---|---|---|
| **No formal EM title** | "My title is Tech Lead, not Engineering Manager - Lattice Pay froze management-track promos so the path wasn't open." | "The work is the same: 1:1s with three ICs since October 2024, hiring rubric, 31 interview loops last year, two promo packets for Ravi and Sam." |
| **No PIP / termination experience** | "I've never run a PIP or been part of letting someone go." | "I'd be developing that muscle in this role for the first time, and I'd want to understand what support looks like - peer EM cohort, HR partnership, the first-time-PIP playbook if Modal has one." |
| **Never managed a manager** | "I've only ever managed ICs, and only informally." | The Modal role is 5 -> 8 ICs, no managers - this isn't actually a gap *for this job*. Don't volunteer it unless asked. |
| **Not previously fully remote** | "Lattice Pay is hybrid, not fully remote." | Surface the async behaviors: runbook documentation, async on-call design, written-first 1:1 notes, etc. Don't claim remote experience you don't have. |
| **No deep fintech compliance background on resume** | "My fintech work has been on the engineering reliability side, not the regulatory/compliance side." | If the JD or interviewer pushes here, be honest - Lattice Pay had a separate compliance org that owned that surface. |
