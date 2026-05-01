# Contributing

Thanks for improving Job Hunt Skills. This repo is meant to be useful to jobseekers first, so contributions should make the workflows clearer, more truthful, or easier to use.

## Standards

- **Truth first.** Do not add prompts or examples that encourage invented metrics, titles, tools, employers, credentials, or story details.
- **Human-readable output.** Resumes, letters, briefs, and guides should sound like something a real person would use.
- **No fear-based ATS claims.** If a guide or prompt makes a strong claim about hiring systems, source it or soften it.
- **Human in the Loop.** Contributions should not introduce paths for AI spam or slop such as auto-apply workflows, AI messaging or emails etc.

## Repository Structure

| Path | What it is |
| --- | --- |
| `skills/` | Claude Code and Cowork skills |
| `prompts/` | Copy/paste prompts for any LLM |
| `guides/` | Job search methodology |
| `templates/` | Resume, CV, and cover letter scaffolds |
| `scripts/` | Export and quality-check scripts |

## Local Checks

```bash
python scripts/check-content-hygiene.py
python scripts/check-internal-links.py
python scripts/test_generate_docx.py
python scripts/test_skill_contracts.py
```

The hygiene check catches unresolved placeholders and HTML comments leaking into rendered samples. The link checker validates that internal markdown links point at files that exist. The DOCX tests cover the markdown renderer. The skill contract tests catch missing skills, schema drift, and stale state-layer conventions.
