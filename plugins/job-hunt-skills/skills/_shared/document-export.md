# Document Export

How a saved resume, CV, or cover letter becomes the Word and PDF files the user sends. Every skill that exports follows these steps; the [state layer contract](state-layer.md) covers where the files live.

**Not a skill.** It has no frontmatter, so it never activates on its own. The source is `skills/_shared/document-export.md`; each skill carries a generated copy in its own `references/` folder, because some hosts let a skill read only files inside its own folder.

This plugin ships no exporter. Word and PDF files come from the host's own document abilities, following the layout specification below, or from the optional companion's `typeset-export` skill when it is available ([state layer §14](state-layer.md#14-optional-companion)). When neither is available, the user gets their markdown plus a print-ready HTML view. Whichever path is used, the user is told which one.

## 1. When to Export

Export after the markdown is saved, and after any report and tracker write the run makes, so a problem with export never blocks the application record. Export every document the run wrote in one pass: for a tailored application, the resume or CV and the cover letter together.

Outputs are written next to their markdown with the same base name: `resume.md` gives `resume.docx`, `resume.pdf`, and `resume.html`. Exporting a document again replaces its earlier outputs; nothing else in the folder changes.

## 2. Pre-Export Checklist

Run this on every document before any export path. It never edits the source markdown's facts; it decides what text the exported files contain.

1. **Shape.** The first line is `# {Name}`. The next non-empty line is the contact line. A line holding only `---` comes after it, and the body follows. If the shape is wrong, fix the markdown (a heading or the divider is missing) and save it before exporting.
2. **Frontmatter stays out.** A leading `---` block (version, label, source fields) is never part of the exported text.
3. **Nothing unfinished.** Nothing after the frontmatter, the name and contact line included, holds any of these. If one is present, resolve it from facts you already have and save the markdown; ask the user only when a missing fact is required. Never export with one present.
   - HTML comments (`<!-- … -->`), including template notes.
   - `[ASK: …]` or `[VERIFY: …]` markers.
   - Bracket placeholders such as `[Company Name]` or `[Metric]`. Links (`[text](https://…)`) and checkboxes (`[ ]`, `[x]`) are fine.
   - `year TBD`.
4. **Copy-paste characters.** In the text handed to any export path (not in the saved markdown), replace characters that survive copy and paste but trip applicant tracking systems: em dash and en dash with `-`, curly double quotes with `"`, curly single quotes and apostrophes with `'`, the ellipsis character with `...`, and non-breaking spaces with ordinary spaces. Remove zero-width characters (zero-width space, zero-width joiner and non-joiner, and the byte-order mark).

The companion's `typeset-export` applies the same checks itself and refuses a document that fails one; fix the markdown as above and export again.

## 3. Layout Specification

One layout for every path, so a document looks the same however it was produced.

**Page.** US Letter (8.5 × 11 in) by default. A4 (210 × 297 mm) when the work document is a UK/EU-format CV (`cv.md`) or the user is applying outside the US and Canada; ask when unsure. Margins 0.5 in top and bottom, 0.55 in left and right. Single column. No tables, text boxes, columns, images, icons, or text in headers and footers: applicant tracking systems read a plain single column most reliably.

**Type.** Georgia 10.5 pt for the body, falling back to Gelasio, Liberation Serif, Times New Roman, then any serif. Line height 1.35. Text color `#2D2D2D`, secondary text `#555566`, accent navy `#2C5F8A`.

| Markdown | Exported as |
| --- | --- |
| `# Name` (first line) | 22 pt bold navy, 2 pt below |
| Contact line | 10 pt secondary color, then a 0.5 pt navy rule, 7 pt below. Links keep their addresses. |
| `## Section` | 10.5 pt bold navy, uppercase, letter spacing 0.06 em, 13 pt above, 4 pt below, a 0.5 pt navy rule underneath; kept with the next line |
| `### Entry` | 11 pt bold, text color, 7 pt above, 1 pt below; kept with the next line |
| The line right after a `###` entry (company, place, dates) | 9.75 pt italic, secondary color, 3 pt below |
| Paragraph | 5 pt below in a resume or CV; 10 pt below in a cover letter |
| `- bullet` | Single level, round bullet, 0.22 in hanging indent, 2.5 pt between items |
| `---` inside the body | 0.25 pt navy rule, 6 pt above and below |
| `**bold**`, `*italic*`, `[link](url)` | Bold, italic, and a working link in navy |

A cover letter uses the same name, contact line, and rule, followed by its paragraphs.

**Files.** The Word file is real text in styled paragraphs, not an image, so it can be edited and parsed. The PDF has selectable text with its fonts embedded. Neither contains the frontmatter, comments, or placeholders the checklist removed.

## 4. Choosing the Path

Take the first path that applies, then tell the user which one was used and name every file written.

1. **The companion's `typeset-export` skill is available and the documents use US Letter.** The companion lays out Letter pages only, so an A4 document skips this path and takes the next one that applies. Hand it every Letter document in one run ([state layer §14](state-layer.md#14-optional-companion)). It writes `.docx`, `.pdf`, and `.html` for each document. If it refuses a document as not ready, fix the markdown and try again. If it cannot run, reconcile as in step 6 and continue with the next path for whatever is still missing.
2. **The host can create both Word and PDF files.** Use the document abilities this session offers, such as a tool or skill for creating `.docx` and `.pdf` files. Give it the checked text from §2 and the layout in §3, and ask for both files next to the markdown. Also write the HTML view (§5) so the user can preview the layout in any browser.
3. **The host can create only one of them.** Produce that one, write the HTML view (§5), and say which file is missing and how to make it: with only a Word file, open it in Word, Pages, or Google Docs and save or download it as PDF; with only a PDF, open the `.html` view in Word or Google Docs and save it as a Word document.
4. **The host can create neither.** Write the HTML view (§5) and tell the user plainly: "Your {label} is saved as markdown, with a print-ready page next to it. Open `{name}.html` in your browser and choose Print, then Save as PDF. To get a Word file, open the same page in Word or Google Docs and save it as a document. The optional Job Hunt Skills Tools companion can also make both files automatically." Then continue the run.

Report the path as what the user has, never as a failed run.

## 5. Print-Ready HTML View

When the HTML view is needed, write it at run time with ordinary file tools as `{name}.html` next to the markdown. Use this page, replacing the three slots:

- `{{name}}` — the name from the `#` line, escaped.
- `{{contact}}` — the contact line, escaped, with links as `<a href="…">…</a>`.
- `{{body}}` — the body after the divider: `## ` as `<h2>`, `### ` as `<h3>`, the line right after a `###` as `<p class="company-line">`, other paragraphs as `<p class="body-para">` (or `<p class="cover-para">` in a cover letter), bullets as `<ul><li>`, a body `---` as `<hr>`, and bold, italic, and links as `<strong>`, `<em>`, and `<a>`.

Escape `&`, `<`, `>`, and `"` in all text as `&amp;`, `&lt;`, `&gt;`, and `&quot;`. Use the checked text from §2. For A4, change `size: letter` to `size: A4` and `width: 8.5in; min-height: 11in` to `width: 210mm; min-height: 297mm`.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{name}}</title>
<style>
:root { --navy: #2C5F8A; --text: #2D2D2D; --muted: #555566; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { background: #e9eaed; font-family: Georgia, Gelasio, "Liberation Serif", "Times New Roman", serif; color: var(--text); font-size: 10.5pt; line-height: 1.35; padding: 24px 16px; }
.page { background: #fff; width: 8.5in; min-height: 11in; margin: 0 auto; padding: 0.5in 0.55in; box-shadow: 0 2px 14px rgba(0,0,0,0.12); }
.name { font-size: 22pt; font-weight: bold; color: var(--navy); margin: 0 0 2pt; }
.contact { color: var(--muted); font-size: 10pt; margin: 0 0 7pt; padding-bottom: 2pt; border-bottom: 0.5pt solid var(--navy); }
.contact a { color: inherit; }
h2 { color: var(--navy); font-size: 10.5pt; font-weight: bold; letter-spacing: 0.06em; margin: 13pt 0 4pt; padding-bottom: 1pt; border-bottom: 0.5pt solid var(--navy); text-transform: uppercase; break-after: avoid; }
h3 { color: var(--text); font-size: 11pt; font-weight: bold; margin: 7pt 0 1pt; break-after: avoid; }
.company-line { color: var(--muted); font-size: 9.75pt; font-style: italic; margin: 0 0 3pt; }
.body-para { margin: 0 0 5pt; }
.cover-para { margin: 0 0 10pt; }
ul { margin: 0; padding-left: 0.22in; list-style: disc outside; }
ul li { margin: 0 0 2.5pt; }
a { color: var(--navy); }
hr { border: 0; border-top: 0.25pt solid var(--navy); margin: 6pt 0; }
@page { size: letter; margin: 0.5in 0.55in; }
@media print {
  body { background: #fff; padding: 0; }
  .page { width: auto; min-height: 0; margin: 0; padding: 0; box-shadow: none; }
}
</style>
</head>
<body>
<main class="page">
<h1 class="name">{{name}}</h1>
<p class="contact">{{contact}}</p>
{{body}}
</main>
</body>
</html>
```

## 6. Check the Result

1. **Every expected file exists** next to its markdown. When exporting several documents, or after a path that stopped partway, keep the files that were written completely and produce only the missing ones ([state layer §12](state-layer.md#12-validated-mutations-written-procedure-and-companion), reconcile after a failed run). Never leave a half-written file in place: replace it.
2. **The text is clean.** Where the host can read the produced files back, check that the extracted text has no frontmatter, comments, `[ASK`, `[VERIFY`, bracket placeholders, or the copy-paste characters from §2. If it does, fix the input and export that document again.
3. **Tell the user** which path made the files, which files exist, and, when something is missing, the one step that gets it.
