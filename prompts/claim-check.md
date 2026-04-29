# Claim Check

Use this prompt before sending a resume, cover letter, LinkedIn rewrite, proof asset, or interview story. It compares the draft against source material you paste in and flags unsupported, inflated, or unclear claims.

## What you'll need

- Final draft material
- Source resume or CV
- Story notes, proof assets, or work-history evidence
- Job posting, if the draft was tailored

## The prompt

```
Check this job-search material for unsupported or inflated claims before I send it. This is a truth and fidelity review, not a copy edit. Compare the draft only against the source material I paste below.

SOURCE RESUME / CV:
[paste source resume or CV]

SOURCE STORY NOTES / PROOF ASSETS:
[paste STAR stories, project notes, case studies, or write "none"]

JOB POSTING, IF RELEVANT:
[paste posting, or write "not relevant"]

DRAFT TO CHECK:
[paste resume, cover letter, LinkedIn copy, proof asset, interview answer, or other draft]

Review the draft in this order:

1. VERDICT
   Give one of:
   - READY AFTER MINOR EDITS
   - NEEDS VERIFICATION BEFORE SENDING
   - DO NOT SEND YET

2. HARD BLOCKERS
   List any claim that appears fabricated, contradicted, or materially unsupported by the pasted sources. Include:
   - Draft span
   - Problem
   - Best matching source, if any
   - Fix: remove, soften, or ask me to verify

3. SOFT ISSUES
   List subtler risk areas:
   - Inference tightening, where two separate facts became one stronger claim
   - Verb inflation, such as "contributed to" becoming "led"
   - Dropped qualifiers, such as "learning" or "scripting only" disappearing
   - Broad tools becoming specific tools
   - Metrics or scope that need confirmation

4. PLACEHOLDERS AND ASK ITEMS
   Find every [ASK], [VERIFY], TBD, placeholder, vague date, or unresolved bracket.

5. CLAIM TABLE
   Create a table:
   | Draft claim | Supported by source? | Risk | Recommended action |
   | --- | --- | --- | --- |
   Use Supported / Partially supported / Not found / Contradicted.

6. CLEANED VERSION
   Provide a cleaned version only if the fixes are straightforward and do not require new facts from me. Do not silently replace unsupported claims with new invented claims.

Rules:
- Do not use outside knowledge.
- Do not assume common tools, typical metrics, or likely responsibilities.
- If a claim might be true but is not in the pasted source material, mark it [VERIFY: ...].
- Preserve the strongest truthful version. Do not overcorrect into vague filler.
```

## What you'll get

A send/no-send verdict, a list of claim risks, and a cleaned version when the fixes do not require new facts.
