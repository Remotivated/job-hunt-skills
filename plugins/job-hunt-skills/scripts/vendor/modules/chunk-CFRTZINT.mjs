import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  LookupTable,
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
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  fixed32,
  int16,
  uint16
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/bsln.js
var BslnSubtable, bsln_default;
var init_bsln = __esm({
  "node_modules/fontkit/src/tables/bsln.js"() {
    init_restructure();
    init_aat();
    BslnSubtable = new VersionedStruct("format", {
      0: {
        // Distance-based, no mapping
        deltas: new ArrayT(int16, 32)
      },
      1: {
        // Distance-based, with mapping
        deltas: new ArrayT(int16, 32),
        mappingData: new LookupTable(uint16)
      },
      2: {
        // Control point-based, no mapping
        standardGlyph: uint16,
        controlPoints: new ArrayT(uint16, 32)
      },
      3: {
        // Control point-based, with mapping
        standardGlyph: uint16,
        controlPoints: new ArrayT(uint16, 32),
        mappingData: new LookupTable(uint16)
      }
    });
    bsln_default = new Struct({
      version: fixed32,
      format: uint16,
      defaultBaseline: uint16,
      subtable: BslnSubtable
    });
  }
});

export {
  bsln_default,
  init_bsln
};
