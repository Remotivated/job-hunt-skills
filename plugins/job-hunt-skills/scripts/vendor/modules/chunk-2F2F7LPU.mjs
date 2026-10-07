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
  VersionedStruct
} from "./chunk-DCBC6YOO.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  uint16,
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/loca.js
var loca, loca_default;
var init_loca = __esm({
  "node_modules/fontkit/src/tables/loca.js"() {
    init_restructure();
    loca = new VersionedStruct("head.indexToLocFormat", {
      0: {
        offsets: new ArrayT(uint16)
      },
      1: {
        offsets: new ArrayT(uint32)
      }
    });
    loca.process = function() {
      if (this.version === 0 && !this._processed) {
        for (let i = 0; i < this.offsets.length; i++) {
          this.offsets[i] <<= 1;
        }
        this._processed = true;
      }
    };
    loca.preEncode = function() {
      if (this.version === 0 && this._processed !== false) {
        for (let i = 0; i < this.offsets.length; i++) {
          this.offsets[i] >>>= 1;
        }
        this._processed = false;
      }
    };
    loca_default = loca;
  }
});

export {
  loca_default,
  init_loca
};
