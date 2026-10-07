import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  Glyph,
  init_Glyph
} from "./chunk-T57UCXEK.mjs";
import {
  BBox,
  init_BBox
} from "./chunk-Q6ISBTLZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/glyph/COLRGlyph.js
var COLRLayer, COLRGlyph;
var init_COLRGlyph = __esm({
  "node_modules/fontkit/src/glyph/COLRGlyph.js"() {
    init_Glyph();
    init_BBox();
    COLRLayer = class {
      constructor(glyph, color) {
        this.glyph = glyph;
        this.color = color;
      }
    };
    COLRGlyph = class extends Glyph {
      type = "COLR";
      _getBBox() {
        let bbox = new BBox();
        for (let i = 0; i < this.layers.length; i++) {
          let layer = this.layers[i];
          let b = layer.glyph.bbox;
          bbox.addPoint(b.minX, b.minY);
          bbox.addPoint(b.maxX, b.maxY);
        }
        return bbox;
      }
      /**
       * Returns an array of objects containing the glyph and color for
       * each layer in the composite color glyph.
       * @type {object[]}
       */
      get layers() {
        let cpal = this._font.CPAL;
        let colr = this._font.COLR;
        let low = 0;
        let high = colr.baseGlyphRecord.length - 1;
        while (low <= high) {
          let mid = low + high >> 1;
          var rec = colr.baseGlyphRecord[mid];
          if (this.id < rec.gid) {
            high = mid - 1;
          } else if (this.id > rec.gid) {
            low = mid + 1;
          } else {
            var baseLayer = rec;
            break;
          }
        }
        if (baseLayer == null) {
          var g = this._font._getBaseGlyph(this.id);
          var color = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 255
          };
          return [new COLRLayer(g, color)];
        }
        let layers = [];
        for (let i = baseLayer.firstLayerIndex; i < baseLayer.firstLayerIndex + baseLayer.numLayers; i++) {
          var rec = colr.layerRecords[i];
          var color = cpal.colorRecords[rec.paletteIndex];
          var g = this._font._getBaseGlyph(rec.gid);
          layers.push(new COLRLayer(g, color));
        }
        return layers;
      }
      render(ctx, size) {
        for (let { glyph, color } of this.layers) {
          ctx.fillColor([color.red, color.green, color.blue], color.alpha / 255 * 100);
          glyph.render(ctx, size);
        }
        return;
      }
    };
  }
});

export {
  COLRGlyph,
  init_COLRGlyph
};
