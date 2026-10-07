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
  LazyArray
} from "./chunk-KW2FFRNO.mjs";
import {
  int16,
  uint16
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/vmtx.js
var VmtxEntry, vmtx_default;
var init_vmtx = __esm({
  "node_modules/fontkit/src/tables/vmtx.js"() {
    init_restructure();
    VmtxEntry = new Struct({
      advance: uint16,
      // The advance height of the glyph
      bearing: int16
      // The top sidebearing of the glyph
    });
    vmtx_default = new Struct({
      metrics: new LazyArray(VmtxEntry, (t) => t.parent.vhea.numberOfMetrics),
      bearings: new LazyArray(int16, (t) => t.parent.maxp.numGlyphs - t.parent.vhea.numberOfMetrics)
    });
  }
});

export {
  vmtx_default,
  init_vmtx
};
