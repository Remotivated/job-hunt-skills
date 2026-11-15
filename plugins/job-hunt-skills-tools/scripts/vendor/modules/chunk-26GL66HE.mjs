import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  init_utils,
  range
} from "./chunk-YOYKROTC.mjs";
import {
  cache,
  init_decorators
} from "./chunk-NCNX7SGZ.mjs";
import {
  __decorateClass,
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/aat/AATLookupTable.js
var AATLookupTable;
var init_AATLookupTable = __esm({
  "node_modules/fontkit/src/aat/AATLookupTable.js"() {
    init_decorators();
    init_utils();
    AATLookupTable = class {
      constructor(table) {
        this.table = table;
      }
      lookup(glyph) {
        switch (this.table.version) {
          case 0:
            return this.table.values.getItem(glyph);
          case 2:
          // segment format
          case 4: {
            let min = 0;
            let max = this.table.binarySearchHeader.nUnits - 1;
            while (min <= max) {
              var mid = min + max >> 1;
              var seg = this.table.segments[mid];
              if (seg.firstGlyph === 65535) {
                return null;
              }
              if (glyph < seg.firstGlyph) {
                max = mid - 1;
              } else if (glyph > seg.lastGlyph) {
                min = mid + 1;
              } else {
                if (this.table.version === 2) {
                  return seg.value;
                } else {
                  return seg.values[glyph - seg.firstGlyph];
                }
              }
            }
            return null;
          }
          case 6: {
            let min = 0;
            let max = this.table.binarySearchHeader.nUnits - 1;
            while (min <= max) {
              var mid = min + max >> 1;
              var seg = this.table.segments[mid];
              if (seg.glyph === 65535) {
                return null;
              }
              if (glyph < seg.glyph) {
                max = mid - 1;
              } else if (glyph > seg.glyph) {
                min = mid + 1;
              } else {
                return seg.value;
              }
            }
            return null;
          }
          case 8:
            return this.table.values[glyph - this.table.firstGlyph];
          default:
            throw new Error("Unknown lookup table format: ".concat(this.table.version));
        }
      }
      glyphsForValue(classValue) {
        let res = [];
        switch (this.table.version) {
          case 2:
          // segment format
          case 4: {
            for (let segment of this.table.segments) {
              if (this.table.version === 2 && segment.value === classValue) {
                res.push(...range(segment.firstGlyph, segment.lastGlyph + 1));
              } else {
                for (let index = 0; index < segment.values.length; index++) {
                  if (segment.values[index] === classValue) {
                    res.push(segment.firstGlyph + index);
                  }
                }
              }
            }
            break;
          }
          case 6: {
            for (let segment of this.table.segments) {
              if (segment.value === classValue) {
                res.push(segment.glyph);
              }
            }
            break;
          }
          case 8: {
            for (let i = 0; i < this.table.values.length; i++) {
              if (this.table.values[i] === classValue) {
                res.push(this.table.firstGlyph + i);
              }
            }
            break;
          }
          default:
            throw new Error("Unknown lookup table format: ".concat(this.table.version));
        }
        return res;
      }
    };
    __decorateClass([
      cache
    ], AATLookupTable.prototype, "glyphsForValue", 1);
  }
});

export {
  AATLookupTable,
  init_AATLookupTable
};
