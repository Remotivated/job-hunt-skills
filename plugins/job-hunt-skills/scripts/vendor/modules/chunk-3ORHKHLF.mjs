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
  uint16
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/VORG.js
var VerticalOrigin, VORG_default;
var init_VORG = __esm({
  "node_modules/fontkit/src/tables/VORG.js"() {
    init_restructure();
    VerticalOrigin = new Struct({
      glyphIndex: uint16,
      vertOriginY: int16
    });
    VORG_default = new Struct({
      majorVersion: uint16,
      minorVersion: uint16,
      defaultVertOriginY: int16,
      numVertOriginYMetrics: uint16,
      metrics: new ArrayT(VerticalOrigin, "numVertOriginYMetrics")
    });
  }
});

export {
  VORG_default,
  init_VORG
};
