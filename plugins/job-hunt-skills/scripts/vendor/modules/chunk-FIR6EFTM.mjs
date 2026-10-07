import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  EncodeStream,
  init_EncodeStream
} from "./chunk-O372ZRV6.mjs";
import {
  DecodeStream,
  init_DecodeStream
} from "./chunk-32NVCR7Y.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/restructure/src/Base.js
var Base;
var init_Base = __esm({
  "node_modules/restructure/src/Base.js"() {
    init_DecodeStream();
    init_EncodeStream();
    Base = class {
      fromBuffer(buffer) {
        let stream = new DecodeStream(buffer);
        return this.decode(stream);
      }
      toBuffer(value) {
        let size = this.size(value);
        let buffer = new Uint8Array(size);
        let stream = new EncodeStream(buffer);
        this.encode(stream, value);
        return buffer;
      }
    };
  }
});

export {
  Base,
  init_Base
};
