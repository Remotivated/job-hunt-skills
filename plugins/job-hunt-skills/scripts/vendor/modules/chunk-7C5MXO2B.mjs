import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  ItemVariationStore,
  init_variations
} from "./chunk-ZQOIF36D.mjs";
import {
  ExpertCharset,
  ExpertSubsetCharset,
  ISOAdobeCharset,
  init_CFFCharsets
} from "./chunk-5NFZCSK7.mjs";
import {
  ExpertEncoding,
  StandardEncoding,
  init_CFFEncodings
} from "./chunk-MTPVXKUP.mjs";
import {
  CFFPrivateDict_default,
  init_CFFPrivateDict
} from "./chunk-ISDP5FX3.mjs";
import {
  CFFDict,
  init_CFFDict
} from "./chunk-4LO37POG.mjs";
import {
  CFFIndex,
  init_CFFIndex
} from "./chunk-NJQSVP4A.mjs";
import {
  CFFPointer,
  init_CFFPointer
} from "./chunk-TXOQG3TN.mjs";
import {
  init_restructure
} from "./chunk-YFRH6662.mjs";
import {
  VersionedStruct
} from "./chunk-DCBC6YOO.mjs";
import {
  Struct
} from "./chunk-2FAS3ON4.mjs";
import {
  StringT
} from "./chunk-CJLFWYXH.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  resolveLength
} from "./chunk-5AJOID3U.mjs";
import {
  NumberT,
  fixed16,
  uint16,
  uint32,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/cff/CFFTop.js
var PredefinedOp, CFFEncodingVersion, Range1, Range2, CFFCustomEncoding, CFFEncoding, RangeArray, CFFCustomCharset, CFFCharset, FDRange3, FDRange4, FDSelect, ptr, CFFPrivateOp, FontDict, CFFTopDict, VariationStore, CFF2TopDict, CFFTop, CFFTop_default;
var init_CFFTop = __esm({
  "node_modules/fontkit/src/cff/CFFTop.js"() {
    init_restructure();
    init_restructure();
    init_CFFDict();
    init_CFFIndex();
    init_CFFPointer();
    init_CFFPrivateDict();
    init_CFFEncodings();
    init_CFFCharsets();
    init_variations();
    PredefinedOp = class {
      constructor(predefinedOps, type) {
        this.predefinedOps = predefinedOps;
        this.type = type;
      }
      decode(stream, parent, operands) {
        if (this.predefinedOps[operands[0]]) {
          return this.predefinedOps[operands[0]];
        }
        return this.type.decode(stream, parent, operands);
      }
      size(value, ctx) {
        return this.type.size(value, ctx);
      }
      encode(stream, value, ctx) {
        let index = this.predefinedOps.indexOf(value);
        if (index !== -1) {
          return index;
        }
        return this.type.encode(stream, value, ctx);
      }
    };
    CFFEncodingVersion = class extends NumberT {
      constructor() {
        super("UInt8");
      }
      decode(stream) {
        return uint8.decode(stream) & 127;
      }
    };
    Range1 = new Struct({
      first: uint16,
      nLeft: uint8
    });
    Range2 = new Struct({
      first: uint16,
      nLeft: uint16
    });
    CFFCustomEncoding = new VersionedStruct(new CFFEncodingVersion(), {
      0: {
        nCodes: uint8,
        codes: new ArrayT(uint8, "nCodes")
      },
      1: {
        nRanges: uint8,
        ranges: new ArrayT(Range1, "nRanges")
      }
      // TODO: supplement?
    });
    CFFEncoding = new PredefinedOp([StandardEncoding, ExpertEncoding], new CFFPointer(CFFCustomEncoding, { lazy: true }));
    RangeArray = class extends ArrayT {
      decode(stream, parent) {
        let length = resolveLength(this.length, stream, parent);
        let count = 0;
        let res = [];
        while (count < length) {
          let range = this.type.decode(stream, parent);
          range.offset = count;
          count += range.nLeft + 1;
          res.push(range);
        }
        return res;
      }
    };
    CFFCustomCharset = new VersionedStruct(uint8, {
      0: {
        glyphs: new ArrayT(uint16, (t) => t.parent.CharStrings.length - 1)
      },
      1: {
        ranges: new RangeArray(Range1, (t) => t.parent.CharStrings.length - 1)
      },
      2: {
        ranges: new RangeArray(Range2, (t) => t.parent.CharStrings.length - 1)
      }
    });
    CFFCharset = new PredefinedOp([ISOAdobeCharset, ExpertCharset, ExpertSubsetCharset], new CFFPointer(CFFCustomCharset, { lazy: true }));
    FDRange3 = new Struct({
      first: uint16,
      fd: uint8
    });
    FDRange4 = new Struct({
      first: uint32,
      fd: uint16
    });
    FDSelect = new VersionedStruct(uint8, {
      0: {
        fds: new ArrayT(uint8, (t) => t.parent.CharStrings.length)
      },
      3: {
        nRanges: uint16,
        ranges: new ArrayT(FDRange3, "nRanges"),
        sentinel: uint16
      },
      4: {
        nRanges: uint32,
        ranges: new ArrayT(FDRange4, "nRanges"),
        sentinel: uint32
      }
    });
    ptr = new CFFPointer(CFFPrivateDict_default);
    CFFPrivateOp = class {
      decode(stream, parent, operands) {
        parent.length = operands[0];
        return ptr.decode(stream, parent, [operands[1]]);
      }
      size(dict, ctx) {
        return [CFFPrivateDict_default.size(dict, ctx, false), ptr.size(dict, ctx)[0]];
      }
      encode(stream, dict, ctx) {
        return [CFFPrivateDict_default.size(dict, ctx, false), ptr.encode(stream, dict, ctx)[0]];
      }
    };
    FontDict = new CFFDict([
      // key       name                   type(s)                                 default
      [18, "Private", new CFFPrivateOp(), null],
      [[12, 38], "FontName", "sid", null],
      [[12, 7], "FontMatrix", "array", [1e-3, 0, 0, 1e-3, 0, 0]],
      [[12, 5], "PaintType", "number", 0]
    ]);
    CFFTopDict = new CFFDict([
      // key       name                   type(s)                                 default
      [[12, 30], "ROS", ["sid", "sid", "number"], null],
      [0, "version", "sid", null],
      [1, "Notice", "sid", null],
      [[12, 0], "Copyright", "sid", null],
      [2, "FullName", "sid", null],
      [3, "FamilyName", "sid", null],
      [4, "Weight", "sid", null],
      [[12, 1], "isFixedPitch", "boolean", false],
      [[12, 2], "ItalicAngle", "number", 0],
      [[12, 3], "UnderlinePosition", "number", -100],
      [[12, 4], "UnderlineThickness", "number", 50],
      [[12, 5], "PaintType", "number", 0],
      [[12, 6], "CharstringType", "number", 2],
      [[12, 7], "FontMatrix", "array", [1e-3, 0, 0, 1e-3, 0, 0]],
      [13, "UniqueID", "number", null],
      [5, "FontBBox", "array", [0, 0, 0, 0]],
      [[12, 8], "StrokeWidth", "number", 0],
      [14, "XUID", "array", null],
      [15, "charset", CFFCharset, ISOAdobeCharset],
      [16, "Encoding", CFFEncoding, StandardEncoding],
      [17, "CharStrings", new CFFPointer(new CFFIndex()), null],
      [18, "Private", new CFFPrivateOp(), null],
      [[12, 20], "SyntheticBase", "number", null],
      [[12, 21], "PostScript", "sid", null],
      [[12, 22], "BaseFontName", "sid", null],
      [[12, 23], "BaseFontBlend", "delta", null],
      // CID font specific
      [[12, 31], "CIDFontVersion", "number", 0],
      [[12, 32], "CIDFontRevision", "number", 0],
      [[12, 33], "CIDFontType", "number", 0],
      [[12, 34], "CIDCount", "number", 8720],
      [[12, 35], "UIDBase", "number", null],
      [[12, 37], "FDSelect", new CFFPointer(FDSelect), null],
      [[12, 36], "FDArray", new CFFPointer(new CFFIndex(FontDict)), null],
      [[12, 38], "FontName", "sid", null]
    ]);
    VariationStore = new Struct({
      length: uint16,
      itemVariationStore: ItemVariationStore
    });
    CFF2TopDict = new CFFDict([
      [[12, 7], "FontMatrix", "array", [1e-3, 0, 0, 1e-3, 0, 0]],
      [17, "CharStrings", new CFFPointer(new CFFIndex()), null],
      [[12, 37], "FDSelect", new CFFPointer(FDSelect), null],
      [[12, 36], "FDArray", new CFFPointer(new CFFIndex(FontDict)), null],
      [24, "vstore", new CFFPointer(VariationStore), null],
      [25, "maxstack", "number", 193]
    ]);
    CFFTop = new VersionedStruct(fixed16, {
      1: {
        hdrSize: uint8,
        offSize: uint8,
        nameIndex: new CFFIndex(new StringT("length")),
        topDictIndex: new CFFIndex(CFFTopDict),
        stringIndex: new CFFIndex(new StringT("length")),
        globalSubrIndex: new CFFIndex()
      },
      2: {
        hdrSize: uint8,
        length: uint16,
        topDict: CFF2TopDict,
        globalSubrIndex: new CFFIndex()
      }
    });
    CFFTop_default = CFFTop;
  }
});

export {
  CFFTop_default,
  init_CFFTop
};
