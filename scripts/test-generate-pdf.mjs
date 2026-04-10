import assert from "node:assert/strict";
import { normalizeUnicode } from "./generate-pdf.mjs";

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

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
