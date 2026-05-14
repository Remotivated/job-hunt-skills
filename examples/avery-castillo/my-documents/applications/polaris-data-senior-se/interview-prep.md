---
application_id: polaris-data-senior-se
company: Polaris Data
role: Senior Solutions Engineer
source_document: my-documents/resume.md
source_version: 3
prepared_date: 2026-05-14
interview_stage: first technical screen + GTM panel
---

# Polaris Data — Senior SE interview prep

## At-a-glance

- **Lead with:** the Docker demo refactor (story `demo-environment-refactor`) — it maps 1:1 to Polaris's public "SE-led discovery" thesis.
- **Don't lead with:** the $4.2M influenced-pipeline figure. Soften any reference into territory close-rate language already on the tailored resume.
- **Open question to ask:** "What does SE-led discovery look like specifically for an enterprise vs mid-market prospect?" — pulled from the company-research report's `Recommended interview talking points`.

## Likely questions

### Behavioral

1. **"Walk us through a technical demo you ran end-to-end — discovery, prep, delivery, follow-up."**
   - Lead story: `demo-environment-refactor`. Anchor on the four-hour → forty-five-minute prep collapse, then pivot to discovery quality.
   - Reflection beat: "I would have proposed it as a working group from the start" — shows seniority and self-awareness.

2. **"Tell us about a time you pushed back on an AE or a deal scope."**
   - Lead story: `poc-no-go`. The customer was sandbagging on volume; restructuring landed at $620K instead of $400K.
   - Reflection beat: surface that asking the *technical buyer directly* is what unblocked the truth. Polaris's GTM motion explicitly empowers SEs in qualification — this is the resonance.

3. **"Describe a cross-functional collaboration where you bridged engineering and customer-facing work."**
   - Lead story: `integration-guide-snowflake`. Public guide + internal support addendum cut Snowflake-permission tickets from 6/wk to 1/wk.
   - Reflection beat: "Writing it solo would have produced something docs-clean but not field-useful" — shows the seniority signal Polaris likely cares about.

4. **"Tell us about a time you led an initiative without formal authority."**
   - Lead story: `demo-environment-refactor` again, this time framed as influence-without-authority rather than demo throughput. Two stories for one bullet is fine — they read differently depending on the frame.

5. **"Walk us through a deal you lost or a PoC that fell apart. What did you learn?"**
   - Honest framing: `poc-no-go` came close to being a no-go. Use the reflection — "I was new to pushing back at the sales-stage" — to land the learning. If pressed for an actual lost deal, capture a new story in story-bank after the interview.

### Technical / scenario

6. **"How would you architect a real-time ingestion pipeline for a mid-market analytics team running on Snowflake?"**
   - Evidence: resume integration-guides experience, NorthwindSync demo stack. Be concrete: streaming source → Kafka or pub/sub → landing schema → dbt → mart. Note tradeoffs around batch-vs-streaming windowing.
   - Honest gap: Avery hasn't operated a real-time pipeline in production at scale — frame this as "I've scoped and demoed against it; I haven't been on-call for one." Don't overclaim.

7. **"Walk us through how you'd handle a competitive evaluation against Fivetran or Airbyte."**
   - Evidence: NorthwindSync resume bullet — close-won 38% as lead SE on competitive deals (territory baseline 29%). Lead with the discovery framework, not feature-by-feature.

8. **"How do you partner with an AE during MEDDPICC qualification?"**
   - Evidence: resume "GTM partnership" section; tie back to the `poc-no-go` story for a concrete example of M (metrics) and E (economic buyer) work.

### Remote / role-fit

9. **"How do you stay aligned with an AE across timezones?"**
   - Evidence: 5 years remote-friendly experience at NorthwindSync. Specific habit: daily 15-min async standup written to a shared doc; AE-SE pairing on every discovery call.

10. **"What would you want to learn about Polaris in your first 30 days?"**
    - Honest: ingestion-routing model internals (research report flagged this is the product differentiator), the actual SE-led discovery playbook docs, and how the SE org partners with product on roadmap (research report's recommended question #2).

## Questions to ask

Pulled from the company-research report's recommended talking points, plus interviewer-function categorization:

| Category | Question |
| --- | --- |
| How they work | "What does SE-led discovery look like specifically for an enterprise prospect vs a mid-market one?" |
| Role scope | "How does the SE org partner with product on the ingestion-routing roadmap? Is there a formal feedback loop, or is it relationship-driven?" |
| Success measures | "What does 'good' look like for a Senior SE at the 90-day, 6-month, and 12-month marks?" |
| Growth | "Where does the SE org typically promote from — into management, principal IC, or sales engineering leadership?" |
| Culture | "When an SE and AE disagree on whether to pursue a deal, how does that get resolved?" |
| Comp / pragmatic | "The role posting lists OTE — could you walk me through how the SE comp band is structured at the senior level? I want to make sure we're aligned before late-stage." (Research report flagged a Glassdoor signal on comp-band tightness — ask diplomatically but don't skip it.) |

## Angles to highlight

- **SE-led discovery alignment.** Polaris's two founders publicly write about SE-led discovery. Avery's `poc-no-go` and `demo-environment-refactor` stories both demonstrate SE driving the qualification arc, not just supporting an AE.
- **Live-coded demo capability.** Resume already calls out Python and SQL; the Docker stack is the proof. If the interviewer asks for a live exercise, offer to walk them through how Avery would adapt the stack to Polaris's ingestion-routing model.
- **Multi-threaded enterprise selling.** The tailored resume already foregrounds this; the `poc-no-go` story is the receipt. Lead with it if the interviewer probes "you're stepping up in technical depth — show us the GTM chops you bring."

## Potential weaknesses + honest scripts

1. **Single-employer experience (NorthwindSync only).**
   - *Risk:* "How will you adapt to a different GTM motion?"
   - *Script:* "All my SE experience is at NorthwindSync, which means I know one motion deeply but haven't been forced to adapt across companies. Two things mitigate this: I've worked across mid-market and early-enterprise segments inside that motion, and the things I'm proudest of — the Docker demo stack, the integration guides — are responses to seeing one motion's gaps clearly. I'd expect a steep first 30 days at Polaris and I'm planning for it."

2. **Not a systems engineer / no on-call for production data pipelines.**
   - *Risk:* technical depth gap if Polaris expects an SE who can debug a live ingestion failure during a customer call.
   - *Script:* "I've scoped, demoed, and integration-guided against real-time ingestion, but I've never carried an on-call rotation for one. If 'Senior SE' here implies that, I want to flag it now rather than learn it in month two. If the SE role is closer to discovery, demos, and integration scoping, that maps cleanly to what I've actually done."

3. **The $4.2M pipeline-influence figure on the original resume.**
   - *Risk:* interviewer probes the number and Avery can't defend the specific attribution model.
   - *Script:* if asked, "Honestly, '$4.2M influenced' is a number I've used internally; I can defend the activity — the technical-buyer conversations and POC scoping that ladder up to it — better than I can defend the dollar attribution. The tailored resume softens it for that reason." This is the same soften-and-defend framing the `claim-check` skill already recommended on the tailored resume.

## Mapped story usage

After this prep brief, append the following to `story-bank.md` under each story's `usage` field:

```yaml
usage:
  - date: 2026-05-14
    company: Polaris Data
    role: Senior Solutions Engineer
    question: "Walk us through a technical demo you ran end-to-end."
```

(applies to `demo-environment-refactor`, `poc-no-go`, and `integration-guide-snowflake` — append one entry per story.)

## Notes

- Tailored resume is the canonical version to bring; original `resume.md` still has the $4.2M figure — do not paste from it.
- Research report 001 has the GTM-signals and risks; re-skim 30 min before the interview.
- Avery's three story-bank entries cover delivery, conflict, and cross-functional — sufficient breadth for a standard SE behavioral loop. No new stories required pre-interview.
