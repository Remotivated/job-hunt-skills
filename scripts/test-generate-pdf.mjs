import assert from "node:assert/strict";
import path from "node:path";
import { normalizeUnicode, parseResumeSections, pickTemplate, renderHtml } from "./generate-pdf.mjs";

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ok - ${name}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL - ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log("normalizeUnicode");

test("replaces em-dash with hyphen", () => {
  assert.equal(normalizeUnicode("a \u2014 b"), "a - b");
});

test("replaces en-dash with hyphen", () => {
  assert.equal(normalizeUnicode("2022 \u2013 2024"), "2022 - 2024");
});

test("replaces smart double quotes", () => {
  assert.equal(normalizeUnicode("\u201Chello\u201D"), '"hello"');
});

test("replaces smart single quotes", () => {
  assert.equal(normalizeUnicode("it\u2019s"), "it's");
});

test("replaces ellipsis character", () => {
  assert.equal(normalizeUnicode("wait\u2026"), "wait...");
});

test("strips zero-width space", () => {
  assert.equal(normalizeUnicode("a\u200Bb"), "ab");
});

test("strips zero-width non-joiner and joiner", () => {
  assert.equal(normalizeUnicode("a\u200Cb\u200Dc"), "abc");
});

test("strips BOM", () => {
  assert.equal(normalizeUnicode("\uFEFFtitle"), "title");
});

test("converts non-breaking space to regular space", () => {
  assert.equal(normalizeUnicode("a\u00A0b"), "a b");
});

test("leaves plain ASCII untouched", () => {
  assert.equal(normalizeUnicode("Hello, world."), "Hello, world.");
});

console.log("\nparseResumeSections");

const sampleResume = `# Sarah Chen

sarah.chen@email.com \u00B7 [LinkedIn](https://linkedin.com/in/sarahchen) \u00B7 San Francisco, CA

---

## Experience

### Marketing Manager \u2014 TechStartup Inc.
*Jan 2022 \u2013 Present* \u00B7 San Francisco, CA

- Did things
`;

test("extracts name from h1", () => {
  const parsed = parseResumeSections(sampleResume);
  assert.equal(parsed.name, "Sarah Chen");
});

test("extracts contact from first non-empty line after name", () => {
  const parsed = parseResumeSections(sampleResume);
  assert.equal(
    parsed.contact,
    "sarah.chen@email.com \u00B7 [LinkedIn](https://linkedin.com/in/sarahchen) \u00B7 San Francisco, CA"
  );
});

test("body starts after the first --- divider", () => {
  const parsed = parseResumeSections(sampleResume);
  assert.ok(parsed.body.startsWith("## Experience"), `body was: ${parsed.body.slice(0, 40)}`);
});

test("handles multiple blank lines between name and contact", () => {
  const input = "# Name\n\n\nemail@x.com\n\n---\n\nbody";
  const parsed = parseResumeSections(input);
  assert.equal(parsed.name, "Name");
  assert.equal(parsed.contact, "email@x.com");
  assert.equal(parsed.body.trim(), "body");
});

test("throws if no h1 on line 1", () => {
  assert.throws(() => parseResumeSections("no heading here\n"), /name/i);
});

test("throws if no divider found", () => {
  assert.throws(() => parseResumeSections("# Name\n\ncontact\n\nbody with no divider\n"), /divider/i);
});

console.log("\npickTemplate");

test("returns resume template for resume.md", () => {
  const result = pickTemplate("my-documents/resume.md");
  assert.ok(result.endsWith(path.join("templates", "resume-template.html")));
});

test("returns cover letter template for coverletter.md", () => {
  const result = pickTemplate("my-documents/coverletter.md");
  assert.ok(result.endsWith(path.join("templates", "coverletter-template.html")));
});

test("cover letter match is case-insensitive", () => {
  const result = pickTemplate("/abs/path/CoverLetter.md");
  assert.ok(result.endsWith(path.join("templates", "coverletter-template.html")));
});

test("applications/{id}/coverletter.md picks cover letter template", () => {
  const result = pickTemplate("my-documents/applications/acme-role/coverletter.md");
  assert.ok(result.endsWith(path.join("templates", "coverletter-template.html")));
});

test("applications/{id}/resume.md picks resume template", () => {
  const result = pickTemplate("my-documents/applications/acme-role/resume.md");
  assert.ok(result.endsWith(path.join("templates", "resume-template.html")));
});

console.log("\nrenderHtml");

test("substitutes name, contact, and rendered body", () => {
  const html = renderHtml({
    name: "Jane Doe",
    contact: "jane@example.com",
    bodyMarkdown: "## Experience\n\n- did a thing",
    templatePath: path.join("templates", "resume-template.html"),
  });
  assert.ok(html.includes("<h1>Jane Doe</h1>"), "name missing");
  assert.ok(html.includes("jane@example.com"), "contact missing");
  assert.ok(html.includes("<h2"), "section heading not rendered");
  assert.ok(html.includes("<li>did a thing</li>"), "list item not rendered");
});

test("renders markdown links in contact line", () => {
  const html = renderHtml({
    name: "Jane Doe",
    contact: "[LinkedIn](https://linkedin.com/in/jane)",
    bodyMarkdown: "body",
    templatePath: path.join("templates", "resume-template.html"),
  });
  assert.ok(html.includes('href="https://linkedin.com/in/jane"'));
});

test("escapes HTML-unsafe characters in name", () => {
  const html = renderHtml({
    name: "<script>alert(1)</script>",
    contact: "x",
    bodyMarkdown: "body",
    templatePath: path.join("templates", "resume-template.html"),
  });
  assert.ok(!html.includes("<script>alert(1)</script>"), "unescaped script tag");
  assert.ok(html.includes("&lt;script&gt;"));
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
