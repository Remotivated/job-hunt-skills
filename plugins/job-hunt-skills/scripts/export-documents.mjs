#!/usr/bin/env node
// Markdown -> HTML preview + DOCX + PDF exporter for resumes, CVs, and
// cover letters. Replaces the former Python-based pipeline.
//
// Tier model (capability unlocks, not failure states):
//   Tier 1 — markdown + HTML preview (no dependencies; when Node is absent
//            Claude fills templates/preview-template.html natively).
//   Tier 2 — this script on Node >= 18: adds .docx (docx npm lib) and a
//            baseline .pdf (pdfmake). All deps are bundled in
//            scripts/vendor/export-deps.mjs — no npm install.
//   Tier 3 — `typst` on PATH (>= MIN_TYPST_VERSION): the .pdf is typeset
//            from templates/resume.typ instead of pdfmake. One .pdf per
//            document, always.
//
// Usage:
//   node scripts/export-documents.mjs <input.md> [<input2.md> ...]
//
// Outputs land next to each input. The last stdout line is machine-readable
// (EXPORT_TIER=2 or EXPORT_TIER=3) so skills can report the tier without
// parsing prose.

import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { MarkdownIt, docx, pdfMake } from "./vendor/export-deps.mjs";

const {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  LevelFormat,
  LineRuleType,
  Packer,
  Paragraph,
  TextRun,
  UnderlineType,
} = docx;

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "..");
const TEMPLATES_DIR = join(REPO_ROOT, "templates");
const FONTS_DIR = join(TEMPLATES_DIR, "fonts");

// Minimum Typst version for Tier 3. block(sticky:) — our keep-with-next —
// needs 0.11; pin a little above it so behavior is predictable.
export const MIN_TYPST_VERSION = "0.12.0";

// --------------------------------------------------------------------------
// Design tokens — single-column serif with restrained navy accent. Shared
// with templates/preview-template.html and templates/resume.typ.
// --------------------------------------------------------------------------

const NAVY = "2C5F8A";
const TEXT = "2D2D2D";
const MUTED = "555566";

// DOCX and HTML name Georgia (installed on effectively all Mac/Windows
// machines). PDFs embed the vendored Gelasio, Georgia's metric-compatible
// open twin, so PDF bytes render identically everywhere.
const FONT = "Georgia";

const BODY_SIZE_PT = 10.5;
const LINE_SPACING = 1.35;

// Anything that survives copy-paste from web/Word but trips ATS parsers.
const UNICODE_REPLACEMENTS = {
  "—": "-", // em-dash
  "–": "-", // en-dash
  "“": '"', // left double quote
  "”": '"', // right double quote
  "‘": "'", // left single quote
  "’": "'", // right single quote
  "…": "...", // ellipsis
  " ": " ", // non-breaking space
};
const ZERO_WIDTH_RE = /[​‌‍﻿]/g;
const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n[\r\n]*/;
const HTML_COMMENT_RE = /<!--[\s\S]*?-->/;
const ASK_VERIFY_RE = /\[(ASK|VERIFY):[^\]]+\]/g;
const BRACKET_PLACEHOLDER_RE = /(?<!\!)\[(?![ xX]\])([^\]\n]{2,120})\](?!\()/g;
const YEAR_TBD_RE = /\byear TBD\b/i;

// --------------------------------------------------------------------------
// Markdown preprocessing — ported 1:1 from the former Python pipeline.
// --------------------------------------------------------------------------

export function normalizeUnicode(text) {
  for (const [k, v] of Object.entries(UNICODE_REPLACEMENTS)) {
    text = text.split(k).join(v);
  }
  return text.replace(ZERO_WIDTH_RE, "");
}

export function stripFrontmatter(text) {
  return text.replace(FRONTMATTER_RE, "");
}

export function findRenderBlockers(text, kind) {
  let body = stripFrontmatter(normalizeUnicode(text));
  const blockers = [];

  if (HTML_COMMENT_RE.test(body)) {
    blockers.push("HTML comments/template notes are still present");
    body = body.replace(new RegExp(HTML_COMMENT_RE.source, "g"), "");
  }

  if (YEAR_TBD_RE.test(body)) {
    blockers.push("unresolved placeholder: year TBD");
  }

  for (const match of body.matchAll(ASK_VERIFY_RE)) {
    blockers.push(`unresolved ${match[1].toUpperCase()} marker: ${match[0]}`);
  }

  // Resume/CV/contact markdown legitimately uses [Link Text](url). The
  // regex excludes those, so any remaining bracket token is almost
  // certainly a template placeholder that should not ship to DOCX/PDF.
  for (const match of body.matchAll(BRACKET_PLACEHOLDER_RE)) {
    blockers.push(`unresolved bracket placeholder: [${match[1].trim()}]`);
  }

  return [...new Set(blockers)];
}

export function validateMarkdownForRender(text, kind) {
  const blockers = findRenderBlockers(text, kind);
  if (blockers.length) {
    throw new Error(
      `${kind} markdown is not ready to render: ${blockers.join("; ")}`,
    );
  }
}

// Same contract as the prior parsers: line 1 = '# Name', next non-empty
// line = contact, body starts after the first '---' divider.
export function parseResumeSections(markdown) {
  const lines = markdown.split("\n");
  const h1 = /^#\s+(.+?)\s*$/.exec(lines[0] ?? "");
  if (!h1) {
    throw new Error(
      "First line must be an h1 with the name, e.g. '# Sarah Chen'",
    );
  }
  const name = h1[1];

  let i = 1;
  while (i < lines.length && lines[i].trim() === "") i += 1;
  if (i >= lines.length) throw new Error("No contact line found after name");
  const contact = lines[i].trim();

  let divider = -1;
  for (let j = i + 1; j < lines.length; j += 1) {
    if (lines[j].trim() === "---") {
      divider = j;
      break;
    }
  }
  if (divider === -1) {
    throw new Error("No '---' divider found after contact line");
  }

  const body = lines
    .slice(divider + 1)
    .join("\n")
    .replace(/^\n+/, "");
  return { name, contact, body };
}

export function pickKind(inputPath) {
  const base = basename(String(inputPath)).toLowerCase();
  if (base.startsWith("coverletter")) return "coverletter";
  if (base.startsWith("cv")) return "cv";
  return "resume";
}

// --------------------------------------------------------------------------
// Markdown tokenization — markdown-it, the JS original of the markdown-it-py
// parser the Python pipeline used. Resume markdown is a constrained subset
// of CommonMark: h2/h3 sections, paragraphs, single-level bullets, **bold**,
// *italic*, [links](url), and the trailing-two-spaces hardbreak idiom.
// --------------------------------------------------------------------------

const md = new MarkdownIt("commonmark", { breaks: false, html: false });

function parseContactInline(contact) {
  const tokens = md.parseInline(contact, {});
  return tokens.length ? tokens[0].children ?? [] : [];
}

// Section headers render uppercase. CSS does this with text-transform; the
// other formats have no reliable equivalent, so uppercase the source text.
function uppercaseTextTokens(inlineTokens) {
  return inlineTokens.map((tok) => {
    if (tok.type !== "text") return tok;
    const copy = Object.assign(Object.create(Object.getPrototypeOf(tok)), tok);
    copy.content = tok.content.toUpperCase();
    return copy;
  });
}

// Generic inline walker: calls `emit` handlers with running bold/italic/link
// state. Shared by every renderer so formatting semantics never drift.
function walkInline(inlineTokens, emit) {
  let bold = false;
  let italic = false;
  let linkUrl = null;

  for (const tok of inlineTokens) {
    switch (tok.type) {
      case "text":
        if (tok.content !== "") emit.text(tok.content, { bold, italic, linkUrl });
        break;
      case "softbreak":
        emit.text(" ", { bold, italic, linkUrl });
        break;
      case "hardbreak":
        emit.hardbreak();
        break;
      case "strong_open":
        bold = true;
        break;
      case "strong_close":
        bold = false;
        break;
      case "em_open":
        italic = true;
        break;
      case "em_close":
        italic = false;
        break;
      case "link_open":
        linkUrl = tok.attrGet("href") ?? "";
        break;
      case "link_close":
        linkUrl = null;
        break;
      case "code_inline":
        // Resumes don't really use code spans, but tolerate them.
        if (tok.content !== "") emit.text(tok.content, { bold, italic, linkUrl });
        break;
      default:
        // Skip image, html_inline — not used in resume markdown.
        break;
    }
  }
}

// Generic block walker mirroring the former Python walkers: h2/h3, the
// company line right after an h3, body/cover paragraphs, single-level
// bullet lists, and hr.
function walkBlocks(tokens, coverLetter, emit) {
  let afterH3 = false;
  let i = 0;
  const n = tokens.length;
  while (i < n) {
    const tok = tokens[i];

    if (tok.type === "heading_open") {
      const level = Number(tok.tag.slice(1));
      const children = tokens[i + 1].children ?? [];
      if (level === 2) {
        emit.h2(children);
        afterH3 = false;
      } else {
        emit.h3(children);
        afterH3 = true;
      }
      i += 3; // heading_open, inline, heading_close
    } else if (tok.type === "paragraph_open") {
      const children = tokens[i + 1].children ?? [];
      if (afterH3) {
        emit.companyLine(children);
        afterH3 = false;
      } else if (coverLetter) {
        emit.coverPara(children);
      } else {
        emit.bodyPara(children);
      }
      i += 3;
    } else if (tok.type === "bullet_list_open") {
      afterH3 = false;
      const items = [];
      i += 1;
      while (i < n && tokens[i].type !== "bullet_list_close") {
        if (tokens[i].type === "list_item_open") {
          let j = i + 1;
          while (j < n && tokens[j].type !== "list_item_close") {
            if (tokens[j].type === "paragraph_open") {
              items.push(tokens[j + 1].children ?? []);
              j += 3;
            } else {
              j += 1;
            }
          }
          i = j; // at list_item_close
        }
        i += 1;
      }
      emit.bullets(items);
      i += 1; // consume bullet_list_close
    } else if (tok.type === "hr") {
      emit.hr();
      i += 1;
    } else {
      i += 1;
    }
  }
}

// --------------------------------------------------------------------------
// HTML preview — fills templates/preview-template.html, the single source
// of truth shared with the no-Node Claude fallback (Tier 1).
// --------------------------------------------------------------------------

function escapeHtml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderInlineHtml(inlineTokens) {
  const parts = [];
  let openTags = [];

  const sync = (state) => {
    const wanted = [];
    if (state.linkUrl != null) wanted.push({ name: "a", value: state.linkUrl });
    if (state.bold) wanted.push({ name: "strong", value: null });
    if (state.italic) wanted.push({ name: "em", value: null });

    let shared = 0;
    while (
      shared < openTags.length &&
      shared < wanted.length &&
      openTags[shared].name === wanted[shared].name &&
      openTags[shared].value === wanted[shared].value
    ) {
      shared += 1;
    }

    for (let i = openTags.length - 1; i >= shared; i -= 1) {
      parts.push(`</${openTags[i].name}>`);
    }
    for (let i = shared; i < wanted.length; i += 1) {
      const tag = wanted[i];
      parts.push(
        tag.name === "a"
          ? `<a href="${escapeHtml(tag.value)}">`
          : `<${tag.name}>`,
      );
    }
    openTags = wanted;
  };

  walkInline(inlineTokens, {
    text(content, state) {
      sync(state);
      parts.push(escapeHtml(content));
    },
    hardbreak() {
      parts.push("<br>");
    },
  });
  sync({ bold: false, italic: false, linkUrl: null });
  return parts.join("");
}

function renderBodyHtml(tokens, coverLetter) {
  const parts = [];
  walkBlocks(tokens, coverLetter, {
    h2(children) {
      parts.push(`<h2>${renderInlineHtml(uppercaseTextTokens(children))}</h2>`);
    },
    h3(children) {
      parts.push(`<h3>${renderInlineHtml(children)}</h3>`);
    },
    companyLine(children) {
      parts.push(`<p class="company-line">${renderInlineHtml(children)}</p>`);
    },
    coverPara(children) {
      parts.push(`<p class="cover-para">${renderInlineHtml(children)}</p>`);
    },
    bodyPara(children) {
      parts.push(`<p class="body-para">${renderInlineHtml(children)}</p>`);
    },
    bullets(items) {
      parts.push("<ul>");
      for (const item of items) parts.push(`<li>${renderInlineHtml(item)}</li>`);
      parts.push("</ul>");
    },
    hr() {
      parts.push("<hr>");
    },
  });
  return parts.join("\n");
}

export function buildHtml(name, contact, bodyMd, kind) {
  const template = readFileSync(
    join(TEMPLATES_DIR, "preview-template.html"),
    "utf8",
  );
  const contactHtml = renderInlineHtml(parseContactInline(contact));
  const bodyHtml = renderBodyHtml(md.parse(bodyMd, {}), kind === "coverletter");
  return template
    .replaceAll("{{name}}", escapeHtml(name))
    .replace("{{contact}}", contactHtml)
    .replace("{{body}}", bodyHtml);
}

// --------------------------------------------------------------------------
// DOCX — `docx` npm lib. Ports the former Python emitters: four-slot font
// setting, navy h2 with 0.5pt bottom border + tracking + uppercase,
// h3/company-line/bullet/cover spacing, real external hyperlinks,
// keep-with-next.
// --------------------------------------------------------------------------

// All four font slots (ascii/hAnsi/eastAsia/cs) point at Georgia. Without
// eastAsia, some viewers fall back to Times for any character that happens
// to land in the East-Asian Unicode range.
const FONT_SLOTS = { ascii: FONT, hAnsi: FONT, eastAsia: FONT, cs: FONT };

const PT = (n) => n * 2; // TextRun size is in half-points
const TWIP = (pt) => Math.round(pt * 20);
const IN_TWIP = (inches) => Math.round(inches * 1440);

function navyBottomBorder(sizeEighths = 4, color = NAVY) {
  // Hairline bottom border — 4 eighths = 0.5pt, the value used for both
  // the contact rule and section underlines.
  return {
    bottom: { style: BorderStyle.SINGLE, size: sizeEighths, space: 1, color },
  };
}

function docxRuns(inlineTokens, { color, size, spacingTwips } = {}) {
  const children = [];
  walkInline(inlineTokens, {
    text(content, { bold, italic, linkUrl }) {
      const style = {
        font: FONT_SLOTS,
        bold: bold || undefined,
        italics: italic || undefined,
        size: size !== undefined ? PT(size) : undefined,
        color,
        characterSpacing: spacingTwips,
      };
      if (linkUrl !== null && linkUrl !== undefined) {
        children.push(
          new ExternalHyperlink({
            link: linkUrl,
            children: [
              new TextRun({
                ...style,
                text: content,
                underline: { type: UnderlineType.SINGLE },
              }),
            ],
          }),
        );
      } else {
        children.push(new TextRun({ ...style, text: content }));
      }
    },
    hardbreak() {
      children.push(new TextRun({ font: FONT_SLOTS, size: size !== undefined ? PT(size) : undefined, color, break: 1 }));
    },
  });
  return children;
}

function buildDocxChildren(name, contact, bodyTokens, coverLetter) {
  const children = [];

  // Header: 22pt navy name, muted 10pt contact with a navy hairline.
  children.push(
    new Paragraph({
      spacing: { after: TWIP(2) },
      children: [
        new TextRun({
          text: name,
          font: FONT_SLOTS,
          size: PT(22),
          bold: true,
          color: NAVY,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: TWIP(7) },
      border: navyBottomBorder(),
      children: docxRuns(parseContactInline(contact), {
        color: MUTED,
        size: 10,
      }),
    }),
  );

  walkBlocks(bodyTokens, coverLetter, {
    h2(inline) {
      children.push(
        new Paragraph({
          spacing: { before: TWIP(13), after: TWIP(4) },
          keepNext: true,
          border: navyBottomBorder(),
          // Tracking — letter-spacing 0.06em ~= 0.65pt at 10.5pt body
          // (13 twentieths of a point).
          children: boldenHeadingRuns(uppercaseTextTokens(inline), {
            color: NAVY,
            size: 10.5,
            spacingTwips: 13,
          }),
        }),
      );
    },
    h3(inline) {
      // h3 is always bold and never picks up the navy accent.
      children.push(
        new Paragraph({
          spacing: { before: TWIP(7), after: TWIP(1) },
          keepNext: true,
          children: boldenHeadingRuns(inline, { color: TEXT, size: 11 }),
        }),
      );
    },
    companyLine(inline) {
      // 'Jan 2022 - Present · Remote' — smaller and muted.
      children.push(
        new Paragraph({
          spacing: { after: TWIP(3) },
          children: docxRuns(inline, { color: MUTED, size: 10 }),
        }),
      );
    },
    coverPara(inline) {
      children.push(
        new Paragraph({ spacing: { after: TWIP(10) }, children: docxRuns(inline) }),
      );
    },
    bodyPara(inline) {
      children.push(
        new Paragraph({ spacing: { after: TWIP(5) }, children: docxRuns(inline) }),
      );
    },
    bullets(items) {
      for (const item of items) {
        children.push(
          new Paragraph({
            numbering: { reference: "resume-bullets", level: 0 },
            spacing: { after: TWIP(2.5) },
            children: docxRuns(item),
          }),
        );
      }
    },
    hr() {
      children.push(
        new Paragraph({
          spacing: { after: 0 },
          border: navyBottomBorder(2),
          children: [],
        }),
      );
    },
  });

  return children;
}

// Bold overrides for h2/h3: docxRuns emits bold only when the markdown has
// **strong**; headings are always bold. Wrap: easiest is to post-process at
// construction time, so headings pass bold through a dedicated helper.
function boldenHeadingRuns(inline, opts) {
  const runs = [];
  walkInline(inline, {
    text(content, { italic, linkUrl }) {
      const style = {
        font: FONT_SLOTS,
        bold: true,
        italics: italic || undefined,
        size: opts.size !== undefined ? PT(opts.size) : undefined,
        color: opts.color,
        characterSpacing: opts.spacingTwips,
      };
      if (linkUrl != null) {
        runs.push(
          new ExternalHyperlink({
            link: linkUrl,
            children: [
              new TextRun({
                ...style,
                text: content,
                underline: { type: UnderlineType.SINGLE },
              }),
            ],
          }),
        );
      } else {
        runs.push(new TextRun({ ...style, text: content }));
      }
    },
    hardbreak() {
      runs.push(new TextRun({ font: FONT_SLOTS, size: opts.size !== undefined ? PT(opts.size) : undefined, color: opts.color, break: 1 }));
    },
  });
  return runs;
}

export async function buildDocxBuffer(name, contact, bodyMd, kind) {
  const bodyTokens = md.parse(bodyMd, {});
  const children = buildDocxChildren(
    name,
    contact,
    bodyTokens,
    kind === "coverletter",
  );

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_SLOTS,
            size: PT(BODY_SIZE_PT),
            color: TEXT,
          },
          paragraph: {
            spacing: {
              line: Math.round(LINE_SPACING * 240),
              lineRule: LineRuleType.AUTO,
              before: 0,
              after: TWIP(5),
            },
          },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: "resume-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: IN_TWIP(0.22), hanging: IN_TWIP(0.11) },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: IN_TWIP(8.5), height: IN_TWIP(11) },
            margin: {
              top: IN_TWIP(0.5),
              bottom: IN_TWIP(0.5),
              left: IN_TWIP(0.55),
              right: IN_TWIP(0.55),
            },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

// --------------------------------------------------------------------------
// PDF via pdfmake — the Tier 2 baseline. Mirrors the same tokens; embeds
// the vendored Gelasio so output is font-deterministic on every platform.
// Fidelity target: correct margins/sizes/colors/page breaks. Typst (Tier 3)
// owns typographic polish.
// --------------------------------------------------------------------------

const PAGE_WIDTH_PT = 612; // Letter
const MARGIN_X_PT = 0.55 * 72;
const MARGIN_Y_PT = 0.5 * 72;
const CONTENT_WIDTH_PT = PAGE_WIDTH_PT - 2 * MARGIN_X_PT;

// pdfmake's lineHeight multiplies the font's natural line height. The DOCX
// renders in Word with Georgia (natural height 1.136em) at "multiple 1.35"
// = a 1.533em baseline pitch; the PDF embeds Gelasio, whose natural height
// is 1.2695em. 1.533 / 1.2695 keeps the same 16.1pt pitch at 10.5pt body,
// which is what makes page breaks match the DOCX (issue #31 bake-off).
const PDF_LINE_HEIGHT = (LINE_SPACING * 1.136) / 1.2695;

let pdfmakeConfigured = false;

function configurePdfmake() {
  if (pdfmakeConfigured) return;
  const b64 = (file) => readFileSync(join(FONTS_DIR, file)).toString("base64");
  pdfMake.addVirtualFileSystem({
    "Gelasio-Regular.ttf": b64("Gelasio-Regular.ttf"),
    "Gelasio-Bold.ttf": b64("Gelasio-Bold.ttf"),
    "Gelasio-Italic.ttf": b64("Gelasio-Italic.ttf"),
    "Gelasio-BoldItalic.ttf": b64("Gelasio-BoldItalic.ttf"),
  });
  pdfMake.setFonts({
    Gelasio: {
      normal: "Gelasio-Regular.ttf",
      bold: "Gelasio-Bold.ttf",
      italics: "Gelasio-Italic.ttf",
      bolditalics: "Gelasio-BoldItalic.ttf",
    },
  });
  pdfmakeConfigured = true;
}

function pdfInline(inlineTokens, { color, size, bold: forceBold } = {}) {
  const parts = [];
  walkInline(inlineTokens, {
    text(content, { bold, italic, linkUrl }) {
      const node = { text: content };
      if (forceBold || bold) node.bold = true;
      if (italic) node.italics = true;
      if (color) node.color = `#${color}`;
      if (size) node.fontSize = size;
      if (linkUrl != null) {
        node.link = linkUrl;
        node.decoration = "underline";
      }
      parts.push(node);
    },
    hardbreak() {
      parts.push({ text: "\n" });
    },
  });
  return parts;
}

function navyRule(widthPt, lineWidth, marginBottom) {
  return {
    canvas: [
      {
        type: "line",
        x1: 0,
        y1: 0,
        x2: widthPt,
        y2: 0,
        lineWidth,
        lineColor: `#${NAVY}`,
      },
    ],
    margin: [0, 0, 0, marginBottom],
  };
}

function buildPdfDocDefinition(name, contact, bodyMd, kind) {
  const content = [];

  content.push({
    text: name,
    fontSize: 22,
    bold: true,
    color: `#${NAVY}`,
    margin: [0, 0, 0, 2],
  });
  content.push({
    text: pdfInline(parseContactInline(contact)),
    fontSize: 10,
    color: `#${MUTED}`,
    margin: [0, 0, 0, 2],
  });
  content.push(navyRule(CONTENT_WIDTH_PT, 0.5, 7));

  walkBlocks(md.parse(bodyMd, {}), kind === "coverletter", {
    h2(inline) {
      // Header text + hairline as sibling nodes, both tagged headlineLevel
      // so the keep-with-next pageBreakBefore rule below treats them as one
      // sticky unit (a stack would hide the tag from its children).
      content.push({
        headlineLevel: 1,
        text: pdfInline(uppercaseTextTokens(inline), { bold: true }),
        fontSize: 10.5,
        color: `#${NAVY}`,
        characterSpacing: 0.63, // 0.06em at 10.5pt
        margin: [0, 13, 0, 1],
      });
      content.push({ ...navyRule(CONTENT_WIDTH_PT, 0.5, 4), headlineLevel: 1 });
    },
    h3(inline) {
      content.push({
        headlineLevel: 1,
        text: pdfInline(inline, { bold: true }),
        fontSize: 11,
        margin: [0, 7, 0, 1],
      });
    },
    companyLine(inline) {
      content.push({
        text: pdfInline(inline),
        fontSize: 9.75,
        italics: true,
        color: `#${MUTED}`,
        margin: [0, 0, 0, 3],
      });
    },
    coverPara(inline) {
      content.push({ text: pdfInline(inline), margin: [0, 0, 0, 10] });
    },
    bodyPara(inline) {
      content.push({ text: pdfInline(inline), margin: [0, 0, 0, 5] });
    },
    bullets(items) {
      content.push({
        ul: items.map((item) => ({
          text: pdfInline(item),
          margin: [0, 0, 0, 2.5],
        })),
        markerColor: `#${TEXT}`,
        margin: [7, 0, 0, 0],
      });
    },
    hr() {
      content.push(navyRule(CONTENT_WIDTH_PT, 0.25, 6));
    },
  });

  return {
    pageSize: "LETTER",
    pageMargins: [MARGIN_X_PT, MARGIN_Y_PT, MARGIN_X_PT, MARGIN_Y_PT],
    defaultStyle: {
      font: "Gelasio",
      fontSize: BODY_SIZE_PT,
      lineHeight: PDF_LINE_HEIGHT,
      color: `#${TEXT}`,
    },
    // Keep-with-next: never leave a section/role header stranded at the
    // bottom of a page. A header breaks to the next page when nothing but
    // other header nodes (its own underline rule) follows it on the page.
    pageBreakBefore: (node, ctx) =>
      node.headlineLevel === 1 &&
      ctx
        .getFollowingNodesOnPage()
        .every((following) => following.headlineLevel === 1),
    content,
  };
}

export async function buildPdfmakeBuffer(name, contact, bodyMd, kind) {
  configurePdfmake();
  const dd = buildPdfDocDefinition(name, contact, bodyMd, kind);
  const buffer = await pdfMake.createPdf(dd).getBuffer();
  return Buffer.from(buffer);
}

// --------------------------------------------------------------------------
// PDF via Typst — Tier 3. The generated .typ carries only content; all
// styling lives in the code-reviewed templates/resume.typ.
// --------------------------------------------------------------------------

// Escape everything Typst markup could interpret: strong/emph markers,
// headings, refs/labels, comments, shorthand dashes, code, math, functions.
const TYPST_ESCAPE_RE = /[\\#$*_`\[\]<>@\/~\-]/g;

function typstEscape(s) {
  return s.replace(TYPST_ESCAPE_RE, (c) => `\\${c}`);
}

function typstString(s) {
  return `"${s.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

function typstInline(inlineTokens) {
  const parts = [];
  walkInline(inlineTokens, {
    text(content, { bold, italic, linkUrl }) {
      let piece = typstEscape(content);
      if (italic) piece = `#emph[${piece}]`;
      if (bold) piece = `#strong[${piece}]`;
      if (linkUrl != null) piece = `#link(${typstString(linkUrl)})[${piece}]`;
      parts.push(piece);
    },
    hardbreak() {
      parts.push("#linebreak()");
    },
  });
  return parts.join("");
}

export function buildTypstSource(name, contact, bodyMd, kind) {
  const lines = [
    "// Generated by scripts/export-documents.mjs — do not edit.",
    '#import "resume.typ": *',
    "#show: setup",
    `#header([${typstEscape(name)}], [${typstInline(parseContactInline(contact))}])`,
  ];

  walkBlocks(md.parse(bodyMd, {}), kind === "coverletter", {
    h2(inline) {
      lines.push(`#section[${typstInline(inline)}]`);
    },
    h3(inline) {
      lines.push(`#role[${typstInline(inline)}]`);
    },
    companyLine(inline) {
      lines.push(`#role-meta[${typstInline(inline)}]`);
    },
    coverPara(inline) {
      lines.push(`#cover-para[${typstInline(inline)}]`);
    },
    bodyPara(inline) {
      lines.push(`#para[${typstInline(inline)}]`);
    },
    bullets(items) {
      const args = items.map((item) => `[${typstInline(item)}]`).join(", ");
      lines.push(`#bullets(${args})`);
    },
    hr() {
      lines.push("#divider()");
    },
  });

  return lines.join("\n") + "\n";
}

export function compileTypstToPdf(typSource, outPath, typstBin = "typst") {
  const workDir = mkdtempSync(join(tmpdir(), "job-hunt-export-"));
  try {
    copyFileSync(join(TEMPLATES_DIR, "resume.typ"), join(workDir, "resume.typ"));
    const genPath = join(workDir, "document.typ");
    const pdfPath = join(workDir, "document.pdf");
    writeFileSync(genPath, typSource, "utf8");
    execFileSync(
      typstBin,
      ["compile", "--font-path", FONTS_DIR, genPath, pdfPath],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    copyFileSync(pdfPath, outPath);
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

// --------------------------------------------------------------------------
// Tier detection
// --------------------------------------------------------------------------

function compareVersions(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i += 1) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
  }
  return 0;
}

// Detect `typst` on PATH (all three installers — brew, winget, snap — put
// it there) and check the version floor.
export function detectTypst({ bin = "typst" } = {}) {
  let out;
  try {
    out = execFileSync(bin, ["--version"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch {
    return { present: false };
  }
  const m = out.match(/(\d+\.\d+\.\d+)/);
  if (!m) return { present: false };
  const version = m[1];
  return {
    present: true,
    version,
    supported: compareVersions(version, MIN_TYPST_VERSION) >= 0,
  };
}

// --------------------------------------------------------------------------
// Pipeline
// --------------------------------------------------------------------------

function withSuffix(path, ext) {
  return path.replace(/\.[^./\\]+$/, "") + ext;
}

function commitOutputSet(entries, stageDir) {
  const prepared = entries.map(({ staged, final }) => ({
    staged,
    final,
    backup: join(stageDir, `${basename(final)}.previous`),
    hadPrevious: false,
    installed: false,
  }));

  try {
    for (const entry of prepared) {
      if (existsSync(entry.final)) {
        renameSync(entry.final, entry.backup);
        entry.hadPrevious = true;
      }
    }
    for (const entry of prepared) {
      renameSync(entry.staged, entry.final);
      entry.installed = true;
    }
  } catch (error) {
    for (const entry of prepared) {
      if (entry.installed) rmSync(entry.final, { force: true });
    }
    for (const entry of prepared) {
      if (entry.hadPrevious && existsSync(entry.backup)) {
        renameSync(entry.backup, entry.final);
      }
    }
    throw error;
  }
}

export async function exportDocument(inputPath, typst) {
  const raw0 = readFileSync(inputPath, "utf8");
  const kind = pickKind(inputPath);
  validateMarkdownForRender(raw0, kind);
  const raw = normalizeUnicode(stripFrontmatter(raw0));
  const { name, contact, body } = parseResumeSections(raw);

  const htmlPath = withSuffix(inputPath, ".html");
  const docxPath = withSuffix(inputPath, ".docx");
  const pdfPath = withSuffix(inputPath, ".pdf");
  const written = [htmlPath, docxPath, pdfPath];
  const stageDir = mkdtempSync(
    join(dirname(inputPath), ".tmp-job-hunt-export-"),
  );

  try {
    const stagedHtml = join(stageDir, basename(htmlPath));
    const stagedDocx = join(stageDir, basename(docxPath));
    const stagedPdf = join(stageDir, basename(pdfPath));

    writeFileSync(stagedHtml, buildHtml(name, contact, body, kind), "utf8");
    writeFileSync(
      stagedDocx,
      await buildDocxBuffer(name, contact, body, kind),
    );

    // One .pdf per document, always: Typst when available, pdfmake otherwise.
    if (typst.present && typst.supported) {
      compileTypstToPdf(
        buildTypstSource(name, contact, body, kind),
        stagedPdf,
        typst.bin ?? "typst",
      );
    } else {
      writeFileSync(
        stagedPdf,
        await buildPdfmakeBuffer(name, contact, body, kind),
      );
    }

    commitOutputSet([
      { staged: stagedHtml, final: htmlPath },
      { staged: stagedDocx, final: docxPath },
      { staged: stagedPdf, final: pdfPath },
    ], stageDir);
  } finally {
    rmSync(stageDir, { recursive: true, force: true });
  }

  return written;
}

export async function main(argv) {
  const inputs = argv.filter((a) => a !== "--");
  if (!inputs.length) {
    process.stderr.write(
      "Usage: node scripts/export-documents.mjs <input.md> [<input2.md> ...]\n",
    );
    return 2;
  }

  const typst = detectTypst();
  if (typst.present && !typst.supported) {
    process.stderr.write(
      `typst ${typst.version} found but ${MIN_TYPST_VERSION}+ is required — ` +
        "using the built-in PDF renderer instead. Upgrade typst to get the " +
        "typeset PDF.\n",
    );
  }

  let anyFailed = false;
  for (const rawInput of inputs) {
    const inputPath = resolve(rawInput);
    let written;
    try {
      written = await exportDocument(inputPath, typst);
    } catch (err) {
      anyFailed = true;
      const msg = err?.code === "ENOENT" && err?.path === inputPath
        ? "file not found"
        : err?.message ?? String(err);
      process.stderr.write(
        `Failed to export ${inputPath}: ${msg}. ` +
          "If this is a markdown-not-ready error, fix the markdown and rerun.\n",
      );
      continue;
    }
    for (const path of written) {
      process.stdout.write(`Wrote ${path}\n`);
    }
  }

  const tier = typst.present && typst.supported ? 3 : 2;
  if (tier === 2) {
    process.stdout.write(
      "\nPDF rendered with the built-in renderer. Installing Typst (one " +
        "command, ~50MB) upgrades it to the typeset version:\n" +
        "  macOS:   brew install typst\n" +
        "  Windows: winget install --id Typst.Typst\n" +
        "  Linux:   snap install typst\n",
    );
  }
  process.stdout.write(`EXPORT_TIER=${tier}\n`);
  return anyFailed ? 1 : 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}
