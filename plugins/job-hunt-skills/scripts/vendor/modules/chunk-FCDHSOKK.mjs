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
  GlyphInfo,
  init_GlyphInfo
} from "./chunk-TV2VLRB7.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/opentype/shapers/HangulShaper.js
function getType(code) {
  if (isL(code)) {
    return L;
  }
  if (isV(code)) {
    return V;
  }
  if (isT(code)) {
    return T;
  }
  if (isLV(code)) {
    return LV;
  }
  if (isLVT(code)) {
    return LVT;
  }
  if (isTone(code)) {
    return M;
  }
  return X;
}
function getGlyph(font, code, features) {
  return new GlyphInfo(font, font.glyphForCodePoint(code).id, [code], features);
}
function decompose(glyphs, i, font) {
  let glyph = glyphs[i];
  let code = glyph.codePoints[0];
  let s = code - HANGUL_BASE;
  let t = T_BASE + s % T_COUNT;
  s = s / T_COUNT | 0;
  let l = L_BASE + s / V_COUNT | 0;
  let v = V_BASE + s % V_COUNT;
  if (!font.hasGlyphForCodePoint(l) || !font.hasGlyphForCodePoint(v) || t !== T_BASE && !font.hasGlyphForCodePoint(t)) {
    return i;
  }
  let ljmo = getGlyph(font, l, glyph.features);
  ljmo.features.ljmo = true;
  let vjmo = getGlyph(font, v, glyph.features);
  vjmo.features.vjmo = true;
  let insert = [ljmo, vjmo];
  if (t > T_BASE) {
    let tjmo = getGlyph(font, t, glyph.features);
    tjmo.features.tjmo = true;
    insert.push(tjmo);
  }
  glyphs.splice(i, 1, ...insert);
  return i + insert.length - 1;
}
function compose(glyphs, i, font) {
  let glyph = glyphs[i];
  let code = glyphs[i].codePoints[0];
  let type = getType(code);
  let prev = glyphs[i - 1].codePoints[0];
  let prevType = getType(prev);
  let lv, ljmo, vjmo, tjmo;
  if (prevType === LV && type === T) {
    lv = prev;
    tjmo = glyph;
  } else {
    if (type === V) {
      ljmo = glyphs[i - 1];
      vjmo = glyph;
    } else {
      ljmo = glyphs[i - 2];
      vjmo = glyphs[i - 1];
      tjmo = glyph;
    }
    let l = ljmo.codePoints[0];
    let v = vjmo.codePoints[0];
    if (isCombiningL(l) && isCombiningV(v)) {
      lv = HANGUL_BASE + ((l - L_BASE) * V_COUNT + (v - V_BASE)) * T_COUNT;
    }
  }
  let t = tjmo && tjmo.codePoints[0] || T_BASE;
  if (lv != null && (t === T_BASE || isCombiningT(t))) {
    let s = lv + (t - T_BASE);
    if (font.hasGlyphForCodePoint(s)) {
      let del = prevType === V ? 3 : 2;
      glyphs.splice(i - del + 1, del, getGlyph(font, s, glyph.features));
      return i - del + 1;
    }
  }
  if (ljmo) {
    ljmo.features.ljmo = true;
  }
  if (vjmo) {
    vjmo.features.vjmo = true;
  }
  if (tjmo) {
    tjmo.features.tjmo = true;
  }
  if (prevType === LV) {
    decompose(glyphs, i - 1, font);
    return i + 1;
  }
  return i;
}
function getLength(code) {
  switch (getType(code)) {
    case LV:
    case LVT:
      return 1;
    case V:
      return 2;
    case T:
      return 3;
  }
}
function reorderToneMark(glyphs, i, font) {
  let glyph = glyphs[i];
  let code = glyphs[i].codePoints[0];
  if (font.glyphForCodePoint(code).advanceWidth === 0) {
    return;
  }
  let prev = glyphs[i - 1].codePoints[0];
  let len = getLength(prev);
  glyphs.splice(i, 1);
  return glyphs.splice(i - len, 0, glyph);
}
function insertDottedCircle(glyphs, i, font) {
  let glyph = glyphs[i];
  let code = glyphs[i].codePoints[0];
  if (font.hasGlyphForCodePoint(DOTTED_CIRCLE)) {
    let dottedCircle = getGlyph(font, DOTTED_CIRCLE, glyph.features);
    let idx = font.glyphForCodePoint(code).advanceWidth === 0 ? i : i + 1;
    glyphs.splice(idx, 0, dottedCircle);
    i++;
  }
  return i;
}
var HangulShaper, HANGUL_BASE, HANGUL_END, HANGUL_COUNT, L_BASE, V_BASE, T_BASE, L_COUNT, V_COUNT, T_COUNT, L_END, V_END, T_END, DOTTED_CIRCLE, isL, isV, isT, isTone, isLVT, isLV, isCombiningL, isCombiningV, isCombiningT, X, L, V, T, LV, LVT, M, NO_ACTION, DECOMPOSE, COMPOSE, TONE_MARK, INVALID, STATE_TABLE;
var init_HangulShaper = __esm({
  "node_modules/fontkit/src/opentype/shapers/HangulShaper.js"() {
    init_DefaultShaper();
    init_GlyphInfo();
    HangulShaper = class extends DefaultShaper {
      static zeroMarkWidths = "NONE";
      static planFeatures(plan) {
        plan.add(["ljmo", "vjmo", "tjmo"], false);
      }
      static assignFeatures(plan, glyphs) {
        let state = 0;
        let i = 0;
        while (i < glyphs.length) {
          let action;
          let glyph = glyphs[i];
          let code = glyph.codePoints[0];
          let type = getType(code);
          [action, state] = STATE_TABLE[state][type];
          switch (action) {
            case DECOMPOSE:
              if (!plan.font.hasGlyphForCodePoint(code)) {
                i = decompose(glyphs, i, plan.font);
              }
              break;
            case COMPOSE:
              i = compose(glyphs, i, plan.font);
              break;
            case TONE_MARK:
              reorderToneMark(glyphs, i, plan.font);
              break;
            case INVALID:
              i = insertDottedCircle(glyphs, i, plan.font);
              break;
          }
          i++;
        }
      }
    };
    HANGUL_BASE = 44032;
    HANGUL_END = 55204;
    HANGUL_COUNT = HANGUL_END - HANGUL_BASE + 1;
    L_BASE = 4352;
    V_BASE = 4449;
    T_BASE = 4519;
    L_COUNT = 19;
    V_COUNT = 21;
    T_COUNT = 28;
    L_END = L_BASE + L_COUNT - 1;
    V_END = V_BASE + V_COUNT - 1;
    T_END = T_BASE + T_COUNT - 1;
    DOTTED_CIRCLE = 9676;
    isL = (code) => 4352 <= code && code <= 4447 || 43360 <= code && code <= 43388;
    isV = (code) => 4448 <= code && code <= 4519 || 55216 <= code && code <= 55238;
    isT = (code) => 4520 <= code && code <= 4607 || 55243 <= code && code <= 55291;
    isTone = (code) => 12334 <= code && code <= 12335;
    isLVT = (code) => HANGUL_BASE <= code && code <= HANGUL_END;
    isLV = (code) => code - HANGUL_BASE < HANGUL_COUNT && (code - HANGUL_BASE) % T_COUNT === 0;
    isCombiningL = (code) => L_BASE <= code && code <= L_END;
    isCombiningV = (code) => V_BASE <= code && code <= V_END;
    isCombiningT = (code) => T_BASE + 1 && 1 <= code && code <= T_END;
    X = 0;
    L = 1;
    V = 2;
    T = 3;
    LV = 4;
    LVT = 5;
    M = 6;
    NO_ACTION = 0;
    DECOMPOSE = 1;
    COMPOSE = 2;
    TONE_MARK = 4;
    INVALID = 5;
    STATE_TABLE = [
      //       X                 L                 V                T                  LV                LVT               M
      // State 0: start state
      [[NO_ACTION, 0], [NO_ACTION, 1], [NO_ACTION, 0], [NO_ACTION, 0], [DECOMPOSE, 2], [DECOMPOSE, 3], [INVALID, 0]],
      // State 1: <L>
      [[NO_ACTION, 0], [NO_ACTION, 1], [COMPOSE, 2], [NO_ACTION, 0], [DECOMPOSE, 2], [DECOMPOSE, 3], [INVALID, 0]],
      // State 2: <L,V> or <LV>
      [[NO_ACTION, 0], [NO_ACTION, 1], [NO_ACTION, 0], [COMPOSE, 3], [DECOMPOSE, 2], [DECOMPOSE, 3], [TONE_MARK, 0]],
      // State 3: <L,V,T> or <LVT>
      [[NO_ACTION, 0], [NO_ACTION, 1], [NO_ACTION, 0], [NO_ACTION, 0], [DECOMPOSE, 2], [DECOMPOSE, 3], [TONE_MARK, 0]]
    ];
  }
});

export {
  HangulShaper,
  init_HangulShaper
};
