import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  init_AATFeatureMap,
  mapAATToOT,
  mapOTToAAT
} from "./chunk-HES4T3ZO.mjs";
import {
  AATMorxProcessor,
  init_AATMorxProcessor
} from "./chunk-O4CPZA5F.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/aat/AATLayoutEngine.js
var AATLayoutEngine;
var init_AATLayoutEngine = __esm({
  "node_modules/fontkit/src/aat/AATLayoutEngine.js"() {
    init_AATFeatureMap();
    init_AATMorxProcessor();
    AATLayoutEngine = class {
      constructor(font) {
        this.font = font;
        this.morxProcessor = new AATMorxProcessor(font);
        this.fallbackPosition = false;
      }
      substitute(glyphRun) {
        if (glyphRun.direction === "rtl") {
          glyphRun.glyphs.reverse();
        }
        this.morxProcessor.process(glyphRun.glyphs, mapOTToAAT(glyphRun.features));
      }
      getAvailableFeatures(script, language) {
        return mapAATToOT(this.morxProcessor.getSupportedFeatures());
      }
      stringsForGlyph(gid) {
        let glyphStrings = this.morxProcessor.generateInputs(gid);
        let result = /* @__PURE__ */ new Set();
        for (let glyphs of glyphStrings) {
          this._addStrings(glyphs, 0, result, "");
        }
        return result;
      }
      _addStrings(glyphs, index, strings, string) {
        let codePoints = this.font._cmapProcessor.codePointsForGlyph(glyphs[index]);
        for (let codePoint of codePoints) {
          let s = string + String.fromCodePoint(codePoint);
          if (index < glyphs.length - 1) {
            this._addStrings(glyphs, index + 1, strings, s);
          } else {
            strings.add(s);
          }
        }
      }
    };
  }
});

export {
  AATLayoutEngine,
  init_AATLayoutEngine
};
