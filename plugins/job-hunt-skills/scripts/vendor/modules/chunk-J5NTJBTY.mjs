import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  choose,
  init_shapers
} from "./chunk-QUOINUGZ.mjs";
import {
  ShapingPlan,
  init_ShapingPlan
} from "./chunk-MSBKH4RS.mjs";
import {
  GPOSProcessor,
  init_GPOSProcessor
} from "./chunk-GZ2VFG2Z.mjs";
import {
  GSUBProcessor,
  init_GSUBProcessor
} from "./chunk-QH3WJ33E.mjs";
import {
  GlyphInfo,
  init_GlyphInfo
} from "./chunk-TV2VLRB7.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/opentype/OTLayoutEngine.js
var OTLayoutEngine;
var init_OTLayoutEngine = __esm({
  "node_modules/fontkit/src/opentype/OTLayoutEngine.js"() {
    init_ShapingPlan();
    init_shapers();
    init_GlyphInfo();
    init_GSUBProcessor();
    init_GPOSProcessor();
    OTLayoutEngine = class {
      constructor(font) {
        this.font = font;
        this.glyphInfos = null;
        this.plan = null;
        this.GSUBProcessor = null;
        this.GPOSProcessor = null;
        this.fallbackPosition = true;
        if (font.GSUB) {
          this.GSUBProcessor = new GSUBProcessor(font, font.GSUB);
        }
        if (font.GPOS) {
          this.GPOSProcessor = new GPOSProcessor(font, font.GPOS);
        }
      }
      setup(glyphRun) {
        this.glyphInfos = glyphRun.glyphs.map((glyph) => new GlyphInfo(this.font, glyph.id, [...glyph.codePoints]));
        let script = null;
        if (this.GPOSProcessor) {
          script = this.GPOSProcessor.selectScript(glyphRun.script, glyphRun.language, glyphRun.direction);
        }
        if (this.GSUBProcessor) {
          script = this.GSUBProcessor.selectScript(glyphRun.script, glyphRun.language, glyphRun.direction);
        }
        this.shaper = choose(script);
        this.plan = new ShapingPlan(this.font, script, glyphRun.direction);
        this.shaper.plan(this.plan, this.glyphInfos, glyphRun.features);
        for (let key in this.plan.allFeatures) {
          glyphRun.features[key] = true;
        }
      }
      substitute(glyphRun) {
        if (this.GSUBProcessor) {
          this.plan.process(this.GSUBProcessor, this.glyphInfos);
          glyphRun.glyphs = this.glyphInfos.map((glyphInfo) => this.font.getGlyph(glyphInfo.id, glyphInfo.codePoints));
        }
      }
      position(glyphRun) {
        if (this.shaper.zeroMarkWidths === "BEFORE_GPOS") {
          this.zeroMarkAdvances(glyphRun.positions);
        }
        if (this.GPOSProcessor) {
          this.plan.process(this.GPOSProcessor, this.glyphInfos, glyphRun.positions);
        }
        if (this.shaper.zeroMarkWidths === "AFTER_GPOS") {
          this.zeroMarkAdvances(glyphRun.positions);
        }
        if (glyphRun.direction === "rtl") {
          glyphRun.glyphs.reverse();
          glyphRun.positions.reverse();
        }
        return this.GPOSProcessor && this.GPOSProcessor.features;
      }
      zeroMarkAdvances(positions) {
        for (let i = 0; i < this.glyphInfos.length; i++) {
          if (this.glyphInfos[i].isMark) {
            positions[i].xAdvance = 0;
            positions[i].yAdvance = 0;
          }
        }
      }
      cleanup() {
        this.glyphInfos = null;
        this.plan = null;
        this.shaper = null;
      }
      getAvailableFeatures(script, language) {
        let features = [];
        if (this.GSUBProcessor) {
          this.GSUBProcessor.selectScript(script, language);
          features.push(...Object.keys(this.GSUBProcessor.features));
        }
        if (this.GPOSProcessor) {
          this.GPOSProcessor.selectScript(script, language);
          features.push(...Object.keys(this.GPOSProcessor.features));
        }
        return features;
      }
    };
  }
});

export {
  OTLayoutEngine,
  init_OTLayoutEngine
};
