import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  init_restructure
} from "./chunk-YFRH6662.mjs";
import {
  Struct
} from "./chunk-2FAS3ON4.mjs";
import {
  int32,
  uint16
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/maxp.js
var maxp_default;
var init_maxp = __esm({
  "node_modules/fontkit/src/tables/maxp.js"() {
    init_restructure();
    maxp_default = new Struct({
      version: int32,
      numGlyphs: uint16,
      // The number of glyphs in the font
      maxPoints: uint16,
      // Maximum points in a non-composite glyph
      maxContours: uint16,
      // Maximum contours in a non-composite glyph
      maxComponentPoints: uint16,
      // Maximum points in a composite glyph
      maxComponentContours: uint16,
      // Maximum contours in a composite glyph
      maxZones: uint16,
      // 1 if instructions do not use the twilight zone, 2 otherwise
      maxTwilightPoints: uint16,
      // Maximum points used in Z0
      maxStorage: uint16,
      // Number of Storage Area locations
      maxFunctionDefs: uint16,
      // Number of FDEFs
      maxInstructionDefs: uint16,
      // Number of IDEFs
      maxStackElements: uint16,
      // Maximum stack depth
      maxSizeOfInstructions: uint16,
      // Maximum byte count for glyph instructions
      maxComponentElements: uint16,
      // Maximum number of components referenced at “top level” for any composite glyph
      maxComponentDepth: uint16
      // Maximum levels of recursion; 1 for simple components
    });
  }
});

export {
  maxp_default,
  init_maxp
};
