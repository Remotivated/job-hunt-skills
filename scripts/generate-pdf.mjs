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

export function pickTemplate(inputPath) {
  const base = path.basename(inputPath).toLowerCase();
  if (base.startsWith("coverletter")) {
    return path.join(TEMPLATES_DIR, "coverletter-template.html");
  }
  return path.join(TEMPLATES_DIR, "resume-template.html");
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderHtml({ name, contact, bodyMarkdown, templatePath }) {
  const templateAbs = path.isAbsolute(templatePath)
    ? templatePath
    : path.join(REPO_ROOT, templatePath);
  const template = fs.readFileSync(templateAbs, "utf8");
  const css = fs.readFileSync(path.join(TEMPLATES_DIR, "shared.css"), "utf8");

  const bodyHtml = marked.parse(bodyMarkdown);
  const contactHtml = marked.parseInline(contact);

  return template
    .replace(
      /<link rel="stylesheet" href="shared\.css">/,
      `<style>\n${css}\n</style>`
    )
    .replace(/\{\{name\}\}/g, escapeHtml(name))
    .replace(/\{\{contact\}\}/g, contactHtml)
    .replace(/\{\{body\}\}/g, bodyHtml);
}

async function renderPdf(html, outputPath) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.pdf({
      path: outputPath,
      format: "Letter",
      printBackground: false,
    });
  } finally {
    await browser.close();
  }
}

async function main(argv) {
  const [, , inputArg, outputArg] = argv;
  if (!inputArg) {
    console.error("Usage: node scripts/generate-pdf.mjs <input.md> [output.pdf]");
    process.exit(2);
  }

  const inputPath = path.resolve(inputArg);
  if (!fs.existsSync(inputPath)) {
    console.error(`Input not found: ${inputPath}`);
    process.exit(1);
  }

  const outputPath = outputArg
    ? path.resolve(outputArg)
    : inputPath.replace(/\.md$/i, ".pdf");

  const templatePath = pickTemplate(inputPath);
  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found: ${templatePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(inputPath, "utf8");
  const { content: afterFrontmatter } = matter(raw);
  const normalized = normalizeUnicode(afterFrontmatter);

  const { name, contact, body } = parseResumeSections(normalized);
  const html = renderHtml({ name, contact, bodyMarkdown: body, templatePath });

  try {
    await renderPdf(html, outputPath);
  } catch (err) {
    const msg = String(err && err.message ? err.message : err);
    if (/Executable doesn't exist|browserType\.launch/.test(msg)) {
      console.error("Chromium not installed. Run: npx playwright install chromium");
    } else {
      console.error(`PDF rendering failed: ${msg}`);
    }
    process.exit(1);
  }

  const bytes = fs.statSync(outputPath).size;
  console.log(`Wrote ${outputPath} (${bytes} bytes)`);
}

// Only run main when executed as a script, not when imported for tests
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main(process.argv).catch((err) => {
    console.error(err.stack || err.message || err);
    process.exit(1);
  });
}
