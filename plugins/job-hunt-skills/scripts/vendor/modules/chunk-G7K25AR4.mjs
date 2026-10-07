import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/dfa/index.js
var require_dfa = __commonJS({
  "node_modules/dfa/index.js"(exports, module) {
    var INITIAL_STATE = 1;
    var FAIL_STATE = 0;
    var StateMachine = class {
      constructor(dfa) {
        this.stateTable = dfa.stateTable;
        this.accepting = dfa.accepting;
        this.tags = dfa.tags;
      }
      /**
       * Returns an iterable object that yields pattern matches over the input sequence.
       * Matches are of the form [startIndex, endIndex, tags].
       */
      match(str) {
        var self = this;
        return {
          *[Symbol.iterator]() {
            var state = INITIAL_STATE;
            var startRun = null;
            var lastAccepting = null;
            var lastState = null;
            for (var p = 0; p < str.length; p++) {
              var c = str[p];
              lastState = state;
              state = self.stateTable[state][c];
              if (state === FAIL_STATE) {
                if (startRun != null && lastAccepting != null && lastAccepting >= startRun) {
                  yield [startRun, lastAccepting, self.tags[lastState]];
                }
                state = self.stateTable[INITIAL_STATE][c];
                startRun = null;
              }
              if (state !== FAIL_STATE && startRun == null) {
                startRun = p;
              }
              if (self.accepting[state]) {
                lastAccepting = p;
              }
              if (state === FAIL_STATE) {
                state = INITIAL_STATE;
              }
            }
            if (startRun != null && lastAccepting != null && lastAccepting >= startRun) {
              yield [startRun, lastAccepting, self.tags[state]];
            }
          }
        };
      }
      /**
       * For each match over the input sequence, action functions matching
       * the tag definitions in the input pattern are called with the startIndex,
       * endIndex, and sub-match sequence.
       */
      apply(str, actions) {
        for (var [start, end, tags] of this.match(str)) {
          for (var tag of tags) {
            if (typeof actions[tag] === "function") {
              actions[tag](start, end, str.slice(start, end + 1));
            }
          }
        }
      }
    };
    module.exports = StateMachine;
  }
});

export {
  require_dfa
};
