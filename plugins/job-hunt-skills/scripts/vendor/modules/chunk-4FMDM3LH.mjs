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
  Pointer
} from "./chunk-ETHVAYUP.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  Bitfield
} from "./chunk-SPZOCPRY.mjs";
import {
  uint16,
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/sbix.js
var ImageTable, sbix_default;
var init_sbix = __esm({
  "node_modules/fontkit/src/tables/sbix.js"() {
    init_restructure();
    ImageTable = new Struct({
      ppem: uint16,
      resolution: uint16,
      imageOffsets: new ArrayT(new Pointer(uint32, "void"), (t) => t.parent.parent.maxp.numGlyphs + 1)
    });
    sbix_default = new Struct({
      version: uint16,
      flags: new Bitfield(uint16, ["renderOutlines"]),
      numImgTables: uint32,
      imageTables: new ArrayT(new Pointer(uint32, ImageTable), "numImgTables")
    });
  }
});

export {
  sbix_default,
  init_sbix
};
