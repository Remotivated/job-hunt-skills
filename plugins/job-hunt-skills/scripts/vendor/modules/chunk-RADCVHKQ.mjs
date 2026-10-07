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
  uint32,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/aat.js
function StateTable(entryData = {}, lookupType = uint16) {
  let entry = Object.assign({
    newState: uint16,
    flags: uint16
  }, entryData);
  let Entry = new Struct(entry);
  let StateArray = new UnboundedArray(new ArrayT(uint16, (t) => t.nClasses));
  let StateHeader = new Struct({
    nClasses: uint32,
    classTable: new Pointer(uint32, new LookupTable(lookupType)),
    stateArray: new Pointer(uint32, StateArray),
    entryTable: new Pointer(uint32, new UnboundedArray(Entry))
  });
  return StateHeader;
}
function StateTable1(entryData = {}, lookupType = uint16) {
  let ClassLookupTable = new Struct({
    version() {
      return 8;
    },
    // simulate LookupTable
    firstGlyph: uint16,
    values: new ArrayT(uint8, uint16)
  });
  let entry = Object.assign({
    newStateOffset: uint16,
    // convert offset to stateArray index
    newState: (t) => (t.newStateOffset - (t.parent.stateArray.base - t.parent._startOffset)) / t.parent.nClasses,
    flags: uint16
  }, entryData);
  let Entry = new Struct(entry);
  let StateArray = new UnboundedArray(new ArrayT(uint8, (t) => t.nClasses));
  let StateHeader1 = new Struct({
    nClasses: uint16,
    classTable: new Pointer(uint16, ClassLookupTable),
    stateArray: new Pointer(uint16, StateArray),
    entryTable: new Pointer(uint16, new UnboundedArray(Entry))
  });
  return StateHeader1;
}
var UnboundedArrayAccessor, UnboundedArray, LookupTable;
var init_aat = __esm({
  "node_modules/fontkit/src/tables/aat.js"() {
    init_restructure();
    UnboundedArrayAccessor = class {
      constructor(type, stream, parent) {
        this.type = type;
        this.stream = stream;
        this.parent = parent;
        this.base = this.stream.pos;
        this._items = [];
      }
      getItem(index) {
        if (this._items[index] == null) {
          let pos = this.stream.pos;
          this.stream.pos = this.base + this.type.size(null, this.parent) * index;
          this._items[index] = this.type.decode(this.stream, this.parent);
          this.stream.pos = pos;
        }
        return this._items[index];
      }
      inspect() {
        return "[UnboundedArray ".concat(this.type.constructor.name, "]");
      }
    };
    UnboundedArray = class extends ArrayT {
      constructor(type) {
        super(type, 0);
      }
      decode(stream, parent) {
        return new UnboundedArrayAccessor(this.type, stream, parent);
      }
    };
    LookupTable = function(ValueType = uint16) {
      class Shadow {
        constructor(type) {
          this.type = type;
        }
        decode(stream, ctx) {
          ctx = ctx.parent.parent;
          return this.type.decode(stream, ctx);
        }
        size(val, ctx) {
          ctx = ctx.parent.parent;
          return this.type.size(val, ctx);
        }
        encode(stream, val, ctx) {
          ctx = ctx.parent.parent;
          return this.type.encode(stream, val, ctx);
        }
      }
      ValueType = new Shadow(ValueType);
      let BinarySearchHeader = new Struct({
        unitSize: uint16,
        nUnits: uint16,
        searchRange: uint16,
        entrySelector: uint16,
        rangeShift: uint16
      });
      let LookupSegmentSingle = new Struct({
        lastGlyph: uint16,
        firstGlyph: uint16,
        value: ValueType
      });
      let LookupSegmentArray = new Struct({
        lastGlyph: uint16,
        firstGlyph: uint16,
        values: new Pointer(uint16, new ArrayT(ValueType, (t) => t.lastGlyph - t.firstGlyph + 1), { type: "parent" })
      });
      let LookupSingle = new Struct({
        glyph: uint16,
        value: ValueType
      });
      return new VersionedStruct(uint16, {
        0: {
          values: new UnboundedArray(ValueType)
          // length == number of glyphs maybe?
        },
        2: {
          binarySearchHeader: BinarySearchHeader,
          segments: new ArrayT(LookupSegmentSingle, (t) => t.binarySearchHeader.nUnits)
        },
        4: {
          binarySearchHeader: BinarySearchHeader,
          segments: new ArrayT(LookupSegmentArray, (t) => t.binarySearchHeader.nUnits)
        },
        6: {
          binarySearchHeader: BinarySearchHeader,
          segments: new ArrayT(LookupSingle, (t) => t.binarySearchHeader.nUnits)
        },
        8: {
          firstGlyph: uint16,
          count: uint16,
          values: new ArrayT(ValueType, "count")
        }
      });
    };
  }
});

export {
  UnboundedArray,
  LookupTable,
  StateTable,
  StateTable1,
  init_aat
};
