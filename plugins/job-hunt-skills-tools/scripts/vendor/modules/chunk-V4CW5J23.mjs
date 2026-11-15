import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/subset/Subset.js
var resolved, Subset;
var init_Subset = __esm({
  "node_modules/fontkit/src/subset/Subset.js"() {
    resolved = Promise.resolve();
    Subset = class {
      constructor(font) {
        this.font = font;
        this.glyphs = [];
        this.mapping = {};
        this.includeGlyph(0);
      }
      includeGlyph(glyph) {
        if (typeof glyph === "object") {
          glyph = glyph.id;
        }
        if (this.mapping[glyph] == null) {
          this.glyphs.push(glyph);
          this.mapping[glyph] = this.glyphs.length - 1;
        }
        return this.mapping[glyph];
      }
    };
  }
});

export {
  Subset,
  init_Subset
};
