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
  uint16,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/LTSH.js
var LTSH_default;
var init_LTSH = __esm({
  "node_modules/fontkit/src/tables/LTSH.js"() {
    init_restructure();
    LTSH_default = new Struct({
      version: uint16,
      numGlyphs: uint16,
      yPels: new ArrayT(uint8, "numGlyphs")
    });
  }
});

export {
  LTSH_default,
  init_LTSH
};
