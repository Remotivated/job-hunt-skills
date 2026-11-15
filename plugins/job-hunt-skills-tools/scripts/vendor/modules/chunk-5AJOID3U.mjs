import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  NumberT,
  init_Number
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/restructure/src/utils.js
function resolveLength(length, stream, parent) {
  let res;
  if (typeof length === "number") {
    res = length;
  } else if (typeof length === "function") {
    res = length.call(parent, parent);
  } else if (parent && typeof length === "string") {
    res = parent[length];
  } else if (stream && length instanceof NumberT) {
    res = length.decode(stream);
  }
  if (isNaN(res)) {
    throw new Error("Not a fixed size");
  }
  return res;
}
var PropertyDescriptor;
var init_utils = __esm({
  "node_modules/restructure/src/utils.js"() {
    init_Number();
    PropertyDescriptor = class {
      constructor(opts = {}) {
        this.enumerable = true;
        this.configurable = true;
        for (let key in opts) {
          const val = opts[key];
          this[key] = val;
        }
      }
    };
  }
});

export {
  resolveLength,
  PropertyDescriptor,
  init_utils
};
