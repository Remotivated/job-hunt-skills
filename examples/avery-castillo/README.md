# Avery Castillo — Example Persona

Synthetic example used in the Job Hunt Skills launch walkthrough video. Files in `my-documents/` were generated end-to-end through the same pipeline real users get.

**Background:** Senior Solutions Engineer at NorthwindSync (B2B data-integration SaaS). 5 years total, joined as Customer Success Engineer and moved into Pre-Sales SE within a year. Comfortable with Python and SQL, ships internal tooling and API integrations, but is not a systems engineer — strength is translating customer problems into product fit.

**Target role:** Senior Solutions Engineer at Polaris Data (fictional but credible mid-market data-tooling startup). Posting wants more technical depth than Avery's current role expects, plus explicit GTM-pairing experience.

## Two snapshots

- **[`my-documents/`](my-documents/)** — the END state. Every artifact a full walkthrough produces, fully populated. Use this as the reference for what each skill outputs.
- **[`starter/my-documents/`](starter/my-documents/)** — the START state. Source documents only (resume, story-bank, proof-assets) plus empty tracker/reports/applications dirs. Copy this into a fresh test folder and run the walkthrough beats against it to see each skill generate its artifact live.

## Files in the end-state

| Path | What it is |
| --- | --- |
| `my-documents/resume.md` | Avery's source resume (v3). Contains the unsupported "$4.2M influenced pipeline" claim that `claim-check` flags on Beat 5. |
| `my-documents/story-bank.md` | Three STAR+R stories: Docker demo refactor, PoC restructuring, Snowflake integration guide. |
| `my-documents/applications.md` | Tracker row for Polaris Data at `status: applied`. |
| `my-documents/proof-assets/demo-environment-refactor.md` | Brief for a written case study of the Docker stack. |
| `my-documents/proof-assets/snowflake-integration-guide.md` | Brief for a proof-link framing post around the public integration guide. |
| `my-documents/reports/001-polaris-data-research-2026-05-12.md` | `company-research` output for Polaris Data. |
| `my-documents/applications/polaris-data-senior-se/resume.md` | Tailored resume — links back to source by `source_version`. |
| `my-documents/applications/polaris-data-senior-se/coverletter.md` | Tailored cover letter. |
| `my-documents/applications/polaris-data-senior-se/interview-prep.md` | Behavioral + technical prep brief mapped to the story-bank. |
| `my-documents/applications/polaris-data-senior-se/resume.docx` / `.html` | DOCX output + HTML preview from `scripts/generate-docx.py`. |
| `my-documents/applications/polaris-data-senior-se/coverletter.docx` / `.html` | Same, for the cover letter. |

## Regenerating the DOCX/PDF

The committed `.docx` and `.html` files come from:

```bash
python scripts/generate-docx.py \
  examples/avery-castillo/my-documents/applications/polaris-data-senior-se/resume.md \
  examples/avery-castillo/my-documents/applications/polaris-data-senior-se/coverletter.md
```

PDF output requires LibreOffice on PATH. On Windows: `winget install TheDocumentFoundation.LibreOffice`. With LibreOffice installed, the same command also writes `resume.pdf` / `coverletter.pdf` alongside the DOCX.

## Following along

Two paths:

1. **End-state reference** — read `my-documents/` to see what every skill produces. No setup required.
2. **Run the walkthrough yourself** — copy `starter/my-documents/` into a fresh local folder, launch Claude Code or Cowork there, and run the skills described in [`docs/launch/scripts/walkthrough.md`](../../docs/launch/scripts/walkthrough.md).
