import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  init_use,
  use_default
} from "./chunk-GNV4IILC.mjs";
import {
  DefaultShaper,
  init_DefaultShaper
} from "./chunk-DDPYBZPE.mjs";
import {
  GlyphInfo,
  init_GlyphInfo
} from "./chunk-TV2VLRB7.mjs";
import {
  require_unicode_trie
} from "./chunk-FTWGS5KP.mjs";
import {
  decodeBase64,
  init_utils
} from "./chunk-YOYKROTC.mjs";
import {
  require_dfa
} from "./chunk-G7K25AR4.mjs";
import {
  __esm,
  __toESM
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/opentype/shapers/UniversalShaper.js
function useCategory(glyph) {
  return trie.get(glyph.codePoints[0]);
}
function setupSyllables(font, glyphs) {
  let syllable = 0;
  for (let [start, end, tags] of stateMachine.match(glyphs.map(useCategory))) {
    ++syllable;
    for (let i = start; i <= end; i++) {
      glyphs[i].shaperInfo = new USEInfo(categories[useCategory(glyphs[i])], tags[0], syllable);
    }
    let limit = glyphs[start].shaperInfo.category === "R" ? 1 : Math.min(3, end - start);
    for (let i = start; i < start + limit; i++) {
      glyphs[i].features.rphf = true;
    }
  }
}
function clearSubstitutionFlags(font, glyphs) {
  for (let glyph of glyphs) {
    glyph.substituted = false;
  }
}
function recordRphf(font, glyphs) {
  for (let glyph of glyphs) {
    if (glyph.substituted && glyph.features.rphf) {
      glyph.shaperInfo.category = "R";
    }
  }
}
function recordPref(font, glyphs) {
  for (let glyph of glyphs) {
    if (glyph.substituted) {
      glyph.shaperInfo.category = "VPre";
    }
  }
}
function reorder(font, glyphs) {
  let dottedCircle = font.glyphForCodePoint(9676).id;
  for (let start = 0, end = nextSyllable(glyphs, 0); start < glyphs.length; start = end, end = nextSyllable(glyphs, start)) {
    let i, j;
    let info = glyphs[start].shaperInfo;
    let type = info.syllableType;
    if (type !== "virama_terminated_cluster" && type !== "standard_cluster" && type !== "broken_cluster") {
      continue;
    }
    if (type === "broken_cluster" && dottedCircle) {
      let g = new GlyphInfo(font, dottedCircle, [9676]);
      g.shaperInfo = info;
      for (i = start; i < end && glyphs[i].shaperInfo.category === "R"; i++) ;
      glyphs.splice(++i, 0, g);
      end++;
    }
    if (info.category === "R" && end - start > 1) {
      for (i = start + 1; i < end; i++) {
        info = glyphs[i].shaperInfo;
        if (isBase(info) || isHalant(glyphs[i])) {
          if (isHalant(glyphs[i])) {
            i--;
          }
          glyphs.splice(start, 0, ...glyphs.splice(start + 1, i - start), glyphs[i]);
          break;
        }
      }
    }
    for (i = start, j = end; i < end; i++) {
      info = glyphs[i].shaperInfo;
      if (isBase(info) || isHalant(glyphs[i])) {
        j = isHalant(glyphs[i]) ? i + 1 : i;
      } else if ((info.category === "VPre" || info.category === "VMPre") && j < i) {
        glyphs.splice(j, 1, glyphs[i], ...glyphs.splice(j, i - j));
      }
    }
  }
}
function nextSyllable(glyphs, start) {
  if (start >= glyphs.length) return start;
  let syllable = glyphs[start].shaperInfo.syllable;
  while (++start < glyphs.length && glyphs[start].shaperInfo.syllable === syllable) ;
  return start;
}
function isHalant(glyph) {
  return glyph.shaperInfo.category === "H" && !glyph.isLigated;
}
function isBase(info) {
  return info.category === "B" || info.category === "GB";
}
var import_dfa, import_unicode_trie, categories, decompositions, trie, stateMachine, UniversalShaper, USEInfo;
var init_UniversalShaper = __esm({
  "node_modules/fontkit/src/opentype/shapers/UniversalShaper.js"() {
    init_DefaultShaper();
    import_dfa = __toESM(require_dfa(), 1);
    import_unicode_trie = __toESM(require_unicode_trie(), 1);
    init_GlyphInfo();
    init_use();
    init_utils();
    ({ categories, decompositions } = use_default);
    trie = new import_unicode_trie.default(decodeBase64("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"));
    stateMachine = new import_dfa.default(use_default);
    UniversalShaper = class extends DefaultShaper {
      static zeroMarkWidths = "BEFORE_GPOS";
      static planFeatures(plan) {
        plan.addStage(setupSyllables);
        plan.addStage(["locl", "ccmp", "nukt", "akhn"]);
        plan.addStage(clearSubstitutionFlags);
        plan.addStage(["rphf"], false);
        plan.addStage(recordRphf);
        plan.addStage(clearSubstitutionFlags);
        plan.addStage(["pref"]);
        plan.addStage(recordPref);
        plan.addStage(["rkrf", "abvf", "blwf", "half", "pstf", "vatu", "cjct"]);
        plan.addStage(reorder);
        plan.addStage(["abvs", "blws", "pres", "psts", "dist", "abvm", "blwm"]);
      }
      static assignFeatures(plan, glyphs) {
        for (let i = glyphs.length - 1; i >= 0; i--) {
          let codepoint = glyphs[i].codePoints[0];
          if (decompositions[codepoint]) {
            let decomposed = decompositions[codepoint].map((c) => {
              let g = plan.font.glyphForCodePoint(c);
              return new GlyphInfo(plan.font, g.id, [c], glyphs[i].features);
            });
            glyphs.splice(i, 1, ...decomposed);
          }
        }
      }
    };
    USEInfo = class {
      constructor(category, syllableType, syllable) {
        this.category = category;
        this.syllableType = syllableType;
        this.syllable = syllable;
      }
    };
  }
});

export {
  UniversalShaper,
  init_UniversalShaper
};
