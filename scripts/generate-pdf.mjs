// CLI pipeline for markdown → ATS-safe PDF.
// Exports internal functions so scripts/test-generate-pdf.mjs can test them.

import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import matter from "gray-matter";
import { marked } from "marked";

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
