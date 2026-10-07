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
  Struct
} from "./chunk-2FAS3ON4.mjs";
import {
  fixed32,
  int16,
  uint16
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/opbd.js
var OpticalBounds, opbd_default;
var init_opbd = __esm({
  "node_modules/fontkit/src/tables/opbd.js"() {
    init_restructure();
    init_aat();
    OpticalBounds = new Struct({
      left: int16,
      top: int16,
      right: int16,
      bottom: int16
    });
    opbd_default = new Struct({
      version: fixed32,
      format: uint16,
      lookupTable: new LookupTable(OpticalBounds)
    });
  }
});

export {
  opbd_default,
  init_opbd
};
