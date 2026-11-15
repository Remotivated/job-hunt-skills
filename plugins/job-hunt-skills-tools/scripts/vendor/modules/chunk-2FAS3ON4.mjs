import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  PropertyDescriptor,
  init_utils
} from "./chunk-5AJOID3U.mjs";
import {
  Base,
  init_Base
} from "./chunk-FIR6EFTM.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/restructure/src/Struct.js
var Struct;
var init_Struct = __esm({
  "node_modules/restructure/src/Struct.js"() {
    init_Base();
    init_utils();
    Struct = class extends Base {
      constructor(fields = {}) {
        super();
        this.fields = fields;
      }
      decode(stream, parent, length = 0) {
        const res = this._setup(stream, parent, length);
        this._parseFields(stream, res, this.fields);
        if (this.process != null) {
          this.process.call(res, stream);
        }
        return res;
      }
      _setup(stream, parent, length) {
        const res = {};
        Object.defineProperties(res, {
          parent: { value: parent },
          _startOffset: { value: stream.pos },
          _currentOffset: { value: 0, writable: true },
          _length: { value: length }
        });
        return res;
      }
      _parseFields(stream, res, fields) {
        for (let key in fields) {
          var val;
          const type = fields[key];
          if (typeof type === "function") {
            val = type.call(res, res);
          } else {
            val = type.decode(stream, res);
          }
          if (val !== void 0) {
            if (val instanceof PropertyDescriptor) {
              Object.defineProperty(res, key, val);
            } else {
              res[key] = val;
            }
          }
          res._currentOffset = stream.pos - res._startOffset;
        }
      }
      size(val, parent, includePointers = true) {
        if (val == null) {
          val = {};
        }
        const ctx = {
          parent,
          val,
          pointerSize: 0
        };
        if (this.preEncode != null) {
          this.preEncode.call(val);
        }
        let size = 0;
        for (let key in this.fields) {
          const type = this.fields[key];
          if (type.size != null) {
            size += type.size(val[key], ctx);
          }
        }
        if (includePointers) {
          size += ctx.pointerSize;
        }
        return size;
      }
      encode(stream, val, parent) {
        let type;
        if (this.preEncode != null) {
          this.preEncode.call(val, stream);
        }
        const ctx = {
          pointers: [],
          startOffset: stream.pos,
          parent,
          val,
          pointerSize: 0
        };
        ctx.pointerOffset = stream.pos + this.size(val, ctx, false);
        for (let key in this.fields) {
          type = this.fields[key];
          if (type.encode != null) {
            type.encode(stream, val[key], ctx);
          }
        }
        let i = 0;
        while (i < ctx.pointers.length) {
          const ptr = ctx.pointers[i++];
          ptr.type.encode(stream, ptr.val, ptr.parent);
        }
      }
    };
  }
});

export {
  Struct,
  init_Struct
};
