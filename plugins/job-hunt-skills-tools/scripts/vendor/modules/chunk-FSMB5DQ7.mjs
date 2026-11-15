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

// scripts/vendor-stubs/svg-measure.mjs
var svg_measure_exports = {};
__export(svg_measure_exports, {
  default: () => SVGMeasure
});
var SVGMeasure;
var init_svg_measure = __esm({
  "scripts/vendor-stubs/svg-measure.mjs"() {
    SVGMeasure = class {
      measureSVG() {
        throw new Error("SVG is not supported by the document exporter.");
      }
      writeDimensions() {
        throw new Error("SVG is not supported by the document exporter.");
      }
    };
  }
});

export {
  SVGMeasure,
  svg_measure_exports,
  init_svg_measure
};
