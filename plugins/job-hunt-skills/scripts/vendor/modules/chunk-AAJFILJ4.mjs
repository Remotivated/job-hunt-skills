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
  Device,
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
  Pointer
} from "./chunk-ETHVAYUP.mjs";
import {
  StringT
} from "./chunk-CJLFWYXH.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  int16,
  uint16,
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/BASE.js
var BaseCoord, BaseValues, FeatMinMaxRecord, MinMax, BaseLangSysRecord, BaseScript, BaseScriptRecord, BaseScriptList, BaseTagList, Axis, BASE_default;
var init_BASE = __esm({
  "node_modules/fontkit/src/tables/BASE.js"() {
    init_restructure();
    init_opentype();
    init_variations();
    BaseCoord = new VersionedStruct(uint16, {
      1: {
        // Design units only
        coordinate: int16
        // X or Y value, in design units
      },
      2: {
        // Design units plus contour point
        coordinate: int16,
        // X or Y value, in design units
        referenceGlyph: uint16,
        // GlyphID of control glyph
        baseCoordPoint: uint16
        // Index of contour point on the referenceGlyph
      },
      3: {
        // Design units plus Device table
        coordinate: int16,
        // X or Y value, in design units
        deviceTable: new Pointer(uint16, Device)
        // Device table for X or Y value
      }
    });
    BaseValues = new Struct({
      defaultIndex: uint16,
      // Index of default baseline for this script-same index in the BaseTagList
      baseCoordCount: uint16,
      baseCoords: new ArrayT(new Pointer(uint16, BaseCoord), "baseCoordCount")
    });
    FeatMinMaxRecord = new Struct({
      tag: new StringT(4),
      // 4-byte feature identification tag-must match FeatureTag in FeatureList
      minCoord: new Pointer(uint16, BaseCoord, { type: "parent" }),
      // May be NULL
      maxCoord: new Pointer(uint16, BaseCoord, { type: "parent" })
      // May be NULL
    });
    MinMax = new Struct({
      minCoord: new Pointer(uint16, BaseCoord),
      // May be NULL
      maxCoord: new Pointer(uint16, BaseCoord),
      // May be NULL
      featMinMaxCount: uint16,
      // May be 0
      featMinMaxRecords: new ArrayT(FeatMinMaxRecord, "featMinMaxCount")
      // In alphabetical order
    });
    BaseLangSysRecord = new Struct({
      tag: new StringT(4),
      // 4-byte language system identification tag
      minMax: new Pointer(uint16, MinMax, { type: "parent" })
    });
    BaseScript = new Struct({
      baseValues: new Pointer(uint16, BaseValues),
      // May be NULL
      defaultMinMax: new Pointer(uint16, MinMax),
      // May be NULL
      baseLangSysCount: uint16,
      // May be 0
      baseLangSysRecords: new ArrayT(BaseLangSysRecord, "baseLangSysCount")
      // in alphabetical order by BaseLangSysTag
    });
    BaseScriptRecord = new Struct({
      tag: new StringT(4),
      // 4-byte script identification tag
      script: new Pointer(uint16, BaseScript, { type: "parent" })
    });
    BaseScriptList = new ArrayT(BaseScriptRecord, uint16);
    BaseTagList = new ArrayT(new StringT(4), uint16);
    Axis = new Struct({
      baseTagList: new Pointer(uint16, BaseTagList),
      // May be NULL
      baseScriptList: new Pointer(uint16, BaseScriptList)
    });
    BASE_default = new VersionedStruct(uint32, {
      header: {
        horizAxis: new Pointer(uint16, Axis),
        // May be NULL
        vertAxis: new Pointer(uint16, Axis)
        // May be NULL
      },
      65536: {},
      65537: {
        itemVariationStore: new Pointer(uint32, ItemVariationStore)
      }
    });
  }
});

export {
  BASE_default,
  init_BASE
};
