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
  Struct
} from "./chunk-2FAS3ON4.mjs";
import {
  LazyArray
} from "./chunk-KW2FFRNO.mjs";
import {
  Optional
} from "./chunk-VTOYGDRI.mjs";
import {
  Pointer
} from "./chunk-ETHVAYUP.mjs";
import {
  Reserved
} from "./chunk-TSASLJV5.mjs";
import {
  StringT
} from "./chunk-CJLFWYXH.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  Bitfield
} from "./chunk-SPZOCPRY.mjs";
import {
  uint16,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/opentype.js
function LookupList(SubTable) {
  let Lookup = new Struct({
    lookupType: uint16,
    flags: LookupFlags,
    subTableCount: uint16,
    subTables: new ArrayT(new Pointer(uint16, SubTable), "subTableCount"),
    markFilteringSet: new Optional(uint16, (t) => t.flags.flags.useMarkFilteringSet)
  });
  return new LazyArray(new Pointer(uint16, Lookup), uint16);
}
var LangSysTable, LangSysRecord, Script, ScriptRecord, ScriptList, FeatureParams, Feature, FeatureRecord, FeatureList, LookupFlags, RangeRecord, Coverage, ClassRangeRecord, ClassDef, Device, LookupRecord, Rule, RuleSet, ClassRule, ClassSet, Context, ChainRule, ChainRuleSet, ChainingContext;
var init_opentype = __esm({
  "node_modules/fontkit/src/tables/opentype.js"() {
    init_restructure();
    LangSysTable = new Struct({
      reserved: new Reserved(uint16),
      reqFeatureIndex: uint16,
      featureCount: uint16,
      featureIndexes: new ArrayT(uint16, "featureCount")
    });
    LangSysRecord = new Struct({
      tag: new StringT(4),
      langSys: new Pointer(uint16, LangSysTable, { type: "parent" })
    });
    Script = new Struct({
      defaultLangSys: new Pointer(uint16, LangSysTable),
      count: uint16,
      langSysRecords: new ArrayT(LangSysRecord, "count")
    });
    ScriptRecord = new Struct({
      tag: new StringT(4),
      script: new Pointer(uint16, Script, { type: "parent" })
    });
    ScriptList = new ArrayT(ScriptRecord, uint16);
    FeatureParams = new Struct({
      version: uint16,
      // should be set to 0 according OT spec
      nameID: uint16
      //OT spec: UI Name ID or uiLabelNameId
    });
    Feature = new Struct({
      featureParams: new Pointer(uint16, FeatureParams),
      lookupCount: uint16,
      lookupListIndexes: new ArrayT(uint16, "lookupCount")
    });
    FeatureRecord = new Struct({
      tag: new StringT(4),
      feature: new Pointer(uint16, Feature, { type: "parent" })
    });
    FeatureList = new ArrayT(FeatureRecord, uint16);
    LookupFlags = new Struct({
      markAttachmentType: uint8,
      flags: new Bitfield(uint8, [
        "rightToLeft",
        "ignoreBaseGlyphs",
        "ignoreLigatures",
        "ignoreMarks",
        "useMarkFilteringSet"
      ])
    });
    RangeRecord = new Struct({
      start: uint16,
      end: uint16,
      startCoverageIndex: uint16
    });
    Coverage = new VersionedStruct(uint16, {
      1: {
        glyphCount: uint16,
        glyphs: new ArrayT(uint16, "glyphCount")
      },
      2: {
        rangeCount: uint16,
        rangeRecords: new ArrayT(RangeRecord, "rangeCount")
      }
    });
    ClassRangeRecord = new Struct({
      start: uint16,
      end: uint16,
      class: uint16
    });
    ClassDef = new VersionedStruct(uint16, {
      1: {
        // Class array
        startGlyph: uint16,
        glyphCount: uint16,
        classValueArray: new ArrayT(uint16, "glyphCount")
      },
      2: {
        // Class ranges
        classRangeCount: uint16,
        classRangeRecord: new ArrayT(ClassRangeRecord, "classRangeCount")
      }
    });
    Device = new Struct({
      a: uint16,
      // startSize for hinting Device, outerIndex for VariationIndex
      b: uint16,
      // endSize for Device, innerIndex for VariationIndex
      deltaFormat: uint16
    });
    LookupRecord = new Struct({
      sequenceIndex: uint16,
      lookupListIndex: uint16
    });
    Rule = new Struct({
      glyphCount: uint16,
      lookupCount: uint16,
      input: new ArrayT(uint16, (t) => t.glyphCount - 1),
      lookupRecords: new ArrayT(LookupRecord, "lookupCount")
    });
    RuleSet = new ArrayT(new Pointer(uint16, Rule), uint16);
    ClassRule = new Struct({
      glyphCount: uint16,
      lookupCount: uint16,
      classes: new ArrayT(uint16, (t) => t.glyphCount - 1),
      lookupRecords: new ArrayT(LookupRecord, "lookupCount")
    });
    ClassSet = new ArrayT(new Pointer(uint16, ClassRule), uint16);
    Context = new VersionedStruct(uint16, {
      1: {
        // Simple context
        coverage: new Pointer(uint16, Coverage),
        ruleSetCount: uint16,
        ruleSets: new ArrayT(new Pointer(uint16, RuleSet), "ruleSetCount")
      },
      2: {
        // Class-based context
        coverage: new Pointer(uint16, Coverage),
        classDef: new Pointer(uint16, ClassDef),
        classSetCnt: uint16,
        classSet: new ArrayT(new Pointer(uint16, ClassSet), "classSetCnt")
      },
      3: {
        glyphCount: uint16,
        lookupCount: uint16,
        coverages: new ArrayT(new Pointer(uint16, Coverage), "glyphCount"),
        lookupRecords: new ArrayT(LookupRecord, "lookupCount")
      }
    });
    ChainRule = new Struct({
      backtrackGlyphCount: uint16,
      backtrack: new ArrayT(uint16, "backtrackGlyphCount"),
      inputGlyphCount: uint16,
      input: new ArrayT(uint16, (t) => t.inputGlyphCount - 1),
      lookaheadGlyphCount: uint16,
      lookahead: new ArrayT(uint16, "lookaheadGlyphCount"),
      lookupCount: uint16,
      lookupRecords: new ArrayT(LookupRecord, "lookupCount")
    });
    ChainRuleSet = new ArrayT(new Pointer(uint16, ChainRule), uint16);
    ChainingContext = new VersionedStruct(uint16, {
      1: {
        // Simple context glyph substitution
        coverage: new Pointer(uint16, Coverage),
        chainCount: uint16,
        chainRuleSets: new ArrayT(new Pointer(uint16, ChainRuleSet), "chainCount")
      },
      2: {
        // Class-based chaining context
        coverage: new Pointer(uint16, Coverage),
        backtrackClassDef: new Pointer(uint16, ClassDef),
        inputClassDef: new Pointer(uint16, ClassDef),
        lookaheadClassDef: new Pointer(uint16, ClassDef),
        chainCount: uint16,
        chainClassSet: new ArrayT(new Pointer(uint16, ChainRuleSet), "chainCount")
      },
      3: {
        // Coverage-based chaining context
        backtrackGlyphCount: uint16,
        backtrackCoverage: new ArrayT(new Pointer(uint16, Coverage), "backtrackGlyphCount"),
        inputGlyphCount: uint16,
        inputCoverage: new ArrayT(new Pointer(uint16, Coverage), "inputGlyphCount"),
        lookaheadGlyphCount: uint16,
        lookaheadCoverage: new ArrayT(new Pointer(uint16, Coverage), "lookaheadGlyphCount"),
        lookupCount: uint16,
        lookupRecords: new ArrayT(LookupRecord, "lookupCount")
      }
    });
  }
});

export {
  ScriptList,
  Feature,
  FeatureList,
  LookupList,
  Coverage,
  ClassDef,
  Device,
  Context,
  ChainingContext,
  init_opentype
};
