import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  AATLookupTable,
  init_AATLookupTable
} from "./chunk-26GL66HE.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/aat/AATStateMachine.js
var START_OF_TEXT_STATE, END_OF_TEXT_CLASS, OUT_OF_BOUNDS_CLASS, DELETED_GLYPH_CLASS, DONT_ADVANCE, AATStateMachine;
var init_AATStateMachine = __esm({
  "node_modules/fontkit/src/aat/AATStateMachine.js"() {
    init_AATLookupTable();
    START_OF_TEXT_STATE = 0;
    END_OF_TEXT_CLASS = 0;
    OUT_OF_BOUNDS_CLASS = 1;
    DELETED_GLYPH_CLASS = 2;
    DONT_ADVANCE = 16384;
    AATStateMachine = class {
      constructor(stateTable) {
        this.stateTable = stateTable;
        this.lookupTable = new AATLookupTable(stateTable.classTable);
      }
      process(glyphs, reverse, processEntry) {
        let currentState = START_OF_TEXT_STATE;
        let index = reverse ? glyphs.length - 1 : 0;
        let dir = reverse ? -1 : 1;
        while (dir === 1 && index <= glyphs.length || dir === -1 && index >= -1) {
          let glyph = null;
          let classCode = OUT_OF_BOUNDS_CLASS;
          let shouldAdvance = true;
          if (index === glyphs.length || index === -1) {
            classCode = END_OF_TEXT_CLASS;
          } else {
            glyph = glyphs[index];
            if (glyph.id === 65535) {
              classCode = DELETED_GLYPH_CLASS;
            } else {
              classCode = this.lookupTable.lookup(glyph.id);
              if (classCode == null) {
                classCode = OUT_OF_BOUNDS_CLASS;
              }
            }
          }
          let row = this.stateTable.stateArray.getItem(currentState);
          let entryIndex = row[classCode];
          let entry = this.stateTable.entryTable.getItem(entryIndex);
          if (classCode !== END_OF_TEXT_CLASS && classCode !== DELETED_GLYPH_CLASS) {
            processEntry(glyph, entry, index);
            shouldAdvance = !(entry.flags & DONT_ADVANCE);
          }
          currentState = entry.newState;
          if (shouldAdvance) {
            index += dir;
          }
        }
        return glyphs;
      }
      /**
       * Performs a depth-first traversal of the glyph strings
       * represented by the state machine.
       */
      traverse(opts, state = 0, visited = /* @__PURE__ */ new Set()) {
        if (visited.has(state)) {
          return;
        }
        visited.add(state);
        let { nClasses, stateArray, entryTable } = this.stateTable;
        let row = stateArray.getItem(state);
        for (let classCode = 4; classCode < nClasses; classCode++) {
          let entryIndex = row[classCode];
          let entry = entryTable.getItem(entryIndex);
          for (let glyph of this.lookupTable.glyphsForValue(classCode)) {
            if (opts.enter) {
              opts.enter(glyph, entry);
            }
            if (entry.newState !== 0) {
              this.traverse(opts, entry.newState, visited);
            }
            if (opts.exit) {
              opts.exit(glyph, entry);
            }
          }
        }
      }
    };
  }
});

export {
  AATStateMachine,
  init_AATStateMachine
};
