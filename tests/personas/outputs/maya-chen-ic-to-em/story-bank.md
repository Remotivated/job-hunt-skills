# Story Bank

STAR+R stories for behavioral interviews. Each entry is a reusable asset — tag with themes so `interview-coach` can match it against future questions. See [guides/interview-framework.md](../../../../guides/interview-framework.md) for the STAR+R format and why the Reflection beat matters.

---

## Rails-to-Go disbursement migration

```yaml
id: lattice-rails-to-go-migration
themes: [delivery, leadership, scope]
archetypes: [technical-leadership, large-migration]
created: 2026-04-11
usage:
  - date: 2026-04-11
    company: Modal Labs
    role: Engineering Manager, Payments Platform
    question: Tell me about a time you led a major technical migration.
```

**Situation:** Lattice Pay's disbursement service was a monolithic Rails app moving roughly $140M/month across ACH, wire, and RTP rails. P99 latency was sitting at ~1,800ms, and the team was spending most of its incident budget on degraded-mode responses tied to the monolith's architecture.

**Task:** As tech lead of the Payouts Reliability team (4 ICs including me), I owned the plan, sequencing, and execution risk for moving the disbursement path off Rails.

**Action:** I designed the migration as a split into three Go services along the natural payment-rail boundaries, then sequenced the cutover so each rail could move independently with shadow traffic and a one-way feature flag rollback. I ran the technical design reviews, divided the implementation work across the four ICs on the team, and personally owned the highest-risk piece (the ACH cutover).

**Result:** Migration completed in seven months and shipped in February 2024. P99 latency dropped from ~1,800ms to ~240ms — roughly a 7x improvement — with no customer-impacting incidents during the cutover window.

**Reflection:** TBD — user to fill. (Likely candidates: sequencing decisions, whether shadow traffic ran long enough, what to do differently on the next migration.)

---

## On-call paging reduction

```yaml
id: lattice-oncall-paging-reduction
themes: [delivery, crisis, leadership]
archetypes: [reliability, team-health]
created: 2026-04-11
usage:
  - date: 2026-04-11
    company: Modal Labs
    role: Engineering Manager, Payments Platform
    question: How do you design and run an on-call rotation?
```

**Situation:** Early in 2023, the Payouts Reliability team was getting paged about 22 times a week. The team was burning out and the false-positive rate was masking a couple of real recurring issues underneath the noise.

**Task:** I owned the on-call rotation design and the path to reducing pager load without hiding real signals.

**Action:** I rebuilt the rotation structure, then spent the year on two parallel tracks: writing runbook automation that turned the most common alerts into self-resolving or self-diagnosing actions, and finding and fixing two recurring root causes that were generating most of the repeat pages. I held weekly pager-review meetings so the team owned which alerts stayed, which ones got tuned, and which ones got automated away.

**Result:** Paging volume dropped from ~22 pages/week to ~6 pages/week across 2023, and the team's incident-response work moved from reactive firefighting back to planned reliability work.

**Reflection:** TBD — user to fill.

---

## Mentoring Ravi and Sam through promotion

```yaml
id: lattice-mentoring-promo
themes: [leadership]
archetypes: [mentorship, growth]
created: 2026-04-11
usage:
  - date: 2026-04-11
    company: Modal Labs
    role: Engineering Manager, Payments Platform
    question: Tell me about a time you helped an engineer grow into the next level.
```

**Situation:** Two engineers on my team — Ravi and Sam — were doing strong work but neither had been through a promo cycle and both were sitting just below the bar for mid-level on different dimensions.

**Task:** As their tech lead, I took on the work of getting them ready and writing their promo packets. (Lattice Pay's manager-track promos were frozen at the time, so I was effectively running this without a formal mgmt title.)

**Action:** I ran weekly 1:1s with each of them focused on the specific gaps to mid-level — for one, technical scope and ownership of a vertical slice; for the other, cross-team collaboration and design-doc ownership. I gave each of them a stretch project I could back-stop, reviewed their design docs early, and wrote the promo packets from the evidence I'd been collecting through the year.

**Result:** Both Ravi and Sam were promoted to mid-level in 2024.

**Reflection:** TBD — user to fill.

---

## Authoring the backend hiring rubric

```yaml
id: lattice-hiring-rubric
themes: [leadership, scope]
archetypes: [hiring, scaling-team]
created: 2026-04-11
usage:
  - date: 2026-04-11
    company: Modal Labs
    role: Engineering Manager, Payments Platform
    question: Walk me through your hiring philosophy and how you'd grow this team.
```

**Situation:** The Payouts Reliability team needed to scale, but Lattice Pay's broader backend hiring loop wasn't producing consistent signal — different interviewers were measuring different things and calibration was drifting.

**Task:** I owned writing a hiring rubric specifically for backend ICs on the team and bringing the loop's signal quality up.

**Action:** I authored the rubric — concrete signals per dimension, anti-patterns to watch for, and a rating scale tied to leveling guidelines. I trained the rest of the loop on it, sat on 31 interview loops myself in 2024, and pushed back in debriefs when feedback drifted away from the rubric's signals.

**Result:** Hired two of the team's current four members through this loop.

**Reflection:** TBD — user to fill.

---

## Stripe Radar feature flag system

```yaml
id: stripe-radar-feature-flags
themes: [delivery]
archetypes: [platform-building, technical-leadership]
created: 2026-04-11
usage: []
```

**Situation:** While I was on the Radar fraud detection platform at Stripe, engineers across three teams were doing ad-hoc rollouts of rule-engine changes, and there was no consistent way to dark-launch or roll back.

**Task:** I scoped and built a feature flag system that the Radar-adjacent teams could share.

**Action:** I designed the API, built the service and the client library, and onboarded the first few teams personally to make sure the ergonomics held up.

**Result:** Adopted by ~40 engineers across 3 teams. Still in production when I left Stripe in September 2021.

**Reflection:** TBD — user to fill.

---

## Stabilizing the Radar end-to-end test suite

```yaml
id: stripe-radar-test-stabilization
themes: [failure-learning, delivery]
archetypes: [reliability, ownership]
created: 2026-04-11
usage: []
```

**Situation:** The Radar team's end-to-end test suite was sitting at roughly a 30% pass rate. Engineers had stopped trusting it, which meant real regressions were starting to slip through.

**Task:** I picked up ownership of stabilizing the suite, even though it wasn't on anyone's roadmap.

**Action:** I worked through the failures one bucket at a time — fixed the genuinely broken tests, deleted the ones testing implementation details, and rebuilt the flaky-test infrastructure so failures had reproducible causes instead of disappearing on retry.

**Result:** Pass rate moved from ~30% to over 95%, and the team started trusting the suite as a release gate again.

**Reflection:** TBD — user to fill.

---

## Gaps — stories that do NOT exist in this bank

These archetypes are likely to come up in EM interviews and Maya does not have a real story for them. The interview-coach should flag this honestly during prep rather than fabricate one.

- **Performance improvement plan or termination.** Maya has never run a PIP or been part of letting someone go. For questions in this archetype, bridge from the mentorship/promo work above and acknowledge the gap directly.
- **Managing a manager.** Maya has only ever managed ICs (informally). Don't claim otherwise.
- **Conflict with a peer or manager that escalated.** The persona ground truth doesn't contain a specific resolved-conflict story. If asked, bridge from a technical disagreement during the Rails-to-Go migration if one applies, or capture a real story in a follow-up session — do not invent one.
