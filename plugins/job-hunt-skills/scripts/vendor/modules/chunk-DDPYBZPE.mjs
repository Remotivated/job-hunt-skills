import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  $747425b437e121da$export$727d9dbc4fbb948f,
  init_module
} from "./chunk-VFVK5HQB.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/opentype/shapers/DefaultShaper.js
var VARIATION_FEATURES, COMMON_FEATURES, FRACTIONAL_FEATURES, HORIZONTAL_FEATURES, DIRECTIONAL_FEATURES, DefaultShaper;
var init_DefaultShaper = __esm({
  "node_modules/fontkit/src/opentype/shapers/DefaultShaper.js"() {
    init_module();
    VARIATION_FEATURES = ["rvrn"];
    COMMON_FEATURES = ["ccmp", "locl", "rlig", "mark", "mkmk"];
    FRACTIONAL_FEATURES = ["frac", "numr", "dnom"];
    HORIZONTAL_FEATURES = ["calt", "clig", "liga", "rclt", "curs", "kern"];
    DIRECTIONAL_FEATURES = {
      ltr: ["ltra", "ltrm"],
      rtl: ["rtla", "rtlm"]
    };
    DefaultShaper = class {
      static zeroMarkWidths = "AFTER_GPOS";
      static plan(plan, glyphs, features) {
        this.planPreprocessing(plan);
        this.planFeatures(plan);
        this.planPostprocessing(plan, features);
        plan.assignGlobalFeatures(glyphs);
        this.assignFeatures(plan, glyphs);
      }
      static planPreprocessing(plan) {
        plan.add({
          global: [...VARIATION_FEATURES, ...DIRECTIONAL_FEATURES[plan.direction]],
          local: FRACTIONAL_FEATURES
        });
      }
      static planFeatures(plan) {
      }
      static planPostprocessing(plan, userFeatures) {
        plan.add([...COMMON_FEATURES, ...HORIZONTAL_FEATURES]);
        plan.setFeatureOverrides(userFeatures);
      }
      static assignFeatures(plan, glyphs) {
        for (let i = 0; i < glyphs.length; i++) {
          let glyph = glyphs[i];
          if (glyph.codePoints[0] === 8260) {
            let start = i;
            let end = i + 1;
            while (start > 0 && $747425b437e121da$export$727d9dbc4fbb948f(glyphs[start - 1].codePoints[0])) {
              glyphs[start - 1].features.numr = true;
              glyphs[start - 1].features.frac = true;
              start--;
            }
            while (end < glyphs.length && $747425b437e121da$export$727d9dbc4fbb948f(glyphs[end].codePoints[0])) {
              glyphs[end].features.dnom = true;
              glyphs[end].features.frac = true;
              end++;
            }
            glyph.features.frac = true;
            i = end - 1;
          }
        }
      }
    };
  }
});

export {
  DefaultShaper,
  init_DefaultShaper
};
