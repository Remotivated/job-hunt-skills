// Entry point for the checked-in readable vendor modules
// (plugins/job-hunt-skills/scripts/vendor/export-deps.mjs).
//
// Built with `npm run build:vendor` (esbuild). The modules are committed so
// users never run `npm install` — Node alone is the Tier 2 requirement.
// CI verifies the modules are up to date with the lockfile.

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
