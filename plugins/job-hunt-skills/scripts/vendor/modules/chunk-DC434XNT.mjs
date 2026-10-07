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
  Reserved
} from "./chunk-TSASLJV5.mjs";
import {
  StringT
} from "./chunk-CJLFWYXH.mjs";
import {
  uint16,
  uint32,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/PCLT.js
var PCLT_default;
var init_PCLT = __esm({
  "node_modules/fontkit/src/tables/PCLT.js"() {
    init_restructure();
    PCLT_default = new Struct({
      version: uint16,
      fontNumber: uint32,
      pitch: uint16,
      xHeight: uint16,
      style: uint16,
      typeFamily: uint16,
      capHeight: uint16,
      symbolSet: uint16,
      typeface: new StringT(16),
      characterComplement: new StringT(8),
      fileName: new StringT(6),
      strokeWeight: new StringT(1),
      widthType: new StringT(1),
      serifStyle: uint8,
      reserved: new Reserved(uint8)
    });
  }
});

export {
  PCLT_default,
  init_PCLT
};
