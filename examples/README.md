# Sample Outputs

Curated sample resumes and CVs rendered through the same pipeline real users get (`scripts/generate-docx.py`). The candidates are synthetic — not real people.

Each example has the source markdown plus the generated `.docx`, `.pdf`, `.html` preview, and a PNG of the first PDF page (in [`screenshots/`](screenshots/)) used in the project README.

| Source | PDF | Description |
| --- | --- | --- |
| [maya-chen/resume.md](maya-chen/resume.md) | [maya-chen/resume.pdf](maya-chen/resume.pdf) | US resume, senior backend tech lead targeting EM roles |
| [devon-park/resume.md](devon-park/resume.md) | [devon-park/resume.pdf](devon-park/resume.pdf) | US resume, bootcamp grad and former teacher |
| [avery-castillo/](avery-castillo/) | [avery-castillo/my-documents/applications/polaris-data-senior-se/resume.pdf](avery-castillo/my-documents/applications/polaris-data-senior-se/resume.pdf) | US resume, senior solutions engineer at a B2B data-integration SaaS — full end-to-end example with tailored resume, cover letter, story bank, research report, and interview prep |

## Regenerating

```bash
python scripts/generate-docx.py examples/*/resume.md
python scripts/render-pdf-preview.py examples/*/resume.pdf
```
