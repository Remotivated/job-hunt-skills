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
  Bitfield
} from "./chunk-SPZOCPRY.mjs";
import {
  int16,
  uint16,
  uint32,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/OS2.js
var OS2, versions, OS2_default;
var init_OS2 = __esm({
  "node_modules/fontkit/src/tables/OS2.js"() {
    init_restructure();
    OS2 = new VersionedStruct(uint16, {
      header: {
        xAvgCharWidth: int16,
        // average weighted advance width of lower case letters and space
        usWeightClass: uint16,
        // visual weight of stroke in glyphs
        usWidthClass: uint16,
        // relative change from the normal aspect ratio (width to height ratio)
        fsType: new Bitfield(uint16, [
          // Indicates font embedding licensing rights
          null,
          "noEmbedding",
          "viewOnly",
          "editable",
          null,
          null,
          null,
          null,
          "noSubsetting",
          "bitmapOnly"
        ]),
        ySubscriptXSize: int16,
        // recommended horizontal size in pixels for subscripts
        ySubscriptYSize: int16,
        // recommended vertical size in pixels for subscripts
        ySubscriptXOffset: int16,
        // recommended horizontal offset for subscripts
        ySubscriptYOffset: int16,
        // recommended vertical offset form the baseline for subscripts
        ySuperscriptXSize: int16,
        // recommended horizontal size in pixels for superscripts
        ySuperscriptYSize: int16,
        // recommended vertical size in pixels for superscripts
        ySuperscriptXOffset: int16,
        // recommended horizontal offset for superscripts
        ySuperscriptYOffset: int16,
        // recommended vertical offset from the baseline for superscripts
        yStrikeoutSize: int16,
        // width of the strikeout stroke
        yStrikeoutPosition: int16,
        // position of the strikeout stroke relative to the baseline
        sFamilyClass: int16,
        // classification of font-family design
        panose: new ArrayT(uint8, 10),
        // describe the visual characteristics of a given typeface
        ulCharRange: new ArrayT(uint32, 4),
        vendorID: new StringT(4),
        // four character identifier for the font vendor
        fsSelection: new Bitfield(uint16, [
          // bit field containing information about the font
          "italic",
          "underscore",
          "negative",
          "outlined",
          "strikeout",
          "bold",
          "regular",
          "useTypoMetrics",
          "wws",
          "oblique"
        ]),
        usFirstCharIndex: uint16,
        // The minimum Unicode index in this font
        usLastCharIndex: uint16
        // The maximum Unicode index in this font
      },
      // The Apple version of this table ends here, but the Microsoft one continues on...
      0: {},
      1: {
        typoAscender: int16,
        typoDescender: int16,
        typoLineGap: int16,
        winAscent: uint16,
        winDescent: uint16,
        codePageRange: new ArrayT(uint32, 2)
      },
      2: {
        // these should be common with version 1 somehow
        typoAscender: int16,
        typoDescender: int16,
        typoLineGap: int16,
        winAscent: uint16,
        winDescent: uint16,
        codePageRange: new ArrayT(uint32, 2),
        xHeight: int16,
        capHeight: int16,
        defaultChar: uint16,
        breakChar: uint16,
        maxContent: uint16
      },
      5: {
        typoAscender: int16,
        typoDescender: int16,
        typoLineGap: int16,
        winAscent: uint16,
        winDescent: uint16,
        codePageRange: new ArrayT(uint32, 2),
        xHeight: int16,
        capHeight: int16,
        defaultChar: uint16,
        breakChar: uint16,
        maxContent: uint16,
        usLowerOpticalPointSize: uint16,
        usUpperOpticalPointSize: uint16
      }
    });
    versions = OS2.versions;
    versions[3] = versions[4] = versions[2];
    OS2_default = OS2;
  }
});

export {
  OS2_default,
  init_OS2
};
