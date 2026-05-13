# Story Bank

STAR+R stories for behavioral interviews and claim evidence.

## The Docker demo environment refactor

```yaml
id: demo-environment-refactor
themes: [leadership, delivery, scope]
archetypes: [technical-leadership]
created: 2026-02-14
usage: []
```

**Situation:** In Q4 2023 our SE team was losing roughly 4 hours of prep time per technical demo because demo environments were hand-built per call. Win rates were trending down and the team was burnt out.

**Task:** I owned the proposal to standardize demo environments. I had no formal authority — I was a Senior SE, not the manager — but the team was open to a fix.

**Action:** I scoped a Docker + Python solution over two weeks, built a working prototype against the three highest-volume prospect profiles, and ran a one-hour internal demo for the team. I open-sourced the repo internally and asked two SEs to validate against their own deals. I iterated based on their feedback for a week, then proposed it as the new standard at the SE staff meeting.

**Result:** Demo prep time dropped from ~4 hours to ~45 minutes. All seven SEs adopted it within a month. Three months later it was a documented part of our onboarding for new SEs.

**Reflection:** I would have proposed it as a working group from the start instead of building solo first. I lucked into team buy-in, but the same approach could have backfired if any SE felt I was solutioning past them.

## The PoC that should have been a no-go

```yaml
id: poc-no-go
themes: [conflict, failure-learning, stakeholder]
archetypes: [scope-negotiation]
created: 2026-03-02
usage: []
```

**Situation:** In Q2 2024 I was paired with an AE on a $400K mid-market deal. The prospect was a CDP company and wanted us to support a non-trivial inbound webhook ingestion pattern that we technically could do but had never productized.

**Task:** Decide whether to scope a PoC committing to the webhook pattern, or push back and risk losing the deal.

**Action:** I worked with the AE for two days reviewing the customer's actual data volume. We realized their stated throughput would push them onto our enterprise tier — which meant the deal was either much bigger than the AE's quota target, or the customer was over-stating their volume. I raised this with the AE and our director, then took the question directly to the prospect's technical buyer. They acknowledged they were sandbagging for budget reasons. We restructured the deal at the correct tier.

**Result:** Deal closed at $620K instead of $400K. The customer's webhook use case turned out to be exactly the kind of thing our roadmap was already targeting, and they became a design partner the following quarter.

**Reflection:** I almost let the AE push me into a no-go PoC because I was new to pushing back at the sales-stage. The lesson was that asking the technical buyer directly — not relying on the AE's summary — is what unblocked the truth.

## The integration guide that became a support shortcut

```yaml
id: integration-guide-snowflake
themes: [delivery, stakeholder]
archetypes: [cross-functional]
created: 2026-03-21
usage: []
```

**Situation:** Mid-2024 we had a recurring support pattern — customers misconfiguring Snowflake permissions during NorthwindSync onboarding. Support tickets averaged 6 per week and resolution time was 2 days.

**Task:** I volunteered to write a public integration guide covering the specific permission grants and account-setup steps.

**Action:** I drafted the guide based on the last 30 support tickets, validated each step against three live customer environments, and worked with support and docs to publish it under the public docs hub. I added an internal-only addendum support could cite during ticket triage.

**Result:** Snowflake-permission tickets dropped to roughly 1 per week within two months. Support cites the guide in roughly one ticket per week across all data warehouses.

**Reflection:** The trickier lesson was that the guide only worked because support and I aligned on the addendum before the public guide shipped. Writing it solo would have produced something docs-clean but not field-useful.
