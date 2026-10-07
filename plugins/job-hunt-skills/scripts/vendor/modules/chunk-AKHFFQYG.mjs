import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  TTFGlyph,
  init_TTFGlyph
} from "./chunk-NWMMPX4A.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/glyph/WOFF2Glyph.js
var WOFF2Glyph;
var init_WOFF2Glyph = __esm({
  "node_modules/fontkit/src/glyph/WOFF2Glyph.js"() {
    init_TTFGlyph();
    WOFF2Glyph = class extends TTFGlyph {
      type = "WOFF2";
      _decode() {
        return this._font._transformedGlyphs[this.id];
      }
      _getCBox() {
        return this.path.bbox;
      }
    };
  }
});

export {
  WOFF2Glyph,
  init_WOFF2Glyph
};
