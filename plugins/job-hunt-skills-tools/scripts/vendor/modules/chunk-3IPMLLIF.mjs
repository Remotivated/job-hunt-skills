import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/opentype/shapers/indic-data.js
var CATEGORIES, POSITIONS, CONSONANT_FLAGS, JOINER_FLAGS, HALANT_OR_COENG_FLAGS, INDIC_CONFIGS, INDIC_DECOMPOSITIONS;
var init_indic_data = __esm({
  "node_modules/fontkit/src/opentype/shapers/indic-data.js"() {
    CATEGORIES = {
      X: 1 << 0,
      C: 1 << 1,
      V: 1 << 2,
      N: 1 << 3,
      H: 1 << 4,
      ZWNJ: 1 << 5,
      ZWJ: 1 << 6,
      M: 1 << 7,
      SM: 1 << 8,
      VD: 1 << 9,
      A: 1 << 10,
      Placeholder: 1 << 11,
      Dotted_Circle: 1 << 12,
      RS: 1 << 13,
      // Register Shifter, used in Khmer OT spec.
      Coeng: 1 << 14,
      // Khmer-style Virama.
      Repha: 1 << 15,
      // Atomically-encoded logical or visual repha.
      Ra: 1 << 16,
      CM: 1 << 17,
      // Consonant-Medial.
      Symbol: 1 << 18
      // Avagraha, etc that take marks (SM,A,VD).
    };
    POSITIONS = {
      Start: 1 << 0,
      Ra_To_Become_Reph: 1 << 1,
      Pre_M: 1 << 2,
      Pre_C: 1 << 3,
      Base_C: 1 << 4,
      After_Main: 1 << 5,
      Above_C: 1 << 6,
      Before_Sub: 1 << 7,
      Below_C: 1 << 8,
      After_Sub: 1 << 9,
      Before_Post: 1 << 10,
      Post_C: 1 << 11,
      After_Post: 1 << 12,
      Final_C: 1 << 13,
      SMVD: 1 << 14,
      End: 1 << 15
    };
    CONSONANT_FLAGS = CATEGORIES.C | CATEGORIES.Ra | CATEGORIES.CM | CATEGORIES.V | CATEGORIES.Placeholder | CATEGORIES.Dotted_Circle;
    JOINER_FLAGS = CATEGORIES.ZWJ | CATEGORIES.ZWNJ;
    HALANT_OR_COENG_FLAGS = CATEGORIES.H | CATEGORIES.Coeng;
    INDIC_CONFIGS = {
      Default: {
        hasOldSpec: false,
        virama: 0,
        basePos: "Last",
        rephPos: POSITIONS.Before_Post,
        rephMode: "Implicit",
        blwfMode: "Pre_And_Post"
      },
      Devanagari: {
        hasOldSpec: true,
        virama: 2381,
        basePos: "Last",
        rephPos: POSITIONS.Before_Post,
        rephMode: "Implicit",
        blwfMode: "Pre_And_Post"
      },
      Bengali: {
        hasOldSpec: true,
        virama: 2509,
        basePos: "Last",
        rephPos: POSITIONS.After_Sub,
        rephMode: "Implicit",
        blwfMode: "Pre_And_Post"
      },
      Gurmukhi: {
        hasOldSpec: true,
        virama: 2637,
        basePos: "Last",
        rephPos: POSITIONS.Before_Sub,
        rephMode: "Implicit",
        blwfMode: "Pre_And_Post"
      },
      Gujarati: {
        hasOldSpec: true,
        virama: 2765,
        basePos: "Last",
        rephPos: POSITIONS.Before_Post,
        rephMode: "Implicit",
        blwfMode: "Pre_And_Post"
      },
      Oriya: {
        hasOldSpec: true,
        virama: 2893,
        basePos: "Last",
        rephPos: POSITIONS.After_Main,
        rephMode: "Implicit",
        blwfMode: "Pre_And_Post"
      },
      Tamil: {
        hasOldSpec: true,
        virama: 3021,
        basePos: "Last",
        rephPos: POSITIONS.After_Post,
        rephMode: "Implicit",
        blwfMode: "Pre_And_Post"
      },
      Telugu: {
        hasOldSpec: true,
        virama: 3149,
        basePos: "Last",
        rephPos: POSITIONS.After_Post,
        rephMode: "Explicit",
        blwfMode: "Post_Only"
      },
      Kannada: {
        hasOldSpec: true,
        virama: 3277,
        basePos: "Last",
        rephPos: POSITIONS.After_Post,
        rephMode: "Implicit",
        blwfMode: "Post_Only"
      },
      Malayalam: {
        hasOldSpec: true,
        virama: 3405,
        basePos: "Last",
        rephPos: POSITIONS.After_Main,
        rephMode: "Log_Repha",
        blwfMode: "Pre_And_Post"
      },
      // Handled by UniversalShaper
      // Sinhala: {
      //   hasOldSpec: false,
      //   virama: 0x0DCA,
      //   basePos: 'Last_Sinhala',
      //   rephPos: POSITIONS.After_Main,
      //   rephMode: 'Explicit',
      //   blwfMode: 'Pre_And_Post'
      // },
      Khmer: {
        hasOldSpec: false,
        virama: 6098,
        basePos: "First",
        rephPos: POSITIONS.Ra_To_Become_Reph,
        rephMode: "Vis_Repha",
        blwfMode: "Pre_And_Post"
      }
    };
    INDIC_DECOMPOSITIONS = {
      // Khmer
      6078: [6081, 6078],
      6079: [6081, 6079],
      6080: [6081, 6080],
      6084: [6081, 6084],
      6085: [6081, 6085]
    };
  }
});

export {
  CATEGORIES,
  POSITIONS,
  CONSONANT_FLAGS,
  JOINER_FLAGS,
  HALANT_OR_COENG_FLAGS,
  INDIC_CONFIGS,
  INDIC_DECOMPOSITIONS,
  init_indic_data
};
