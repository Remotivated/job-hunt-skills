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
  uint16,
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/COLR.js
var LayerRecord, BaseGlyphRecord, COLR_default;
var init_COLR = __esm({
  "node_modules/fontkit/src/tables/COLR.js"() {
    init_restructure();
    LayerRecord = new Struct({
      gid: uint16,
      // Glyph ID of layer glyph (must be in z-order from bottom to top).
      paletteIndex: uint16
      // Index value to use in the appropriate palette. This value must
    });
    BaseGlyphRecord = new Struct({
      gid: uint16,
      // Glyph ID of reference glyph. This glyph is for reference only
      // and is not rendered for color.
      firstLayerIndex: uint16,
      // Index (from beginning of the Layer Records) to the layer record.
      // There will be numLayers consecutive entries for this base glyph.
      numLayers: uint16
    });
    COLR_default = new Struct({
      version: uint16,
      numBaseGlyphRecords: uint16,
      baseGlyphRecord: new Pointer(uint32, new ArrayT(BaseGlyphRecord, "numBaseGlyphRecords")),
      layerRecords: new Pointer(uint32, new ArrayT(LayerRecord, "numLayerRecords"), { lazy: true }),
      numLayerRecords: uint16
    });
  }
});

export {
  COLR_default,
  init_COLR
};
