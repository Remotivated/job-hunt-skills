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
  uint16
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/vhea.js
var vhea_default;
var init_vhea = __esm({
  "node_modules/fontkit/src/tables/vhea.js"() {
    init_restructure();
    vhea_default = new Struct({
      version: uint16,
      // Version number of the Vertical Header Table
      ascent: int16,
      // The vertical typographic ascender for this font
      descent: int16,
      // The vertical typographic descender for this font
      lineGap: int16,
      // The vertical typographic line gap for this font
      advanceHeightMax: int16,
      // The maximum advance height measurement found in the font
      minTopSideBearing: int16,
      // The minimum top side bearing measurement found in the font
      minBottomSideBearing: int16,
      // The minimum bottom side bearing measurement found in the font
      yMaxExtent: int16,
      caretSlopeRise: int16,
      // Caret slope (rise/run)
      caretSlopeRun: int16,
      caretOffset: int16,
      // Set value equal to 0 for nonslanted fonts
      reserved: new Reserved(int16, 4),
      metricDataFormat: int16,
      // Set to 0
      numberOfMetrics: uint16
      // Number of advance heights in the Vertical Metrics table
    });
  }
});

export {
  vhea_default,
  init_vhea
};
