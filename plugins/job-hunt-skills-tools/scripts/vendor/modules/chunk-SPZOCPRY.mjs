import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  Base,
  init_Base
} from "./chunk-FIR6EFTM.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/restructure/src/Bitfield.js
var Bitfield;
var init_Bitfield = __esm({
  "node_modules/restructure/src/Bitfield.js"() {
    init_Base();
    Bitfield = class extends Base {
      constructor(type, flags = []) {
        super();
        this.type = type;
        this.flags = flags;
      }
      decode(stream) {
        const val = this.type.decode(stream);
        const res = {};
        for (let i = 0; i < this.flags.length; i++) {
          const flag = this.flags[i];
          if (flag != null) {
            res[flag] = !!(val & 1 << i);
          }
        }
        return res;
      }
      size() {
        return this.type.size();
      }
      encode(stream, keys) {
        let val = 0;
        for (let i = 0; i < this.flags.length; i++) {
          const flag = this.flags[i];
          if (flag != null) {
            if (keys[flag]) {
              val |= 1 << i;
            }
          }
        }
        return this.type.encode(stream, val);
      }
    };
  }
});

export {
  Bitfield,
  init_Bitfield
};
