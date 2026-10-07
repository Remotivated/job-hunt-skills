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

// node_modules/fontkit/src/tables/hmtx.js
var HmtxEntry, hmtx_default;
var init_hmtx = __esm({
  "node_modules/fontkit/src/tables/hmtx.js"() {
    init_restructure();
    HmtxEntry = new Struct({
      advance: uint16,
      bearing: int16
    });
    hmtx_default = new Struct({
      metrics: new LazyArray(HmtxEntry, (t) => t.parent.hhea.numberOfMetrics),
      bearings: new LazyArray(int16, (t) => t.parent.maxp.numGlyphs - t.parent.hhea.numberOfMetrics)
    });
  }
});

export {
  hmtx_default,
  init_hmtx
};
