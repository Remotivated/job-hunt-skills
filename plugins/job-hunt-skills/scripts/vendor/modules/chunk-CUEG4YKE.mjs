import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  ItemVariationStore,
  init_variations
} from "./chunk-ZQOIF36D.mjs";
import {
  ClassDef,
  Coverage,
  Device,
  init_opentype
} from "./chunk-3W5UVUMY.mjs";
import {
  init_restructure
} from "./chunk-YFRH6662.mjs";
import {
  VersionedStruct
} from "./chunk-DCBC6YOO.mjs";
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
  int16,
  uint16,
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/GDEF.js
var AttachPoint, AttachList, CaretValue, LigGlyph, LigCaretList, MarkGlyphSetsDef, GDEF_default;
var init_GDEF = __esm({
  "node_modules/fontkit/src/tables/GDEF.js"() {
    init_restructure();
    init_opentype();
    init_variations();
    AttachPoint = new ArrayT(uint16, uint16);
    AttachList = new Struct({
      coverage: new Pointer(uint16, Coverage),
      glyphCount: uint16,
      attachPoints: new ArrayT(new Pointer(uint16, AttachPoint), "glyphCount")
    });
    CaretValue = new VersionedStruct(uint16, {
      1: {
        // Design units only
        coordinate: int16
      },
      2: {
        // Contour point
        caretValuePoint: uint16
      },
      3: {
        // Design units plus Device table
        coordinate: int16,
        deviceTable: new Pointer(uint16, Device)
      }
    });
    LigGlyph = new ArrayT(new Pointer(uint16, CaretValue), uint16);
    LigCaretList = new Struct({
      coverage: new Pointer(uint16, Coverage),
      ligGlyphCount: uint16,
      ligGlyphs: new ArrayT(new Pointer(uint16, LigGlyph), "ligGlyphCount")
    });
    MarkGlyphSetsDef = new Struct({
      markSetTableFormat: uint16,
      markSetCount: uint16,
      coverage: new ArrayT(new Pointer(uint32, Coverage), "markSetCount")
    });
    GDEF_default = new VersionedStruct(uint32, {
      header: {
        glyphClassDef: new Pointer(uint16, ClassDef),
        attachList: new Pointer(uint16, AttachList),
        ligCaretList: new Pointer(uint16, LigCaretList),
        markAttachClassDef: new Pointer(uint16, ClassDef)
      },
      65536: {},
      65538: {
        markGlyphSetsDef: new Pointer(uint16, MarkGlyphSetsDef)
      },
      65539: {
        markGlyphSetsDef: new Pointer(uint16, MarkGlyphSetsDef),
        itemVariationStore: new Pointer(uint32, ItemVariationStore)
      }
    });
  }
});

export {
  GDEF_default,
  init_GDEF
};
