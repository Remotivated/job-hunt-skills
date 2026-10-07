import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  FeatureVariations,
  init_variations
} from "./chunk-ZQOIF36D.mjs";
import {
  ChainingContext,
  ClassDef,
  Context,
  Coverage,
  Device,
  FeatureList,
  LookupList,
  ScriptList,
  init_opentype
} from "./chunk-3W5UVUMY.mjs";
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
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  Bitfield
} from "./chunk-SPZOCPRY.mjs";
import {
  int16,
  uint16,
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/GPOS.js
var ValueFormat, types, ValueRecord, PairValueRecord, PairSet, Class2Record, Anchor, EntryExitRecord, MarkRecord, MarkArray, BaseRecord, BaseArray, ComponentRecord, LigatureAttach, LigatureArray, GPOSLookup, GPOS_default;
var init_GPOS = __esm({
  "node_modules/fontkit/src/tables/GPOS.js"() {
    init_restructure();
    init_opentype();
    init_variations();
    ValueFormat = new Bitfield(uint16, [
      "xPlacement",
      "yPlacement",
      "xAdvance",
      "yAdvance",
      "xPlaDevice",
      "yPlaDevice",
      "xAdvDevice",
      "yAdvDevice"
    ]);
    types = {
      xPlacement: int16,
      yPlacement: int16,
      xAdvance: int16,
      yAdvance: int16,
      xPlaDevice: new Pointer(uint16, Device, { type: "global", relativeTo: (ctx) => ctx.rel }),
      yPlaDevice: new Pointer(uint16, Device, { type: "global", relativeTo: (ctx) => ctx.rel }),
      xAdvDevice: new Pointer(uint16, Device, { type: "global", relativeTo: (ctx) => ctx.rel }),
      yAdvDevice: new Pointer(uint16, Device, { type: "global", relativeTo: (ctx) => ctx.rel })
    };
    ValueRecord = class {
      constructor(key = "valueFormat") {
        this.key = key;
      }
      buildStruct(parent) {
        let struct = parent;
        while (!struct[this.key] && struct.parent) {
          struct = struct.parent;
        }
        if (!struct[this.key]) return;
        let fields = {};
        fields.rel = () => struct._startOffset;
        let format = struct[this.key];
        for (let key in format) {
          if (format[key]) {
            fields[key] = types[key];
          }
        }
        return new Struct(fields);
      }
      size(val, ctx) {
        return this.buildStruct(ctx).size(val, ctx);
      }
      decode(stream, parent) {
        let res = this.buildStruct(parent).decode(stream, parent);
        delete res.rel;
        return res;
      }
    };
    PairValueRecord = new Struct({
      secondGlyph: uint16,
      value1: new ValueRecord("valueFormat1"),
      value2: new ValueRecord("valueFormat2")
    });
    PairSet = new ArrayT(PairValueRecord, uint16);
    Class2Record = new Struct({
      value1: new ValueRecord("valueFormat1"),
      value2: new ValueRecord("valueFormat2")
    });
    Anchor = new VersionedStruct(uint16, {
      1: {
        // Design units only
        xCoordinate: int16,
        yCoordinate: int16
      },
      2: {
        // Design units plus contour point
        xCoordinate: int16,
        yCoordinate: int16,
        anchorPoint: uint16
      },
      3: {
        // Design units plus Device tables
        xCoordinate: int16,
        yCoordinate: int16,
        xDeviceTable: new Pointer(uint16, Device),
        yDeviceTable: new Pointer(uint16, Device)
      }
    });
    EntryExitRecord = new Struct({
      entryAnchor: new Pointer(uint16, Anchor, { type: "parent" }),
      exitAnchor: new Pointer(uint16, Anchor, { type: "parent" })
    });
    MarkRecord = new Struct({
      class: uint16,
      markAnchor: new Pointer(uint16, Anchor, { type: "parent" })
    });
    MarkArray = new ArrayT(MarkRecord, uint16);
    BaseRecord = new ArrayT(new Pointer(uint16, Anchor), (t) => t.parent.classCount);
    BaseArray = new ArrayT(BaseRecord, uint16);
    ComponentRecord = new ArrayT(new Pointer(uint16, Anchor), (t) => t.parent.parent.classCount);
    LigatureAttach = new ArrayT(ComponentRecord, uint16);
    LigatureArray = new ArrayT(new Pointer(uint16, LigatureAttach), uint16);
    GPOSLookup = new VersionedStruct("lookupType", {
      1: new VersionedStruct(uint16, {
        // Single Adjustment
        1: {
          // Single positioning value
          coverage: new Pointer(uint16, Coverage),
          valueFormat: ValueFormat,
          value: new ValueRecord()
        },
        2: {
          coverage: new Pointer(uint16, Coverage),
          valueFormat: ValueFormat,
          valueCount: uint16,
          values: new LazyArray(new ValueRecord(), "valueCount")
        }
      }),
      2: new VersionedStruct(uint16, {
        // Pair Adjustment Positioning
        1: {
          // Adjustments for glyph pairs
          coverage: new Pointer(uint16, Coverage),
          valueFormat1: ValueFormat,
          valueFormat2: ValueFormat,
          pairSetCount: uint16,
          pairSets: new LazyArray(new Pointer(uint16, PairSet), "pairSetCount")
        },
        2: {
          // Class pair adjustment
          coverage: new Pointer(uint16, Coverage),
          valueFormat1: ValueFormat,
          valueFormat2: ValueFormat,
          classDef1: new Pointer(uint16, ClassDef),
          classDef2: new Pointer(uint16, ClassDef),
          class1Count: uint16,
          class2Count: uint16,
          classRecords: new LazyArray(new LazyArray(Class2Record, "class2Count"), "class1Count")
        }
      }),
      3: {
        // Cursive Attachment Positioning
        format: uint16,
        coverage: new Pointer(uint16, Coverage),
        entryExitCount: uint16,
        entryExitRecords: new ArrayT(EntryExitRecord, "entryExitCount")
      },
      4: {
        // MarkToBase Attachment Positioning
        format: uint16,
        markCoverage: new Pointer(uint16, Coverage),
        baseCoverage: new Pointer(uint16, Coverage),
        classCount: uint16,
        markArray: new Pointer(uint16, MarkArray),
        baseArray: new Pointer(uint16, BaseArray)
      },
      5: {
        // MarkToLigature Attachment Positioning
        format: uint16,
        markCoverage: new Pointer(uint16, Coverage),
        ligatureCoverage: new Pointer(uint16, Coverage),
        classCount: uint16,
        markArray: new Pointer(uint16, MarkArray),
        ligatureArray: new Pointer(uint16, LigatureArray)
      },
      6: {
        // MarkToMark Attachment Positioning
        format: uint16,
        mark1Coverage: new Pointer(uint16, Coverage),
        mark2Coverage: new Pointer(uint16, Coverage),
        classCount: uint16,
        mark1Array: new Pointer(uint16, MarkArray),
        mark2Array: new Pointer(uint16, BaseArray)
      },
      7: Context,
      // Contextual positioning
      8: ChainingContext,
      // Chaining contextual positioning
      9: {
        // Extension Positioning
        posFormat: uint16,
        lookupType: uint16,
        // cannot also be 9
        extension: new Pointer(uint32, null)
      }
    });
    GPOSLookup.versions[9].extension.type = GPOSLookup;
    GPOS_default = new VersionedStruct(uint32, {
      header: {
        scriptList: new Pointer(uint16, ScriptList),
        featureList: new Pointer(uint16, FeatureList),
        lookupList: new Pointer(uint16, new LookupList(GPOSLookup))
      },
      65536: {},
      65537: {
        featureVariations: new Pointer(uint32, FeatureVariations)
      }
    });
  }
});

export {
  GPOSLookup,
  GPOS_default,
  init_GPOS
};
