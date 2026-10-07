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

// node_modules/restructure/src/Optional.js
var Optional;
var init_Optional = __esm({
  "node_modules/restructure/src/Optional.js"() {
    init_Base();
    Optional = class extends Base {
      constructor(type, condition = true) {
        super();
        this.type = type;
        this.condition = condition;
      }
      decode(stream, parent) {
        let { condition } = this;
        if (typeof condition === "function") {
          condition = condition.call(parent, parent);
        }
        if (condition) {
          return this.type.decode(stream, parent);
        }
      }
      size(val, parent) {
        let { condition } = this;
        if (typeof condition === "function") {
          condition = condition.call(parent, parent);
        }
        if (condition) {
          return this.type.size(val, parent);
        } else {
          return 0;
        }
      }
      encode(stream, val, parent) {
        let { condition } = this;
        if (typeof condition === "function") {
          condition = condition.call(parent, parent);
        }
        if (condition) {
          return this.type.encode(stream, val, parent);
        }
      }
    };
  }
});

export {
  Optional,
  init_Optional
};
