# Contributing

Thanks for improving Job Hunt Skills. This repo is meant to be useful to jobseekers first, so contributions should make the workflows clearer, more truthful, or easier to use.

## Standards

- **Truth first.** Do not add prompts or examples that encourage invented metrics, titles, tools, employers, credentials, or story details.
- **Useful before clever.** Prefer simple workflows a jobseeker can actually follow.
- **No hidden marketing.** Remotivated can appear as builder/sponsor metadata or as a genuinely relevant external source. Do not turn guides, prompts, or examples into product copy.
- **Human-readable output.** Resumes, letters, briefs, and guides should sound like something a real person would use.
- **No fear-based ATS claims.** If a guide or prompt makes a strong claim about hiring systems, source it or soften it.

## Pull Request Checklist

- [ ] The change helps a jobseeker do a real task.
- [ ] Any new career advice is sourced, obvious from experience, or framed as judgment rather than fact.
- [ ] Examples do not include unresolved ASK, VERIFY, Date, or similar placeholders.
- [ ] Prompts instruct users to verify any new or reframed claims.
- [ ] Public docs do not reference retired project or skill names.
- [ ] Remotivated references are attribution-level or directly useful.
- [ ] `python scripts/check-content-hygiene.py` passes.
- [ ] `python scripts/test_generate_docx.py` passes.

## Local Checks

```bash
python scripts/check-content-hygiene.py
python scripts/test_generate_docx.py
```
