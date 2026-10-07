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
  Struct
} from "./chunk-2FAS3ON4.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  int16,
  uint16,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/VDMX.js
var Ratio, vTable, VdmxGroup, VDMX_default;
var init_VDMX = __esm({
  "node_modules/fontkit/src/tables/VDMX.js"() {
    init_restructure();
    Ratio = new Struct({
      bCharSet: uint8,
      // Character set
      xRatio: uint8,
      // Value to use for x-Ratio
      yStartRatio: uint8,
      // Starting y-Ratio value
      yEndRatio: uint8
      // Ending y-Ratio value
    });
    vTable = new Struct({
      yPelHeight: uint16,
      // yPelHeight to which values apply
      yMax: int16,
      // Maximum value (in pels) for this yPelHeight
      yMin: int16
      // Minimum value (in pels) for this yPelHeight
    });
    VdmxGroup = new Struct({
      recs: uint16,
      // Number of height records in this group
      startsz: uint8,
      // Starting yPelHeight
      endsz: uint8,
      // Ending yPelHeight
      entries: new ArrayT(vTable, "recs")
      // The VDMX records
    });
    VDMX_default = new Struct({
      version: uint16,
      // Version number (0 or 1)
      numRecs: uint16,
      // Number of VDMX groups present
      numRatios: uint16,
      // Number of aspect ratio groupings
      ratioRanges: new ArrayT(Ratio, "numRatios"),
      // Ratio ranges
      offsets: new ArrayT(uint16, "numRatios"),
      // Offset to the VDMX group for this ratio range
      groups: new ArrayT(VdmxGroup, "numRecs")
      // The actual VDMX groupings
    });
  }
});

export {
  VDMX_default,
  init_VDMX
};
