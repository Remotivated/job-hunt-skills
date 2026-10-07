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
  VersionedStruct
} from "./chunk-DCBC6YOO.mjs";
import {
  StringT
} from "./chunk-CJLFWYXH.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  fixed32,
  int16,
  uint16,
  uint32,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/post.js
var post_default;
var init_post = __esm({
  "node_modules/fontkit/src/tables/post.js"() {
    init_restructure();
    post_default = new VersionedStruct(fixed32, {
      header: {
        // these fields exist at the top of all versions
        italicAngle: fixed32,
        // Italic angle in counter-clockwise degrees from the vertical.
        underlinePosition: int16,
        // Suggested distance of the top of the underline from the baseline
        underlineThickness: int16,
        // Suggested values for the underline thickness
        isFixedPitch: uint32,
        // Whether the font is monospaced
        minMemType42: uint32,
        // Minimum memory usage when a TrueType font is downloaded as a Type 42 font
        maxMemType42: uint32,
        // Maximum memory usage when a TrueType font is downloaded as a Type 42 font
        minMemType1: uint32,
        // Minimum memory usage when a TrueType font is downloaded as a Type 1 font
        maxMemType1: uint32
        // Maximum memory usage when a TrueType font is downloaded as a Type 1 font
      },
      1: {},
      // version 1 has no additional fields
      2: {
        numberOfGlyphs: uint16,
        glyphNameIndex: new ArrayT(uint16, "numberOfGlyphs"),
        names: new ArrayT(new StringT(uint8))
      },
      2.5: {
        numberOfGlyphs: uint16,
        offsets: new ArrayT(uint8, "numberOfGlyphs")
      },
      3: {},
      // version 3 has no additional fields
      4: {
        map: new ArrayT(uint32, (t) => t.parent.maxp.numGlyphs)
      }
    });
  }
});

export {
  post_default,
  init_post
};
