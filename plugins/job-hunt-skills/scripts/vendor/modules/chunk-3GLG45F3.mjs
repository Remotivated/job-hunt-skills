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
  Optional
} from "./chunk-VTOYGDRI.mjs";
import {
  Reserved
} from "./chunk-TSASLJV5.mjs";
import {
  StringT
} from "./chunk-CJLFWYXH.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  uint16,
  uint32,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/WOFF2Directory.js
var Base128, knownTags, WOFF2DirectoryEntry, WOFF2Directory, WOFF2Directory_default;
var init_WOFF2Directory = __esm({
  "node_modules/fontkit/src/tables/WOFF2Directory.js"() {
    init_restructure();
    Base128 = {
      decode(stream) {
        let result = 0;
        let iterable = [0, 1, 2, 3, 4];
        for (let j = 0; j < iterable.length; j++) {
          let i = iterable[j];
          let code = stream.readUInt8();
          if (result & 3758096384) {
            throw new Error("Overflow");
          }
          result = result << 7 | code & 127;
          if ((code & 128) === 0) {
            return result;
          }
        }
        throw new Error("Bad base 128 number");
      }
    };
    knownTags = [
      "cmap",
      "head",
      "hhea",
      "hmtx",
      "maxp",
      "name",
      "OS/2",
      "post",
      "cvt ",
      "fpgm",
      "glyf",
      "loca",
      "prep",
      "CFF ",
      "VORG",
      "EBDT",
      "EBLC",
      "gasp",
      "hdmx",
      "kern",
      "LTSH",
      "PCLT",
      "VDMX",
      "vhea",
      "vmtx",
      "BASE",
      "GDEF",
      "GPOS",
      "GSUB",
      "EBSC",
      "JSTF",
      "MATH",
      "CBDT",
      "CBLC",
      "COLR",
      "CPAL",
      "SVG ",
      "sbix",
      "acnt",
      "avar",
      "bdat",
      "bloc",
      "bsln",
      "cvar",
      "fdsc",
      "feat",
      "fmtx",
      "fvar",
      "gvar",
      "hsty",
      "just",
      "lcar",
      "mort",
      "morx",
      "opbd",
      "prop",
      "trak",
      "Zapf",
      "Silf",
      "Glat",
      "Gloc",
      "Feat",
      "Sill"
    ];
    WOFF2DirectoryEntry = new Struct({
      flags: uint8,
      customTag: new Optional(new StringT(4), (t) => (t.flags & 63) === 63),
      tag: (t) => t.customTag || knownTags[t.flags & 63],
      // || (() => { throw new Error(`Bad tag: ${flags & 0x3f}`); })(); },
      length: Base128,
      transformVersion: (t) => t.flags >>> 6 & 3,
      transformed: (t) => t.tag === "glyf" || t.tag === "loca" ? t.transformVersion === 0 : t.transformVersion !== 0,
      transformLength: new Optional(Base128, (t) => t.transformed)
    });
    WOFF2Directory = new Struct({
      tag: new StringT(4),
      // should be 'wOF2'
      flavor: uint32,
      length: uint32,
      numTables: uint16,
      reserved: new Reserved(uint16),
      totalSfntSize: uint32,
      totalCompressedSize: uint32,
      majorVersion: uint16,
      minorVersion: uint16,
      metaOffset: uint32,
      metaLength: uint32,
      metaOrigLength: uint32,
      privOffset: uint32,
      privLength: uint32,
      tables: new ArrayT(WOFF2DirectoryEntry, "numTables")
    });
    WOFF2Directory.process = function() {
      let tables = {};
      for (let i = 0; i < this.tables.length; i++) {
        let table = this.tables[i];
        tables[table.tag] = table;
      }
      return this.tables = tables;
    };
    WOFF2Directory_default = WOFF2Directory;
  }
});

export {
  WOFF2Directory_default,
  init_WOFF2Directory
};
