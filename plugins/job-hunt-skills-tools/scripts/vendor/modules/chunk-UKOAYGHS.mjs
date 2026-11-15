import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __esm,
  __export
} from "./chunk-FDWSCWK2.mjs";

// scripts/vendor-stubs/svg.mjs
var svg_exports = {};
__export(svg_exports, {
  default: () => renderSvg
});
function renderSvg() {
  throw new Error("SVG is not supported by the document exporter.");
}
var init_svg = __esm({
  "scripts/vendor-stubs/svg.mjs"() {
  }
});

export {
  renderSvg,
  svg_exports,
  init_svg
};
