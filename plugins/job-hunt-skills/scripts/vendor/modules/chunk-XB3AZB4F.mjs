import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  parse_default
} from "./chunk-KWEHWRBY.mjs";
import {
  decode_default
} from "./chunk-VZJBNP2K.mjs";
import {
  encode_default
} from "./chunk-DXKIFMQI.mjs";
import {
  format
} from "./chunk-UWMDC7IC.mjs";
import {
  __export
} from "./chunk-FDWSCWK2.mjs";

// node_modules/mdurl/index.mjs
var mdurl_exports = {};
__export(mdurl_exports, {
  decode: () => decode_default,
  encode: () => encode_default,
  format: () => format,
  parse: () => parse_default
});

export {
  mdurl_exports
};
