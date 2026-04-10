// CLI pipeline for markdown → ATS-safe PDF.
// Exports internal functions so scripts/test-generate-pdf.mjs can test them.

export function normalizeUnicode(text) {
  return text
    .replace(/\u2014/g, "-")          // em-dash
    .replace(/\u2013/g, "-")          // en-dash
    .replace(/[\u201C\u201D]/g, '"')  // smart double quotes
    .replace(/[\u2018\u2019]/g, "'")  // smart single quotes
    .replace(/\u2026/g, "...")        // ellipsis
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, "") // zero-width + BOM
    .replace(/\u00A0/g, " ");         // non-breaking space
}
