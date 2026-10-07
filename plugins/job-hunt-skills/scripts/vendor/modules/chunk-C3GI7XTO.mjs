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
  resolveLength
} from "./chunk-5AJOID3U.mjs";
import {
  uint16,
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/HVAR.js
var VariableSizeNumber, MapDataEntry, DeltaSetIndexMap, HVAR_default;
var init_HVAR = __esm({
  "node_modules/fontkit/src/tables/HVAR.js"() {
    init_restructure();
    init_restructure();
    init_variations();
    VariableSizeNumber = class {
      constructor(size) {
        this._size = size;
      }
      decode(stream, parent) {
        switch (this.size(0, parent)) {
          case 1:
            return stream.readUInt8();
          case 2:
            return stream.readUInt16BE();
          case 3:
            return stream.readUInt24BE();
          case 4:
            return stream.readUInt32BE();
        }
      }
      size(val, parent) {
        return resolveLength(this._size, null, parent);
      }
    };
    MapDataEntry = new Struct({
      entry: new VariableSizeNumber((t) => ((t.parent.entryFormat & 48) >> 4) + 1),
      outerIndex: (t) => t.entry >> (t.parent.entryFormat & 15) + 1,
      innerIndex: (t) => t.entry & (1 << (t.parent.entryFormat & 15) + 1) - 1
    });
    DeltaSetIndexMap = new Struct({
      entryFormat: uint16,
      mapCount: uint16,
      mapData: new ArrayT(MapDataEntry, "mapCount")
    });
    HVAR_default = new Struct({
      majorVersion: uint16,
      minorVersion: uint16,
      itemVariationStore: new Pointer(uint32, ItemVariationStore),
      advanceWidthMapping: new Pointer(uint32, DeltaSetIndexMap),
      LSBMapping: new Pointer(uint32, DeltaSetIndexMap),
      RSBMapping: new Pointer(uint32, DeltaSetIndexMap)
    });
  }
});

export {
  HVAR_default,
  init_HVAR
};
