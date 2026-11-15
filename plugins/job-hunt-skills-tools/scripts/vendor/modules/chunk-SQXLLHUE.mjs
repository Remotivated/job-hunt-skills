import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  require_columnCalculator
} from "./chunk-DRQKZZU5.mjs";
import {
  require_variableType
} from "./chunk-WLP4UAZF.mjs";
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/TableProcessor.js
var require_TableProcessor = __commonJS({
  "node_modules/pdfmake/js/TableProcessor.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var _columnCalculator = _interopRequireDefault(require_columnCalculator());
    var _variableType = require_variableType();
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var PAGE_BREAK_VALUES = /* @__PURE__ */ new Set(["before", "beforeOdd", "beforeEven", "after", "afterOdd", "afterEven"]);
    var hasExplicitPageBreak = (cell) => {
      if (!cell || typeof cell !== "object") {
        return false;
      }
      return PAGE_BREAK_VALUES.has(cell.pageBreak);
    };
    var TableProcessor = class {
      constructor(tableNode) {
        this.tableNode = tableNode;
        this._isCurrentRowUnbreakable = false;
      }
      beginTable(writer) {
        const getTableInnerContentWidth = () => {
          let width = 0;
          tableNode.table.widths.forEach((w) => {
            width += w._calcWidth;
          });
          return width;
        };
        const prepareRowSpanData = () => {
          let rsd = [];
          let x = 0;
          let lastWidth;
          rsd.push({
            left: 0,
            rowSpan: 0
          });
          for (let i = 0, l = this.tableNode.table.body[0].length; i < l; i++) {
            let paddings = this.layout.paddingLeft(i, this.tableNode) + this.layout.paddingRight(i, this.tableNode);
            let lBorder = this.layout.vLineWidth(i, this.tableNode);
            lastWidth = paddings + lBorder + this.tableNode.table.widths[i]._calcWidth;
            rsd[rsd.length - 1].width = lastWidth;
            x += lastWidth;
            rsd.push({
              left: x,
              rowSpan: 0,
              width: 0
            });
          }
          return rsd;
        };
        const prepareCellBorders = (body) => {
          for (let rowIndex = 0; rowIndex < body.length; rowIndex++) {
            let row = body[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
              let cell = row[colIndex];
              if (cell.border) {
                let rowSpan = cell.rowSpan || 1;
                let colSpan = cell.colSpan || 1;
                for (let rowOffset = 0; rowOffset < rowSpan; rowOffset++) {
                  if (cell.border[0] !== void 0 && rowOffset > 0) {
                    setBorder(rowIndex + rowOffset, colIndex, 0, cell.border[0]);
                  }
                  if (cell.border[2] !== void 0) {
                    setBorder(rowIndex + rowOffset, colIndex + colSpan - 1, 2, cell.border[2]);
                  }
                }
                for (let colOffset = 0; colOffset < colSpan; colOffset++) {
                  if (cell.border[1] !== void 0 && colOffset > 0) {
                    setBorder(rowIndex, colIndex + colOffset, 1, cell.border[1]);
                  }
                  if (cell.border[3] !== void 0) {
                    setBorder(rowIndex + rowSpan - 1, colIndex + colOffset, 3, cell.border[3]);
                  }
                }
              }
            }
          }
          function setBorder(rowIndex, colIndex, borderIndex, borderValue) {
            let cell = body[rowIndex][colIndex];
            cell.border = cell.border || {};
            cell.border[borderIndex] = borderValue;
          }
        };
        let tableNode;
        let availableWidth;
        tableNode = this.tableNode;
        this.offsets = tableNode._offsets;
        this.layout = tableNode._layout;
        availableWidth = writer.context().availableWidth - this.offsets.total;
        _columnCalculator.default.buildColumnWidths(tableNode.table.widths, availableWidth, this.offsets.total, tableNode);
        this.tableWidth = tableNode._offsets.total + getTableInnerContentWidth();
        this.rowSpanData = prepareRowSpanData();
        this.cleanUpRepeatables = false;
        this.headerRows = 0;
        this.rowsWithoutPageBreak = 0;
        const headerRows = tableNode.table.headerRows;
        if ((0, _variableType.isPositiveInteger)(headerRows)) {
          this.headerRows = headerRows;
          if (this.headerRows > tableNode.table.body.length) {
            throw new Error("Too few rows in the table. Property headerRows requires at least ".concat(this.headerRows, ", contains only ").concat(tableNode.table.body.length));
          }
          this.rowsWithoutPageBreak = this.headerRows;
          const keepWithHeaderRows = tableNode.table.keepWithHeaderRows;
          if ((0, _variableType.isPositiveInteger)(keepWithHeaderRows)) {
            this.rowsWithoutPageBreak += keepWithHeaderRows;
          }
        }
        this.dontBreakRows = tableNode.table.dontBreakRows || false;
        if (this.rowsWithoutPageBreak || this.dontBreakRows) {
          writer.beginUnbreakableBlock();
          this.drawHorizontalLine(0, writer);
          if (this.rowsWithoutPageBreak && this.dontBreakRows) {
            writer.beginUnbreakableBlock();
          }
        }
        prepareCellBorders(this.tableNode.table.body);
      }
      onRowBreak(rowIndex, writer) {
        return () => {
          let offset = this.rowPaddingTop + (!this.headerRows ? this.topLineWidth : 0);
          writer.context().availableHeight -= this.reservedAtBottom;
          writer.context().moveDown(offset);
        };
      }
      beginRow(rowIndex, writer) {
        this.topLineWidth = this.layout.hLineWidth(rowIndex, this.tableNode);
        this.rowPaddingTop = this.layout.paddingTop(rowIndex, this.tableNode);
        this.bottomLineWidth = this.layout.hLineWidth(rowIndex + 1, this.tableNode);
        this.rowPaddingBottom = this.layout.paddingBottom(rowIndex, this.tableNode);
        this.rowCallback = this.onRowBreak(rowIndex, writer);
        writer.addListener("pageChanged", this.rowCallback);
        if (rowIndex == 0 && !this.dontBreakRows && !this.rowsWithoutPageBreak) {
          this._tableTopBorderY = writer.context().y;
          writer.context().moveDown(this.topLineWidth);
        }
        this.rowTopPageY = writer.context().y + this.rowPaddingTop;
        const rowCells = this.tableNode.table.body[rowIndex] || [];
        const rowHasPageBreak = rowCells.some(hasExplicitPageBreak);
        this._isCurrentRowUnbreakable = this.dontBreakRows && rowIndex > 0 && !rowHasPageBreak;
        if (this._isCurrentRowUnbreakable) {
          writer.beginUnbreakableBlock();
        }
        this.rowTopY = writer.context().y;
        this.reservedAtBottom = this.bottomLineWidth + this.rowPaddingBottom;
        writer.context().availableHeight -= this.reservedAtBottom;
        writer.context().moveDown(this.rowPaddingTop);
      }
      drawHorizontalLine(lineIndex, writer, overrideY, moveDown = true, forcePage) {
        let lineWidth = this.layout.hLineWidth(lineIndex, this.tableNode);
        if (lineWidth) {
          let style = this.layout.hLineStyle(lineIndex, this.tableNode);
          let dash;
          if (style && style.dash) {
            dash = style.dash;
          }
          let offset = lineWidth / 2;
          let currentLine = null;
          let body = this.tableNode.table.body;
          let cellAbove;
          let currentCell;
          let rowCellAbove;
          for (let i = 0, l = this.rowSpanData.length; i < l; i++) {
            let data = this.rowSpanData[i];
            let shouldDrawLine = !data.rowSpan;
            let borderColor = null;
            if (shouldDrawLine && i < l - 1) {
              var topBorder = false, bottomBorder = false, rowBottomBorder = false;
              if (lineIndex > 0) {
                cellAbove = body[lineIndex - 1][i];
                bottomBorder = cellAbove.border ? cellAbove.border[3] : this.layout.defaultBorder;
                if (bottomBorder && cellAbove.borderColor) {
                  borderColor = cellAbove.borderColor[3];
                }
              }
              if (lineIndex < body.length) {
                currentCell = body[lineIndex][i];
                topBorder = currentCell.border ? currentCell.border[1] : this.layout.defaultBorder;
                if (topBorder && borderColor == null && currentCell.borderColor) {
                  borderColor = currentCell.borderColor[1];
                }
              }
              shouldDrawLine = topBorder || bottomBorder;
            }
            if (cellAbove && cellAbove._rowSpanCurrentOffset) {
              rowCellAbove = body[lineIndex - 1 - cellAbove._rowSpanCurrentOffset][i];
              rowBottomBorder = rowCellAbove && rowCellAbove.border ? rowCellAbove.border[3] : this.layout.defaultBorder;
              if (rowBottomBorder && rowCellAbove && rowCellAbove.borderColor) {
                borderColor = rowCellAbove.borderColor[3];
              }
            }
            if (borderColor == null) {
              borderColor = typeof this.layout.hLineColor === "function" ? this.layout.hLineColor(lineIndex, this.tableNode, i) : this.layout.hLineColor;
            }
            if (!currentLine && shouldDrawLine) {
              currentLine = {
                left: data.left,
                width: 0
              };
            }
            if (shouldDrawLine) {
              let colSpanIndex = 0;
              if (rowCellAbove && rowCellAbove.colSpan && rowBottomBorder) {
                while (rowCellAbove.colSpan > colSpanIndex) {
                  currentLine.width += this.rowSpanData[i + colSpanIndex++].width || 0;
                }
                i += colSpanIndex - 1;
              } else if (cellAbove && cellAbove.colSpan && bottomBorder) {
                while (cellAbove.colSpan > colSpanIndex) {
                  currentLine.width += this.rowSpanData[i + colSpanIndex++].width || 0;
                }
                i += colSpanIndex - 1;
              } else if (currentCell && currentCell.colSpan && topBorder) {
                while (currentCell.colSpan > colSpanIndex) {
                  currentLine.width += this.rowSpanData[i + colSpanIndex++].width || 0;
                }
                i += colSpanIndex - 1;
              } else {
                currentLine.width += this.rowSpanData[i].width || 0;
              }
            }
            let y = (overrideY || 0) + offset;
            if (shouldDrawLine) {
              if (currentLine && currentLine.width) {
                writer.addVector({
                  type: "line",
                  x1: currentLine.left,
                  x2: currentLine.left + currentLine.width,
                  y1: y,
                  y2: y,
                  lineWidth,
                  dash,
                  lineColor: borderColor
                }, false, (0, _variableType.isNumber)(overrideY), null, forcePage);
                currentLine = null;
                cellAbove = null;
                currentCell = null;
                rowCellAbove = null;
              }
            }
          }
          if (moveDown) {
            writer.context().moveDown(lineWidth);
          }
        }
      }
      drawVerticalLine(x, y0, y1, vLineColIndex, writer, vLineRowIndex, beforeVLineColIndex) {
        let width = this.layout.vLineWidth(vLineColIndex, this.tableNode);
        if (width === 0) {
          return;
        }
        let style = this.layout.vLineStyle(vLineColIndex, this.tableNode);
        let dash;
        if (style && style.dash) {
          dash = style.dash;
        }
        let body = this.tableNode.table.body;
        let cellBefore;
        let currentCell;
        let borderColor;
        if (vLineColIndex > 0) {
          cellBefore = body[vLineRowIndex][beforeVLineColIndex];
          if (cellBefore && cellBefore.borderColor) {
            if (cellBefore.border ? cellBefore.border[2] : this.layout.defaultBorder) {
              borderColor = cellBefore.borderColor[2];
            }
          }
        }
        if (borderColor == null && vLineColIndex < body.length) {
          currentCell = body[vLineRowIndex][vLineColIndex];
          if (currentCell && currentCell.borderColor) {
            if (currentCell.border ? currentCell.border[0] : this.layout.defaultBorder) {
              borderColor = currentCell.borderColor[0];
            }
          }
        }
        if (borderColor == null && cellBefore && cellBefore._rowSpanCurrentOffset) {
          let rowCellBeforeAbove = body[vLineRowIndex - cellBefore._rowSpanCurrentOffset][beforeVLineColIndex];
          if (rowCellBeforeAbove.borderColor) {
            if (rowCellBeforeAbove.border ? rowCellBeforeAbove.border[2] : this.layout.defaultBorder) {
              borderColor = rowCellBeforeAbove.borderColor[2];
            }
          }
        }
        if (borderColor == null && currentCell && currentCell._rowSpanCurrentOffset) {
          let rowCurrentCellAbove = body[vLineRowIndex - currentCell._rowSpanCurrentOffset][vLineColIndex];
          if (rowCurrentCellAbove.borderColor) {
            if (rowCurrentCellAbove.border ? rowCurrentCellAbove.border[2] : this.layout.defaultBorder) {
              borderColor = rowCurrentCellAbove.borderColor[2];
            }
          }
        }
        if (borderColor == null) {
          borderColor = typeof this.layout.vLineColor === "function" ? this.layout.vLineColor(vLineColIndex, this.tableNode, vLineRowIndex) : this.layout.vLineColor;
        }
        writer.addVector({
          type: "line",
          x1: x + width / 2,
          x2: x + width / 2,
          y1: y0,
          y2: y1,
          lineWidth: width,
          dash,
          lineColor: borderColor
        }, false, true);
      }
      endTable(writer) {
        if (this.cleanUpRepeatables) {
          writer.popFromRepeatables();
        }
      }
      endRow(rowIndex, writer, pageBreaks) {
        const getLineXs = () => {
          let result = [];
          let cols = 0;
          for (let i = 0, l = this.tableNode.table.body[rowIndex].length; i < l; i++) {
            if (!cols) {
              result.push({
                x: this.rowSpanData[i].left,
                index: i
              });
              let item = this.tableNode.table.body[rowIndex][i];
              cols = item._colSpan || item.colSpan || 0;
            }
            if (cols > 0) {
              cols--;
            }
          }
          result.push({
            x: this.rowSpanData[this.rowSpanData.length - 1].left,
            index: this.rowSpanData.length - 1
          });
          return result;
        };
        writer.removeListener("pageChanged", this.rowCallback);
        writer.context().moveDown(this.layout.paddingBottom(rowIndex, this.tableNode));
        writer.context().availableHeight += this.reservedAtBottom;
        let endingPage = writer.context().page;
        let endingY = writer.context().y;
        let xs = getLineXs();
        let ys = [];
        let hasBreaks = pageBreaks && pageBreaks.length > 0;
        let body = this.tableNode.table.body;
        ys.push({
          y0: this.rowTopY,
          page: hasBreaks ? pageBreaks[0].prevPage : endingPage
        });
        if (hasBreaks) {
          for (let i = 0, l = pageBreaks.length; i < l; i++) {
            let pageBreak = pageBreaks[i];
            ys[ys.length - 1].y1 = pageBreak.prevY;
            ys.push({
              y0: pageBreak.y,
              page: pageBreak.prevPage + 1
            });
          }
        }
        ys[ys.length - 1].y1 = endingY;
        let skipOrphanePadding = ys[0].y1 - ys[0].y0 === this.rowPaddingTop;
        if (rowIndex === 0 && !skipOrphanePadding && !this.rowsWithoutPageBreak && !this.dontBreakRows) {
          let pageTableStartedAt = null;
          if (pageBreaks && pageBreaks.length > 0) {
            pageTableStartedAt = pageBreaks[0].prevPage;
          }
          this.drawHorizontalLine(0, writer, this._tableTopBorderY, false, pageTableStartedAt);
        }
        for (let yi = skipOrphanePadding ? 1 : 0, yl = ys.length; yi < yl; yi++) {
          let willBreak = yi < ys.length - 1;
          let rowBreakWithoutHeader = yi > 0 && !this.headerRows;
          let hzLineOffset = rowBreakWithoutHeader ? 0 : this.topLineWidth;
          let y1 = ys[yi].y0;
          let y2 = ys[yi].y1;
          if (willBreak) {
            y2 = y2 + this.rowPaddingBottom;
          }
          if (writer.context().page != ys[yi].page) {
            writer.context().page = ys[yi].page;
            this.reservedAtBottom = 0;
          }
          if (willBreak && this.layout.hLineWhenBroken !== false) {
            this.drawHorizontalLine(rowIndex + 1, writer, y2);
          }
          if (rowBreakWithoutHeader && this.layout.hLineWhenBroken !== false) {
            this.drawHorizontalLine(rowIndex, writer, y1);
          }
          for (let i = 0, l = xs.length; i < l; i++) {
            let leftCellBorder = false;
            let rightCellBorder = false;
            let colIndex = xs[i].index;
            if (colIndex < body[rowIndex].length) {
              let cell = body[rowIndex][colIndex];
              leftCellBorder = cell.border ? cell.border[0] : this.layout.defaultBorder;
              rightCellBorder = cell.border ? cell.border[2] : this.layout.defaultBorder;
            }
            if (colIndex > 0 && !leftCellBorder) {
              let cell = body[rowIndex][colIndex - 1];
              leftCellBorder = cell.border ? cell.border[2] : this.layout.defaultBorder;
            }
            if (colIndex + 1 < body[rowIndex].length && !rightCellBorder) {
              let cell = body[rowIndex][colIndex + 1];
              rightCellBorder = cell.border ? cell.border[0] : this.layout.defaultBorder;
            }
            if (leftCellBorder) {
              this.drawVerticalLine(xs[i].x, y1 - hzLineOffset, y2 + this.bottomLineWidth, xs[i].index, writer, rowIndex, xs[i - 1] ? xs[i - 1].index : null);
            }
            if (i < l - 1) {
              body[rowIndex][colIndex]._willBreak = body[rowIndex][colIndex]._willBreak ?? willBreak;
              if (body[rowIndex][colIndex]._bottomY === void 0) {
                let bottomY = this.dontBreakRows ? y2 + this.bottomLineWidth : y2 + this.bottomLineWidth / 2;
                if (willBreak || this.dontBreakRows) {
                  bottomY = bottomY - this.rowPaddingBottom;
                }
                body[rowIndex][colIndex]._bottomY = bottomY - this.reservedAtBottom;
              }
              body[rowIndex][colIndex]._rowTopPageY = this.rowTopPageY;
              if (this.dontBreakRows) {
                body[rowIndex][colIndex]._rowTopPageYPadding = this.rowPaddingTop;
              }
              body[rowIndex][colIndex]._lastPageNumber = ys[yi].page + 1;
              let fillColor = body[rowIndex][colIndex].fillColor;
              let fillOpacity = body[rowIndex][colIndex].fillOpacity;
              if (!fillColor) {
                fillColor = typeof this.layout.fillColor === "function" ? this.layout.fillColor(rowIndex, this.tableNode, colIndex) : this.layout.fillColor;
              }
              if (!(0, _variableType.isNumber)(fillOpacity)) {
                fillOpacity = typeof this.layout.fillOpacity === "function" ? this.layout.fillOpacity(rowIndex, this.tableNode, colIndex) : this.layout.fillOpacity;
              }
              var overlayPattern = body[rowIndex][colIndex].overlayPattern;
              var overlayOpacity = body[rowIndex][colIndex].overlayOpacity;
              if (fillColor || overlayPattern) {
                let widthLeftBorder = leftCellBorder ? this.layout.vLineWidth(colIndex, this.tableNode) : 0;
                let widthRightBorder;
                if ((colIndex === 0 || colIndex + 1 == body[rowIndex].length) && !rightCellBorder) {
                  widthRightBorder = this.layout.vLineWidth(colIndex + 1, this.tableNode);
                } else if (rightCellBorder) {
                  widthRightBorder = this.layout.vLineWidth(colIndex + 1, this.tableNode) / 2;
                } else {
                  widthRightBorder = 0;
                }
                let x1f = this.dontBreakRows ? xs[i].x + widthLeftBorder : xs[i].x + widthLeftBorder / 2;
                let y1f = this.dontBreakRows ? y1 : y1 - hzLineOffset / 2;
                let x2f = xs[i + 1].x + widthRightBorder;
                let y2f = this.dontBreakRows ? y2 + this.bottomLineWidth : y2 + this.bottomLineWidth / 2;
                var bgWidth = x2f - x1f;
                var bgHeight = y2f - y1f;
                if (fillColor) {
                  writer.addVector({
                    type: "rect",
                    x: x1f,
                    y: y1f,
                    w: bgWidth,
                    h: bgHeight,
                    lineWidth: 0,
                    color: fillColor,
                    fillOpacity,
                    // mark if we are in an unbreakable block
                    _isFillColorFromUnbreakable: !!writer.transactionLevel
                  }, false, true, writer.context().backgroundLength[writer.context().page]);
                }
                if (overlayPattern) {
                  writer.addVector({
                    type: "rect",
                    x: x1f,
                    y: y1f,
                    w: bgWidth,
                    h: bgHeight,
                    lineWidth: 0,
                    color: overlayPattern,
                    fillOpacity: overlayOpacity
                  }, false, true);
                }
              }
            }
          }
        }
        writer.context().page = endingPage;
        writer.context().y = endingY;
        let row = this.tableNode.table.body[rowIndex];
        for (let i = 0, l = row.length; i < l; i++) {
          if (row[i].rowSpan) {
            this.rowSpanData[i].rowSpan = row[i].rowSpan;
            if (row[i].colSpan && row[i].colSpan > 1) {
              for (let j = 1; j < row[i].rowSpan; j++) {
                this.tableNode.table.body[rowIndex + j][i]._colSpan = row[i].colSpan;
              }
            }
            if (row[i].rowSpan && row[i].rowSpan > 1) {
              for (let j = 1; j < row[i].rowSpan; j++) {
                this.tableNode.table.body[rowIndex + j][i]._rowSpanCurrentOffset = j;
              }
            }
          }
          if (this.rowSpanData[i].rowSpan > 0) {
            this.rowSpanData[i].rowSpan--;
          }
        }
        this.drawHorizontalLine(rowIndex + 1, writer);
        if (this.headerRows && rowIndex === this.headerRows - 1) {
          this.headerRepeatable = writer.currentBlockToRepeatable();
        }
        const shouldCommitCurrentRowUnbreakable = this.dontBreakRows && (rowIndex === 0 || this._isCurrentRowUnbreakable);
        if (shouldCommitCurrentRowUnbreakable) {
          const pageChangedCallback = () => {
            if (rowIndex > 0 && !this.headerRows && this.layout.hLineWhenBroken !== false) {
              this.drawHorizontalLine(rowIndex, writer);
            }
          };
          writer.addListener("pageChanged", pageChangedCallback);
          writer.commitUnbreakableBlock();
          writer.removeListener("pageChanged", pageChangedCallback);
        }
        this._isCurrentRowUnbreakable = false;
        if (this.headerRepeatable && (rowIndex === this.rowsWithoutPageBreak - 1 || rowIndex === this.tableNode.table.body.length - 1)) {
          writer.commitUnbreakableBlock();
          writer.pushToRepeatables(this.headerRepeatable);
          this.cleanUpRepeatables = true;
          this.headerRepeatable = null;
        }
      }
    };
    var _default = exports.default = TableProcessor;
  }
});

export {
  require_TableProcessor
};
