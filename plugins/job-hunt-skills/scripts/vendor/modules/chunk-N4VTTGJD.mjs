import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  WOFF2Font,
  init_WOFF2Font
} from "./chunk-CLEYAMHK.mjs";
import {
  WOFFFont,
  init_WOFFFont
} from "./chunk-ANACA5GP.mjs";
import {
  DFont,
  init_DFont
} from "./chunk-7MCZKIYI.mjs";
import {
  TrueTypeCollection,
  init_TrueTypeCollection
} from "./chunk-E7OFJSP2.mjs";
import {
  TTFFont,
  init_TTFFont
} from "./chunk-UULUL7OE.mjs";
import {
  create,
  defaultLanguage,
  init_base,
  logErrors,
  registerFormat,
  setDefaultLanguage
} from "./chunk-C4XDTOTE.mjs";
import {
  __esm,
  __export
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/index.js
var src_exports = {};
__export(src_exports, {
  create: () => create,
  defaultLanguage: () => defaultLanguage,
  logErrors: () => logErrors,
  registerFormat: () => registerFormat,
  setDefaultLanguage: () => setDefaultLanguage
});
var init_src = __esm({
  "node_modules/fontkit/src/index.js"() {
    init_base();
    init_TTFFont();
    init_WOFFFont();
    init_WOFF2Font();
    init_TrueTypeCollection();
    init_DFont();
    init_base();
    registerFormat(TTFFont);
    registerFormat(WOFFFont);
    registerFormat(WOFF2Font);
    registerFormat(TrueTypeCollection);
    registerFormat(DFont);
  }
});

export {
  src_exports,
  init_src
};
