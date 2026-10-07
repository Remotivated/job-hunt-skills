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
  int32,
  uint16,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/hdmx.js
var DeviceRecord, hdmx_default;
var init_hdmx = __esm({
  "node_modules/fontkit/src/tables/hdmx.js"() {
    init_restructure();
    DeviceRecord = new Struct({
      pixelSize: uint8,
      maximumWidth: uint8,
      widths: new ArrayT(uint8, (t) => t.parent.parent.maxp.numGlyphs)
    });
    hdmx_default = new Struct({
      version: uint16,
      numRecords: int16,
      sizeDeviceRecord: int32,
      records: new ArrayT(DeviceRecord, "numRecords")
    });
  }
});

export {
  hdmx_default,
  init_hdmx
};
