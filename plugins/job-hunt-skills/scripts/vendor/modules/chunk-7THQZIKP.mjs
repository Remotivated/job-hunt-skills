import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  direction,
  init_Script
} from "./chunk-SNNDT6ZF.mjs";
import {
  BBox,
  init_BBox
} from "./chunk-Q6ISBTLZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/layout/GlyphRun.js
var GlyphRun;
var init_GlyphRun = __esm({
  "node_modules/fontkit/src/layout/GlyphRun.js"() {
    init_BBox();
    init_Script();
    GlyphRun = class {
      constructor(glyphs, features, script, language, direction2) {
        this.glyphs = glyphs;
        this.positions = null;
        this.script = script;
        this.language = language || null;
        this.direction = direction2 || direction(script);
        this.features = {};
        if (Array.isArray(features)) {
          for (let tag of features) {
            this.features[tag] = true;
          }
        } else if (typeof features === "object") {
          this.features = features;
        }
      }
      /**
       * The total advance width of the run.
       * @type {number}
       */
      get advanceWidth() {
        let width = 0;
        for (let position of this.positions) {
          width += position.xAdvance;
        }
        return width;
      }
      /**
       * The total advance height of the run.
       * @type {number}
       */
      get advanceHeight() {
        let height = 0;
        for (let position of this.positions) {
          height += position.yAdvance;
        }
        return height;
      }
      /**
       * The bounding box containing all glyphs in the run.
       * @type {BBox}
       */
      get bbox() {
        let bbox = new BBox();
        let x = 0;
        let y = 0;
        for (let index = 0; index < this.glyphs.length; index++) {
          let glyph = this.glyphs[index];
          let p = this.positions[index];
          let b = glyph.bbox;
          bbox.addPoint(b.minX + x + p.xOffset, b.minY + y + p.yOffset);
          bbox.addPoint(b.maxX + x + p.xOffset, b.maxY + y + p.yOffset);
          x += p.xAdvance;
          y += p.yAdvance;
        }
        return bbox;
      }
    };
  }
});

export {
  GlyphRun,
  init_GlyphRun
};
