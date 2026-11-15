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

// node_modules/restructure/src/Enum.js
var Enum;
var init_Enum = __esm({
  "node_modules/restructure/src/Enum.js"() {
    init_Base();
    Enum = class extends Base {
      constructor(type, options = []) {
        super();
        this.type = type;
        this.options = options;
      }
      decode(stream) {
        const index = this.type.decode(stream);
        return this.options[index] || index;
      }
      size() {
        return this.type.size();
      }
      encode(stream, val) {
        const index = this.options.indexOf(val);
        if (index === -1) {
          throw new Error("Unknown option in enum: ".concat(val));
        }
        return this.type.encode(stream, index);
      }
    };
  }
});

export {
  Enum,
  init_Enum
};
