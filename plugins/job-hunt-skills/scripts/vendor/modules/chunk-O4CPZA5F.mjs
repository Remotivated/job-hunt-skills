import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  AATStateMachine,
  init_AATStateMachine
} from "./chunk-NNOYNLW4.mjs";
import {
  AATLookupTable,
  init_AATLookupTable
} from "./chunk-26GL66HE.mjs";
import {
  cache,
  init_decorators
} from "./chunk-NCNX7SGZ.mjs";
import {
  __decorateClass,
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/aat/AATMorxProcessor.js
function swap(glyphs, rangeA, rangeB, reverseA = false, reverseB = false) {
  let end = glyphs.splice(rangeB[0] - (rangeB[1] - 1), rangeB[1]);
  if (reverseB) {
    end.reverse();
  }
  let start = glyphs.splice(rangeA[0], rangeA[1], ...end);
  if (reverseA) {
    start.reverse();
  }
  glyphs.splice(rangeB[0] - (rangeA[1] - 1), 0, ...start);
  return glyphs;
}
function reorderGlyphs(glyphs, verb, firstGlyph, lastGlyph) {
  let length = lastGlyph - firstGlyph + 1;
  switch (verb) {
    case 0:
      return glyphs;
    case 1:
      return swap(glyphs, [firstGlyph, 1], [lastGlyph, 0]);
    case 2:
      return swap(glyphs, [firstGlyph, 0], [lastGlyph, 1]);
    case 3:
      return swap(glyphs, [firstGlyph, 1], [lastGlyph, 1]);
    case 4:
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 0]);
    case 5:
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 0], true, false);
    case 6:
      return swap(glyphs, [firstGlyph, 0], [lastGlyph, 2]);
    case 7:
      return swap(glyphs, [firstGlyph, 0], [lastGlyph, 2], false, true);
    case 8:
      return swap(glyphs, [firstGlyph, 1], [lastGlyph, 2]);
    case 9:
      return swap(glyphs, [firstGlyph, 1], [lastGlyph, 2], false, true);
    case 10:
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 1]);
    case 11:
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 1], true, false);
    case 12:
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 2]);
    case 13:
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 2], true, false);
    case 14:
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 2], false, true);
    case 15:
      return swap(glyphs, [firstGlyph, 2], [lastGlyph, 2], true, true);
    default:
      throw new Error("Unknown verb: ".concat(verb));
  }
}
var MARK_FIRST, MARK_LAST, VERB, SET_MARK, SET_COMPONENT, PERFORM_ACTION, LAST_MASK, STORE_MASK, OFFSET_MASK, REVERSE_DIRECTION, CURRENT_INSERT_BEFORE, MARKED_INSERT_BEFORE, CURRENT_INSERT_COUNT, MARKED_INSERT_COUNT, AATMorxProcessor;
var init_AATMorxProcessor = __esm({
  "node_modules/fontkit/src/aat/AATMorxProcessor.js"() {
    init_AATStateMachine();
    init_AATLookupTable();
    init_decorators();
    MARK_FIRST = 32768;
    MARK_LAST = 8192;
    VERB = 15;
    SET_MARK = 32768;
    SET_COMPONENT = 32768;
    PERFORM_ACTION = 8192;
    LAST_MASK = 2147483648;
    STORE_MASK = 1073741824;
    OFFSET_MASK = 1073741823;
    REVERSE_DIRECTION = 4194304;
    CURRENT_INSERT_BEFORE = 2048;
    MARKED_INSERT_BEFORE = 1024;
    CURRENT_INSERT_COUNT = 992;
    MARKED_INSERT_COUNT = 31;
    AATMorxProcessor = class {
      constructor(font) {
        this.processIndicRearragement = this.processIndicRearragement.bind(this);
        this.processContextualSubstitution = this.processContextualSubstitution.bind(this);
        this.processLigature = this.processLigature.bind(this);
        this.processNoncontextualSubstitutions = this.processNoncontextualSubstitutions.bind(this);
        this.processGlyphInsertion = this.processGlyphInsertion.bind(this);
        this.font = font;
        this.morx = font.morx;
        this.inputCache = null;
      }
      // Processes an array of glyphs and applies the specified features
      // Features should be in the form of {featureType:{featureSetting:boolean}}
      process(glyphs, features = {}) {
        for (let chain of this.morx.chains) {
          let flags = chain.defaultFlags;
          for (let feature of chain.features) {
            let f;
            if (f = features[feature.featureType]) {
              if (f[feature.featureSetting]) {
                flags &= feature.disableFlags;
                flags |= feature.enableFlags;
              } else if (f[feature.featureSetting] === false) {
                flags |= ~feature.disableFlags;
                flags &= ~feature.enableFlags;
              }
            }
          }
          for (let subtable of chain.subtables) {
            if (subtable.subFeatureFlags & flags) {
              this.processSubtable(subtable, glyphs);
            }
          }
        }
        let index = glyphs.length - 1;
        while (index >= 0) {
          if (glyphs[index].id === 65535) {
            glyphs.splice(index, 1);
          }
          index--;
        }
        return glyphs;
      }
      processSubtable(subtable, glyphs) {
        this.subtable = subtable;
        this.glyphs = glyphs;
        if (this.subtable.type === 4) {
          this.processNoncontextualSubstitutions(this.subtable, this.glyphs);
          return;
        }
        this.ligatureStack = [];
        this.markedGlyph = null;
        this.firstGlyph = null;
        this.lastGlyph = null;
        this.markedIndex = null;
        let stateMachine = this.getStateMachine(subtable);
        let process = this.getProcessor();
        let reverse = !!(this.subtable.coverage & REVERSE_DIRECTION);
        return stateMachine.process(this.glyphs, reverse, process);
      }
      getStateMachine(subtable) {
        return new AATStateMachine(subtable.table.stateTable);
      }
      getProcessor() {
        switch (this.subtable.type) {
          case 0:
            return this.processIndicRearragement;
          case 1:
            return this.processContextualSubstitution;
          case 2:
            return this.processLigature;
          case 4:
            return this.processNoncontextualSubstitutions;
          case 5:
            return this.processGlyphInsertion;
          default:
            throw new Error("Invalid morx subtable type: ".concat(this.subtable.type));
        }
      }
      processIndicRearragement(glyph, entry, index) {
        if (entry.flags & MARK_FIRST) {
          this.firstGlyph = index;
        }
        if (entry.flags & MARK_LAST) {
          this.lastGlyph = index;
        }
        reorderGlyphs(this.glyphs, entry.flags & VERB, this.firstGlyph, this.lastGlyph);
      }
      processContextualSubstitution(glyph, entry, index) {
        let subsitutions = this.subtable.table.substitutionTable.items;
        if (entry.markIndex !== 65535) {
          let lookup = subsitutions.getItem(entry.markIndex);
          let lookupTable = new AATLookupTable(lookup);
          glyph = this.glyphs[this.markedGlyph];
          var gid = lookupTable.lookup(glyph.id);
          if (gid) {
            this.glyphs[this.markedGlyph] = this.font.getGlyph(gid, glyph.codePoints);
          }
        }
        if (entry.currentIndex !== 65535) {
          let lookup = subsitutions.getItem(entry.currentIndex);
          let lookupTable = new AATLookupTable(lookup);
          glyph = this.glyphs[index];
          var gid = lookupTable.lookup(glyph.id);
          if (gid) {
            this.glyphs[index] = this.font.getGlyph(gid, glyph.codePoints);
          }
        }
        if (entry.flags & SET_MARK) {
          this.markedGlyph = index;
        }
      }
      processLigature(glyph, entry, index) {
        if (entry.flags & SET_COMPONENT) {
          this.ligatureStack.push(index);
        }
        if (entry.flags & PERFORM_ACTION) {
          let actions = this.subtable.table.ligatureActions;
          let components = this.subtable.table.components;
          let ligatureList = this.subtable.table.ligatureList;
          let actionIndex = entry.action;
          let last = false;
          let ligatureIndex = 0;
          let codePoints = [];
          let ligatureGlyphs = [];
          while (!last) {
            let componentGlyph = this.ligatureStack.pop();
            codePoints.unshift(...this.glyphs[componentGlyph].codePoints);
            let action = actions.getItem(actionIndex++);
            last = !!(action & LAST_MASK);
            let store = !!(action & STORE_MASK);
            let offset = (action & OFFSET_MASK) << 2 >> 2;
            offset += this.glyphs[componentGlyph].id;
            let component = components.getItem(offset);
            ligatureIndex += component;
            if (last || store) {
              let ligatureEntry = ligatureList.getItem(ligatureIndex);
              this.glyphs[componentGlyph] = this.font.getGlyph(ligatureEntry, codePoints);
              ligatureGlyphs.push(componentGlyph);
              ligatureIndex = 0;
              codePoints = [];
            } else {
              this.glyphs[componentGlyph] = this.font.getGlyph(65535);
            }
          }
          this.ligatureStack.push(...ligatureGlyphs);
        }
      }
      processNoncontextualSubstitutions(subtable, glyphs, index) {
        let lookupTable = new AATLookupTable(subtable.table.lookupTable);
        for (index = 0; index < glyphs.length; index++) {
          let glyph = glyphs[index];
          if (glyph.id !== 65535) {
            let gid = lookupTable.lookup(glyph.id);
            if (gid) {
              glyphs[index] = this.font.getGlyph(gid, glyph.codePoints);
            }
          }
        }
      }
      _insertGlyphs(glyphIndex, insertionActionIndex, count, isBefore) {
        let insertions = [];
        while (count--) {
          let gid = this.subtable.table.insertionActions.getItem(insertionActionIndex++);
          insertions.push(this.font.getGlyph(gid));
        }
        if (!isBefore) {
          glyphIndex++;
        }
        this.glyphs.splice(glyphIndex, 0, ...insertions);
      }
      processGlyphInsertion(glyph, entry, index) {
        if (entry.flags & SET_MARK) {
          this.markedIndex = index;
        }
        if (entry.markedInsertIndex !== 65535) {
          let count = (entry.flags & MARKED_INSERT_COUNT) >>> 5;
          let isBefore = !!(entry.flags & MARKED_INSERT_BEFORE);
          this._insertGlyphs(this.markedIndex, entry.markedInsertIndex, count, isBefore);
        }
        if (entry.currentInsertIndex !== 65535) {
          let count = (entry.flags & CURRENT_INSERT_COUNT) >>> 5;
          let isBefore = !!(entry.flags & CURRENT_INSERT_BEFORE);
          this._insertGlyphs(index, entry.currentInsertIndex, count, isBefore);
        }
      }
      getSupportedFeatures() {
        let features = [];
        for (let chain of this.morx.chains) {
          for (let feature of chain.features) {
            features.push([feature.featureType, feature.featureSetting]);
          }
        }
        return features;
      }
      generateInputs(gid) {
        if (!this.inputCache) {
          this.generateInputCache();
        }
        return this.inputCache[gid] || [];
      }
      generateInputCache() {
        this.inputCache = {};
        for (let chain of this.morx.chains) {
          let flags = chain.defaultFlags;
          for (let subtable of chain.subtables) {
            if (subtable.subFeatureFlags & flags) {
              this.generateInputsForSubtable(subtable);
            }
          }
        }
      }
      generateInputsForSubtable(subtable) {
        if (subtable.type !== 2) {
          return;
        }
        let reverse = !!(subtable.coverage & REVERSE_DIRECTION);
        if (reverse) {
          throw new Error("Reverse subtable, not supported.");
        }
        this.subtable = subtable;
        this.ligatureStack = [];
        let stateMachine = this.getStateMachine(subtable);
        let process = this.getProcessor();
        let input = [];
        let stack = [];
        this.glyphs = [];
        stateMachine.traverse({
          enter: (glyph, entry) => {
            let glyphs = this.glyphs;
            stack.push({
              glyphs: glyphs.slice(),
              ligatureStack: this.ligatureStack.slice()
            });
            let g = this.font.getGlyph(glyph);
            input.push(g);
            glyphs.push(input[input.length - 1]);
            process(glyphs[glyphs.length - 1], entry, glyphs.length - 1);
            let count = 0;
            let found = 0;
            for (let i = 0; i < glyphs.length && count <= 1; i++) {
              if (glyphs[i].id !== 65535) {
                count++;
                found = glyphs[i].id;
              }
            }
            if (count === 1) {
              let result = input.map((g2) => g2.id);
              let cache2 = this.inputCache[found];
              if (cache2) {
                cache2.push(result);
              } else {
                this.inputCache[found] = [result];
              }
            }
          },
          exit: () => {
            ({ glyphs: this.glyphs, ligatureStack: this.ligatureStack } = stack.pop());
            input.pop();
          }
        });
      }
    };
    __decorateClass([
      cache
    ], AATMorxProcessor.prototype, "getStateMachine", 1);
  }
});

export {
  AATMorxProcessor,
  init_AATMorxProcessor
};
