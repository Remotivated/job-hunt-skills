# Resume & CV Format Research — Candidate Designs

> Research notes for [Issue #5](https://github.com/Remotivated/job-hunt-os/issues/5). Compiled 2026-04-11.
> Companion to [resume-best-practices.md](resume-best-practices.md), which covers what recruiters want and how ATS systems actually work. This document is strictly about visual format and template design — what to build, what to avoid, and why.

---

## Table of Contents

1. [Scope and Goals](#scope-and-goals)
2. [What the Data Actually Says About ATS Formatting](#what-the-data-actually-says-about-ats-formatting)
3. [Template Survey](#template-survey)
4. [The Design Moves That Distinguish "Designed" From "Word Document"](#the-design-moves-that-distinguish-designed-from-word-document)
5. [Candidate Designs (Resume)](#candidate-designs-resume)
6. [UK/EU CV Template](#ukeu-cv-template)
7. [Recommendation](#recommendation)

---

## Scope and Goals

The ATS-export pipeline shipped in [#2](https://github.com/Remotivated/job-hunt-os/issues/2) intentionally optimized for parser safety over visual polish: Georgia serif, black on white, thin rules, no accent color. It works but reads as a 1998 Word document to human reviewers. This document researches a refresh that stays parser-safe while signaling design competence.

**Two templates are in scope:**
- **Resume** — 1-2 pages, tailored per application, the dominant US/corporate use case.
- **CV** — the UK/EU work CV, 1-2 pages, with Personal Statement, degree classification, Languages, and the "References available on request" footer. Same length budget as a resume, different section vocabulary and tone. US academic CVs (publications, grants, 15+ pages) are explicitly out of scope for this project — remote roles skew industry, not tenure-track.

---

## What the Data Actually Says About ATS Formatting

The companion research document established that parsers *parse, they don't reject*. This section drills into the next layer: given parsing fidelity (not auto-rejection) is the real concern, which visual choices are genuinely risky and which are folklore?

### Confirmed safe (documented or structurally parser-invisible)

| Pattern | Why it's safe |
|---|---|
| **Single accent color** on text, rules, name, links | PDF text extraction is colorless at the byte level — color is a visual attribute that parsers don't see |
| **Modern fonts with standard Unicode cmaps** (Inter, Source Sans 3, Source Serif, Charter, EB Garamond) | Standard cmap tables extract cleanly; no vendor allowlist exists |
| **Weight contrast** (700 / 400 within name or headers) | PDF text operators don't encode weight in a parser-visible way |
| **Uppercase section headers** | No documented parser failure; risk is non-standard section *names* ("My Journey"), not case |
| **Faux small-caps** (manually sized regular caps) | Plain text to the parser |
| **Standard bullet glyphs** (`•` U+2022, `-`, `–`) | ASCII/Latin-1, extracts cleanly |
| **Thin horizontal rules** as section dividers | PDF stroke operations are invisible to text extractors |
| **Visible-text URLs** (even when hyperlinked) | The text layer contains the URL regardless of the annotation layer |
| **Reasonable margins** (0.5in – 1in) | Extraction is position-agnostic within a page |

### Genuine risks (documented failure modes)

| Risk | Source |
|---|---|
| **Text sitting on colored/shaded background boxes** | Some parsers rasterize or skip shaded regions |
| **Icon fonts or fonts with private-use-area codepoint remapping** | `pdftotext`-class extractors emit garbage unicode; Awesome-CV's `\accsupp` workaround is the canary |
| **True OpenType `smcp` small-caps** | Some extractors emit lowercase for synthesized small-caps — use faux small-caps instead |
| **Decorative bullet glyphs** (★ ➤ ✓ ❯) and image bullets | Extract as tofu or get dropped (pyresparser issue tracker) |
| **Real `<table>` layout / multi-column pages** | ATS reads left-to-right across both columns, mixing content — documented on Jobscan |
| **Anchor-only links** where visible text isn't the URL | Text-only parsers miss the URL if it's only in the annotation layer |
| **Text inside PDF text boxes, headers/footers, or image layers** | Many parsers skip these entirely |
| **Pill/badge shapes around skill text** | Text inside rounded rectangles parses as image or gets split |

### Confirmed folklore (no primary source)

- "Rules break parsers" — no documented case; rules aren't in the text stream
- "Color in links breaks Workday" — no vendor doc confirms this
- "Minimum 0.75in margins required" — no parser has documented margin sensitivity
- "Only use Arial / Calibri / Times" — no vendor allowlist exists; surfaces only in third-party guides
- "`•` vs `-` vs `–` matters" — all extract equivalently

**Sources:** [Greenhouse supported formats](https://support.greenhouse.io/hc/en-us/articles/360052218132), [Lever parsing guide](https://help.lever.co/hc/en-us/articles/20087345054749-Understanding-Resume-Parsing), [Ashby uploadResume API](https://developers.ashbyhq.com/reference/candidateuploadresume), [Jobscan tables/columns](https://www.jobscan.co/blog/resume-tables-columns-ats/), [Jobscan formatting mistakes](https://www.jobscan.co/blog/ats-formatting-mistakes/), [pyresparser table issue](https://github.com/OmkarPathak/pyresparser/issues/5).

---

## Template Survey

### Jake's Resume ([jakegut/resume](https://github.com/jakegut/resume))
**Stack:** LaTeX. **Status:** 2.5k stars, widely cited as the gold standard ATS-safe template.

**Design choices worth copying:**
- Single column, 11pt, 0.5in margins
- Name in `\Huge\scshape` (large small-caps) — the signature move
- Section headers: small-caps + full-width `\titlerule` (1pt horizontal rule)
- Right-aligned dates via `tabular*` with `\extracolsep{\fill}` — dates sit on the same baseline as company name
- Hand-tuned negative vspace (`\vspace{-4pt}`) throughout for tight vertical rhythm
- Explicitly sets `\pdfgentounicode=1` for parser compatibility

**Visual grade:** Timeless — reads 2020 or 2030 equally. Pure black-on-white but doesn't feel like Word, because of the small-caps + hairline-rule combination.

### Awesome-CV ([posquit0/Awesome-CV](https://github.com/posquit0/Awesome-CV))
**Stack:** XeLaTeX. **Status:** 27k stars.

**Design choices worth studying:**
- Source Sans 3 body, Roboto header, 2.0cm margins
- Name split: first name in `\fontseries{l}` (light 32pt) + last name in `\bfseries` (bold 32pt) — **explicit weight contrast within the name**
- Position subtitle: 7.6pt small-caps in accent color
- Palette: awesome-red `#DC3522`, awesome-emerald `#00A388`, awesome-skyblue `#0395DE` — used on section headers, position titles, icons

**ATS risks present — do not adopt wholesale:**
- FontAwesome6 icon glyphs in contact header (`\accsupp` package exists specifically to paper over this)
- `fancyhdr` for running headers/footers
- `tabularx` for experience rows (multi-cell table layout)

**Visual grade:** Peak 2017 recruiter-aesthetic. Still looks good but *of a moment*.

### Deedy-Resume ([deedy/Deedy-Resume](https://github.com/deedy/Deedy-Resume))
**Stack:** XeTeX. **Status:** 5k stars. **Layout:** Explicit asymmetric two-column.

**Do not model after this.** The repo's own README describes it as "one-page, two asymmetric column." The companion research doc explicitly flags two-column as ATS-hostile. Also reads as ~2014-2016 Helvetica-Light-everything.

### RenderCV ([rendercv/rendercv](https://github.com/rendercv/rendercv))
**Stack:** YAML → LaTeX → PDF. **Status:** 16k stars.

Nine built-in themes (`classic`, `engineeringresumes`, `engineeringclassic`, `sb2nov`, `moderncv`, `harvard`, `ink`, `opal`, `ember`). All single-column. Default font Source Sans 3; `engineeringresumes` uses Charter. Single accent per theme, easily disabled. The `engineeringresumes` preset is the most ATS-leaning.

### Typst Templates
- [`basic-resume`](https://typst.app/universe/package/basic-resume/) — single column, `#26428b` accent, ATS-targeted
- [`simple-technical-resume-template`](https://github.com/steadyfall/simple-technical-resume-template) — single column, readability-first, ATS-friendly
- [`modern-typst-resume`](https://github.com/peterpf/modern-typst-resume) — **pill-shaped skill badges + colored header bar + experience cards**. ATS-risky; skip.

### Harvard OCS / HES Format
The [Harvard GSAS CVs & Cover Letters guide](https://hwpi.harvard.edu/files/ocs/files/gsas-cvs-and-cover-letters.pdf) is the canonical "Word document" end of the spectrum — Times or Garamond, 10–12pt, bold ALL CAPS section headers, no color, no rules. Respected but deliberately conservative. Reference for "recognize as a resume," not for "designed."

### redbricksoftware/resume-builder ([repo](https://github.com/redbricksoftware/resume-builder))
**Stack:** DOCX via `python-docx`. **Status:** Small (33 KB), created 2026-04-06. Not a direct architectural fit for our Playwright/HTML pipeline, but the design tokens are worth borrowing.

**Tokens from [`generate_resume.py`](https://raw.githubusercontent.com/redbricksoftware/resume-builder/main/generate_resume.py):**
- `COLOR_HEADING = #1F2B4D` (dark navy) — name + section headings
- `COLOR_BODY = #2D2D2D` (near-black, softer than pure black)
- `COLOR_SECONDARY = #555566` (muted slate) — contact, dates, school
- `COLOR_ACCENT = #2C5F8A` (medium blue) — bullet glyph only
- Section heading: 11pt bold uppercase + 0.5pt bottom border in heading color
- Job title 10.5pt bold; meta line (`Company | Location | Dates`) 9.5pt italic secondary
- Single column, no tables, no icons, no headers/footers — legitimately ATS-safe

**Do not copy:** Calibri default (Word-ish), skills-as-dot-separated-inline-list (parsers sometimes fail to split on `•` inside a single paragraph), centered name/contact (safe but left-aligned is marginally safer on older parsers).

---

## The Design Moves That Distinguish "Designed" From "Word Document"

Consistent across Jake, Awesome-CV (minus ATS risks), RenderCV classic, and good Typst templates:

1. **Weight contrast inside the name.** `700 surname` + `300–400 given name`, or `700 name` + `400 small-caps title`. A name in uniform 400 or 700 reads as Word. This is the single highest-leverage move.
2. **Small-caps section headers with a full-width hairline rule underneath.** Jake's `\scshape` + `\titlerule`, replicated by RenderCV classic and most Typst templates. A 0.5–1pt rule is *the* signal that someone thought about the page.
3. **A single accent color, used in exactly 2–3 places.** Section rules + name + link underlines, never more. Templates with zero color look conservative-but-respectable; templates with 4+ colors look like 2015 Behance.
4. **Right-aligned dates on the same baseline as the company name, with en-dash separators** (`Aug. 2018 – May 2021`). Dates inline with company in regular parens reads as Word.
5. **Tight vertical rhythm.** The default spacing LaTeX/browsers produce looks like a term paper. Hand-tune leading, paragraph spacing, and section gaps until the page reads as a poster instead of a document.
6. **Typeface choice away from the defaults.** Georgia / Times / Calibri read as Word. **Charter, Source Serif, EB Garamond** (serif) and **Inter, Source Sans 3, Roboto** (sans) consistently signal "designed." Charter in particular is having a moment (RenderCV `engineeringresumes`, XCharter) because it renders beautifully at small sizes and is open-licensed.

---

## Candidate Designs (Resume)

Three directions to choose from. All single-column, all parser-safe per the confirmed-safe list above.

### A. Minimal Serif — "Jake, modernized"
**Philosophy:** Nothing but typography and a hairline rule. Black on white.

- **Typeface:** Charter for body and headings. Fallback `Georgia, "Times New Roman", serif`.
- **Name:** 22pt, `font-weight: 700`, letter-spacing `0.02em`. Left-aligned.
- **Contact line:** 10pt, `color: #555`, pipe-separated, left-aligned under the name.
- **Section headers:** 11pt, uppercase, letter-spacing `0.1em`, `font-weight: 600`, with a 0.5pt `border-bottom: #222` full-width rule.
- **Company / Role meta:** job title 11.5pt bold, then a single meta line `Company · Location · Aug. 2018 – Present` in 10pt italic `color: #555`, dates right-aligned via flex.
- **Bullets:** `•` glyph, hanging indent, 10.5pt, line-height 1.35.
- **Color:** None. Pure black-on-white with one dark-grey secondary tone for meta.

**Tradeoffs:** Safest. Closest to current template, lowest implementation risk, highest "recognize as a resume" factor. Least differentiated from what applicants get out of Word.

### B. Modern Serif with Restrained Navy Accent — "Charter + navy"
**Philosophy:** Option A plus one accent hue, one weight contrast. The sweet spot.

- **Typeface:** Charter for body. Section headers in Charter small-caps.
- **Name:** 24pt, weight contrast — e.g., `Jim` in `font-weight: 400` + `Coughlin` in `font-weight: 700`, or faux small-caps for a single-word treatment.
- **Accent color:** `#1F2B4D` (the redbrick navy) used on: section heading rules, name underline (optional), link underlines. Body text stays near-black (`#2D2D2D`).
- **Contact line:** 10pt `color: #555566`, pipe-separated.
- **Section headers:** 11pt faux small-caps, `color: #1F2B4D`, `border-bottom: 1px solid #1F2B4D`.
- **Job title:** 11.5pt bold `#2D2D2D`; dates right-aligned via flex, 10pt italic `#555566`.
- **Bullets:** `•` 10.5pt hanging indent. `li::marker { color: #1F2B4D }` for the accent-bullet pattern (fall back to body color if ::marker support is a concern).

**Tradeoffs:** Most visually differentiated while staying in the confirmed-safe zone. Requires importing a non-stock font (Charter is open-licensed via [Bitstream Charter / XCharter](https://practicaltypography.com/charter.html)). Slightly more CSS complexity.

### C. Modern Sans — "Inter / Source Sans"
**Philosophy:** Sans-serif for a contemporary tech-industry feel.

- **Typeface:** Inter (variable) or Source Sans 3 for everything.
- **Name:** 24pt `font-weight: 700`, letter-spacing `-0.01em`.
- **Accent color:** Same navy `#1F2B4D` as Option B, or a subtle forest `#1f4e3d` — one hue only.
- **Section headers:** 10pt uppercase, letter-spacing `0.12em`, `font-weight: 600`, accent color, 0.5pt rule.
- **Job title:** 11pt semibold; dates right-aligned.
- **Bullets:** `•` 10.5pt, slightly tighter leading than the serif options.

**Tradeoffs:** Most modern-looking, strongest fit for tech/startup roles, but the least "classic resume" signal for conservative industries (law, finance, government). Same ATS-safety as B. Inter and Source Sans 3 are both OFL and render cleanly via Playwright.

---

## UK/EU CV Template

### Why it's a different template

"CV" in this project means the UK/EU work CV — the everyday document a candidate in London, Berlin, or Dublin submits to industry roles. It is roughly the same length as a US resume (1-2 pages), uses the same bullet structure, and targets the same ATS systems. What differs is section vocabulary, opening convention, and a few UK-specific details that would read wrong on a US resume.

**Explicitly out of scope:** US academic CVs (faculty / postdoc / tenure-track searches with publications, grants, teaching, and service sections running 15+ pages). The realistic academic flow on a remote job platform is academic-to-industry — and in that flow the candidate uses the UK/EU work CV, not an academic CV. See [tests/personas/aisha-okonkwo-academic-to-industry.md](../tests/personas/aisha-okonkwo-academic-to-industry.md) for the canonical example.

### What makes it different from a US resume

- **Personal Statement** at the top (2-4 sentences, first-person OK, no dated third-person tone) — replaces the optional US Professional Summary.
- **Degree classification** in Education (First, 2:1, 2:2 / Distinction, Merit). For early-career candidates (< 5 years experience), Education moves above Experience.
- **Languages with CEFR levels** in Skills — routinely included on EU CVs in a way they aren't on US resumes.
- **Interests** section (optional, UK-common) — short, specific, authentic. Skip if generic.
- **"References available on request"** footer — still the UK default.
- **No photo, DOB, address, or marital status.** These were standard 15 years ago and are now discouraged (and in some regions legally fraught).

Same single-column serif typography and navy accent as the resume template. The visual system is shared with [Option B](#b-modern-serif-with-restrained-navy-accent--charter--navy); only the section list and tone differ. Implementation lives in [templates/resume-eu-template.md](../templates/resume-eu-template.md) and is routed by filename in [scripts/generate-pdf.mjs](../scripts/generate-pdf.mjs) (`cv*.md` → CV body class).

### Section order

1. **Contact** — name, email, LinkedIn, optional portfolio, city/country or "Remote"
2. **Personal Statement**
3. **Experience** (Education moves above this for early-career)
4. **Education** (with degree classification)
5. **Skills** (Technical / Domain / Languages with CEFR)
6. **Interests** (optional)
7. **References** — "available on request"

### Machine readability

Same ATS target as the US resume template — Greenhouse, Lever, Ashby, Workday. Because the CV stays inside the same 1-2 page budget and single-column layout as the resume, it inherits the same parser safety. No running headers, no hanging indents, no publications list to choke on.

### References to study

- [Oxford Careers Service CV guide](https://www.careers.ox.ac.uk/cvs) — canonical UK university guidance
- [Prospects.ac.uk CV templates](https://www.prospects.ac.uk/careers-advice/cvs-and-cover-letters) — UK graduate-focused practical templates
- [Europass CV](https://europa.eu/europass/en/create-europass-cv) — EU standardised format (reference only; too rigid to copy wholesale)

---

## Recommendation

**Resume: adopt Option B (Modern Serif with Restrained Navy Accent).**

It captures every distinguishing design move from the survey (weight contrast, small-caps + rule section headers, single accent, right-aligned dates, tight rhythm, non-default typeface) while staying entirely inside the confirmed-safe list. Charter is open-licensed and renders cleanly via Playwright. Navy `#1F2B4D` is conservative enough for law/finance and modern enough for tech — no industry penalty.

Option A is the safer fallback if we decide to ship a purely typographic refresh without introducing a new font dependency. Option C is the better choice if user testing shows the target audience skews heavily tech/startup.

**CV: share the resume's visual system, swap the section vocabulary.** Same Charter serif, same navy accent, same hairline rules — what changes is the section list (Personal Statement at top, Interests, "References available on request"), a few UK-specific details (degree classification, CEFR languages), and the filename-driven body class (`cv*.md` → `<body class="cv">`) so `shared.css` can scope any CV-only tweaks. No separate template file needed.

### Concrete next steps

1. **Confirm direction** with user: A / B / C for resume.
2. **Add Charter to the Playwright pipeline** — vendor the open-licensed Bitstream Charter (XCharter is the actively maintained variant at [CTAN](https://ctan.org/pkg/xcharter)) into `templates/fonts/`.
3. **Update `templates/shared.css`** with the Option B token system: colors, type scale, rule specs.
4. **Update `templates/document-template.html`** for the new header layout (name weight contrast, flex-based right-aligned dates). The single template backs resume, CV, and cover letter — routed by filename in `generate-pdf.mjs`.
5. **Parser regression test:** run the new PDFs through [Jobscan](https://www.jobscan.co/), [Resume Worded](https://resumeworded.com/), and at least one free Lever/Greenhouse portal submission to verify no parse regression vs. the current template.
6. **Update [#5](https://github.com/Remotivated/job-hunt-os/issues/5)** with test results and close once merged.

---

*Last updated 2026-04-11. Sources cited inline throughout. Companion to [resume-best-practices.md](resume-best-practices.md).*
