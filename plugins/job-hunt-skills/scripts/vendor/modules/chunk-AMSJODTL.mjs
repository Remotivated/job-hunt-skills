import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  LookupTable,
  StateTable,
  UnboundedArray,
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
  uint16,
  uint24,
  uint32,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/morx.js
var LigatureData, ContextualData, InsertionData, SubstitutionTable, SubtableData, Subtable, FeatureEntry, MorxChain, morx_default;
var init_morx = __esm({
  "node_modules/fontkit/src/tables/morx.js"() {
    init_restructure();
    init_aat();
    LigatureData = {
      action: uint16
    };
    ContextualData = {
      markIndex: uint16,
      currentIndex: uint16
    };
    InsertionData = {
      currentInsertIndex: uint16,
      markedInsertIndex: uint16
    };
    SubstitutionTable = new Struct({
      items: new UnboundedArray(new Pointer(uint32, new LookupTable()))
    });
    SubtableData = new VersionedStruct("type", {
      0: {
        // Indic Rearrangement Subtable
        stateTable: new StateTable()
      },
      1: {
        // Contextual Glyph Substitution Subtable
        stateTable: new StateTable(ContextualData),
        substitutionTable: new Pointer(uint32, SubstitutionTable)
      },
      2: {
        // Ligature subtable
        stateTable: new StateTable(LigatureData),
        ligatureActions: new Pointer(uint32, new UnboundedArray(uint32)),
        components: new Pointer(uint32, new UnboundedArray(uint16)),
        ligatureList: new Pointer(uint32, new UnboundedArray(uint16))
      },
      4: {
        // Non-contextual Glyph Substitution Subtable
        lookupTable: new LookupTable()
      },
      5: {
        // Glyph Insertion Subtable
        stateTable: new StateTable(InsertionData),
        insertionActions: new Pointer(uint32, new UnboundedArray(uint16))
      }
    });
    Subtable = new Struct({
      length: uint32,
      coverage: uint24,
      type: uint8,
      subFeatureFlags: uint32,
      table: SubtableData,
      padding: new Reserved(uint8, (t) => t.length - t._currentOffset)
    });
    FeatureEntry = new Struct({
      featureType: uint16,
      featureSetting: uint16,
      enableFlags: uint32,
      disableFlags: uint32
    });
    MorxChain = new Struct({
      defaultFlags: uint32,
      chainLength: uint32,
      nFeatureEntries: uint32,
      nSubtables: uint32,
      features: new ArrayT(FeatureEntry, "nFeatureEntries"),
      subtables: new ArrayT(Subtable, "nSubtables")
    });
    morx_default = new Struct({
      version: uint16,
      unused: new Reserved(uint16),
      nChains: uint32,
      chains: new ArrayT(MorxChain, "nChains")
    });
  }
});

export {
  morx_default,
  init_morx
};
