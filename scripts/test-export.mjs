// Unit tests for scripts/export-documents.mjs.
//
// Run with:  node --test scripts/test-export.mjs   (or: npm run test:export)
//
// Ports scripts/test_generate_docx.py to node:test. Covers the parser +
// preprocessing layer, DOCX assertions via zip + XML inspection (no Word
// needed), HTML snapshot checks, the pdfmake PDF path, tier detection with
// stubbed binaries, and — when `typst` is on PATH (always in CI) — the
// Tier 3 typeset path.

import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test, describe, before, after } from "node:test";
import { inflateRawSync } from "node:zlib";

import {
  MIN_TYPST_VERSION,
  buildDocxBuffer,
  buildHtml,
  buildPdfmakeBuffer,
  buildTypstSource,
  compileTypstToPdf,
  detectTypst,
  findRenderBlockers,
  normalizeUnicode,
  parseResumeSections,
  pickKind,
  stripFrontmatter,
} from "./export-documents.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const EXPORT_SCRIPT = join(SCRIPT_DIR, "export-documents.mjs");

const SAMPLE_RESUME = `# Sarah Chen

sarah.chen@email.com · [LinkedIn](https://linkedin.com/in/sarahchen) · San Francisco, CA

---

## Experience

### Marketing Manager — TechStartup Inc.
*Jan 2022 – Present* · San Francisco, CA

- Did things, **with impact**
- Did *more* things
`;

// Minimal zip reader — enough to pull word/document.xml out of a DOCX
// buffer without any dependency. Walks local file headers.
function readZipEntry(buffer, wantedName) {
  let offset = 0;
  while (offset < buffer.length - 4) {
    if (buffer.readUInt32LE(offset) !== 0x04034b50) break;
    const method = buffer.readUInt16LE(offset + 8);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const nameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const name = buffer
      .subarray(offset + 30, offset + 30 + nameLength)
      .toString("utf8");
    const dataStart = offset + 30 + nameLength + extraLength;
    const data = buffer.subarray(dataStart, dataStart + compressedSize);
    if (name === wantedName) {
      return method === 0 ? data : inflateRawSync(data);
    }
    offset = dataStart + compressedSize;
  }
  throw new Error(`${wantedName} not found in zip`);
}

async function docxXml(markdown, kind = "resume") {
  const normalized = normalizeUnicode(markdown);
  const { name, contact, body } = parseResumeSections(normalized);
  const buffer = await buildDocxBuffer(name, contact, body, kind);
  return {
    buffer,
    documentXml: readZipEntry(buffer, "word/document.xml").toString("utf8"),
  };
}

describe("normalizeUnicode", () => {
  test("em dash", () => {
    assert.equal(normalizeUnicode("a — b"), "a - b");
  });
  test("en dash", () => {
    assert.equal(normalizeUnicode("2022 – 2024"), "2022 - 2024");
  });
  test("smart double quotes", () => {
    assert.equal(normalizeUnicode("“hello”"), '"hello"');
  });
  test("smart single quotes", () => {
    assert.equal(normalizeUnicode("it’s"), "it's");
  });
  test("ellipsis", () => {
    assert.equal(normalizeUnicode("wait…"), "wait...");
  });
  test("zero width space", () => {
    assert.equal(normalizeUnicode("a​b"), "ab");
  });
  test("zwj and zwnj", () => {
    assert.equal(normalizeUnicode("a‌b‍c"), "abc");
  });
  test("bom", () => {
    assert.equal(normalizeUnicode("﻿title"), "title");
  });
  test("nbsp", () => {
    assert.equal(normalizeUnicode("a b"), "a b");
  });
  test("plain ascii untouched", () => {
    assert.equal(normalizeUnicode("Hello, world."), "Hello, world.");
  });
});

describe("stripFrontmatter", () => {
  test("strips yaml block", () => {
    const text = "---\nversion: 3\nupdated: 2026-04-08\n---\n# Name\n";
    assert.equal(stripFrontmatter(text), "# Name\n");
  });
  test("consumes blank lines after frontmatter", () => {
    assert.equal(stripFrontmatter("---\nversion: 1\n---\n\n\n# Name\n"), "# Name\n");
  });
  test("no frontmatter passthrough", () => {
    const text = "# Name\n\ncontact\n";
    assert.equal(stripFrontmatter(text), text);
  });
  test("only strips first block", () => {
    const out = stripFrontmatter("---\nversion: 1\n---\n# Name\n\n---\n\nbody");
    assert.ok(out.startsWith("# Name"));
    assert.ok(out.includes("---")); // the body divider survives
  });
});

describe("parseResumeSections", () => {
  test("extracts name", () => {
    assert.equal(parseResumeSections(SAMPLE_RESUME).name, "Sarah Chen");
  });
  test("extracts contact", () => {
    const { contact } = parseResumeSections(SAMPLE_RESUME);
    assert.ok(contact.includes("sarah.chen@email.com"));
    assert.ok(contact.includes("[LinkedIn]"));
  });
  test("body starts after divider", () => {
    assert.ok(parseResumeSections(SAMPLE_RESUME).body.startsWith("## Experience"));
  });
  test("handles blank lines between name and contact", () => {
    const { name, contact, body } = parseResumeSections(
      "# Name\n\n\nemail@x.com\n\n---\n\nbody",
    );
    assert.equal(name, "Name");
    assert.equal(contact, "email@x.com");
    assert.equal(body.trim(), "body");
  });
  test("missing h1 throws", () => {
    assert.throws(() => parseResumeSections("no heading\n"), /name/);
  });
  test("missing divider throws", () => {
    assert.throws(
      () => parseResumeSections("# Name\n\ncontact\n\nbody no divider\n"),
      /divider/,
    );
  });
});

describe("pickKind", () => {
  test("resume", () => {
    assert.equal(pickKind("my-documents/resume.md"), "resume");
  });
  test("coverletter", () => {
    assert.equal(pickKind("my-documents/coverletter.md"), "coverletter");
  });
  test("cv", () => {
    assert.equal(pickKind("my-documents/cv.md"), "cv");
  });
  test("case insensitive", () => {
    assert.equal(pickKind("/abs/CoverLetter.md"), "coverletter");
    assert.equal(pickKind("/abs/CV.md"), "cv");
    assert.equal(pickKind("/abs/Resume.md"), "resume");
  });
  test("application subdir", () => {
    assert.equal(pickKind("my-documents/applications/acme/resume.md"), "resume");
    assert.equal(
      pickKind("my-documents/applications/acme/coverletter.md"),
      "coverletter",
    );
  });
});

describe("render validation", () => {
  test("allows markdown links", () => {
    const sample =
      "# Jane Doe\n\n" +
      "[jane@x.com](mailto:jane@x.com) · [LinkedIn](https://linkedin.com/in/jane)\n\n" +
      "---\n\n" +
      "Dear Hiring Team,\n\n" +
      "You're hiring a frontend engineer to improve accessibility across your product. " +
      "At Acme, I led the cleanup of a legacy component library and cut the number of " +
      "keyboard-navigation bugs by 40%.\n";
    assert.deepEqual(findRenderBlockers(sample, "coverletter"), []);
  });
  test("flags bracket placeholders", () => {
    const sample =
      "# [Your Name]\n\njane@x.com\n\n---\n\n[Date]\n\nDear [Hiring Team],\n";
    const blockers = findRenderBlockers(sample, "coverletter");
    assert.ok(blockers.includes("unresolved bracket placeholder: [Your Name]"));
    assert.ok(blockers.includes("unresolved bracket placeholder: [Date]"));
    assert.ok(blockers.includes("unresolved bracket placeholder: [Hiring Team]"));
  });
  test("flags comments and ask/verify markers", () => {
    const sample =
      "# Jane Doe\n\njane@x.com\n\n---\n\n" +
      "<!-- template note -->\n" +
      "[ASK: what was the result?]\n" +
      "[VERIFY: exact team size]\n" +
      "year TBD\n";
    const blockers = findRenderBlockers(sample, "resume");
    assert.ok(blockers.includes("HTML comments/template notes are still present"));
    assert.ok(
      blockers.includes("unresolved ASK marker: [ASK: what was the result?]"),
    );
    assert.ok(
      blockers.includes("unresolved VERIFY marker: [VERIFY: exact team size]"),
    );
    assert.ok(blockers.includes("unresolved placeholder: year TBD"));
  });
});

describe("DOCX build", () => {
  // Smoke tests that exercise the full md->docx pipeline. We inspect the
  // docx XML to verify content survived the round-trip; we don't verify
  // pixel-level styling (that's what visual review is for).
  let documentXml;
  before(async () => {
    ({ documentXml } = await docxXml(SAMPLE_RESUME));
  });

  test("contains name", () => {
    assert.ok(documentXml.includes("Sarah Chen"));
  });
  test("section header uppercased", () => {
    assert.ok(documentXml.includes("EXPERIENCE"));
  });
  test("contains company line", () => {
    assert.ok(documentXml.includes("TechStartup Inc."));
  });
  test("contains bullet text", () => {
    assert.ok(documentXml.includes("Did things"));
    assert.ok(documentXml.includes("with impact"));
  });
  test("em dash normalized", () => {
    assert.ok(!documentXml.includes("—"));
  });
  test("hyperlink emitted", () => {
    assert.ok(documentXml.includes("w:hyperlink"));
  });
  test("uses georgia font", () => {
    assert.ok(documentXml.includes("Georgia"));
  });
  test("no charter references", () => {
    assert.ok(!documentXml.includes("Charter"));
  });
  test("section header has bottom border", () => {
    assert.ok(documentXml.includes("w:pBdr"));
    assert.ok(documentXml.includes("w:bottom"));
  });
  test("keep-with-next on headings", () => {
    assert.ok(documentXml.includes("w:keepNext"));
  });

  test("cover letter paragraphs have extra spacing", async () => {
    const sample =
      "# Jane Doe\n\njane@x.com\n\n---\n\nDear Hiring Manager,\n\nI am writing about the role.\n";
    const { documentXml: xml } = await docxXml(sample, "coverletter");
    // 10pt space-after = 200 twips on cover body paragraphs.
    assert.ok(xml.includes('w:after="200"'));
  });
});

describe("HTML preview", () => {
  let html;
  before(() => {
    const normalized = normalizeUnicode(SAMPLE_RESUME);
    const { name, contact, body } = parseResumeSections(normalized);
    html = buildHtml(name, contact, body, "resume");
  });

  test("is a complete html document", () => {
    assert.ok(html.trimStart().startsWith("<!doctype html>"));
    assert.ok(html.includes("</html>"));
  });
  test("no unfilled template slots", () => {
    assert.ok(!html.includes("{{"));
  });
  test("contains name", () => {
    assert.ok(html.includes("Sarah Chen"));
  });
  test("section header uppercased", () => {
    assert.ok(html.includes("EXPERIENCE"));
  });
  test("company line class", () => {
    assert.ok(html.includes('class="company-line"'));
  });
  test("h3 role title", () => {
    assert.ok(html.includes("Marketing Manager"));
  });
  test("bullet list emitted as ul", () => {
    assert.ok(html.includes("<ul>"));
    assert.ok(html.includes("</ul>"));
    assert.ok(html.includes("Did things"));
  });
  test("bold inside bullet renders as strong", () => {
    assert.ok(html.includes("<strong>with impact</strong>"));
  });
  test("em inside bullet renders as em", () => {
    assert.ok(html.includes("<em>more</em>"));
  });
  test("em dash normalized", () => {
    assert.ok(!html.includes("—"));
  });
  test("link in contact renders as anchor", () => {
    assert.ok(html.includes('href="https://linkedin.com/in/sarahchen"'));
  });
  test("georgia in styles", () => {
    assert.ok(html.includes("Georgia"));
  });
  test("navy token in styles", () => {
    assert.ok(html.includes("#2C5F8A"));
  });

  test("escapes angle brackets and ampersands", () => {
    const sample =
      "# Jane <Doe>\n\njane@x.com\n\n---\n\n## Experience\n\nWorked on A & B at <Acme>.\n";
    const { name, contact, body } = parseResumeSections(sample);
    const out = buildHtml(name, contact, body, "resume");
    assert.ok(!out.includes("<Doe>"));
    assert.ok(!out.includes("<Acme>"));
    assert.ok(out.includes("Jane &lt;Doe&gt;"));
    assert.ok(out.includes("&lt;Acme&gt;"));
    assert.ok(out.includes("A &amp; B"));
  });

  test("cover letter paragraphs use cover-para class", () => {
    const sample =
      "# Jane Doe\n\njane@x.com\n\n---\n\nDear Hiring Manager,\n\nI am writing about the role.\n";
    const { name, contact, body } = parseResumeSections(sample);
    const out = buildHtml(name, contact, body, "coverletter");
    assert.ok(out.includes('class="cover-para"'));
    assert.ok(!out.includes('class="body-para"'));
  });
});

function pdfPageCount(buffer) {
  const text = buffer.toString("latin1");
  const matches = text.match(/\/Type\s*\/Page[^s]/g);
  return matches ? matches.length : 0;
}

describe("pdfmake PDF", () => {
  let pdf;
  before(async () => {
    const normalized = normalizeUnicode(SAMPLE_RESUME);
    const { name, contact, body } = parseResumeSections(normalized);
    pdf = await buildPdfmakeBuffer(name, contact, body, "resume");
  });

  test("has PDF magic and plausible size", () => {
    assert.ok(pdf.length > 1024, "PDF suspiciously small");
    assert.equal(pdf.subarray(0, 5).toString("latin1"), "%PDF-");
  });
  test("single page for the sample resume", () => {
    assert.equal(pdfPageCount(pdf), 1);
  });
  test("embeds Gelasio, not a substituted font", () => {
    assert.ok(pdf.toString("latin1").includes("Gelasio"));
  });
});

describe("Typst source generation", () => {
  test("calls the template functions in document order", () => {
    const normalized = normalizeUnicode(SAMPLE_RESUME);
    const { name, contact, body } = parseResumeSections(normalized);
    const src = buildTypstSource(name, contact, body, "resume");
    assert.ok(src.includes('#import "resume.typ": *'));
    assert.ok(src.includes("#show: setup"));
    assert.ok(src.includes("#header(["));
    assert.ok(src.includes("#section["));
    assert.ok(src.includes("#role["));
    assert.ok(src.includes("#role-meta["));
    assert.ok(src.includes("#bullets("));
    const order = ["#header", "#section", "#role[", "#role-meta", "#bullets"];
    let last = -1;
    for (const marker of order) {
      const idx = src.indexOf(marker);
      assert.ok(idx > last, `${marker} out of order`);
      last = idx;
    }
  });
  test("escapes typst markup characters", () => {
    const { name, contact, body } = parseResumeSections(
      "# Jane Doe\n\njane@x.com\n\n---\n\nC# and a/b testing with_underscores 2022 - 2024\n",
    );
    const src = buildTypstSource(name, contact, body, "resume");
    assert.ok(src.includes("C\\#"));
    assert.ok(src.includes("a\\/b"));
    assert.ok(src.includes("with\\_underscores"));
    assert.ok(src.includes("2022 \\- 2024"));
  });
  test("links become #link calls", () => {
    const normalized = normalizeUnicode(SAMPLE_RESUME);
    const { name, contact, body } = parseResumeSections(normalized);
    const src = buildTypstSource(name, contact, body, "resume");
    assert.ok(src.includes('#link("https://linkedin.com/in/sarahchen")'));
  });
  test("cover letters use cover-para", () => {
    const { name, contact, body } = parseResumeSections(
      "# Jane Doe\n\njane@x.com\n\n---\n\nDear Hiring Manager,\n\nI am writing about the role.\n",
    );
    const src = buildTypstSource(name, contact, body, "coverletter");
    assert.ok(src.includes("#cover-para["));
    assert.ok(!src.includes("#para["));
  });
});

describe("tier detection", () => {
  let stubDir;
  before(() => {
    stubDir = mkdtempSync(join(tmpdir(), "typst-stub-"));
  });
  after(() => {
    rmSync(stubDir, { recursive: true, force: true });
  });

  function makeStub(name, version) {
    const path = join(stubDir, name);
    writeFileSync(path, `#!/bin/sh\necho "typst ${version} (stub)"\n`);
    chmodSync(path, 0o755);
    return path;
  }

  test("absent binary", () => {
    const result = detectTypst({ bin: join(stubDir, "does-not-exist") });
    assert.deepEqual(result, { present: false });
  });
  test("current version is supported", () => {
    const result = detectTypst({ bin: makeStub("typst-ok", "0.15.1") });
    assert.equal(result.present, true);
    assert.equal(result.version, "0.15.1");
    assert.equal(result.supported, true);
  });
  test("minimum version is supported", () => {
    const result = detectTypst({ bin: makeStub("typst-min", MIN_TYPST_VERSION) });
    assert.equal(result.supported, true);
  });
  test("too-old version falls back", () => {
    const result = detectTypst({ bin: makeStub("typst-old", "0.9.0") });
    assert.equal(result.present, true);
    assert.equal(result.supported, false);
  });
});

describe("CLI end-to-end", () => {
  function runExport(args, env = {}) {
    return spawnSync(process.execPath, [EXPORT_SCRIPT, ...args], {
      encoding: "utf8",
      env: { ...process.env, ...env },
    });
  }

  test("writes html, docx, and pdf next to the input", () => {
    const tmp = mkdtempSync(join(tmpdir(), "export-e2e-"));
    try {
      const mdPath = join(tmp, "resume.md");
      writeFileSync(mdPath, SAMPLE_RESUME, "utf8");
      const result = runExport([mdPath]);
      assert.equal(result.status, 0, result.stderr);
      for (const ext of [".html", ".docx", ".pdf"]) {
        const out = join(tmp, `resume${ext}`);
        assert.ok(
          readFileSync(out).length > 500,
          `missing or tiny ${out}; stdout=${result.stdout} stderr=${result.stderr}`,
        );
      }
      assert.match(result.stdout, /EXPORT_TIER=[23]\n?$/);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test("rejects unresolved placeholders with nonzero exit", () => {
    const tmp = mkdtempSync(join(tmpdir(), "export-e2e-"));
    try {
      const mdPath = join(tmp, "coverletter.md");
      writeFileSync(
        mdPath,
        "# Jane Doe\n\njane@x.com\n\n---\n\n[Date]\n\nDear Hiring Team,\n",
        "utf8",
      );
      const result = runExport([mdPath]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /not ready to render/);
      assert.match(result.stderr, /fix the markdown and rerun/);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test("missing file is a per-file failure, not a crash", () => {
    const result = runExport(["/nonexistent/resume.md"]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Failed to export/);
  });
});

describe("Typst compile (Tier 3)", { skip: !detectTypst().present }, () => {
  test("typeset PDF has PDF magic, plausible size, one page", () => {
    const normalized = normalizeUnicode(SAMPLE_RESUME);
    const { name, contact, body } = parseResumeSections(normalized);
    const src = buildTypstSource(name, contact, body, "resume");
    const tmp = mkdtempSync(join(tmpdir(), "typst-e2e-"));
    try {
      const outPath = join(tmp, "resume.pdf");
      compileTypstToPdf(src, outPath);
      const pdf = readFileSync(outPath);
      assert.ok(pdf.length > 1024);
      assert.equal(pdf.subarray(0, 5).toString("latin1"), "%PDF-");
      assert.equal(pdfPageCount(pdf), 1);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test("CLI reports EXPORT_TIER=3 when typst is present", () => {
    const tmp = mkdtempSync(join(tmpdir(), "typst-e2e-"));
    try {
      const mdPath = join(tmp, "resume.md");
      writeFileSync(mdPath, SAMPLE_RESUME, "utf8");
      const result = spawnSync(process.execPath, [EXPORT_SCRIPT, mdPath], {
        encoding: "utf8",
      });
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /EXPORT_TIER=3\n?$/);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});
