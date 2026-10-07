import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/layout/GlyphPosition.js
var GlyphPosition;
var init_GlyphPosition = __esm({
  "node_modules/fontkit/src/layout/GlyphPosition.js"() {
    GlyphPosition = class {
      constructor(xAdvance = 0, yAdvance = 0, xOffset = 0, yOffset = 0) {
        this.xAdvance = xAdvance;
        this.yAdvance = yAdvance;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
      }
    };
  }
});

export {
  GlyphPosition,
  init_GlyphPosition
};
