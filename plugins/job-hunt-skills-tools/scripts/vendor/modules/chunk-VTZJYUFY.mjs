import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  CATEGORIES,
  CONSONANT_FLAGS,
  HALANT_OR_COENG_FLAGS,
  INDIC_CONFIGS,
  INDIC_DECOMPOSITIONS,
  JOINER_FLAGS,
  POSITIONS,
  init_indic_data
} from "./chunk-3IPMLLIF.mjs";
import {
  indic_default,
  init_indic
} from "./chunk-32OZQJIF.mjs";
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
  fromOpenType,
  init_Script
} from "./chunk-SNNDT6ZF.mjs";
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
  require_dfa
} from "./chunk-G7K25AR4.mjs";
import {
  __esm,
  __toESM
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/opentype/shapers/IndicShaper.js
function indicCategory(glyph) {
  return trie.get(glyph.codePoints[0]) >> 8;
}
function indicPosition(glyph) {
  return 1 << (trie.get(glyph.codePoints[0]) & 255);
}
function setupSyllables(font, glyphs) {
  let syllable = 0;
  let last = 0;
  for (let [start, end, tags] of stateMachine.match(glyphs.map(indicCategory))) {
    if (start > last) {
      ++syllable;
      for (let i = last; i < start; i++) {
        glyphs[i].shaperInfo = new IndicInfo(CATEGORIES.X, POSITIONS.End, "non_indic_cluster", syllable);
      }
    }
    ++syllable;
    for (let i = start; i <= end; i++) {
      glyphs[i].shaperInfo = new IndicInfo(
        1 << indicCategory(glyphs[i]),
        indicPosition(glyphs[i]),
        tags[0],
        syllable
      );
    }
    last = end + 1;
  }
  if (last < glyphs.length) {
    ++syllable;
    for (let i = last; i < glyphs.length; i++) {
      glyphs[i].shaperInfo = new IndicInfo(CATEGORIES.X, POSITIONS.End, "non_indic_cluster", syllable);
    }
  }
}
function isConsonant(glyph) {
  return glyph.shaperInfo.category & CONSONANT_FLAGS;
}
function isJoiner(glyph) {
  return glyph.shaperInfo.category & JOINER_FLAGS;
}
function isHalantOrCoeng(glyph) {
  return glyph.shaperInfo.category & HALANT_OR_COENG_FLAGS;
}
function wouldSubstitute(glyphs, feature) {
  for (let glyph of glyphs) {
    glyph.features = { [feature]: true };
  }
  let GSUB = glyphs[0]._font._layoutEngine.engine.GSUBProcessor;
  GSUB.applyFeatures([feature], glyphs);
  return glyphs.length === 1;
}
function consonantPosition(font, consonant, virama) {
  let glyphs = [virama, consonant, virama];
  if (wouldSubstitute(glyphs.slice(0, 2), "blwf") || wouldSubstitute(glyphs.slice(1, 3), "blwf")) {
    return POSITIONS.Below_C;
  } else if (wouldSubstitute(glyphs.slice(0, 2), "pstf") || wouldSubstitute(glyphs.slice(1, 3), "pstf")) {
    return POSITIONS.Post_C;
  } else if (wouldSubstitute(glyphs.slice(0, 2), "pref") || wouldSubstitute(glyphs.slice(1, 3), "pref")) {
    return POSITIONS.Post_C;
  }
  return POSITIONS.Base_C;
}
function initialReordering(font, glyphs, plan) {
  let indicConfig = plan.indicConfig;
  let features = font._layoutEngine.engine.GSUBProcessor.features;
  let dottedCircle = font.glyphForCodePoint(9676).id;
  let virama = font.glyphForCodePoint(indicConfig.virama).id;
  if (virama) {
    let info = new GlyphInfo(font, virama, [indicConfig.virama]);
    for (let i = 0; i < glyphs.length; i++) {
      if (glyphs[i].shaperInfo.position === POSITIONS.Base_C) {
        glyphs[i].shaperInfo.position = consonantPosition(font, glyphs[i].copy(), info);
      }
    }
  }
  for (let start = 0, end = nextSyllable(glyphs, 0); start < glyphs.length; start = end, end = nextSyllable(glyphs, start)) {
    let { category, syllableType } = glyphs[start].shaperInfo;
    if (syllableType === "symbol_cluster" || syllableType === "non_indic_cluster") {
      continue;
    }
    if (syllableType === "broken_cluster" && dottedCircle) {
      let g = new GlyphInfo(font, dottedCircle, [9676]);
      g.shaperInfo = new IndicInfo(
        1 << indicCategory(g),
        indicPosition(g),
        glyphs[start].shaperInfo.syllableType,
        glyphs[start].shaperInfo.syllable
      );
      let i = start;
      while (i < end && glyphs[i].shaperInfo.category === CATEGORIES.Repha) {
        i++;
      }
      glyphs.splice(i++, 0, g);
      end++;
    }
    let base = end;
    let limit = start;
    let hasReph = false;
    if (indicConfig.rephPos !== POSITIONS.Ra_To_Become_Reph && features.rphf && start + 3 <= end && (indicConfig.rephMode === "Implicit" && !isJoiner(glyphs[start + 2]) || indicConfig.rephMode === "Explicit" && glyphs[start + 2].shaperInfo.category === CATEGORIES.ZWJ)) {
      let g = [glyphs[start].copy(), glyphs[start + 1].copy(), glyphs[start + 2].copy()];
      if (wouldSubstitute(g.slice(0, 2), "rphf") || indicConfig.rephMode === "Explicit" && wouldSubstitute(g, "rphf")) {
        limit += 2;
        while (limit < end && isJoiner(glyphs[limit])) {
          limit++;
        }
        base = start;
        hasReph = true;
      }
    } else if (indicConfig.rephMode === "Log_Repha" && glyphs[start].shaperInfo.category === CATEGORIES.Repha) {
      limit++;
      while (limit < end && isJoiner(glyphs[limit])) {
        limit++;
      }
      base = start;
      hasReph = true;
    }
    switch (indicConfig.basePos) {
      case "Last": {
        let i = end;
        let seenBelow = false;
        do {
          let info = glyphs[--i].shaperInfo;
          if (isConsonant(glyphs[i])) {
            if (info.position !== POSITIONS.Below_C && (info.position !== POSITIONS.Post_C || seenBelow)) {
              base = i;
              break;
            }
            if (info.position === POSITIONS.Below_C) {
              seenBelow = true;
            }
            base = i;
          } else if (start < i && info.category === CATEGORIES.ZWJ && glyphs[i - 1].shaperInfo.category === CATEGORIES.H) {
            break;
          }
        } while (i > limit);
        break;
      }
      case "First": {
        base = start;
        for (let i = base + 1; i < end; i++) {
          if (isConsonant(glyphs[i])) {
            glyphs[i].shaperInfo.position = POSITIONS.Below_C;
          }
        }
      }
    }
    if (hasReph && base === start && limit - base <= 2) {
      hasReph = false;
    }
    for (let i = start; i < base; i++) {
      let info = glyphs[i].shaperInfo;
      info.position = Math.min(POSITIONS.Pre_C, info.position);
    }
    if (base < end) {
      glyphs[base].shaperInfo.position = POSITIONS.Base_C;
    }
    for (let i = base + 1; i < end; i++) {
      if (glyphs[i].shaperInfo.category === CATEGORIES.M) {
        for (let j = i + 1; j < end; j++) {
          if (isConsonant(glyphs[j])) {
            glyphs[j].shaperInfo.position = POSITIONS.Final_C;
            break;
          }
        }
        break;
      }
    }
    if (hasReph) {
      glyphs[start].shaperInfo.position = POSITIONS.Ra_To_Become_Reph;
    }
    if (plan.isOldSpec) {
      let disallowDoubleHalants = plan.unicodeScript !== "Malayalam";
      for (let i = base + 1; i < end; i++) {
        if (glyphs[i].shaperInfo.category === CATEGORIES.H) {
          let j;
          for (j = end - 1; j > i; j--) {
            if (isConsonant(glyphs[j]) || disallowDoubleHalants && glyphs[j].shaperInfo.category === CATEGORIES.H) {
              break;
            }
          }
          if (glyphs[j].shaperInfo.category !== CATEGORIES.H && j > i) {
            let t = glyphs[i];
            glyphs.splice(i, 0, ...glyphs.splice(i + 1, j - i));
            glyphs[j] = t;
          }
          break;
        }
      }
    }
    let lastPos = POSITIONS.Start;
    for (let i = start; i < end; i++) {
      let info = glyphs[i].shaperInfo;
      if (info.category & (JOINER_FLAGS | CATEGORIES.N | CATEGORIES.RS | CATEGORIES.CM | HALANT_OR_COENG_FLAGS & info.category)) {
        info.position = lastPos;
        if (info.category === CATEGORIES.H && info.position === POSITIONS.Pre_M) {
          for (let j = i; j > start; j--) {
            if (glyphs[j - 1].shaperInfo.position !== POSITIONS.Pre_M) {
              info.position = glyphs[j - 1].shaperInfo.position;
              break;
            }
          }
        }
      } else if (info.position !== POSITIONS.SMVD) {
        lastPos = info.position;
      }
    }
    let last = base;
    for (let i = base + 1; i < end; i++) {
      if (isConsonant(glyphs[i])) {
        for (let j = last + 1; j < i; j++) {
          if (glyphs[j].shaperInfo.position < POSITIONS.SMVD) {
            glyphs[j].shaperInfo.position = glyphs[i].shaperInfo.position;
          }
        }
        last = i;
      } else if (glyphs[i].shaperInfo.category === CATEGORIES.M) {
        last = i;
      }
    }
    let arr = glyphs.slice(start, end);
    arr.sort((a, b) => a.shaperInfo.position - b.shaperInfo.position);
    glyphs.splice(start, arr.length, ...arr);
    for (let i = start; i < end; i++) {
      if (glyphs[i].shaperInfo.position === POSITIONS.Base_C) {
        base = i;
        break;
      }
    }
    for (let i = start; i < end && glyphs[i].shaperInfo.position === POSITIONS.Ra_To_Become_Reph; i++) {
      glyphs[i].features.rphf = true;
    }
    let blwf = !plan.isOldSpec && indicConfig.blwfMode === "Pre_And_Post";
    for (let i = start; i < base; i++) {
      glyphs[i].features.half = true;
      if (blwf) {
        glyphs[i].features.blwf = true;
      }
    }
    for (let i = base + 1; i < end; i++) {
      glyphs[i].features.abvf = true;
      glyphs[i].features.pstf = true;
      glyphs[i].features.blwf = true;
    }
    if (plan.isOldSpec && plan.unicodeScript === "Devanagari") {
      for (let i = start; i + 1 < base; i++) {
        if (glyphs[i].shaperInfo.category === CATEGORIES.Ra && glyphs[i + 1].shaperInfo.category === CATEGORIES.H && (i + 1 === base || glyphs[i + 2].shaperInfo.category === CATEGORIES.ZWJ)) {
          glyphs[i].features.blwf = true;
          glyphs[i + 1].features.blwf = true;
        }
      }
    }
    let prefLen = 2;
    if (features.pref && base + prefLen < end) {
      for (let i = base + 1; i + prefLen - 1 < end; i++) {
        let g = [glyphs[i].copy(), glyphs[i + 1].copy()];
        if (wouldSubstitute(g, "pref")) {
          for (let j = 0; j < prefLen; j++) {
            glyphs[i++].features.pref = true;
          }
          if (features.cfar) {
            for (; i < end; i++) {
              glyphs[i].features.cfar = true;
            }
          }
          break;
        }
      }
    }
    for (let i = start + 1; i < end; i++) {
      if (isJoiner(glyphs[i])) {
        let nonJoiner = glyphs[i].shaperInfo.category === CATEGORIES.ZWNJ;
        let j = i;
        do {
          j--;
          if (nonJoiner) {
            delete glyphs[j].features.half;
          }
        } while (j > start && !isConsonant(glyphs[j]));
      }
    }
  }
}
function finalReordering(font, glyphs, plan) {
  let indicConfig = plan.indicConfig;
  let features = font._layoutEngine.engine.GSUBProcessor.features;
  for (let start = 0, end = nextSyllable(glyphs, 0); start < glyphs.length; start = end, end = nextSyllable(glyphs, start)) {
    let tryPref = !!features.pref;
    let base = start;
    for (; base < end; base++) {
      if (glyphs[base].shaperInfo.position >= POSITIONS.Base_C) {
        if (tryPref && base + 1 < end) {
          for (let i = base + 1; i < end; i++) {
            if (glyphs[i].features.pref) {
              if (!(glyphs[i].substituted && glyphs[i].isLigated && !glyphs[i].isMultiplied)) {
                base = i;
                while (base < end && isHalantOrCoeng(glyphs[base])) {
                  base++;
                }
                glyphs[base].shaperInfo.position = POSITIONS.BASE_C;
                tryPref = false;
              }
              break;
            }
          }
        }
        if (plan.unicodeScript === "Malayalam") {
          for (let i = base + 1; i < end; i++) {
            while (i < end && isJoiner(glyphs[i])) {
              i++;
            }
            if (i === end || !isHalantOrCoeng(glyphs[i])) {
              break;
            }
            i++;
            while (i < end && isJoiner(glyphs[i])) {
              i++;
            }
            if (i < end && isConsonant(glyphs[i]) && glyphs[i].shaperInfo.position === POSITIONS.Below_C) {
              base = i;
              glyphs[base].shaperInfo.position = POSITIONS.Base_C;
            }
          }
        }
        if (start < base && glyphs[base].shaperInfo.position > POSITIONS.Base_C) {
          base--;
        }
        break;
      }
    }
    if (base === end && start < base && glyphs[base - 1].shaperInfo.category === CATEGORIES.ZWJ) {
      base--;
    }
    if (base < end) {
      while (start < base && glyphs[base].shaperInfo.category & (CATEGORIES.N | HALANT_OR_COENG_FLAGS)) {
        base--;
      }
    }
    if (start + 1 < end && start < base) {
      let newPos = base === end ? base - 2 : base - 1;
      if (plan.unicodeScript !== "Malayalam" && plan.unicodeScript !== "Tamil") {
        while (newPos > start && !(glyphs[newPos].shaperInfo.category & (CATEGORIES.M | HALANT_OR_COENG_FLAGS))) {
          newPos--;
        }
        if (isHalantOrCoeng(glyphs[newPos]) && glyphs[newPos].shaperInfo.position !== POSITIONS.Pre_M) {
          if (newPos + 1 < end && isJoiner(glyphs[newPos + 1])) {
            newPos++;
          }
        } else {
          newPos = start;
        }
      }
      if (start < newPos && glyphs[newPos].shaperInfo.position !== POSITIONS.Pre_M) {
        for (let i = newPos; i > start; i--) {
          if (glyphs[i - 1].shaperInfo.position === POSITIONS.Pre_M) {
            let oldPos = i - 1;
            if (oldPos < base && base <= newPos) {
              base--;
            }
            let tmp = glyphs[oldPos];
            glyphs.splice(oldPos, 0, ...glyphs.splice(oldPos + 1, newPos - oldPos));
            glyphs[newPos] = tmp;
            newPos--;
          }
        }
      }
    }
    if (start + 1 < end && glyphs[start].shaperInfo.position === POSITIONS.Ra_To_Become_Reph && glyphs[start].shaperInfo.category === CATEGORIES.Repha !== (glyphs[start].isLigated && !glyphs[start].isMultiplied)) {
      let newRephPos;
      let rephPos = indicConfig.rephPos;
      let found = false;
      if (rephPos !== POSITIONS.After_Post) {
        newRephPos = start + 1;
        while (newRephPos < base && !isHalantOrCoeng(glyphs[newRephPos])) {
          newRephPos++;
        }
        if (newRephPos < base && isHalantOrCoeng(glyphs[newRephPos])) {
          if (newRephPos + 1 < base && isJoiner(glyphs[newRephPos + 1])) {
            newRephPos++;
          }
          found = true;
        }
        if (!found && rephPos === POSITIONS.After_Main) {
          newRephPos = base;
          while (newRephPos + 1 < end && glyphs[newRephPos + 1].shaperInfo.position <= POSITIONS.After_Main) {
            newRephPos++;
          }
          found = newRephPos < end;
        }
        if (!found && rephPos === POSITIONS.After_Sub) {
          newRephPos = base;
          while (newRephPos + 1 < end && !(glyphs[newRephPos + 1].shaperInfo.position & (POSITIONS.Post_C | POSITIONS.After_Post | POSITIONS.SMVD))) {
            newRephPos++;
          }
          found = newRephPos < end;
        }
      }
      if (!found) {
        newRephPos = start + 1;
        while (newRephPos < base && !isHalantOrCoeng(glyphs[newRephPos])) {
          newRephPos++;
        }
        if (newRephPos < base && isHalantOrCoeng(glyphs[newRephPos])) {
          if (newRephPos + 1 < base && isJoiner(glyphs[newRephPos + 1])) {
            newRephPos++;
          }
          found = true;
        }
      }
      if (!found) {
        newRephPos = end - 1;
        while (newRephPos > start && glyphs[newRephPos].shaperInfo.position === POSITIONS.SMVD) {
          newRephPos--;
        }
        if (isHalantOrCoeng(glyphs[newRephPos])) {
          for (let i = base + 1; i < newRephPos; i++) {
            if (glyphs[i].shaperInfo.category === CATEGORIES.M) {
              newRephPos--;
            }
          }
        }
      }
      let reph = glyphs[start];
      glyphs.splice(start, 0, ...glyphs.splice(start + 1, newRephPos - start));
      glyphs[newRephPos] = reph;
      if (start < base && base <= newRephPos) {
        base--;
      }
    }
    if (tryPref && base + 1 < end) {
      for (let i = base + 1; i < end; i++) {
        if (glyphs[i].features.pref) {
          if (glyphs[i].isLigated && !glyphs[i].isMultiplied) {
            let newPos = base;
            if (plan.unicodeScript !== "Malayalam" && plan.unicodeScript !== "Tamil") {
              while (newPos > start && !(glyphs[newPos - 1].shaperInfo.category & (CATEGORIES.M | HALANT_OR_COENG_FLAGS))) {
                newPos--;
              }
              if (newPos > start && glyphs[newPos - 1].shaperInfo.category === CATEGORIES.M) {
                let oldPos2 = i;
                for (let j = base + 1; j < oldPos2; j++) {
                  if (glyphs[j].shaperInfo.category === CATEGORIES.M) {
                    newPos--;
                    break;
                  }
                }
              }
            }
            if (newPos > start && isHalantOrCoeng(glyphs[newPos - 1])) {
              if (newPos < end && isJoiner(glyphs[newPos])) {
                newPos++;
              }
            }
            let oldPos = i;
            let tmp = glyphs[oldPos];
            glyphs.splice(newPos + 1, 0, ...glyphs.splice(newPos, oldPos - newPos));
            glyphs[newPos] = tmp;
            if (newPos <= base && base < oldPos) {
              base++;
            }
          }
          break;
        }
      }
    }
    if (glyphs[start].shaperInfo.position === POSITIONS.Pre_M && (!start || !/Cf|Mn/.test($747425b437e121da$export$410364bbb673ddbc(glyphs[start - 1].codePoints[0])))) {
      glyphs[start].features.init = true;
    }
  }
}
function nextSyllable(glyphs, start) {
  if (start >= glyphs.length) return start;
  let syllable = glyphs[start].shaperInfo.syllable;
  while (++start < glyphs.length && glyphs[start].shaperInfo.syllable === syllable) ;
  return start;
}
var import_dfa, import_unicode_trie, decompositions, trie, stateMachine, IndicShaper, IndicInfo;
var init_IndicShaper = __esm({
  "node_modules/fontkit/src/opentype/shapers/IndicShaper.js"() {
    init_DefaultShaper();
    import_dfa = __toESM(require_dfa(), 1);
    import_unicode_trie = __toESM(require_unicode_trie(), 1);
    init_module();
    init_Script();
    init_GlyphInfo();
    init_indic();
    init_use();
    init_indic_data();
    init_utils();
    ({ decompositions } = use_default);
    trie = new import_unicode_trie.default(decodeBase64("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"));
    stateMachine = new import_dfa.default(indic_default);
    IndicShaper = class extends DefaultShaper {
      static zeroMarkWidths = "NONE";
      static planFeatures(plan) {
        plan.addStage(setupSyllables);
        plan.addStage(["locl", "ccmp"]);
        plan.addStage(initialReordering);
        plan.addStage("nukt");
        plan.addStage("akhn");
        plan.addStage("rphf", false);
        plan.addStage("rkrf");
        plan.addStage("pref", false);
        plan.addStage("blwf", false);
        plan.addStage("abvf", false);
        plan.addStage("half", false);
        plan.addStage("pstf", false);
        plan.addStage("vatu");
        plan.addStage("cjct");
        plan.addStage("cfar", false);
        plan.addStage(finalReordering);
        plan.addStage({
          local: ["init"],
          global: ["pres", "abvs", "blws", "psts", "haln", "dist", "abvm", "blwm", "calt", "clig"]
        });
        plan.unicodeScript = fromOpenType(plan.script);
        plan.indicConfig = INDIC_CONFIGS[plan.unicodeScript] || INDIC_CONFIGS.Default;
        plan.isOldSpec = plan.indicConfig.hasOldSpec && plan.script[plan.script.length - 1] !== "2";
      }
      static assignFeatures(plan, glyphs) {
        for (let i = glyphs.length - 1; i >= 0; i--) {
          let codepoint = glyphs[i].codePoints[0];
          let d = INDIC_DECOMPOSITIONS[codepoint] || decompositions[codepoint];
          if (d) {
            let decomposed = d.map((c) => {
              let g = plan.font.glyphForCodePoint(c);
              return new GlyphInfo(plan.font, g.id, [c], glyphs[i].features);
            });
            glyphs.splice(i, 1, ...decomposed);
          }
        }
      }
    };
    IndicInfo = class {
      constructor(category, position, syllableType, syllable) {
        this.category = category;
        this.position = position;
        this.syllableType = syllableType;
        this.syllable = syllable;
      }
    };
  }
});

export {
  IndicShaper,
  init_IndicShaper
};
