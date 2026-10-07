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
  Pointer
} from "./chunk-ETHVAYUP.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/cff/CFFPointer.js
var CFFPointer, Ptr;
var init_CFFPointer = __esm({
  "node_modules/fontkit/src/cff/CFFPointer.js"() {
    init_restructure();
    CFFPointer = class extends Pointer {
      constructor(type, options = {}) {
        if (options.type == null) {
          options.type = "global";
        }
        super(null, type, options);
      }
      decode(stream, parent, operands) {
        this.offsetType = {
          decode: () => operands[0]
        };
        return super.decode(stream, parent, operands);
      }
      encode(stream, value, ctx) {
        if (!stream) {
          this.offsetType = {
            size: () => 0
          };
          this.size(value, ctx);
          return [new Ptr(0)];
        }
        let ptr = null;
        this.offsetType = {
          encode: (stream2, val) => ptr = val
        };
        super.encode(stream, value, ctx);
        return [new Ptr(ptr)];
      }
    };
    Ptr = class {
      constructor(val) {
        this.val = val;
        this.forceLarge = true;
      }
      valueOf() {
        return this.val;
      }
    };
  }
});

export {
  CFFPointer,
  init_CFFPointer
};
