import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/unicode-trie/swap.js
var require_swap = __commonJS({
  "node_modules/unicode-trie/swap.js"(exports, module) {
    var isBigEndian = new Uint8Array(new Uint32Array([305419896]).buffer)[0] === 18;
    var swap = (b, n, m) => {
      let i = b[n];
      b[n] = b[m];
      b[m] = i;
    };
    var swap32 = (array) => {
      const len = array.length;
      for (let i = 0; i < len; i += 4) {
        swap(array, i, i + 3);
        swap(array, i + 1, i + 2);
      }
    };
    var swap32LE = (array) => {
      if (isBigEndian) {
        swap32(array);
      }
    };
    module.exports = {
      swap32LE
    };
  }
});

export {
  require_swap
};
