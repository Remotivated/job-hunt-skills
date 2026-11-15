import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/utils.js
function binarySearch(arr, cmp) {
  let min = 0;
  let max = arr.length - 1;
  while (min <= max) {
    let mid = min + max >> 1;
    let res = cmp(arr[mid]);
    if (res < 0) {
      max = mid - 1;
    } else if (res > 0) {
      min = mid + 1;
    } else {
      return mid;
    }
  }
  return -1;
}
function range(index, end) {
  let range2 = [];
  while (index < end) {
    range2.push(index++);
  }
  return range2;
}
function decodeBase64(base64) {
  let bufferLength = base64.length * 0.75;
  if (base64[base64.length - 1] === "=") {
    bufferLength--;
    if (base64[base64.length - 2] === "=") {
      bufferLength--;
    }
  }
  let bytes = new Uint8Array(bufferLength);
  let p = 0;
  for (let i = 0, len = base64.length; i < len; i += 4) {
    let encoded1 = LOOKUP[base64.charCodeAt(i)];
    let encoded2 = LOOKUP[base64.charCodeAt(i + 1)];
    let encoded3 = LOOKUP[base64.charCodeAt(i + 2)];
    let encoded4 = LOOKUP[base64.charCodeAt(i + 3)];
    bytes[p++] = encoded1 << 2 | encoded2 >> 4;
    bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
    bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
  }
  return bytes;
}
var asciiDecoder, CHARS, LOOKUP;
var init_utils = __esm({
  "node_modules/fontkit/src/utils.js"() {
    asciiDecoder = new TextDecoder("ascii");
    CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    LOOKUP = new Uint8Array(256);
    for (let i = 0; i < CHARS.length; i++) {
      LOOKUP[CHARS.charCodeAt(i)] = i;
    }
  }
});

export {
  binarySearch,
  range,
  asciiDecoder,
  decodeBase64,
  init_utils
};
