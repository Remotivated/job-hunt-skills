import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  GlyphInfo,
  init_GlyphInfo
} from "./chunk-TV2VLRB7.mjs";
import {
  OTProcessor,
  init_OTProcessor
} from "./chunk-IQQOVWPB.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/opentype/GSUBProcessor.js
var GSUBProcessor;
var init_GSUBProcessor = __esm({
  "node_modules/fontkit/src/opentype/GSUBProcessor.js"() {
    init_OTProcessor();
    init_GlyphInfo();
    GSUBProcessor = class extends OTProcessor {
      applyLookup(lookupType, table) {
        switch (lookupType) {
          case 1: {
            let index = this.coverageIndex(table.coverage);
            if (index === -1) {
              return false;
            }
            let glyph = this.glyphIterator.cur;
            switch (table.version) {
              case 1:
                glyph.id = glyph.id + table.deltaGlyphID & 65535;
                break;
              case 2:
                glyph.id = table.substitute.get(index);
                break;
            }
            return true;
          }
          case 2: {
            let index = this.coverageIndex(table.coverage);
            if (index !== -1) {
              let sequence = table.sequences.get(index);
              if (sequence.length === 0) {
                this.glyphs.splice(this.glyphIterator.index, 1);
                return true;
              }
              this.glyphIterator.cur.id = sequence[0];
              this.glyphIterator.cur.ligatureComponent = 0;
              let features = this.glyphIterator.cur.features;
              let curGlyph = this.glyphIterator.cur;
              let replacement = sequence.slice(1).map((gid, i) => {
                let glyph = new GlyphInfo(this.font, gid, void 0, features);
                glyph.shaperInfo = curGlyph.shaperInfo;
                glyph.isLigated = curGlyph.isLigated;
                glyph.ligatureComponent = i + 1;
                glyph.substituted = true;
                glyph.isMultiplied = true;
                return glyph;
              });
              this.glyphs.splice(this.glyphIterator.index + 1, 0, ...replacement);
              return true;
            }
            return false;
          }
          case 3: {
            let index = this.coverageIndex(table.coverage);
            if (index !== -1) {
              let USER_INDEX = 0;
              this.glyphIterator.cur.id = table.alternateSet.get(index)[USER_INDEX];
              return true;
            }
            return false;
          }
          case 4: {
            let index = this.coverageIndex(table.coverage);
            if (index === -1) {
              return false;
            }
            for (let ligature of table.ligatureSets.get(index)) {
              let matched = this.sequenceMatchIndices(1, ligature.components);
              if (!matched) {
                continue;
              }
              let curGlyph = this.glyphIterator.cur;
              let characters = curGlyph.codePoints.slice();
              for (let index2 of matched) {
                characters.push(...this.glyphs[index2].codePoints);
              }
              let ligatureGlyph = new GlyphInfo(this.font, ligature.glyph, characters, curGlyph.features);
              ligatureGlyph.shaperInfo = curGlyph.shaperInfo;
              ligatureGlyph.isLigated = true;
              ligatureGlyph.substituted = true;
              let isMarkLigature = curGlyph.isMark;
              for (let i = 0; i < matched.length && isMarkLigature; i++) {
                isMarkLigature = this.glyphs[matched[i]].isMark;
              }
              ligatureGlyph.ligatureID = isMarkLigature ? null : this.ligatureID++;
              let lastLigID = curGlyph.ligatureID;
              let lastNumComps = curGlyph.codePoints.length;
              let curComps = lastNumComps;
              let idx = this.glyphIterator.index + 1;
              for (let matchIndex of matched) {
                if (isMarkLigature) {
                  idx = matchIndex;
                } else {
                  while (idx < matchIndex) {
                    var ligatureComponent = curComps - lastNumComps + Math.min(this.glyphs[idx].ligatureComponent || 1, lastNumComps);
                    this.glyphs[idx].ligatureID = ligatureGlyph.ligatureID;
                    this.glyphs[idx].ligatureComponent = ligatureComponent;
                    idx++;
                  }
                }
                lastLigID = this.glyphs[idx].ligatureID;
                lastNumComps = this.glyphs[idx].codePoints.length;
                curComps += lastNumComps;
                idx++;
              }
              if (lastLigID && !isMarkLigature) {
                for (let i = idx; i < this.glyphs.length; i++) {
                  if (this.glyphs[i].ligatureID === lastLigID) {
                    var ligatureComponent = curComps - lastNumComps + Math.min(this.glyphs[i].ligatureComponent || 1, lastNumComps);
                    this.glyphs[i].ligatureComponent = ligatureComponent;
                  } else {
                    break;
                  }
                }
              }
              for (let i = matched.length - 1; i >= 0; i--) {
                this.glyphs.splice(matched[i], 1);
              }
              this.glyphs[this.glyphIterator.index] = ligatureGlyph;
              return true;
            }
            return false;
          }
          case 5:
            return this.applyContext(table);
          case 6:
            return this.applyChainingContext(table);
          case 7:
            return this.applyLookup(table.lookupType, table.extension);
          default:
            throw new Error("GSUB lookupType ".concat(lookupType, " is not supported"));
        }
      }
    };
  }
});

export {
  GSUBProcessor,
  init_GSUBProcessor
};
