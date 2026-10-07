import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  LookupTable,
  StateTable1,
  init_aat
} from "./chunk-RADCVHKQ.mjs";
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
  fixed32,
  uint16,
  uint32,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/just.js
var ClassTable, WidthDeltaRecord, WidthDeltaCluster, ActionData, Action, PostcompensationAction, PostCompensationTable, JustificationTable, just_default;
var init_just = __esm({
  "node_modules/fontkit/src/tables/just.js"() {
    init_restructure();
    init_aat();
    ClassTable = new Struct({
      length: uint16,
      coverage: uint16,
      subFeatureFlags: uint32,
      stateTable: new StateTable1()
    });
    WidthDeltaRecord = new Struct({
      justClass: uint32,
      beforeGrowLimit: fixed32,
      beforeShrinkLimit: fixed32,
      afterGrowLimit: fixed32,
      afterShrinkLimit: fixed32,
      growFlags: uint16,
      shrinkFlags: uint16
    });
    WidthDeltaCluster = new ArrayT(WidthDeltaRecord, uint32);
    ActionData = new VersionedStruct("actionType", {
      0: {
        // Decomposition action
        lowerLimit: fixed32,
        upperLimit: fixed32,
        order: uint16,
        glyphs: new ArrayT(uint16, uint16)
      },
      1: {
        // Unconditional add glyph action
        addGlyph: uint16
      },
      2: {
        // Conditional add glyph action
        substThreshold: fixed32,
        addGlyph: uint16,
        substGlyph: uint16
      },
      3: {},
      // Stretch glyph action (no data, not supported by CoreText)
      4: {
        // Ductile glyph action (not supported by CoreText)
        variationAxis: uint32,
        minimumLimit: fixed32,
        noStretchValue: fixed32,
        maximumLimit: fixed32
      },
      5: {
        // Repeated add glyph action
        flags: uint16,
        glyph: uint16
      }
    });
    Action = new Struct({
      actionClass: uint16,
      actionType: uint16,
      actionLength: uint32,
      actionData: ActionData,
      padding: new Reserved(uint8, (t) => t.actionLength - t._currentOffset)
    });
    PostcompensationAction = new ArrayT(Action, uint32);
    PostCompensationTable = new Struct({
      lookupTable: new LookupTable(new Pointer(uint16, PostcompensationAction))
    });
    JustificationTable = new Struct({
      classTable: new Pointer(uint16, ClassTable, { type: "parent" }),
      wdcOffset: uint16,
      postCompensationTable: new Pointer(uint16, PostCompensationTable, { type: "parent" }),
      widthDeltaClusters: new LookupTable(new Pointer(uint16, WidthDeltaCluster, { type: "parent", relativeTo: (ctx) => ctx.wdcOffset }))
    });
    just_default = new Struct({
      version: uint32,
      format: uint16,
      horizontal: new Pointer(uint16, JustificationTable),
      vertical: new Pointer(uint16, JustificationTable)
    });
  }
});

export {
  just_default,
  init_just
};
