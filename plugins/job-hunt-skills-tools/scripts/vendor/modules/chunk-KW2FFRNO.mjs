import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  ArrayT,
  init_Array
} from "./chunk-KM4TAG6K.mjs";
import {
  init_utils,
  resolveLength
} from "./chunk-5AJOID3U.mjs";
import {
  NumberT,
  init_Number
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/restructure/src/LazyArray.js
var LazyArray, LazyArrayValue;
var init_LazyArray = __esm({
  "node_modules/restructure/src/LazyArray.js"() {
    init_Array();
    init_Number();
    init_utils();
    LazyArray = class extends ArrayT {
      decode(stream, parent) {
        const { pos } = stream;
        const length = resolveLength(this.length, stream, parent);
        if (this.length instanceof NumberT) {
          parent = {
            parent,
            _startOffset: pos,
            _currentOffset: 0,
            _length: length
          };
        }
        const res = new LazyArrayValue(this.type, length, stream, parent);
        stream.pos += length * this.type.size(null, parent);
        return res;
      }
      size(val, ctx) {
        if (val instanceof LazyArrayValue) {
          val = val.toArray();
        }
        return super.size(val, ctx);
      }
      encode(stream, val, ctx) {
        if (val instanceof LazyArrayValue) {
          val = val.toArray();
        }
        return super.encode(stream, val, ctx);
      }
    };
    LazyArrayValue = class {
      constructor(type, length, stream, ctx) {
        this.type = type;
        this.length = length;
        this.stream = stream;
        this.ctx = ctx;
        this.base = this.stream.pos;
        this.items = [];
      }
      get(index) {
        if (index < 0 || index >= this.length) {
          return void 0;
        }
        if (this.items[index] == null) {
          const { pos } = this.stream;
          this.stream.pos = this.base + this.type.size(null, this.ctx) * index;
          this.items[index] = this.type.decode(this.stream, this.ctx);
          this.stream.pos = pos;
        }
        return this.items[index];
      }
      toArray() {
        const result = [];
        for (let i = 0, end = this.length; i < end; i++) {
          result.push(this.get(i));
        }
        return result;
      }
    };
  }
});

export {
  LazyArray,
  init_LazyArray
};
