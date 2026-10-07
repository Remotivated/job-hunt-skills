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
  DecodeStream
} from "./chunk-32NVCR7Y.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/base.js
function registerFormat(format) {
  formats.push(format);
}
function create(buffer, postscriptName) {
  for (let i = 0; i < formats.length; i++) {
    let format = formats[i];
    if (format.probe(buffer)) {
      let font = new format(new DecodeStream(buffer));
      if (postscriptName) {
        return font.getFont(postscriptName);
      }
      return font;
    }
  }
  throw new Error("Unknown font format");
}
function setDefaultLanguage(lang = "en") {
  defaultLanguage = lang;
}
var logErrors, formats, defaultLanguage;
var init_base = __esm({
  "node_modules/fontkit/src/base.js"() {
    init_restructure();
    logErrors = false;
    formats = [];
    defaultLanguage = "en";
  }
});

export {
  logErrors,
  registerFormat,
  create,
  defaultLanguage,
  setDefaultLanguage,
  init_base
};
