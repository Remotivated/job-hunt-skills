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
  Bitfield
} from "./chunk-SPZOCPRY.mjs";
import {
  int16,
  int32,
  uint16,
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/head.js
var head_default;
var init_head = __esm({
  "node_modules/fontkit/src/tables/head.js"() {
    init_restructure();
    head_default = new Struct({
      version: int32,
      // 0x00010000 (version 1.0)
      revision: int32,
      // set by font manufacturer
      checkSumAdjustment: uint32,
      magicNumber: uint32,
      // set to 0x5F0F3CF5
      flags: uint16,
      unitsPerEm: uint16,
      // range from 64 to 16384
      created: new ArrayT(int32, 2),
      modified: new ArrayT(int32, 2),
      xMin: int16,
      // for all glyph bounding boxes
      yMin: int16,
      // for all glyph bounding boxes
      xMax: int16,
      // for all glyph bounding boxes
      yMax: int16,
      // for all glyph bounding boxes
      macStyle: new Bitfield(uint16, [
        "bold",
        "italic",
        "underline",
        "outline",
        "shadow",
        "condensed",
        "extended"
      ]),
      lowestRecPPEM: uint16,
      // smallest readable size in pixels
      fontDirectionHint: int16,
      indexToLocFormat: int16,
      // 0 for short offsets, 1 for long
      glyphDataFormat: int16
      // 0 for current format
    });
  }
});

export {
  head_default,
  init_head
};
