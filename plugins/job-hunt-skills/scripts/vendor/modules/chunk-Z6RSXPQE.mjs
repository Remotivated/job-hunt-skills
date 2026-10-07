import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
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
  LazyArray
} from "./chunk-KW2FFRNO.mjs";
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
  int16,
  uint16,
  uint24,
  uint32,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/cmap.js
var SubHeader, CmapGroup, UnicodeValueRange, UVSMapping, DefaultUVS, NonDefaultUVS, VarSelectorRecord, CmapSubtable, CmapEntry, cmap_default;
var init_cmap = __esm({
  "node_modules/fontkit/src/tables/cmap.js"() {
    init_restructure();
    SubHeader = new Struct({
      firstCode: uint16,
      entryCount: uint16,
      idDelta: int16,
      idRangeOffset: uint16
    });
    CmapGroup = new Struct({
      startCharCode: uint32,
      endCharCode: uint32,
      glyphID: uint32
    });
    UnicodeValueRange = new Struct({
      startUnicodeValue: uint24,
      additionalCount: uint8
    });
    UVSMapping = new Struct({
      unicodeValue: uint24,
      glyphID: uint16
    });
    DefaultUVS = new ArrayT(UnicodeValueRange, uint32);
    NonDefaultUVS = new ArrayT(UVSMapping, uint32);
    VarSelectorRecord = new Struct({
      varSelector: uint24,
      defaultUVS: new Pointer(uint32, DefaultUVS, { type: "parent" }),
      nonDefaultUVS: new Pointer(uint32, NonDefaultUVS, { type: "parent" })
    });
    CmapSubtable = new VersionedStruct(uint16, {
      0: {
        // Byte encoding
        length: uint16,
        // Total table length in bytes (set to 262 for format 0)
        language: uint16,
        // Language code for this encoding subtable, or zero if language-independent
        codeMap: new LazyArray(uint8, 256)
      },
      2: {
        // High-byte mapping (CJK)
        length: uint16,
        language: uint16,
        subHeaderKeys: new ArrayT(uint16, 256),
        subHeaderCount: (t) => Math.max.apply(Math, t.subHeaderKeys),
        subHeaders: new LazyArray(SubHeader, "subHeaderCount"),
        glyphIndexArray: new LazyArray(uint16, "subHeaderCount")
      },
      4: {
        // Segment mapping to delta values
        length: uint16,
        // Total table length in bytes
        language: uint16,
        // Language code
        segCountX2: uint16,
        segCount: (t) => t.segCountX2 >> 1,
        searchRange: uint16,
        entrySelector: uint16,
        rangeShift: uint16,
        endCode: new LazyArray(uint16, "segCount"),
        reservedPad: new Reserved(uint16),
        // This value should be zero
        startCode: new LazyArray(uint16, "segCount"),
        idDelta: new LazyArray(int16, "segCount"),
        idRangeOffset: new LazyArray(uint16, "segCount"),
        glyphIndexArray: new LazyArray(uint16, (t) => (t.length - t._currentOffset) / 2)
      },
      6: {
        // Trimmed table
        length: uint16,
        language: uint16,
        firstCode: uint16,
        entryCount: uint16,
        glyphIndices: new LazyArray(uint16, "entryCount")
      },
      8: {
        // mixed 16-bit and 32-bit coverage
        reserved: new Reserved(uint16),
        length: uint32,
        language: uint16,
        is32: new LazyArray(uint8, 8192),
        nGroups: uint32,
        groups: new LazyArray(CmapGroup, "nGroups")
      },
      10: {
        // Trimmed Array
        reserved: new Reserved(uint16),
        length: uint32,
        language: uint32,
        firstCode: uint32,
        entryCount: uint32,
        glyphIndices: new LazyArray(uint16, "numChars")
      },
      12: {
        // Segmented coverage
        reserved: new Reserved(uint16),
        length: uint32,
        language: uint32,
        nGroups: uint32,
        groups: new LazyArray(CmapGroup, "nGroups")
      },
      13: {
        // Many-to-one range mappings (same as 12 except for group.startGlyphID)
        reserved: new Reserved(uint16),
        length: uint32,
        language: uint32,
        nGroups: uint32,
        groups: new LazyArray(CmapGroup, "nGroups")
      },
      14: {
        // Unicode Variation Sequences
        length: uint32,
        numRecords: uint32,
        varSelectors: new LazyArray(VarSelectorRecord, "numRecords")
      }
    });
    CmapEntry = new Struct({
      platformID: uint16,
      // Platform identifier
      encodingID: uint16,
      // Platform-specific encoding identifier
      table: new Pointer(uint32, CmapSubtable, { type: "parent", lazy: true })
    });
    cmap_default = new Struct({
      version: uint16,
      numSubtables: uint16,
      tables: new ArrayT(CmapEntry, "numSubtables")
    });
  }
});

export {
  cmap_default,
  init_cmap
};
