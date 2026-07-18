// Entry point for the checked-in vendor bundle (scripts/vendor/export-deps.mjs).
//
// Built with `npm run build:vendor` (esbuild). The bundle is committed so
// users never run `npm install` — Node alone is the Tier 2 requirement.
// CI verifies the bundle is up to date with the lockfile.

export * as docx from "docx";
export { default as MarkdownIt } from "markdown-it";

// pdfmake's prebuilt browser bundle is self-contained (pdfkit inlined, no
// filesystem font lookups); fonts are supplied at runtime via a base64 VFS.
import pdfMakeModule from "pdfmake/build/pdfmake.js";
export const pdfMake = pdfMakeModule.default ?? pdfMakeModule;
