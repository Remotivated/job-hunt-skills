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

// node_modules/restructure/src/Boolean.js
var BooleanT;
var init_Boolean = __esm({
  "node_modules/restructure/src/Boolean.js"() {
    init_Base();
    BooleanT = class extends Base {
      constructor(type) {
        super();
        this.type = type;
      }
      decode(stream, parent) {
        return !!this.type.decode(stream, parent);
      }
      size(val, parent) {
        return this.type.size(val, parent);
      }
      encode(stream, val, parent) {
        return this.type.encode(stream, +val, parent);
      }
    };
  }
});

export {
  BooleanT,
  init_Boolean
};
