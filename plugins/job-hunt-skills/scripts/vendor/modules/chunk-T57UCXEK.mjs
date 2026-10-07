import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  $747425b437e121da$export$e33ad6871e762338,
  init_module
} from "./chunk-VFVK5HQB.mjs";
import {
  Path,
  init_Path
} from "./chunk-S2ULSDRG.mjs";
import {
  StandardNames_default,
  init_StandardNames
} from "./chunk-E6KCJGYP.mjs";
import {
  cache,
  init_decorators
} from "./chunk-NCNX7SGZ.mjs";
import {
  __decorateClass,
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/glyph/Glyph.js
var Glyph;
var init_Glyph = __esm({
  "node_modules/fontkit/src/glyph/Glyph.js"() {
    init_decorators();
    init_Path();
    init_module();
    init_StandardNames();
    Glyph = class {
      constructor(id, codePoints, font) {
        this.id = id;
        this.codePoints = codePoints;
        this._font = font;
        this.isMark = this.codePoints.length > 0 && this.codePoints.every($747425b437e121da$export$e33ad6871e762338);
        this.isLigature = this.codePoints.length > 1;
      }
      _getPath() {
        return new Path();
      }
      _getCBox() {
        return this.path.cbox;
      }
      _getBBox() {
        return this.path.bbox;
      }
      _getTableMetrics(table) {
        if (this.id < table.metrics.length) {
          return table.metrics.get(this.id);
        }
        let metric = table.metrics.get(table.metrics.length - 1);
        let res = {
          advance: metric ? metric.advance : 0,
          bearing: table.bearings.get(this.id - table.metrics.length) || 0
        };
        return res;
      }
      _getMetrics(cbox) {
        if (this._metrics) {
          return this._metrics;
        }
        let { advance: advanceWidth, bearing: leftBearing } = this._getTableMetrics(this._font.hmtx);
        if (this._font.vmtx) {
          var { advance: advanceHeight, bearing: topBearing } = this._getTableMetrics(this._font.vmtx);
        } else {
          let os2;
          if (typeof cbox === "undefined" || cbox === null) {
            ({ cbox } = this);
          }
          if ((os2 = this._font["OS/2"]) && os2.version > 0) {
            var advanceHeight = Math.abs(os2.typoAscender - os2.typoDescender);
            var topBearing = os2.typoAscender - cbox.maxY;
          } else {
            let { hhea } = this._font;
            var advanceHeight = Math.abs(hhea.ascent - hhea.descent);
            var topBearing = hhea.ascent - cbox.maxY;
          }
        }
        if (this._font._variationProcessor && this._font.HVAR) {
          advanceWidth += this._font._variationProcessor.getAdvanceAdjustment(this.id, this._font.HVAR);
        }
        return this._metrics = { advanceWidth, advanceHeight, leftBearing, topBearing };
      }
      get cbox() {
        return this._getCBox();
      }
      get bbox() {
        return this._getBBox();
      }
      get path() {
        return this._getPath();
      }
      /**
       * Returns a path scaled to the given font size.
       * @param {number} size
       * @return {Path}
       */
      getScaledPath(size) {
        let scale = 1 / this._font.unitsPerEm * size;
        return this.path.scale(scale);
      }
      get advanceWidth() {
        return this._getMetrics().advanceWidth;
      }
      get advanceHeight() {
        return this._getMetrics().advanceHeight;
      }
      get ligatureCaretPositions() {
      }
      _getName() {
        let { post } = this._font;
        if (!post) {
          return null;
        }
        switch (post.version) {
          case 1:
            return StandardNames_default[this.id];
          case 2:
            let id = post.glyphNameIndex[this.id];
            if (id < StandardNames_default.length) {
              return StandardNames_default[id];
            }
            return post.names[id - StandardNames_default.length];
          case 2.5:
            return StandardNames_default[this.id + post.offsets[this.id]];
          case 4:
            return String.fromCharCode(post.map[this.id]);
        }
      }
      get name() {
        return this._getName();
      }
      /**
       * Renders the glyph to the given graphics context, at the specified font size.
       * @param {CanvasRenderingContext2d} ctx
       * @param {number} size
       */
      render(ctx, size) {
        ctx.save();
        let scale = 1 / this._font.head.unitsPerEm * size;
        ctx.scale(scale, scale);
        let fn = this.path.toFunction();
        fn(ctx);
        ctx.fill();
        ctx.restore();
      }
    };
    __decorateClass([
      cache
    ], Glyph.prototype, "cbox", 1);
    __decorateClass([
      cache
    ], Glyph.prototype, "bbox", 1);
    __decorateClass([
      cache
    ], Glyph.prototype, "path", 1);
    __decorateClass([
      cache
    ], Glyph.prototype, "advanceWidth", 1);
    __decorateClass([
      cache
    ], Glyph.prototype, "advanceHeight", 1);
    __decorateClass([
      cache
    ], Glyph.prototype, "name", 1);
  }
});

export {
  Glyph,
  init_Glyph
};
