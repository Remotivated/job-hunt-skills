// CLI pipeline for markdown → ATS-safe PDF.
// Exports internal functions so scripts/test-generate-pdf.mjs can test them.

import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import fs from "node:fs";
import matter from "gray-matter";
import { marked } from "marked";
import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATES_DIR = path.join(REPO_ROOT, "templates");
const FONTS_DIR = path.join(TEMPLATES_DIR, "fonts");
const DOCUMENT_TEMPLATE_PATH = path.join(TEMPLATES_DIR, "document-template.html");

// Charter (Bitstream, freely redistributable — see templates/fonts/LICENSE.txt).
// Vendored as WOFF2 and inlined at render time so page.setContent() doesn't
// need to resolve external URLs. The PDF engine subsets the glyphs actually
// used, so final PDFs don't ship the full font payload.
const CHARTER_FACES = [
  { file: "charter_regular.woff2",     weight: 400, style: "normal" },
  { file: "charter_italic.woff2",      weight: 400, style: "italic" },
  { file: "charter_bold.woff2",        weight: 700, style: "normal" },
  { file: "charter_bold_italic.woff2", weight: 700, style: "italic" },
];

let cachedFontFaceCss = null;

export function buildFontFaceCss() {
  if (cachedFontFaceCss) return cachedFontFaceCss;
  const blocks = CHARTER_FACES.map(({ file, weight, style }) => {
    const bytes = fs.readFileSync(path.join(FONTS_DIR, file));
    const b64 = bytes.toString("base64");
    return `@font-face {
  font-family: "Charter";
  font-style: ${style};
  font-weight: ${weight};
  font-display: block;
  src: url("data:font/woff2;base64,${b64}") format("woff2");
}`;
  });
  cachedFontFaceCss = blocks.join("\n");
  return cachedFontFaceCss;
}

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

export function parseResumeSections(markdown) {
  const lines = markdown.split("\n");

  // Line 1 must be "# Name"
  const h1Match = /^#\s+(.+?)\s*$/.exec(lines[0] ?? "");
  if (!h1Match) {
    throw new Error("First line must be an h1 with the name, e.g. '# Sarah Chen'");
  }
  const name = h1Match[1];

  // Walk forward to first non-empty line after the name
  let i = 1;
  while (i < lines.length && lines[i].trim() === "") i++;
  if (i >= lines.length) {
    throw new Error("No contact line found after name");
  }
  const contact = lines[i].trim();

  // Walk forward to first --- divider
  let dividerIdx = -1;
  for (let j = i + 1; j < lines.length; j++) {
    if (lines[j].trim() === "---") {
      dividerIdx = j;
      break;
    }
  }
  if (dividerIdx === -1) {
    throw new Error("No '---' divider found after contact line");
  }

  const body = lines.slice(dividerIdx + 1).join("\n").replace(/^\s*\n/, "");
  return { name, contact, body };
}

export function pickDocumentKind(inputPath) {
  const base = path.basename(inputPath).toLowerCase();
  if (base.startsWith("coverletter")) {
    return { title: "Cover Letter", bodyClass: "coverletter" };
  }
  if (base.startsWith("cv")) {
    return { title: "CV", bodyClass: "cv" };
  }
  return { title: "Resume", bodyClass: "" };
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderHtml({ name, contact, bodyMarkdown, title, bodyClass }) {
  const template = fs.readFileSync(DOCUMENT_TEMPLATE_PATH, "utf8");
  const css = fs.readFileSync(path.join(TEMPLATES_DIR, "shared.css"), "utf8");
  const fontFaceCss = buildFontFaceCss();

  const bodyHtml = marked.parse(bodyMarkdown);
  const contactHtml = marked.parseInline(contact);

  return template
    .replace(
      /<link rel="stylesheet" href="shared\.css">/,
      `<style>\n${fontFaceCss}\n${css}\n</style>`
    )
    .replace(/\{\{title\}\}/g, escapeHtml(title))
    .replace(/\{\{bodyClass\}\}/g, escapeHtml(bodyClass))
    .replace(/\{\{name\}\}/g, escapeHtml(name))
    .replace(/\{\{contact\}\}/g, contactHtml)
    .replace(/\{\{body\}\}/g, bodyHtml);
}

async function renderPdfBatch(jobs) {
  // jobs: [{ html, outputPath }, ...]
  // Launches one browser, reuses one page, renders each PDF.
  // Returns [{ outputPath, ok, error? }, ...] in the same order as `jobs`.
  const results = [];
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    for (const job of jobs) {
      try {
        await page.setContent(job.html, { waitUntil: "networkidle" });
        await page.pdf({
          path: job.outputPath,
          format: "Letter",
          printBackground: false,
        });
        results.push({ outputPath: job.outputPath, ok: true });
      } catch (err) {
        results.push({
          outputPath: job.outputPath,
          ok: false,
          error: err,
        });
      }
    }
  } finally {
    await browser.close();
  }
  return results;
}

async function main(argv) {
  const inputArgs = argv.slice(2);
  if (inputArgs.length === 0) {
    console.error("Usage: node scripts/generate-pdf.mjs <input.md> [<input2.md> ...]");
    process.exit(2);
  }

  // Build jobs first — per-file validation/parse errors are reported and
  // counted as failures but do not abort the remaining files.
  const jobs = [];
  const prepFailures = [];

  for (const arg of inputArgs) {
    const inputPath = path.resolve(arg);
    const outputPath = inputPath.replace(/\.md$/i, ".pdf");
    try {
      if (!fs.existsSync(inputPath)) {
        throw new Error(`Input not found: ${inputPath}`);
      }
      const raw = fs.readFileSync(inputPath, "utf8");
      const { content: afterFrontmatter } = matter(raw);
      const normalized = normalizeUnicode(afterFrontmatter);
      const { name, contact, body } = parseResumeSections(normalized);
      const { title, bodyClass } = pickDocumentKind(inputPath);
      const html = renderHtml({ name, contact, bodyMarkdown: body, title, bodyClass });
      jobs.push({ inputPath, outputPath, html });
    } catch (err) {
      const msg = String(err && err.message ? err.message : err);
      console.error(`Failed to prepare ${inputPath}: ${msg}`);
      prepFailures.push({ inputPath, outputPath, error: err });
    }
  }

  let renderResults = [];
  if (jobs.length > 0) {
    try {
      renderResults = await renderPdfBatch(
        jobs.map(({ html, outputPath }) => ({ html, outputPath }))
      );
    } catch (err) {
      const msg = String(err && err.message ? err.message : err);
      if (/Executable doesn't exist|browserType\.launch/.test(msg)) {
        console.error("Chromium not installed. Run: npx playwright install chromium");
      } else {
        console.error(`PDF rendering failed: ${msg}`);
      }
      process.exit(1);
    }
  }

  let anyFailed = prepFailures.length > 0;
  for (let i = 0; i < renderResults.length; i++) {
    const r = renderResults[i];
    if (r.ok) {
      const bytes = fs.statSync(r.outputPath).size;
      console.log(`Wrote ${r.outputPath} (${bytes} bytes)`);
    } else {
      anyFailed = true;
      const msg = String(r.error && r.error.message ? r.error.message : r.error);
      if (/Executable doesn't exist|browserType\.launch/.test(msg)) {
        console.error(`PDF rendering failed for ${r.outputPath}: Chromium not installed. Run: npx playwright install chromium`);
      } else {
        console.error(`PDF rendering failed for ${r.outputPath}: ${msg}`);
      }
    }
  }

  process.exit(anyFailed ? 1 : 0);
}

// Only run main when executed as a script, not when imported for tests
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main(process.argv).catch((err) => {
    console.error(err.stack || err.message || err);
    process.exit(1);
  });
}
