# Sample Outputs

Curated sample resumes and CVs rendered through the same pipeline real users get (`scripts/generate-docx.py`). The candidates are synthetic — not real people.

Each example has the source markdown plus the generated `.docx`, `.pdf`, `.html` preview, and a PNG of the first PDF page (in [`screenshots/`](screenshots/)) used in the project README.

| Source | PDF | Description |
| --- | --- | --- |
| [maya-chen-resume.md](maya-chen-resume.md) | [maya-chen-resume.pdf](maya-chen-resume.pdf) | US resume, senior backend tech lead targeting EM roles |
| [devon-park-resume.md](devon-park-resume.md) | [devon-park-resume.pdf](devon-park-resume.pdf) | US resume, bootcamp grad and former teacher |
| [aisha-okonkwo-cv.md](aisha-okonkwo-cv.md) | [aisha-okonkwo-cv.pdf](aisha-okonkwo-cv.pdf) | UK CV, computational biologist moving from academia to industry |

## Regenerating

```bash
python scripts/generate-docx.py examples/*.md
python scripts/render-pdf-preview.py examples/*.pdf
```
