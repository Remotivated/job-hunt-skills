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
  int16,
  int32,
  uint16
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/hhea.js
var hhea_default;
var init_hhea = __esm({
  "node_modules/fontkit/src/tables/hhea.js"() {
    init_restructure();
    hhea_default = new Struct({
      version: int32,
      ascent: int16,
      // Distance from baseline of highest ascender
      descent: int16,
      // Distance from baseline of lowest descender
      lineGap: int16,
      // Typographic line gap
      advanceWidthMax: uint16,
      // Maximum advance width value in 'hmtx' table
      minLeftSideBearing: int16,
      // Maximum advance width value in 'hmtx' table
      minRightSideBearing: int16,
      // Minimum right sidebearing value
      xMaxExtent: int16,
      caretSlopeRise: int16,
      // Used to calculate the slope of the cursor (rise/run); 1 for vertical
      caretSlopeRun: int16,
      // 0 for vertical
      caretOffset: int16,
      // Set to 0 for non-slanted fonts
      reserved: new Reserved(int16, 4),
      metricDataFormat: int16,
      // 0 for current format
      numberOfMetrics: uint16
      // Number of advance widths in 'hmtx' table
    });
  }
});

export {
  hhea_default,
  init_hhea
};
