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

// node_modules/restructure/src/Pointer.js
var Pointer, VoidPointer;
var init_Pointer = __esm({
  "node_modules/restructure/src/Pointer.js"() {
    init_utils();
    init_Base();
    Pointer = class extends Base {
      constructor(offsetType, type, options = {}) {
        super();
        this.offsetType = offsetType;
        this.type = type;
        this.options = options;
        if (this.type === "void") {
          this.type = null;
        }
        if (this.options.type == null) {
          this.options.type = "local";
        }
        if (this.options.allowNull == null) {
          this.options.allowNull = true;
        }
        if (this.options.nullValue == null) {
          this.options.nullValue = 0;
        }
        if (this.options.lazy == null) {
          this.options.lazy = false;
        }
        if (this.options.relativeTo) {
          if (typeof this.options.relativeTo !== "function") {
            throw new Error("relativeTo option must be a function");
          }
          this.relativeToGetter = options.relativeTo;
        }
      }
      decode(stream, ctx) {
        const offset = this.offsetType.decode(stream, ctx);
        if (offset === this.options.nullValue && this.options.allowNull) {
          return null;
        }
        let relative;
        switch (this.options.type) {
          case "local":
            relative = ctx._startOffset;
            break;
          case "immediate":
            relative = stream.pos - this.offsetType.size();
            break;
          case "parent":
            relative = ctx.parent._startOffset;
            break;
          default:
            var c = ctx;
            while (c.parent) {
              c = c.parent;
            }
            relative = c._startOffset || 0;
        }
        if (this.options.relativeTo) {
          relative += this.relativeToGetter(ctx);
        }
        const ptr = offset + relative;
        if (this.type != null) {
          let val = null;
          const decodeValue = () => {
            if (val != null) {
              return val;
            }
            const { pos } = stream;
            stream.pos = ptr;
            val = this.type.decode(stream, ctx);
            stream.pos = pos;
            return val;
          };
          if (this.options.lazy) {
            return new PropertyDescriptor({
              get: decodeValue
            });
          }
          return decodeValue();
        } else {
          return ptr;
        }
      }
      size(val, ctx) {
        const parent = ctx;
        switch (this.options.type) {
          case "local":
          case "immediate":
            break;
          case "parent":
            ctx = ctx.parent;
            break;
          default:
            while (ctx.parent) {
              ctx = ctx.parent;
            }
        }
        let { type } = this;
        if (type == null) {
          if (!(val instanceof VoidPointer)) {
            throw new Error("Must be a VoidPointer");
          }
          ({ type } = val);
          val = val.value;
        }
        if (val && ctx) {
          let size = type.size(val, parent);
          ctx.pointerSize += size;
        }
        return this.offsetType.size();
      }
      encode(stream, val, ctx) {
        let relative;
        const parent = ctx;
        if (val == null) {
          this.offsetType.encode(stream, this.options.nullValue);
          return;
        }
        switch (this.options.type) {
          case "local":
            relative = ctx.startOffset;
            break;
          case "immediate":
            relative = stream.pos + this.offsetType.size(val, parent);
            break;
          case "parent":
            ctx = ctx.parent;
            relative = ctx.startOffset;
            break;
          default:
            relative = 0;
            while (ctx.parent) {
              ctx = ctx.parent;
            }
        }
        if (this.options.relativeTo) {
          relative += this.relativeToGetter(parent.val);
        }
        this.offsetType.encode(stream, ctx.pointerOffset - relative);
        let { type } = this;
        if (type == null) {
          if (!(val instanceof VoidPointer)) {
            throw new Error("Must be a VoidPointer");
          }
          ({ type } = val);
          val = val.value;
        }
        ctx.pointers.push({
          type,
          val,
          parent
        });
        return ctx.pointerOffset += type.size(val, parent);
      }
    };
    VoidPointer = class {
      constructor(type, value) {
        this.type = type;
        this.value = value;
      }
    };
  }
});

export {
  Pointer,
  VoidPointer,
  init_Pointer
};
