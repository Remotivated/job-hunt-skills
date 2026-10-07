import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  IndicShaper,
  init_IndicShaper
} from "./chunk-VTZJYUFY.mjs";
import {
  UniversalShaper,
  init_UniversalShaper
} from "./chunk-S2N2F4C2.mjs";
import {
  ArabicShaper,
  init_ArabicShaper
} from "./chunk-7QFNITNT.mjs";
import {
  HangulShaper,
  init_HangulShaper
} from "./chunk-FCDHSOKK.mjs";
import {
  DefaultShaper,
  init_DefaultShaper
} from "./chunk-DDPYBZPE.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/opentype/shapers/index.js
function choose(script) {
  if (!Array.isArray(script)) {
    script = [script];
  }
  for (let s of script) {
    let shaper = SHAPERS[s];
    if (shaper) {
      return shaper;
    }
  }
  return DefaultShaper;
}
var SHAPERS;
var init_shapers = __esm({
  "node_modules/fontkit/src/opentype/shapers/index.js"() {
    init_DefaultShaper();
    init_ArabicShaper();
    init_HangulShaper();
    init_IndicShaper();
    init_UniversalShaper();
    SHAPERS = {
      arab: ArabicShaper,
      // Arabic
      mong: ArabicShaper,
      // Mongolian
      syrc: ArabicShaper,
      // Syriac
      "nko ": ArabicShaper,
      // N'Ko
      phag: ArabicShaper,
      // Phags Pa
      mand: ArabicShaper,
      // Mandaic
      mani: ArabicShaper,
      // Manichaean
      phlp: ArabicShaper,
      // Psalter Pahlavi
      hang: HangulShaper,
      // Hangul
      bng2: IndicShaper,
      // Bengali
      beng: IndicShaper,
      // Bengali
      dev2: IndicShaper,
      // Devanagari
      deva: IndicShaper,
      // Devanagari
      gjr2: IndicShaper,
      // Gujarati
      gujr: IndicShaper,
      // Gujarati
      guru: IndicShaper,
      // Gurmukhi
      gur2: IndicShaper,
      // Gurmukhi
      knda: IndicShaper,
      // Kannada
      knd2: IndicShaper,
      // Kannada
      mlm2: IndicShaper,
      // Malayalam
      mlym: IndicShaper,
      // Malayalam
      ory2: IndicShaper,
      // Oriya
      orya: IndicShaper,
      // Oriya
      taml: IndicShaper,
      // Tamil
      tml2: IndicShaper,
      // Tamil
      telu: IndicShaper,
      // Telugu
      tel2: IndicShaper,
      // Telugu
      khmr: IndicShaper,
      // Khmer
      bali: UniversalShaper,
      // Balinese
      batk: UniversalShaper,
      // Batak
      brah: UniversalShaper,
      // Brahmi
      bugi: UniversalShaper,
      // Buginese
      buhd: UniversalShaper,
      // Buhid
      cakm: UniversalShaper,
      // Chakma
      cham: UniversalShaper,
      // Cham
      dupl: UniversalShaper,
      // Duployan
      egyp: UniversalShaper,
      // Egyptian Hieroglyphs
      gran: UniversalShaper,
      // Grantha
      hano: UniversalShaper,
      // Hanunoo
      java: UniversalShaper,
      // Javanese
      kthi: UniversalShaper,
      // Kaithi
      kali: UniversalShaper,
      // Kayah Li
      khar: UniversalShaper,
      // Kharoshthi
      khoj: UniversalShaper,
      // Khojki
      sind: UniversalShaper,
      // Khudawadi
      lepc: UniversalShaper,
      // Lepcha
      limb: UniversalShaper,
      // Limbu
      mahj: UniversalShaper,
      // Mahajani
      // mand: UniversalShaper, // Mandaic
      // mani: UniversalShaper, // Manichaean
      mtei: UniversalShaper,
      // Meitei Mayek
      modi: UniversalShaper,
      // Modi
      // mong: UniversalShaper, // Mongolian
      // 'nko ': UniversalShaper, // N’Ko
      hmng: UniversalShaper,
      // Pahawh Hmong
      // phag: UniversalShaper, // Phags-pa
      // phlp: UniversalShaper, // Psalter Pahlavi
      rjng: UniversalShaper,
      // Rejang
      saur: UniversalShaper,
      // Saurashtra
      shrd: UniversalShaper,
      // Sharada
      sidd: UniversalShaper,
      // Siddham
      sinh: IndicShaper,
      // Sinhala
      sund: UniversalShaper,
      // Sundanese
      sylo: UniversalShaper,
      // Syloti Nagri
      tglg: UniversalShaper,
      // Tagalog
      tagb: UniversalShaper,
      // Tagbanwa
      tale: UniversalShaper,
      // Tai Le
      lana: UniversalShaper,
      // Tai Tham
      tavt: UniversalShaper,
      // Tai Viet
      takr: UniversalShaper,
      // Takri
      tibt: UniversalShaper,
      // Tibetan
      tfng: UniversalShaper,
      // Tifinagh
      tirh: UniversalShaper,
      // Tirhuta
      latn: DefaultShaper,
      // Latin
      DFLT: DefaultShaper
      // Default
    };
  }
});

export {
  choose,
  init_shapers
};
