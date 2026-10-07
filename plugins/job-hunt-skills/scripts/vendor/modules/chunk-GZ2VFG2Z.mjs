import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  OTProcessor,
  init_OTProcessor
} from "./chunk-IQQOVWPB.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/opentype/GPOSProcessor.js
var GPOSProcessor;
var init_GPOSProcessor = __esm({
  "node_modules/fontkit/src/opentype/GPOSProcessor.js"() {
    init_OTProcessor();
    GPOSProcessor = class extends OTProcessor {
      applyPositionValue(sequenceIndex, value) {
        let position = this.positions[this.glyphIterator.peekIndex(sequenceIndex)];
        if (value.xAdvance != null) {
          position.xAdvance += value.xAdvance;
        }
        if (value.yAdvance != null) {
          position.yAdvance += value.yAdvance;
        }
        if (value.xPlacement != null) {
          position.xOffset += value.xPlacement;
        }
        if (value.yPlacement != null) {
          position.yOffset += value.yPlacement;
        }
        let variationProcessor = this.font._variationProcessor;
        let variationStore = this.font.GDEF && this.font.GDEF.itemVariationStore;
        if (variationProcessor && variationStore) {
          if (value.xPlaDevice) {
            position.xOffset += variationProcessor.getDelta(variationStore, value.xPlaDevice.a, value.xPlaDevice.b);
          }
          if (value.yPlaDevice) {
            position.yOffset += variationProcessor.getDelta(variationStore, value.yPlaDevice.a, value.yPlaDevice.b);
          }
          if (value.xAdvDevice) {
            position.xAdvance += variationProcessor.getDelta(variationStore, value.xAdvDevice.a, value.xAdvDevice.b);
          }
          if (value.yAdvDevice) {
            position.yAdvance += variationProcessor.getDelta(variationStore, value.yAdvDevice.a, value.yAdvDevice.b);
          }
        }
      }
      applyLookup(lookupType, table) {
        switch (lookupType) {
          case 1: {
            let index = this.coverageIndex(table.coverage);
            if (index === -1) {
              return false;
            }
            switch (table.version) {
              case 1:
                this.applyPositionValue(0, table.value);
                break;
              case 2:
                this.applyPositionValue(0, table.values.get(index));
                break;
            }
            return true;
          }
          case 2: {
            let nextGlyph = this.glyphIterator.peek();
            if (!nextGlyph) {
              return false;
            }
            let index = this.coverageIndex(table.coverage);
            if (index === -1) {
              return false;
            }
            switch (table.version) {
              case 1:
                let set = table.pairSets.get(index);
                for (let pair2 of set) {
                  if (pair2.secondGlyph === nextGlyph.id) {
                    this.applyPositionValue(0, pair2.value1);
                    this.applyPositionValue(1, pair2.value2);
                    return true;
                  }
                }
                return false;
              case 2:
                let class1 = this.getClassID(this.glyphIterator.cur.id, table.classDef1);
                let class2 = this.getClassID(nextGlyph.id, table.classDef2);
                if (class1 === -1 || class2 === -1) {
                  return false;
                }
                var pair = table.classRecords.get(class1).get(class2);
                this.applyPositionValue(0, pair.value1);
                this.applyPositionValue(1, pair.value2);
                return true;
            }
          }
          case 3: {
            let nextIndex = this.glyphIterator.peekIndex();
            let nextGlyph = this.glyphs[nextIndex];
            if (!nextGlyph) {
              return false;
            }
            let curRecord = table.entryExitRecords[this.coverageIndex(table.coverage)];
            if (!curRecord || !curRecord.exitAnchor) {
              return false;
            }
            let nextRecord = table.entryExitRecords[this.coverageIndex(table.coverage, nextGlyph.id)];
            if (!nextRecord || !nextRecord.entryAnchor) {
              return false;
            }
            let entry = this.getAnchor(nextRecord.entryAnchor);
            let exit = this.getAnchor(curRecord.exitAnchor);
            let cur = this.positions[this.glyphIterator.index];
            let next = this.positions[nextIndex];
            let d;
            switch (this.direction) {
              case "ltr":
                cur.xAdvance = exit.x + cur.xOffset;
                d = entry.x + next.xOffset;
                next.xAdvance -= d;
                next.xOffset -= d;
                break;
              case "rtl":
                d = exit.x + cur.xOffset;
                cur.xAdvance -= d;
                cur.xOffset -= d;
                next.xAdvance = entry.x + next.xOffset;
                break;
            }
            if (this.glyphIterator.flags.rightToLeft) {
              this.glyphIterator.cur.cursiveAttachment = nextIndex;
              cur.yOffset = entry.y - exit.y;
            } else {
              nextGlyph.cursiveAttachment = this.glyphIterator.index;
              cur.yOffset = exit.y - entry.y;
            }
            return true;
          }
          case 4: {
            let markIndex = this.coverageIndex(table.markCoverage);
            if (markIndex === -1) {
              return false;
            }
            let baseGlyphIndex = this.glyphIterator.index;
            while (--baseGlyphIndex >= 0 && (this.glyphs[baseGlyphIndex].isMark || this.glyphs[baseGlyphIndex].ligatureComponent > 0)) ;
            if (baseGlyphIndex < 0) {
              return false;
            }
            let baseIndex = this.coverageIndex(table.baseCoverage, this.glyphs[baseGlyphIndex].id);
            if (baseIndex === -1) {
              return false;
            }
            let markRecord = table.markArray[markIndex];
            let baseAnchor = table.baseArray[baseIndex][markRecord.class];
            this.applyAnchor(markRecord, baseAnchor, baseGlyphIndex);
            return true;
          }
          case 5: {
            let markIndex = this.coverageIndex(table.markCoverage);
            if (markIndex === -1) {
              return false;
            }
            let baseGlyphIndex = this.glyphIterator.index;
            while (--baseGlyphIndex >= 0 && this.glyphs[baseGlyphIndex].isMark) ;
            if (baseGlyphIndex < 0) {
              return false;
            }
            let ligIndex = this.coverageIndex(table.ligatureCoverage, this.glyphs[baseGlyphIndex].id);
            if (ligIndex === -1) {
              return false;
            }
            let ligAttach = table.ligatureArray[ligIndex];
            let markGlyph = this.glyphIterator.cur;
            let ligGlyph = this.glyphs[baseGlyphIndex];
            let compIndex = ligGlyph.ligatureID && ligGlyph.ligatureID === markGlyph.ligatureID && markGlyph.ligatureComponent > 0 ? Math.min(markGlyph.ligatureComponent, ligGlyph.codePoints.length) - 1 : ligGlyph.codePoints.length - 1;
            let markRecord = table.markArray[markIndex];
            let baseAnchor = ligAttach[compIndex][markRecord.class];
            this.applyAnchor(markRecord, baseAnchor, baseGlyphIndex);
            return true;
          }
          case 6: {
            let mark1Index = this.coverageIndex(table.mark1Coverage);
            if (mark1Index === -1) {
              return false;
            }
            let prevIndex = this.glyphIterator.peekIndex(-1);
            let prev = this.glyphs[prevIndex];
            if (!prev || !prev.isMark) {
              return false;
            }
            let cur = this.glyphIterator.cur;
            let good = false;
            if (cur.ligatureID === prev.ligatureID) {
              if (!cur.ligatureID) {
                good = true;
              } else if (cur.ligatureComponent === prev.ligatureComponent) {
                good = true;
              }
            } else {
              if (cur.ligatureID && !cur.ligatureComponent || prev.ligatureID && !prev.ligatureComponent) {
                good = true;
              }
            }
            if (!good) {
              return false;
            }
            let mark2Index = this.coverageIndex(table.mark2Coverage, prev.id);
            if (mark2Index === -1) {
              return false;
            }
            let markRecord = table.mark1Array[mark1Index];
            let baseAnchor = table.mark2Array[mark2Index][markRecord.class];
            this.applyAnchor(markRecord, baseAnchor, prevIndex);
            return true;
          }
          case 7:
            return this.applyContext(table);
          case 8:
            return this.applyChainingContext(table);
          case 9:
            return this.applyLookup(table.lookupType, table.extension);
          default:
            throw new Error("Unsupported GPOS table: ".concat(lookupType));
        }
      }
      applyAnchor(markRecord, baseAnchor, baseGlyphIndex) {
        let baseCoords = this.getAnchor(baseAnchor);
        let markCoords = this.getAnchor(markRecord.markAnchor);
        let basePos = this.positions[baseGlyphIndex];
        let markPos = this.positions[this.glyphIterator.index];
        markPos.xOffset = baseCoords.x - markCoords.x;
        markPos.yOffset = baseCoords.y - markCoords.y;
        this.glyphIterator.cur.markAttachment = baseGlyphIndex;
      }
      getAnchor(anchor) {
        let x = anchor.xCoordinate;
        let y = anchor.yCoordinate;
        let variationProcessor = this.font._variationProcessor;
        let variationStore = this.font.GDEF && this.font.GDEF.itemVariationStore;
        if (variationProcessor && variationStore) {
          if (anchor.xDeviceTable) {
            x += variationProcessor.getDelta(variationStore, anchor.xDeviceTable.a, anchor.xDeviceTable.b);
          }
          if (anchor.yDeviceTable) {
            y += variationProcessor.getDelta(variationStore, anchor.yDeviceTable.a, anchor.yDeviceTable.b);
          }
        }
        return { x, y };
      }
      applyFeatures(userFeatures, glyphs, advances) {
        super.applyFeatures(userFeatures, glyphs, advances);
        for (var i = 0; i < this.glyphs.length; i++) {
          this.fixCursiveAttachment(i);
        }
        this.fixMarkAttachment();
      }
      fixCursiveAttachment(i) {
        let glyph = this.glyphs[i];
        if (glyph.cursiveAttachment != null) {
          let j = glyph.cursiveAttachment;
          glyph.cursiveAttachment = null;
          this.fixCursiveAttachment(j);
          this.positions[i].yOffset += this.positions[j].yOffset;
        }
      }
      fixMarkAttachment() {
        for (let i = 0; i < this.glyphs.length; i++) {
          let glyph = this.glyphs[i];
          if (glyph.markAttachment != null) {
            let j = glyph.markAttachment;
            this.positions[i].xOffset += this.positions[j].xOffset;
            this.positions[i].yOffset += this.positions[j].yOffset;
            if (this.direction === "ltr") {
              for (let k = j; k < i; k++) {
                this.positions[i].xOffset -= this.positions[k].xAdvance;
                this.positions[i].yOffset -= this.positions[k].yAdvance;
              }
            } else {
              for (let k = j + 1; k < i + 1; k++) {
                this.positions[i].xOffset += this.positions[k].xAdvance;
                this.positions[i].yOffset += this.positions[k].yAdvance;
              }
            }
          }
        }
      }
    };
  }
});

export {
  GPOSProcessor,
  init_GPOSProcessor
};
