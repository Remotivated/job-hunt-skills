// resume.typ — vendored Typst template for resumes, CVs, and cover letters.
//
// Design tokens match templates/preview-template.html and the DOCX emitter
// in scripts/export-documents.mjs: single-column serif (Gelasio, metric-
// compatible with Georgia), restrained navy accent, US Letter with
// 0.5in/0.55in margins.
//
// Data-driven contract: scripts/export-documents.mjs generates a .typ file
// that imports this template and calls the functions below in document
// order. The generated file carries only content; all styling lives here.
// No @preview imports, no network — compiled with:
//   typst compile --font-path templates/fonts <generated.typ> <out.pdf>
//
// Vertical rhythm: the DOCX renders with Word's "multiple 1.35" line
// spacing, which at Georgia metrics produces a 1.533em baseline pitch
// (measured 16.1pt at 10.5pt body in the reference renders). Typst line
// boxes span cap-height (0.693em) to baseline, so:
//   - wrapped lines get leading = 1.533em - 0.693em = 0.84em
//   - every paragraph block adds 0.70em (scaled to its font size)
//     to its bottom spacing, compensating for the leading Word bakes into
//     the final line box of each paragraph.
// Page breaks were verified against the pre-Typst reference PDFs (issue
// #31 bake-off) — change these constants only with a fresh comparison.

#let navy = rgb("#2C5F8A")
#let ink = rgb("#2D2D2D")
#let muted = rgb("#555566")

// Per-block compensation: Word's final-line leading, scaled to font size.
#let comp(size) = 0.70 * size

// Document-level setup. Apply with:  #show: setup
#let setup(doc) = {
  set page(paper: "us-letter", margin: (x: 0.55in, y: 0.5in))
  set text(font: "Gelasio", size: 10.5pt, fill: ink)
  set par(leading: 0.84em, spacing: 0pt, justify: false)
  set smartquote(enabled: false)
  show link: it => underline(it)
  doc
}

// Name + contact header. `name` and `contact` are content.
#let header(name, contact) = {
  block(below: 2pt + comp(22pt), text(size: 22pt, weight: "bold", fill: navy, name))
  block(below: 7pt + comp(10pt), {
    set text(size: 10pt, fill: muted)
    show link: it => underline(text(fill: muted, it))
    contact
    v(2pt)
    line(length: 100%, stroke: 0.5pt + navy)
  })
}

// Section header (markdown h2): uppercase navy with hairline underline.
// sticky: true keeps it with the block that follows (DOCX keep-with-next).
// space-before lives inside the block (v) so it adds to the previous
// block's below-spacing the way Word sums after + before.
#let section(title) = block(sticky: true, below: 4pt + comp(10.5pt), {
  v(13pt)
  set text(size: 10.5pt, weight: "bold", fill: navy, tracking: 0.06em)
  upper(title)
  v(1pt)
  line(length: 100%, stroke: 0.5pt + navy)
})

// Role title (markdown h3).
#let role(title) = block(sticky: true, below: 1pt + comp(11pt), {
  v(7pt)
  text(size: 11pt, weight: "bold", fill: ink, title)
})

// The italic meta line right after a role: "Jan 2022 - Present · Remote".
#let role-meta(body) = block(
  below: 3pt + comp(9.75pt),
  text(size: 9.75pt, style: "italic", fill: muted, body),
)

// Regular body paragraph.
#let para(body) = block(below: 5pt + comp(10.5pt), body)

// Cover-letter paragraph — looser spacing.
#let cover-para(body) = block(below: 10pt + comp(10.5pt), body)

// Single-level bullet list. Geometry mirrors the HTML preview: text starts
// 0.22in from the margin with the disc marker hanging just before it.
#let bullets(..items) = block(below: 2.5pt + comp(10.5pt), {
  set list(
    marker: text(fill: ink)[•],
    indent: 0.10in,
    body-indent: 0.07in,
    spacing: 2.5pt + comp(10.5pt),
    tight: false,
  )
  list(..items)
})

// Horizontal rule (markdown ---). Word renders this as an empty paragraph
// carrying a bottom border, so it consumes a full line box.
#let divider() = block(below: 5pt + comp(10.5pt), {
  v(comp(10.5pt))
  line(length: 100%, stroke: 0.25pt + navy)
})
