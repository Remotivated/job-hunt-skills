// Entry point for the checked-in vendor bundle (scripts/vendor/export-deps.mjs).
//
// Built with `npm run build:vendor` (esbuild). The bundle is committed so
// users never run `npm install` — Node alone is the Tier 2 requirement.
// CI verifies the bundle is up to date with the lockfile.

export * as docx from "docx";
export { default as MarkdownIt } from "markdown-it";

// Use pdfmake's server/source entry so every dependency comes from this
// repository's lockfile. The published browser build contains an opaque build-
// time dependency graph without exact version metadata, so it is not vendored.
import pdfMakeModule from "pdfmake";
export const pdfMake = pdfMakeModule.default ?? pdfMakeModule;

pdfMake.addVirtualFileSystem = (vfs) => {
  for (const [name, data] of Object.entries(vfs)) {
    pdfMake.virtualfs.writeFileSync(name, Buffer.from(data, "base64"));
  }
};

// Exported documents never fetch remote or arbitrary local resources.
pdfMake.setUrlAccessPolicy(() => false);
pdfMake.setLocalAccessPolicy(() => false);
