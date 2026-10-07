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
  Base,
  init_Base
} from "./chunk-FIR6EFTM.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/restructure/src/Reserved.js
var Reserved;
var init_Reserved = __esm({
  "node_modules/restructure/src/Reserved.js"() {
    init_Base();
    init_utils();
    Reserved = class extends Base {
      constructor(type, count = 1) {
        super();
        this.type = type;
        this.count = count;
      }
      decode(stream, parent) {
        stream.pos += this.size(null, parent);
        return void 0;
      }
      size(data, parent) {
        const count = resolveLength(this.count, null, parent);
        return this.type.size() * count;
      }
      encode(stream, val, parent) {
        return stream.fill(0, this.size(val, parent));
      }
    };
  }
});

export {
  Reserved,
  init_Reserved
};
