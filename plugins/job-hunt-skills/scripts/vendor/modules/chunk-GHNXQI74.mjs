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
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/WOFFDirectory.js
var WOFFDirectoryEntry, WOFFDirectory, WOFFDirectory_default;
var init_WOFFDirectory = __esm({
  "node_modules/fontkit/src/tables/WOFFDirectory.js"() {
    init_restructure();
    WOFFDirectoryEntry = new Struct({
      tag: new StringT(4),
      offset: new Pointer(uint32, "void", { type: "global" }),
      compLength: uint32,
      length: uint32,
      origChecksum: uint32
    });
    WOFFDirectory = new Struct({
      tag: new StringT(4),
      // should be 'wOFF'
      flavor: uint32,
      length: uint32,
      numTables: uint16,
      reserved: new Reserved(uint16),
      totalSfntSize: uint32,
      majorVersion: uint16,
      minorVersion: uint16,
      metaOffset: uint32,
      metaLength: uint32,
      metaOrigLength: uint32,
      privOffset: uint32,
      privLength: uint32,
      tables: new ArrayT(WOFFDirectoryEntry, "numTables")
    });
    WOFFDirectory.process = function() {
      let tables = {};
      for (let table of this.tables) {
        tables[table.tag] = table;
      }
      this.tables = tables;
    };
    WOFFDirectory_default = WOFFDirectory;
  }
});

export {
  WOFFDirectory_default,
  init_WOFFDirectory
};
