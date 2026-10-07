import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// scripts/vendor-stubs/brotli.mjs
function decompressWoff2() {
  throw new Error("WOFF2 fonts are not supported by the document exporter; use TrueType fonts.");
}
var init_brotli = __esm({
  "scripts/vendor-stubs/brotli.mjs"() {
  }
});

export {
  decompressWoff2,
  init_brotli
};
