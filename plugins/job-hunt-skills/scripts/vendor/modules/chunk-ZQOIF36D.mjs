import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  Feature,
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
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  Fixed,
  fixed32,
  int16,
  int8,
  uint16,
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/variations.js
var F2DOT14, RegionAxisCoordinates, VariationRegionList, DeltaSet, ItemVariationData, ItemVariationStore, ConditionTable, ConditionSet, FeatureTableSubstitutionRecord, FeatureTableSubstitution, FeatureVariationRecord, FeatureVariations;
var init_variations = __esm({
  "node_modules/fontkit/src/tables/variations.js"() {
    init_opentype();
    init_restructure();
    F2DOT14 = new Fixed(16, "BE", 14);
    RegionAxisCoordinates = new Struct({
      startCoord: F2DOT14,
      peakCoord: F2DOT14,
      endCoord: F2DOT14
    });
    VariationRegionList = new Struct({
      axisCount: uint16,
      regionCount: uint16,
      variationRegions: new ArrayT(new ArrayT(RegionAxisCoordinates, "axisCount"), "regionCount")
    });
    DeltaSet = new Struct({
      shortDeltas: new ArrayT(int16, (t) => t.parent.shortDeltaCount),
      regionDeltas: new ArrayT(int8, (t) => t.parent.regionIndexCount - t.parent.shortDeltaCount),
      deltas: (t) => t.shortDeltas.concat(t.regionDeltas)
    });
    ItemVariationData = new Struct({
      itemCount: uint16,
      shortDeltaCount: uint16,
      regionIndexCount: uint16,
      regionIndexes: new ArrayT(uint16, "regionIndexCount"),
      deltaSets: new ArrayT(DeltaSet, "itemCount")
    });
    ItemVariationStore = new Struct({
      format: uint16,
      variationRegionList: new Pointer(uint32, VariationRegionList),
      variationDataCount: uint16,
      itemVariationData: new ArrayT(new Pointer(uint32, ItemVariationData), "variationDataCount")
    });
    ConditionTable = new VersionedStruct(uint16, {
      1: {
        axisIndex: uint16,
        axisIndex: uint16,
        filterRangeMinValue: F2DOT14,
        filterRangeMaxValue: F2DOT14
      }
    });
    ConditionSet = new Struct({
      conditionCount: uint16,
      conditionTable: new ArrayT(new Pointer(uint32, ConditionTable), "conditionCount")
    });
    FeatureTableSubstitutionRecord = new Struct({
      featureIndex: uint16,
      alternateFeatureTable: new Pointer(uint32, Feature, { type: "parent" })
    });
    FeatureTableSubstitution = new Struct({
      version: fixed32,
      substitutionCount: uint16,
      substitutions: new ArrayT(FeatureTableSubstitutionRecord, "substitutionCount")
    });
    FeatureVariationRecord = new Struct({
      conditionSet: new Pointer(uint32, ConditionSet, { type: "parent" }),
      featureTableSubstitution: new Pointer(uint32, FeatureTableSubstitution, { type: "parent" })
    });
    FeatureVariations = new Struct({
      majorVersion: uint16,
      minorVersion: uint16,
      featureVariationRecordCount: uint32,
      featureVariationRecords: new ArrayT(FeatureVariationRecord, "featureVariationRecordCount")
    });
  }
});

export {
  ItemVariationStore,
  FeatureVariations,
  init_variations
};
