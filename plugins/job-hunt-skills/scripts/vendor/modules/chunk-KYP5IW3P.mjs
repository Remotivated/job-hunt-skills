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
  Bitfield
} from "./chunk-SPZOCPRY.mjs";
import {
  int16,
  uint16,
  uint32,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/kern.js
var KernPair, ClassTable, Kern2Array, KernSubtable, KernTable, kern_default;
var init_kern = __esm({
  "node_modules/fontkit/src/tables/kern.js"() {
    init_restructure();
    KernPair = new Struct({
      left: uint16,
      right: uint16,
      value: int16
    });
    ClassTable = new Struct({
      firstGlyph: uint16,
      nGlyphs: uint16,
      offsets: new ArrayT(uint16, "nGlyphs"),
      max: (t) => t.offsets.length && Math.max.apply(Math, t.offsets)
    });
    Kern2Array = new Struct({
      off: (t) => t._startOffset - t.parent.parent._startOffset,
      len: (t) => ((t.parent.leftTable.max - t.off) / t.parent.rowWidth + 1) * (t.parent.rowWidth / 2),
      values: new LazyArray(int16, "len")
    });
    KernSubtable = new VersionedStruct("format", {
      0: {
        nPairs: uint16,
        searchRange: uint16,
        entrySelector: uint16,
        rangeShift: uint16,
        pairs: new ArrayT(KernPair, "nPairs")
      },
      2: {
        rowWidth: uint16,
        leftTable: new Pointer(uint16, ClassTable, { type: "parent" }),
        rightTable: new Pointer(uint16, ClassTable, { type: "parent" }),
        array: new Pointer(uint16, Kern2Array, { type: "parent" })
      },
      3: {
        glyphCount: uint16,
        kernValueCount: uint8,
        leftClassCount: uint8,
        rightClassCount: uint8,
        flags: uint8,
        kernValue: new ArrayT(int16, "kernValueCount"),
        leftClass: new ArrayT(uint8, "glyphCount"),
        rightClass: new ArrayT(uint8, "glyphCount"),
        kernIndex: new ArrayT(uint8, (t) => t.leftClassCount * t.rightClassCount)
      }
    });
    KernTable = new VersionedStruct("version", {
      0: {
        // Microsoft uses this format
        subVersion: uint16,
        // Microsoft has an extra sub-table version number
        length: uint16,
        // Length of the subtable, in bytes
        format: uint8,
        // Format of subtable
        coverage: new Bitfield(uint8, [
          "horizontal",
          // 1 if table has horizontal data, 0 if vertical
          "minimum",
          // If set to 1, the table has minimum values. If set to 0, the table has kerning values.
          "crossStream",
          // If set to 1, kerning is perpendicular to the flow of the text
          "override"
          // If set to 1 the value in this table replaces the accumulated value
        ]),
        subtable: KernSubtable,
        padding: new Reserved(uint8, (t) => t.length - t._currentOffset)
      },
      1: {
        // Apple uses this format
        length: uint32,
        coverage: new Bitfield(uint8, [
          null,
          null,
          null,
          null,
          null,
          "variation",
          // Set if table has variation kerning values
          "crossStream",
          // Set if table has cross-stream kerning values
          "vertical"
          // Set if table has vertical kerning values
        ]),
        format: uint8,
        tupleIndex: uint16,
        subtable: KernSubtable,
        padding: new Reserved(uint8, (t) => t.length - t._currentOffset)
      }
    });
    kern_default = new VersionedStruct(uint16, {
      0: {
        // Microsoft Version
        nTables: uint16,
        tables: new ArrayT(KernTable, "nTables")
      },
      1: {
        // Apple Version
        reserved: new Reserved(uint16),
        // the other half of the version number
        nTables: uint32,
        tables: new ArrayT(KernTable, "nTables")
      }
    });
  }
});

export {
  kern_default,
  init_kern
};
