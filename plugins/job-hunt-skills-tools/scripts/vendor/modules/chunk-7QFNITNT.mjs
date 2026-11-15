import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  DefaultShaper,
  init_DefaultShaper
} from "./chunk-DDPYBZPE.mjs";
import {
  $747425b437e121da$export$410364bbb673ddbc,
  init_module
} from "./chunk-VFVK5HQB.mjs";
import {
  require_unicode_trie
} from "./chunk-FTWGS5KP.mjs";
import {
  decodeBase64,
  init_utils
} from "./chunk-YOYKROTC.mjs";
import {
  __esm,
  __toESM
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/opentype/shapers/ArabicShaper.js
function getShapingClass(codePoint) {
  let res = trie.get(codePoint);
  if (res) {
    return res - 1;
  }
  let category = $747425b437e121da$export$410364bbb673ddbc(codePoint);
  if (category === "Mn" || category === "Me" || category === "Cf") {
    return ShapingClasses.Transparent;
  }
  return ShapingClasses.Non_Joining;
}
var import_unicode_trie, trie, FEATURES, ShapingClasses, ISOL, FINA, FIN2, FIN3, MEDI, MED2, INIT, NONE, STATE_TABLE, ArabicShaper;
var init_ArabicShaper = __esm({
  "node_modules/fontkit/src/opentype/shapers/ArabicShaper.js"() {
    init_DefaultShaper();
    init_module();
    import_unicode_trie = __toESM(require_unicode_trie(), 1);
    init_utils();
    trie = new import_unicode_trie.default(decodeBase64("APABAAAAAAAAOAAAAf0BAv7tmi1MxDAUx7vtvjhAgcDgkEgEAnmXEBIMCYaEcygEiqBQ4FAkCE4ikUgMiiBJSAgSiUQSDMn9L9eSl6bddddug9t7yS/trevre+3r27pcNxZiG+yCfdCVv/9LeQxOwRm4AJegD27ALbgD9+ABPJF+z+BN/h7yDj5k/VOWX6SdmU5+wLWknggxDxaS8u0qiiX4uiz9XamQ3wzDMAzDMAzDMAzDVI/h959V/v7BMAzDMAzDMLlyNTNiMSdewVxbiA44B4/guz1qW58VYlMI0WsJ0W+N6kXw0spvPtdwhtkwnGM6uLaV4Xyzg3v3PM9DPfQ/sOg4xPWjipy31P8LTqbU304c/cLCUmWJLNB2Uz2U1KTeRKNmKHVMfbJC+/0loTZRH/W5cvEvBJPMbREkWt3FD1NcqXZBSpuE2Ad0PBehPtNrPtIEdYP+hiRt/V1jIiE69X4NT/uVZI3PUHE9bm5M7ePGdZWy951v7Nn6j8v1WWKP3mt6ttnsigx6VN7Vc0VomSSGqW2mGNP1muZPl7LfjNUaKNFtDGVf2fvE9O7VlBS5j333c5p/eeoOqcs1R/hIqDWLJ7TTlksirVT1SI7l8k4Yp+g3jafGcrU1RM6l9th80XOpnlN97bDNY4i4s61B0Si/ipa0uHMl6zqEjlFfCZm/TM8KmzQDjmuTAQ=="));
    FEATURES = ["isol", "fina", "fin2", "fin3", "medi", "med2", "init"];
    ShapingClasses = {
      Non_Joining: 0,
      Left_Joining: 1,
      Right_Joining: 2,
      Dual_Joining: 3,
      Join_Causing: 3,
      ALAPH: 4,
      "DALATH RISH": 5,
      Transparent: 6
    };
    ISOL = "isol";
    FINA = "fina";
    FIN2 = "fin2";
    FIN3 = "fin3";
    MEDI = "medi";
    MED2 = "med2";
    INIT = "init";
    NONE = null;
    STATE_TABLE = [
      //   Non_Joining,        Left_Joining,       Right_Joining,     Dual_Joining,           ALAPH,            DALATH RISH
      // State 0: prev was U,  not willing to join.
      [[NONE, NONE, 0], [NONE, ISOL, 2], [NONE, ISOL, 1], [NONE, ISOL, 2], [NONE, ISOL, 1], [NONE, ISOL, 6]],
      // State 1: prev was R or ISOL/ALAPH,  not willing to join.
      [[NONE, NONE, 0], [NONE, ISOL, 2], [NONE, ISOL, 1], [NONE, ISOL, 2], [NONE, FIN2, 5], [NONE, ISOL, 6]],
      // State 2: prev was D/L in ISOL form,  willing to join.
      [[NONE, NONE, 0], [NONE, ISOL, 2], [INIT, FINA, 1], [INIT, FINA, 3], [INIT, FINA, 4], [INIT, FINA, 6]],
      // State 3: prev was D in FINA form,  willing to join.
      [[NONE, NONE, 0], [NONE, ISOL, 2], [MEDI, FINA, 1], [MEDI, FINA, 3], [MEDI, FINA, 4], [MEDI, FINA, 6]],
      // State 4: prev was FINA ALAPH,  not willing to join.
      [[NONE, NONE, 0], [NONE, ISOL, 2], [MED2, ISOL, 1], [MED2, ISOL, 2], [MED2, FIN2, 5], [MED2, ISOL, 6]],
      // State 5: prev was FIN2/FIN3 ALAPH,  not willing to join.
      [[NONE, NONE, 0], [NONE, ISOL, 2], [ISOL, ISOL, 1], [ISOL, ISOL, 2], [ISOL, FIN2, 5], [ISOL, ISOL, 6]],
      // State 6: prev was DALATH/RISH,  not willing to join.
      [[NONE, NONE, 0], [NONE, ISOL, 2], [NONE, ISOL, 1], [NONE, ISOL, 2], [NONE, FIN3, 5], [NONE, ISOL, 6]]
    ];
    ArabicShaper = class extends DefaultShaper {
      static planFeatures(plan) {
        plan.add(["ccmp", "locl"]);
        for (let i = 0; i < FEATURES.length; i++) {
          let feature = FEATURES[i];
          plan.addStage(feature, false);
        }
        plan.addStage("mset");
      }
      static assignFeatures(plan, glyphs) {
        super.assignFeatures(plan, glyphs);
        let prev = -1;
        let state = 0;
        let actions = [];
        for (let i = 0; i < glyphs.length; i++) {
          let curAction, prevAction;
          var glyph = glyphs[i];
          let type = getShapingClass(glyph.codePoints[0]);
          if (type === ShapingClasses.Transparent) {
            actions[i] = NONE;
            continue;
          }
          [prevAction, curAction, state] = STATE_TABLE[state][type];
          if (prevAction !== NONE && prev !== -1) {
            actions[prev] = prevAction;
          }
          actions[i] = curAction;
          prev = i;
        }
        for (let index = 0; index < glyphs.length; index++) {
          let feature;
          var glyph = glyphs[index];
          if (feature = actions[index]) {
            glyph.features[feature] = true;
          }
        }
      }
    };
  }
});

export {
  ArabicShaper,
  init_ArabicShaper
};
