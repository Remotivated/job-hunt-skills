import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  decompressWoff2,
  init_brotli
} from "./chunk-IHVOMSN4.mjs";
import {
  WOFF2Directory_default,
  init_WOFF2Directory
} from "./chunk-3GLG45F3.mjs";
import {
  WOFF2Glyph,
  init_WOFF2Glyph
} from "./chunk-AKHFFQYG.mjs";
import {
  TTFFont,
  init_TTFFont
} from "./chunk-UULUL7OE.mjs";
import {
  Point,
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
  BufferT
} from "./chunk-FXNCBV2B.mjs";
import {
  uint16,
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  DecodeStream
} from "./chunk-32NVCR7Y.mjs";
import {
  asciiDecoder,
  init_utils
} from "./chunk-YOYKROTC.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/WOFF2Font.js
function read255UInt16(stream) {
  let code = stream.readUInt8();
  if (code === WORD_CODE) {
    return stream.readUInt16BE();
  }
  if (code === ONE_MORE_BYTE_CODE1) {
    return stream.readUInt8() + LOWEST_U_CODE;
  }
  if (code === ONE_MORE_BYTE_CODE2) {
    return stream.readUInt8() + LOWEST_U_CODE * 2;
  }
  return code;
}
function withSign(flag, baseval) {
  return flag & 1 ? baseval : -baseval;
}
function decodeTriplet(flags, glyphs, nPoints) {
  let y;
  let x = y = 0;
  let res = [];
  for (let i = 0; i < nPoints; i++) {
    let dx = 0, dy = 0;
    let flag = flags.readUInt8();
    let onCurve = !(flag >> 7);
    flag &= 127;
    if (flag < 10) {
      dx = 0;
      dy = withSign(flag, ((flag & 14) << 7) + glyphs.readUInt8());
    } else if (flag < 20) {
      dx = withSign(flag, ((flag - 10 & 14) << 7) + glyphs.readUInt8());
      dy = 0;
    } else if (flag < 84) {
      var b0 = flag - 20;
      var b1 = glyphs.readUInt8();
      dx = withSign(flag, 1 + (b0 & 48) + (b1 >> 4));
      dy = withSign(flag >> 1, 1 + ((b0 & 12) << 2) + (b1 & 15));
    } else if (flag < 120) {
      var b0 = flag - 84;
      dx = withSign(flag, 1 + (b0 / 12 << 8) + glyphs.readUInt8());
      dy = withSign(flag >> 1, 1 + (b0 % 12 >> 2 << 8) + glyphs.readUInt8());
    } else if (flag < 124) {
      var b1 = glyphs.readUInt8();
      let b2 = glyphs.readUInt8();
      dx = withSign(flag, (b1 << 4) + (b2 >> 4));
      dy = withSign(flag >> 1, ((b2 & 15) << 8) + glyphs.readUInt8());
    } else {
      dx = withSign(flag, glyphs.readUInt16BE());
      dy = withSign(flag >> 1, glyphs.readUInt16BE());
    }
    x += dx;
    y += dy;
    res.push(new Point(onCurve, false, x, y));
  }
  return res;
}
var WOFF2Font, Substream, GlyfTable, WORD_CODE, ONE_MORE_BYTE_CODE2, ONE_MORE_BYTE_CODE1, LOWEST_U_CODE;
var init_WOFF2Font = __esm({
  "node_modules/fontkit/src/WOFF2Font.js"() {
    init_restructure();
    init_brotli();
    init_TTFFont();
    init_TTFGlyph();
    init_WOFF2Glyph();
    init_WOFF2Directory();
    init_utils();
    WOFF2Font = class extends TTFFont {
      type = "WOFF2";
      static probe(buffer) {
        return asciiDecoder.decode(buffer.slice(0, 4)) === "wOF2";
      }
      _decodeDirectory() {
        this.directory = WOFF2Directory_default.decode(this.stream);
        this._dataPos = this.stream.pos;
      }
      _decompress() {
        if (!this._decompressed) {
          this.stream.pos = this._dataPos;
          let buffer = this.stream.readBuffer(this.directory.totalCompressedSize);
          let decompressedSize = 0;
          for (let tag in this.directory.tables) {
            let entry = this.directory.tables[tag];
            entry.offset = decompressedSize;
            decompressedSize += entry.transformLength != null ? entry.transformLength : entry.length;
          }
          let decompressed = decompressWoff2(buffer, decompressedSize);
          if (!decompressed) {
            throw new Error("Error decoding compressed data in WOFF2");
          }
          this.stream = new DecodeStream(decompressed);
          this._decompressed = true;
        }
      }
      _decodeTable(table) {
        this._decompress();
        return super._decodeTable(table);
      }
      // Override this method to get a glyph and return our
      // custom subclass if there is a glyf table.
      _getBaseGlyph(glyph, characters = []) {
        if (!this._glyphs[glyph]) {
          if (this.directory.tables.glyf && this.directory.tables.glyf.transformed) {
            if (!this._transformedGlyphs) {
              this._transformGlyfTable();
            }
            return this._glyphs[glyph] = new WOFF2Glyph(glyph, characters, this);
          } else {
            return super._getBaseGlyph(glyph, characters);
          }
        }
      }
      _transformGlyfTable() {
        this._decompress();
        this.stream.pos = this.directory.tables.glyf.offset;
        let table = GlyfTable.decode(this.stream);
        let glyphs = [];
        for (let index = 0; index < table.numGlyphs; index++) {
          let glyph = {};
          let nContours = table.nContours.readInt16BE();
          glyph.numberOfContours = nContours;
          if (nContours > 0) {
            let nPoints = [];
            let totalPoints = 0;
            for (let i = 0; i < nContours; i++) {
              let r = read255UInt16(table.nPoints);
              totalPoints += r;
              nPoints.push(totalPoints);
            }
            glyph.points = decodeTriplet(table.flags, table.glyphs, totalPoints);
            for (let i = 0; i < nContours; i++) {
              glyph.points[nPoints[i] - 1].endContour = true;
            }
            var instructionSize = read255UInt16(table.glyphs);
          } else if (nContours < 0) {
            let haveInstructions = TTFGlyph.prototype._decodeComposite.call({ _font: this }, glyph, table.composites);
            if (haveInstructions) {
              var instructionSize = read255UInt16(table.glyphs);
            }
          }
          glyphs.push(glyph);
        }
        this._transformedGlyphs = glyphs;
      }
    };
    Substream = class {
      constructor(length) {
        this.length = length;
        this._buf = new BufferT(length);
      }
      decode(stream, parent) {
        return new DecodeStream(this._buf.decode(stream, parent));
      }
    };
    GlyfTable = new Struct({
      version: uint32,
      numGlyphs: uint16,
      indexFormat: uint16,
      nContourStreamSize: uint32,
      nPointsStreamSize: uint32,
      flagStreamSize: uint32,
      glyphStreamSize: uint32,
      compositeStreamSize: uint32,
      bboxStreamSize: uint32,
      instructionStreamSize: uint32,
      nContours: new Substream("nContourStreamSize"),
      nPoints: new Substream("nPointsStreamSize"),
      flags: new Substream("flagStreamSize"),
      glyphs: new Substream("glyphStreamSize"),
      composites: new Substream("compositeStreamSize"),
      bboxes: new Substream("bboxStreamSize"),
      instructions: new Substream("instructionStreamSize")
    });
    WORD_CODE = 253;
    ONE_MORE_BYTE_CODE2 = 254;
    ONE_MORE_BYTE_CODE1 = 255;
    LOWEST_U_CODE = 253;
  }
});

export {
  WOFF2Font,
  init_WOFF2Font
};
