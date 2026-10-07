import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  init_tables,
  tables_default
} from "./chunk-RK2F5G2B.mjs";
import {
  init_restructure
} from "./chunk-YFRH6662.mjs";
import {
  Struct
} from "./chunk-2FAS3ON4.mjs";
import {
  Pointer,
  VoidPointer
} from "./chunk-ETHVAYUP.mjs";
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

// node_modules/fontkit/src/tables/directory.js
var TableEntry, Directory, directory_default;
var init_directory = __esm({
  "node_modules/fontkit/src/tables/directory.js"() {
    init_restructure();
    init_tables();
    TableEntry = new Struct({
      tag: new StringT(4),
      checkSum: uint32,
      offset: new Pointer(uint32, "void", { type: "global" }),
      length: uint32
    });
    Directory = new Struct({
      tag: new StringT(4),
      numTables: uint16,
      searchRange: uint16,
      entrySelector: uint16,
      rangeShift: uint16,
      tables: new ArrayT(TableEntry, "numTables")
    });
    Directory.process = function() {
      let tables = {};
      for (let table of this.tables) {
        tables[table.tag] = table;
      }
      this.tables = tables;
    };
    Directory.preEncode = function() {
      if (!Array.isArray(this.tables)) {
        let tables = [];
        for (let tag in this.tables) {
          let table = this.tables[tag];
          if (table) {
            tables.push({
              tag,
              checkSum: 0,
              offset: new VoidPointer(tables_default[tag], table),
              length: tables_default[tag].size(table)
            });
          }
        }
        this.tables = tables;
      }
      this.tag = "true";
      this.numTables = this.tables.length;
      let maxExponentFor2 = Math.floor(Math.log(this.numTables) / Math.LN2);
      let maxPowerOf2 = Math.pow(2, maxExponentFor2);
      this.searchRange = maxPowerOf2 * 16;
      this.entrySelector = Math.log(maxPowerOf2) / Math.LN2;
      this.rangeShift = this.numTables * 16 - this.searchRange;
    };
    directory_default = Directory;
  }
});

export {
  directory_default,
  init_directory
};
