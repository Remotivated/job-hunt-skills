import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  directory_default,
  init_directory
} from "./chunk-3EKV4EBJ.mjs";
import {
  Subset,
  init_Subset
} from "./chunk-V4CW5J23.mjs";
import {
  TTFGlyphEncoder,
  init_TTFGlyphEncoder
} from "./chunk-VZQRPZZP.mjs";
import {
  require_clone
} from "./chunk-PULH4LZO.mjs";
import {
  __esm,
  __toESM
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/subset/TTFSubset.js
var import_clone, TTFSubset;
var init_TTFSubset = __esm({
  "node_modules/fontkit/src/subset/TTFSubset.js"() {
    import_clone = __toESM(require_clone(), 1);
    init_Subset();
    init_directory();
    init_TTFGlyphEncoder();
    TTFSubset = class extends Subset {
      constructor(font) {
        super(font);
        this.glyphEncoder = new TTFGlyphEncoder();
      }
      _addGlyph(gid) {
        let glyph = this.font.getGlyph(gid);
        let glyf = glyph._decode();
        let curOffset = this.font.loca.offsets[gid];
        let nextOffset = this.font.loca.offsets[gid + 1];
        let stream = this.font._getTableStream("glyf");
        stream.pos += curOffset;
        let buffer = stream.readBuffer(nextOffset - curOffset);
        if (glyf && glyf.numberOfContours < 0) {
          buffer = new Uint8Array(buffer);
          let view = new DataView(buffer.buffer);
          for (let component of glyf.components) {
            gid = this.includeGlyph(component.glyphID);
            view.setUint16(component.pos, gid);
          }
        } else if (glyf && this.font._variationProcessor) {
          buffer = this.glyphEncoder.encodeSimple(glyph.path, glyf.instructions);
        }
        this.glyf.push(buffer);
        this.loca.offsets.push(this.offset);
        this.hmtx.metrics.push({
          advance: glyph.advanceWidth,
          bearing: glyph._getMetrics().leftBearing
        });
        this.offset += buffer.length;
        return this.glyf.length - 1;
      }
      encode() {
        this.glyf = [];
        this.offset = 0;
        this.loca = {
          offsets: [],
          version: this.font.loca.version
        };
        this.hmtx = {
          metrics: [],
          bearings: []
        };
        let i = 0;
        while (i < this.glyphs.length) {
          this._addGlyph(this.glyphs[i++]);
        }
        let maxp = (0, import_clone.default)(this.font.maxp);
        maxp.numGlyphs = this.glyf.length;
        this.loca.offsets.push(this.offset);
        let head = (0, import_clone.default)(this.font.head);
        head.indexToLocFormat = this.loca.version;
        let hhea = (0, import_clone.default)(this.font.hhea);
        hhea.numberOfMetrics = this.hmtx.metrics.length;
        return directory_default.toBuffer({
          tables: {
            head,
            hhea,
            loca: this.loca,
            maxp,
            "cvt ": this.font["cvt "],
            prep: this.font.prep,
            glyf: this.glyf,
            hmtx: this.hmtx,
            fpgm: this.font.fpgm
            // name: clone @font.name
            // 'OS/2': clone @font['OS/2']
            // post: clone @font.post
            // cmap: cmap
          }
        });
      }
    };
  }
});

export {
  TTFSubset,
  init_TTFSubset
};
