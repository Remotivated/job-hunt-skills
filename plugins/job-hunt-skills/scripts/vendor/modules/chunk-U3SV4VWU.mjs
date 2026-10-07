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
  Fixed,
  fixed32,
  uint16,
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/avar.js
var shortFrac, Correspondence, Segment, avar_default;
var init_avar = __esm({
  "node_modules/fontkit/src/tables/avar.js"() {
    init_restructure();
    shortFrac = new Fixed(16, "BE", 14);
    Correspondence = new Struct({
      fromCoord: shortFrac,
      toCoord: shortFrac
    });
    Segment = new Struct({
      pairCount: uint16,
      correspondence: new ArrayT(Correspondence, "pairCount")
    });
    avar_default = new Struct({
      version: fixed32,
      axisCount: uint32,
      segment: new ArrayT(Segment, "axisCount")
    });
  }
});

export {
  avar_default,
  init_avar
};
