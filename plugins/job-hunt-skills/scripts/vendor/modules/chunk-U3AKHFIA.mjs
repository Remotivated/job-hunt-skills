import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  BigMetrics,
  init_EBDT
} from "./chunk-KZ6X7NMB.mjs";
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
  Pointer
} from "./chunk-ETHVAYUP.mjs";
import {
  Reserved
} from "./chunk-TSASLJV5.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  Bitfield
} from "./chunk-SPZOCPRY.mjs";
import {
  int8,
  uint16,
  uint32,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/EBLC.js
var SBitLineMetrics, CodeOffsetPair, IndexSubtable, IndexSubtableArray, BitmapSizeTable, EBLC_default;
var init_EBLC = __esm({
  "node_modules/fontkit/src/tables/EBLC.js"() {
    init_restructure();
    init_EBDT();
    SBitLineMetrics = new Struct({
      ascender: int8,
      descender: int8,
      widthMax: uint8,
      caretSlopeNumerator: int8,
      caretSlopeDenominator: int8,
      caretOffset: int8,
      minOriginSB: int8,
      minAdvanceSB: int8,
      maxBeforeBL: int8,
      minAfterBL: int8,
      pad: new Reserved(int8, 2)
    });
    CodeOffsetPair = new Struct({
      glyphCode: uint16,
      offset: uint16
    });
    IndexSubtable = new VersionedStruct(uint16, {
      header: {
        imageFormat: uint16,
        imageDataOffset: uint32
      },
      1: {
        offsetArray: new ArrayT(uint32, (t) => t.parent.lastGlyphIndex - t.parent.firstGlyphIndex + 1)
      },
      2: {
        imageSize: uint32,
        bigMetrics: BigMetrics
      },
      3: {
        offsetArray: new ArrayT(uint16, (t) => t.parent.lastGlyphIndex - t.parent.firstGlyphIndex + 1)
      },
      4: {
        numGlyphs: uint32,
        glyphArray: new ArrayT(CodeOffsetPair, (t) => t.numGlyphs + 1)
      },
      5: {
        imageSize: uint32,
        bigMetrics: BigMetrics,
        numGlyphs: uint32,
        glyphCodeArray: new ArrayT(uint16, "numGlyphs")
      }
    });
    IndexSubtableArray = new Struct({
      firstGlyphIndex: uint16,
      lastGlyphIndex: uint16,
      subtable: new Pointer(uint32, IndexSubtable)
    });
    BitmapSizeTable = new Struct({
      indexSubTableArray: new Pointer(uint32, new ArrayT(IndexSubtableArray, 1), { type: "parent" }),
      indexTablesSize: uint32,
      numberOfIndexSubTables: uint32,
      colorRef: uint32,
      hori: SBitLineMetrics,
      vert: SBitLineMetrics,
      startGlyphIndex: uint16,
      endGlyphIndex: uint16,
      ppemX: uint8,
      ppemY: uint8,
      bitDepth: uint8,
      flags: new Bitfield(uint8, ["horizontal", "vertical"])
    });
    EBLC_default = new Struct({
      version: uint32,
      // 0x00020000
      numSizes: uint32,
      sizes: new ArrayT(BitmapSizeTable, "numSizes")
    });
  }
});

export {
  EBLC_default,
  init_EBLC
};
