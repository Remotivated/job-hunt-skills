import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  getEncoding,
  getEncodingMapping,
  init_encodings
} from "./chunk-3SYJ6GZQ.mjs";
import {
  binarySearch,
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

// node_modules/fontkit/src/CmapProcessor.js
var CmapProcessor;
var init_CmapProcessor = __esm({
  "node_modules/fontkit/src/CmapProcessor.js"() {
    init_utils();
    init_encodings();
    init_decorators();
    init_utils();
    CmapProcessor = class {
      constructor(cmapTable) {
        this.encoding = null;
        this.cmap = this.findSubtable(cmapTable, [
          // 32-bit subtables
          [3, 10],
          [0, 6],
          [0, 4],
          // 16-bit subtables
          [3, 1],
          [0, 3],
          [0, 2],
          [0, 1],
          [0, 0]
        ]);
        if (!this.cmap) {
          for (let cmap of cmapTable.tables) {
            let encoding = getEncoding(cmap.platformID, cmap.encodingID, cmap.table.language - 1);
            let mapping = getEncodingMapping(encoding);
            if (mapping) {
              this.cmap = cmap.table;
              this.encoding = mapping;
            }
          }
        }
        if (!this.cmap) {
          throw new Error("Could not find a supported cmap table");
        }
        this.uvs = this.findSubtable(cmapTable, [[0, 5]]);
        if (this.uvs && this.uvs.version !== 14) {
          this.uvs = null;
        }
      }
      findSubtable(cmapTable, pairs) {
        for (let [platformID, encodingID] of pairs) {
          for (let cmap of cmapTable.tables) {
            if (cmap.platformID === platformID && cmap.encodingID === encodingID) {
              return cmap.table;
            }
          }
        }
        return null;
      }
      lookup(codepoint, variationSelector) {
        if (this.encoding) {
          codepoint = this.encoding.get(codepoint) || codepoint;
        } else if (variationSelector) {
          let gid = this.getVariationSelector(codepoint, variationSelector);
          if (gid) {
            return gid;
          }
        }
        let cmap = this.cmap;
        switch (cmap.version) {
          case 0:
            return cmap.codeMap.get(codepoint) || 0;
          case 4: {
            let min = 0;
            let max = cmap.segCount - 1;
            while (min <= max) {
              let mid = min + max >> 1;
              if (codepoint < cmap.startCode.get(mid)) {
                max = mid - 1;
              } else if (codepoint > cmap.endCode.get(mid)) {
                min = mid + 1;
              } else {
                let rangeOffset = cmap.idRangeOffset.get(mid);
                let gid;
                if (rangeOffset === 0) {
                  gid = codepoint + cmap.idDelta.get(mid);
                } else {
                  let index = rangeOffset / 2 + (codepoint - cmap.startCode.get(mid)) - (cmap.segCount - mid);
                  gid = cmap.glyphIndexArray.get(index) || 0;
                  if (gid !== 0) {
                    gid += cmap.idDelta.get(mid);
                  }
                }
                return gid & 65535;
              }
            }
            return 0;
          }
          case 8:
            throw new Error("TODO: cmap format 8");
          case 6:
          case 10:
            return cmap.glyphIndices.get(codepoint - cmap.firstCode) || 0;
          case 12:
          case 13: {
            let min = 0;
            let max = cmap.nGroups - 1;
            while (min <= max) {
              let mid = min + max >> 1;
              let group = cmap.groups.get(mid);
              if (codepoint < group.startCharCode) {
                max = mid - 1;
              } else if (codepoint > group.endCharCode) {
                min = mid + 1;
              } else {
                if (cmap.version === 12) {
                  return group.glyphID + (codepoint - group.startCharCode);
                } else {
                  return group.glyphID;
                }
              }
            }
            return 0;
          }
          case 14:
            throw new Error("TODO: cmap format 14");
          default:
            throw new Error("Unknown cmap format ".concat(cmap.version));
        }
      }
      getVariationSelector(codepoint, variationSelector) {
        if (!this.uvs) {
          return 0;
        }
        let selectors = this.uvs.varSelectors.toArray();
        let i = binarySearch(selectors, (x) => variationSelector - x.varSelector);
        let sel = selectors[i];
        if (i !== -1 && sel.defaultUVS) {
          i = binarySearch(
            sel.defaultUVS,
            (x) => codepoint < x.startUnicodeValue ? -1 : codepoint > x.startUnicodeValue + x.additionalCount ? 1 : 0
          );
        }
        if (i !== -1 && sel.nonDefaultUVS) {
          i = binarySearch(sel.nonDefaultUVS, (x) => codepoint - x.unicodeValue);
          if (i !== -1) {
            return sel.nonDefaultUVS[i].glyphID;
          }
        }
        return 0;
      }
      getCharacterSet() {
        let cmap = this.cmap;
        switch (cmap.version) {
          case 0:
            return range(0, cmap.codeMap.length);
          case 4: {
            let res = [];
            let endCodes = cmap.endCode.toArray();
            for (let i = 0; i < endCodes.length; i++) {
              let tail = endCodes[i] + 1;
              let start = cmap.startCode.get(i);
              res.push(...range(start, tail));
            }
            return res;
          }
          case 8:
            throw new Error("TODO: cmap format 8");
          case 6:
          case 10:
            return range(cmap.firstCode, cmap.firstCode + cmap.glyphIndices.length);
          case 12:
          case 13: {
            let res = [];
            for (let group of cmap.groups.toArray()) {
              res.push(...range(group.startCharCode, group.endCharCode + 1));
            }
            return res;
          }
          case 14:
            throw new Error("TODO: cmap format 14");
          default:
            throw new Error("Unknown cmap format ".concat(cmap.version));
        }
      }
      codePointsForGlyph(gid) {
        let cmap = this.cmap;
        switch (cmap.version) {
          case 0: {
            let res = [];
            for (let i = 0; i < 256; i++) {
              if (cmap.codeMap.get(i) === gid) {
                res.push(i);
              }
            }
            return res;
          }
          case 4: {
            let res = [];
            for (let i = 0; i < cmap.segCount; i++) {
              let end = cmap.endCode.get(i);
              let start = cmap.startCode.get(i);
              let rangeOffset = cmap.idRangeOffset.get(i);
              let delta = cmap.idDelta.get(i);
              for (var c = start; c <= end; c++) {
                let g = 0;
                if (rangeOffset === 0) {
                  g = c + delta;
                } else {
                  let index = rangeOffset / 2 + (c - start) - (cmap.segCount - i);
                  g = cmap.glyphIndexArray.get(index) || 0;
                  if (g !== 0) {
                    g += delta;
                  }
                }
                if (g === gid) {
                  res.push(c);
                }
              }
            }
            return res;
          }
          case 12: {
            let res = [];
            for (let group of cmap.groups.toArray()) {
              if (gid >= group.glyphID && gid <= group.glyphID + (group.endCharCode - group.startCharCode)) {
                res.push(group.startCharCode + (gid - group.glyphID));
              }
            }
            return res;
          }
          case 13: {
            let res = [];
            for (let group of cmap.groups.toArray()) {
              if (gid === group.glyphID) {
                res.push(...range(group.startCharCode, group.endCharCode + 1));
              }
            }
            return res;
          }
          default:
            throw new Error("Unknown cmap format ".concat(cmap.version));
        }
      }
    };
    __decorateClass([
      cache
    ], CmapProcessor.prototype, "getCharacterSet", 1);
    __decorateClass([
      cache
    ], CmapProcessor.prototype, "codePointsForGlyph", 1);
  }
});

export {
  CmapProcessor,
  init_CmapProcessor
};
