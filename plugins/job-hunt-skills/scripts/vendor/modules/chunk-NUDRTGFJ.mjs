import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  FeatureVariations,
  init_variations
} from "./chunk-ZQOIF36D.mjs";
import {
  ChainingContext,
  Context,
  Coverage,
  FeatureList,
  LookupList,
  ScriptList,
  init_opentype
} from "./chunk-3W5UVUMY.mjs";
import {
  init_restructure
} from "./chunk-YFRH6662.mjs";
import {
  VersionedStruct
} from "./chunk-DCBC6YOO.mjs";
import {
  Struct
} from "./chunk-2FAS3ON4.mjs";
import {
  LazyArray
} from "./chunk-KW2FFRNO.mjs";
import {
  Pointer
} from "./chunk-ETHVAYUP.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  int16,
  uint16,
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/GSUB.js
var Sequence, AlternateSet, Ligature, LigatureSet, GSUBLookup, GSUB_default;
var init_GSUB = __esm({
  "node_modules/fontkit/src/tables/GSUB.js"() {
    init_restructure();
    init_opentype();
    init_variations();
    Sequence = new ArrayT(uint16, uint16);
    AlternateSet = Sequence;
    Ligature = new Struct({
      glyph: uint16,
      compCount: uint16,
      components: new ArrayT(uint16, (t) => t.compCount - 1)
    });
    LigatureSet = new ArrayT(new Pointer(uint16, Ligature), uint16);
    GSUBLookup = new VersionedStruct("lookupType", {
      1: new VersionedStruct(uint16, {
        // Single Substitution
        1: {
          coverage: new Pointer(uint16, Coverage),
          deltaGlyphID: int16
        },
        2: {
          coverage: new Pointer(uint16, Coverage),
          glyphCount: uint16,
          substitute: new LazyArray(uint16, "glyphCount")
        }
      }),
      2: {
        // Multiple Substitution
        substFormat: uint16,
        coverage: new Pointer(uint16, Coverage),
        count: uint16,
        sequences: new LazyArray(new Pointer(uint16, Sequence), "count")
      },
      3: {
        // Alternate Substitution
        substFormat: uint16,
        coverage: new Pointer(uint16, Coverage),
        count: uint16,
        alternateSet: new LazyArray(new Pointer(uint16, AlternateSet), "count")
      },
      4: {
        // Ligature Substitution
        substFormat: uint16,
        coverage: new Pointer(uint16, Coverage),
        count: uint16,
        ligatureSets: new LazyArray(new Pointer(uint16, LigatureSet), "count")
      },
      5: Context,
      // Contextual Substitution
      6: ChainingContext,
      // Chaining Contextual Substitution
      7: {
        // Extension Substitution
        substFormat: uint16,
        lookupType: uint16,
        // cannot also be 7
        extension: new Pointer(uint32, null)
      },
      8: {
        // Reverse Chaining Contextual Single Substitution
        substFormat: uint16,
        coverage: new Pointer(uint16, Coverage),
        backtrackCoverage: new ArrayT(new Pointer(uint16, Coverage), "backtrackGlyphCount"),
        lookaheadGlyphCount: uint16,
        lookaheadCoverage: new ArrayT(new Pointer(uint16, Coverage), "lookaheadGlyphCount"),
        glyphCount: uint16,
        substitutes: new ArrayT(uint16, "glyphCount")
      }
    });
    GSUBLookup.versions[7].extension.type = GSUBLookup;
    GSUB_default = new VersionedStruct(uint32, {
      header: {
        scriptList: new Pointer(uint16, ScriptList),
        featureList: new Pointer(uint16, FeatureList),
        lookupList: new Pointer(uint16, new LookupList(GSUBLookup))
      },
      65536: {},
      65537: {
        featureVariations: new Pointer(uint32, FeatureVariations)
      }
    });
  }
});

export {
  GSUB_default,
  init_GSUB
};
