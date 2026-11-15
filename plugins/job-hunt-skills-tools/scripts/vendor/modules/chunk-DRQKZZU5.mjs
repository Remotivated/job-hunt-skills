import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  require_variableType
} from "./chunk-WLP4UAZF.mjs";
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/columnCalculator.js
var require_columnCalculator = __commonJS({
  "node_modules/pdfmake/js/columnCalculator.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var _variableType = require_variableType();
    function buildColumnWidths(columns, availableWidth, offsetTotal = 0, tableNode) {
      let autoColumns = [];
      let autoMin = 0;
      let autoMax = 0;
      let starColumns = [];
      let starMaxMin = 0;
      let starMaxMax = 0;
      let fixedColumns = [];
      let initial_availableWidth = availableWidth;
      columns.forEach((column) => {
        if (isAutoColumn(column)) {
          autoColumns.push(column);
          autoMin += column._minWidth;
          autoMax += column._maxWidth;
        } else if (isStarColumn(column)) {
          starColumns.push(column);
          starMaxMin = Math.max(starMaxMin, column._minWidth);
          starMaxMax = Math.max(starMaxMax, column._maxWidth);
        } else {
          fixedColumns.push(column);
        }
      });
      fixedColumns.forEach((col, colIndex) => {
        if ((0, _variableType.isString)(col.width) && /\d+%/.test(col.width)) {
          let reservedWidth = 0;
          if (tableNode) {
            const paddingLeft = tableNode._layout.paddingLeft(colIndex, tableNode);
            const paddingRight = tableNode._layout.paddingRight(colIndex, tableNode);
            const borderLeft = tableNode._layout.vLineWidth(colIndex, tableNode);
            const borderRight = tableNode._layout.vLineWidth(colIndex + 1, tableNode);
            if (colIndex === 0) {
              reservedWidth = paddingLeft + paddingRight + borderLeft + borderRight / 2;
            } else if (colIndex === fixedColumns.length - 1) {
              reservedWidth = paddingLeft + paddingRight + borderLeft / 2 + borderRight;
            } else {
              reservedWidth = paddingLeft + paddingRight + borderLeft / 2 + borderRight / 2;
            }
          }
          const totalAvailableWidth = initial_availableWidth + offsetTotal;
          col.width = parseFloat(col.width) * totalAvailableWidth / 100 - reservedWidth;
        }
        if (col.width < col._minWidth && col.elasticWidth) {
          col._calcWidth = col._minWidth;
        } else {
          col._calcWidth = col.width;
        }
        availableWidth -= col._calcWidth;
      });
      let minW = autoMin + starMaxMin * starColumns.length;
      let maxW = autoMax + starMaxMax * starColumns.length;
      if (minW >= availableWidth) {
        autoColumns.forEach((col) => {
          col._calcWidth = col._minWidth;
        });
        starColumns.forEach((col) => {
          col._calcWidth = starMaxMin;
        });
      } else {
        if (maxW < availableWidth) {
          autoColumns.forEach((col) => {
            col._calcWidth = col._maxWidth;
            availableWidth -= col._calcWidth;
          });
        } else {
          let W = availableWidth - minW;
          let D = maxW - minW;
          autoColumns.forEach((col) => {
            let d = col._maxWidth - col._minWidth;
            col._calcWidth = col._minWidth + d * W / D;
            availableWidth -= col._calcWidth;
          });
        }
        if (starColumns.length > 0) {
          let starSize = availableWidth / starColumns.length;
          starColumns.forEach((col) => {
            col._calcWidth = starSize;
          });
        }
      }
    }
    function isAutoColumn(column) {
      return column.width === "auto";
    }
    function isStarColumn(column) {
      return column.width === null || column.width === void 0 || column.width === "*" || column.width === "star";
    }
    function measureMinMax(columns) {
      let result = {
        min: 0,
        max: 0
      };
      let maxStar = {
        min: 0,
        max: 0
      };
      let starCount = 0;
      for (let i = 0, l = columns.length; i < l; i++) {
        let c = columns[i];
        if (isStarColumn(c)) {
          maxStar.min = Math.max(maxStar.min, c._minWidth);
          maxStar.max = Math.max(maxStar.max, c._maxWidth);
          starCount++;
        } else if (isAutoColumn(c)) {
          result.min += c._minWidth;
          result.max += c._maxWidth;
        } else {
          result.min += c.width !== void 0 && c.width || c._minWidth;
          result.max += c.width !== void 0 && c.width || c._maxWidth;
        }
      }
      if (starCount) {
        result.min += starCount * maxStar.min;
        result.max += starCount * maxStar.max;
      }
      return result;
    }
    var _default = exports.default = {
      buildColumnWidths,
      measureMinMax,
      isAutoColumn,
      isStarColumn
    };
  }
});

export {
  require_columnCalculator
};
