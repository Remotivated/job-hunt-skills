import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  CFFStandardStrings_default,
  init_CFFStandardStrings
} from "./chunk-OTPXM3I3.mjs";
import {
  CFFTop_default,
  init_CFFTop
} from "./chunk-7C5MXO2B.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/cff/CFFFont.js
var CFFFont, CFFFont_default;
var init_CFFFont = __esm({
  "node_modules/fontkit/src/cff/CFFFont.js"() {
    init_CFFTop();
    init_CFFStandardStrings();
    CFFFont = class _CFFFont {
      constructor(stream) {
        this.stream = stream;
        this.decode();
      }
      static decode(stream) {
        return new _CFFFont(stream);
      }
      decode() {
        let start = this.stream.pos;
        let top = CFFTop_default.decode(this.stream);
        for (let key in top) {
          let val = top[key];
          this[key] = val;
        }
        if (this.version < 2) {
          if (this.topDictIndex.length !== 1) {
            throw new Error("Only a single font is allowed in CFF");
          }
          this.topDict = this.topDictIndex[0];
        }
        this.isCIDFont = this.topDict.ROS != null;
        return this;
      }
      string(sid) {
        if (this.version >= 2) {
          return null;
        }
        if (sid < CFFStandardStrings_default.length) {
          return CFFStandardStrings_default[sid];
        }
        return this.stringIndex[sid - CFFStandardStrings_default.length];
      }
      get postscriptName() {
        if (this.version < 2) {
          return this.nameIndex[0];
        }
        return null;
      }
      get fullName() {
        return this.string(this.topDict.FullName);
      }
      get familyName() {
        return this.string(this.topDict.FamilyName);
      }
      getCharString(glyph) {
        this.stream.pos = this.topDict.CharStrings[glyph].offset;
        return this.stream.readBuffer(this.topDict.CharStrings[glyph].length);
      }
      getGlyphName(gid) {
        if (this.version >= 2) {
          return null;
        }
        if (this.isCIDFont) {
          return null;
        }
        let { charset } = this.topDict;
        if (Array.isArray(charset)) {
          return charset[gid];
        }
        if (gid === 0) {
          return ".notdef";
        }
        gid -= 1;
        switch (charset.version) {
          case 0:
            return this.string(charset.glyphs[gid]);
          case 1:
          case 2:
            for (let i = 0; i < charset.ranges.length; i++) {
              let range = charset.ranges[i];
              if (range.offset <= gid && gid <= range.offset + range.nLeft) {
                return this.string(range.first + (gid - range.offset));
              }
            }
            break;
        }
        return null;
      }
      fdForGlyph(gid) {
        if (!this.topDict.FDSelect) {
          return null;
        }
        switch (this.topDict.FDSelect.version) {
          case 0:
            return this.topDict.FDSelect.fds[gid];
          case 3:
          case 4:
            let { ranges } = this.topDict.FDSelect;
            let low = 0;
            let high = ranges.length - 1;
            while (low <= high) {
              let mid = low + high >> 1;
              if (gid < ranges[mid].first) {
                high = mid - 1;
              } else if (mid < high && gid >= ranges[mid + 1].first) {
                low = mid + 1;
              } else {
                return ranges[mid].fd;
              }
            }
          default:
            throw new Error("Unknown FDSelect version: ".concat(this.topDict.FDSelect.version));
        }
      }
      privateDictForGlyph(gid) {
        if (this.topDict.FDSelect) {
          let fd = this.fdForGlyph(gid);
          if (this.topDict.FDArray[fd]) {
            return this.topDict.FDArray[fd].Private;
          }
          return null;
        }
        if (this.version < 2) {
          return this.topDict.Private;
        }
        return this.topDict.FDArray[0].Private;
      }
    };
    CFFFont_default = CFFFont;
  }
});

export {
  CFFFont_default,
  init_CFFFont
};
