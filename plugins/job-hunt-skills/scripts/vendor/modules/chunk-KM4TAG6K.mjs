import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  init_utils,
  resolveLength
} from "./chunk-5AJOID3U.mjs";
import {
  NumberT,
  init_Number
} from "./chunk-TXWX2CMZ.mjs";
import {
  Base,
  init_Base
} from "./chunk-FIR6EFTM.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/restructure/src/Array.js
var ArrayT;
var init_Array = __esm({
  "node_modules/restructure/src/Array.js"() {
    init_Base();
    init_Number();
    init_utils();
    ArrayT = class extends Base {
      constructor(type, length, lengthType = "count") {
        super();
        this.type = type;
        this.length = length;
        this.lengthType = lengthType;
      }
      decode(stream, parent) {
        let length;
        const { pos } = stream;
        const res = [];
        let ctx = parent;
        if (this.length != null) {
          length = resolveLength(this.length, stream, parent);
        }
        if (this.length instanceof NumberT) {
          Object.defineProperties(res, {
            parent: { value: parent },
            _startOffset: { value: pos },
            _currentOffset: { value: 0, writable: true },
            _length: { value: length }
          });
          ctx = res;
        }
        if (length == null || this.lengthType === "bytes") {
          const target = length != null ? stream.pos + length : (parent != null ? parent._length : void 0) ? parent._startOffset + parent._length : stream.length;
          while (stream.pos < target) {
            res.push(this.type.decode(stream, ctx));
          }
        } else {
          for (let i = 0, end = length; i < end; i++) {
            res.push(this.type.decode(stream, ctx));
          }
        }
        return res;
      }
      size(array, ctx, includePointers = true) {
        if (!array) {
          return this.type.size(null, ctx) * resolveLength(this.length, null, ctx);
        }
        let size = 0;
        if (this.length instanceof NumberT) {
          size += this.length.size();
          ctx = { parent: ctx, pointerSize: 0 };
        }
        for (let item of array) {
          size += this.type.size(item, ctx);
        }
        if (ctx && includePointers && this.length instanceof NumberT) {
          size += ctx.pointerSize;
        }
        return size;
      }
      encode(stream, array, parent) {
        let ctx = parent;
        if (this.length instanceof NumberT) {
          ctx = {
            pointers: [],
            startOffset: stream.pos,
            parent
          };
          ctx.pointerOffset = stream.pos + this.size(array, ctx, false);
          this.length.encode(stream, array.length);
        }
        for (let item of array) {
          this.type.encode(stream, item, ctx);
        }
        if (this.length instanceof NumberT) {
          let i = 0;
          while (i < ctx.pointers.length) {
            const ptr = ctx.pointers[i++];
            ptr.type.encode(stream, ptr.val, ptr.parent);
          }
        }
      }
    };
  }
});

export {
  ArrayT,
  init_Array
};
