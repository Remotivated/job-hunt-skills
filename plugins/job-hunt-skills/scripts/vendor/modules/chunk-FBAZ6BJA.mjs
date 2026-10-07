import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  OTLayoutEngine,
  init_OTLayoutEngine
} from "./chunk-J5NTJBTY.mjs";
import {
  GlyphPosition,
  init_GlyphPosition
} from "./chunk-NMFAFIWV.mjs";
import {
  GlyphRun,
  init_GlyphRun
} from "./chunk-7THQZIKP.mjs";
import {
  KernProcessor,
  init_KernProcessor
} from "./chunk-SYUILWXM.mjs";
import {
  UnicodeLayoutEngine,
  init_UnicodeLayoutEngine
} from "./chunk-GAFCJP4H.mjs";
import {
  forCodePoints,
  forString,
  init_Script
} from "./chunk-SNNDT6ZF.mjs";
import {
  AATLayoutEngine,
  init_AATLayoutEngine
} from "./chunk-RGG6SKXQ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/layout/LayoutEngine.js
var LayoutEngine;
var init_LayoutEngine = __esm({
  "node_modules/fontkit/src/layout/LayoutEngine.js"() {
    init_KernProcessor();
    init_UnicodeLayoutEngine();
    init_GlyphRun();
    init_GlyphPosition();
    init_Script();
    init_AATLayoutEngine();
    init_OTLayoutEngine();
    LayoutEngine = class {
      constructor(font) {
        this.font = font;
        this.unicodeLayoutEngine = null;
        this.kernProcessor = null;
        if (this.font.morx) {
          this.engine = new AATLayoutEngine(this.font);
        } else if (this.font.GSUB || this.font.GPOS) {
          this.engine = new OTLayoutEngine(this.font);
        }
      }
      layout(string, features, script, language, direction) {
        if (typeof features === "string") {
          direction = language;
          language = script;
          script = features;
          features = [];
        }
        if (typeof string === "string") {
          if (script == null) {
            script = forString(string);
          }
          var glyphs = this.font.glyphsForString(string);
        } else {
          if (script == null) {
            let codePoints = [];
            for (let glyph of string) {
              codePoints.push(...glyph.codePoints);
            }
            script = forCodePoints(codePoints);
          }
          var glyphs = string;
        }
        let glyphRun = new GlyphRun(glyphs, features, script, language, direction);
        if (glyphs.length === 0) {
          glyphRun.positions = [];
          return glyphRun;
        }
        if (this.engine && this.engine.setup) {
          this.engine.setup(glyphRun);
        }
        this.substitute(glyphRun);
        this.position(glyphRun);
        this.hideDefaultIgnorables(glyphRun.glyphs, glyphRun.positions);
        if (this.engine && this.engine.cleanup) {
          this.engine.cleanup();
        }
        return glyphRun;
      }
      substitute(glyphRun) {
        if (this.engine && this.engine.substitute) {
          this.engine.substitute(glyphRun);
        }
      }
      position(glyphRun) {
        glyphRun.positions = glyphRun.glyphs.map((glyph) => new GlyphPosition(glyph.advanceWidth));
        let positioned = null;
        if (this.engine && this.engine.position) {
          positioned = this.engine.position(glyphRun);
        }
        if (!positioned && (!this.engine || this.engine.fallbackPosition)) {
          if (!this.unicodeLayoutEngine) {
            this.unicodeLayoutEngine = new UnicodeLayoutEngine(this.font);
          }
          this.unicodeLayoutEngine.positionGlyphs(glyphRun.glyphs, glyphRun.positions);
        }
        if ((!positioned || !positioned.kern) && glyphRun.features.kern !== false && this.font.kern) {
          if (!this.kernProcessor) {
            this.kernProcessor = new KernProcessor(this.font);
          }
          this.kernProcessor.process(glyphRun.glyphs, glyphRun.positions);
          glyphRun.features.kern = true;
        }
      }
      hideDefaultIgnorables(glyphs, positions) {
        let space = this.font.glyphForCodePoint(32);
        for (let i = 0; i < glyphs.length; i++) {
          if (this.isDefaultIgnorable(glyphs[i].codePoints[0])) {
            glyphs[i] = space;
            positions[i].xAdvance = 0;
            positions[i].yAdvance = 0;
          }
        }
      }
      isDefaultIgnorable(ch) {
        let plane = ch >> 16;
        if (plane === 0) {
          switch (ch >> 8) {
            case 0:
              return ch === 173;
            case 3:
              return ch === 847;
            case 6:
              return ch === 1564;
            case 23:
              return 6068 <= ch && ch <= 6069;
            case 24:
              return 6155 <= ch && ch <= 6158;
            case 32:
              return 8203 <= ch && ch <= 8207 || 8234 <= ch && ch <= 8238 || 8288 <= ch && ch <= 8303;
            case 254:
              return 65024 <= ch && ch <= 65039 || ch === 65279;
            case 255:
              return 65520 <= ch && ch <= 65528;
            default:
              return false;
          }
        } else {
          switch (plane) {
            case 1:
              return 113824 <= ch && ch <= 113827 || 119155 <= ch && ch <= 119162;
            case 14:
              return 917504 <= ch && ch <= 921599;
            default:
              return false;
          }
        }
      }
      getAvailableFeatures(script, language) {
        let features = [];
        if (this.engine) {
          features.push(...this.engine.getAvailableFeatures(script, language));
        }
        if (this.font.kern && features.indexOf("kern") === -1) {
          features.push("kern");
        }
        return features;
      }
      stringsForGlyph(gid) {
        let result = /* @__PURE__ */ new Set();
        let codePoints = this.font._cmapProcessor.codePointsForGlyph(gid);
        for (let codePoint of codePoints) {
          result.add(String.fromCodePoint(codePoint));
        }
        if (this.engine && this.engine.stringsForGlyph) {
          for (let string of this.engine.stringsForGlyph(gid)) {
            result.add(string);
          }
        }
        return Array.from(result);
      }
    };
  }
});

export {
  LayoutEngine,
  init_LayoutEngine
};
