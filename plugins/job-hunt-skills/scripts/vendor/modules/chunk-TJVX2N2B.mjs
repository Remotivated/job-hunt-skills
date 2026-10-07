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
  init_restructure
} from "./chunk-YFRH6662.mjs";
import {
  Struct
} from "./chunk-2FAS3ON4.mjs";
import {
  StringT
} from "./chunk-CJLFWYXH.mjs";
import {
  BufferT
} from "./chunk-FXNCBV2B.mjs";
import {
  uint16
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/glyph/SBIXGlyph.js
var SBIXImage, SBIXGlyph;
var init_SBIXGlyph = __esm({
  "node_modules/fontkit/src/glyph/SBIXGlyph.js"() {
    init_TTFGlyph();
    init_restructure();
    SBIXImage = new Struct({
      originX: uint16,
      originY: uint16,
      type: new StringT(4),
      data: new BufferT((t) => t.parent.buflen - t._currentOffset)
    });
    SBIXGlyph = class extends TTFGlyph {
      type = "SBIX";
      /**
       * Returns an object representing a glyph image at the given point size.
       * The object has a data property with a Buffer containing the actual image data,
       * along with the image type, and origin.
       *
       * @param {number} size
       * @return {object}
       */
      getImageForSize(size) {
        for (let i = 0; i < this._font.sbix.imageTables.length; i++) {
          var table = this._font.sbix.imageTables[i];
          if (table.ppem >= size) {
            break;
          }
        }
        let offsets = table.imageOffsets;
        let start = offsets[this.id];
        let end = offsets[this.id + 1];
        if (start === end) {
          return null;
        }
        this._font.stream.pos = start;
        return SBIXImage.decode(this._font.stream, { buflen: end - start });
      }
      render(ctx, size) {
        let img = this.getImageForSize(size);
        if (img != null) {
          let scale = size / this._font.unitsPerEm;
          ctx.image(img.data, { height: size, x: img.originX, y: (this.bbox.minY - img.originY) * scale });
        }
        if (this._font.sbix.flags.renderOutlines) {
          super.render(ctx, size);
        }
      }
    };
  }
});

export {
  SBIXGlyph,
  init_SBIXGlyph
};
