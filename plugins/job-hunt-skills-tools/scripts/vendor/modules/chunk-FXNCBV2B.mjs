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

// node_modules/restructure/src/Buffer.js
var BufferT;
var init_Buffer = __esm({
  "node_modules/restructure/src/Buffer.js"() {
    init_Base();
    init_Number();
    init_utils();
    BufferT = class extends Base {
      constructor(length) {
        super();
        this.length = length;
      }
      decode(stream, parent) {
        const length = resolveLength(this.length, stream, parent);
        return stream.readBuffer(length);
      }
      size(val, parent) {
        if (!val) {
          return resolveLength(this.length, null, parent);
        }
        let len = val.length;
        if (this.length instanceof NumberT) {
          len += this.length.size();
        }
        return len;
      }
      encode(stream, buf, parent) {
        if (this.length instanceof NumberT) {
          this.length.encode(stream, buf.length);
        }
        return stream.writeBuffer(buf);
      }
    };
  }
});

export {
  BufferT,
  init_Buffer
};
