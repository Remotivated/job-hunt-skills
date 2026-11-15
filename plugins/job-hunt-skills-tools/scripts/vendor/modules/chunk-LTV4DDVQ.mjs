import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  require_TableProcessor
} from "./chunk-SQXLLHUE.mjs";
import {
  require_PageElementWriter
} from "./chunk-COKAYHCX.mjs";
import {
  require_DocMeasure
} from "./chunk-EWLEWE3C.mjs";
import {
  require_columnCalculator
} from "./chunk-DRQKZZU5.mjs";
import {
  require_TextInlines
} from "./chunk-6RG7E3YS.mjs";
import {
  require_StyleContextStack
} from "./chunk-HC5FQQCL.mjs";
import {
  require_DocPreprocessor
} from "./chunk-QD3E4IVL.mjs";
import {
  require_node
} from "./chunk-VEYRURPE.mjs";
import {
  require_tools
} from "./chunk-HGHQZUV7.mjs";
import {
  require_DocumentContext
} from "./chunk-VTFDEV2C.mjs";
import {
  require_variableType
} from "./chunk-WLP4UAZF.mjs";
import {
  require_Line
} from "./chunk-VGLHKEMU.mjs";
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/LayoutBuilder.js
var require_LayoutBuilder = __commonJS({
  "node_modules/pdfmake/js/LayoutBuilder.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var _DocPreprocessor = _interopRequireDefault(require_DocPreprocessor());
    var _DocMeasure = _interopRequireDefault(require_DocMeasure());
    var _DocumentContext = _interopRequireDefault(require_DocumentContext());
    var _PageElementWriter = _interopRequireDefault(require_PageElementWriter());
    var _columnCalculator = _interopRequireDefault(require_columnCalculator());
    var _TableProcessor = _interopRequireDefault(require_TableProcessor());
    var _Line = _interopRequireDefault(require_Line());
    var _variableType = require_variableType();
    var _node = require_node();
    var _tools = require_tools();
    var _TextInlines = _interopRequireDefault(require_TextInlines());
    var _StyleContextStack = _interopRequireDefault(require_StyleContextStack());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function addAll(target, otherArray) {
      otherArray.forEach((item) => {
        target.push(item);
      });
    }
    var LayoutBuilder = class {
      /**
       * @param {object} pageSize - an object defining page width and height
       * @param {object} pageMargins - an object defining top, left, right and bottom margins
       * @param {object} svgMeasure
       */
      constructor(pageSize, pageMargins, svgMeasure) {
        this.pageSize = pageSize;
        this.pageMargins = pageMargins;
        this.svgMeasure = svgMeasure;
        this.tableLayouts = {};
        this.nestedLevel = 0;
        this.verticalAlignmentItemStack = [];
      }
      registerTableLayouts(tableLayouts) {
        this.tableLayouts = (0, _tools.pack)(this.tableLayouts, tableLayouts);
      }
      /**
       * Executes layout engine on document-definition-object and creates an array of pages
       * containing positioned Blocks, Lines and inlines
       *
       * @param {object} docStructure document-definition-object
       * @param {object} pdfDocument pdfkit document
       * @param {object} styleDictionary dictionary with style definitions
       * @param {object} defaultStyle default style definition
       * @param {object} background
       * @param {object} header
       * @param {object} footer
       * @param {object} watermark
       * @param {object} pageBreakBeforeFct
       * @returns {Array} an array of pages
       */
      layoutDocument(docStructure, pdfDocument, styleDictionary, defaultStyle, background, header, footer, watermark, pageBreakBeforeFct) {
        function addPageBreaksIfNecessary(linearNodeList, pages) {
          if (typeof pageBreakBeforeFct !== "function") {
            return false;
          }
          const hasRenderableContent = (node) => {
            if (!node || node.positions.length === 0) {
              return false;
            }
            if (node.text === "" && !node.listMarker) {
              return false;
            }
            return true;
          };
          linearNodeList = linearNodeList.filter(hasRenderableContent);
          linearNodeList.forEach((node) => {
            let nodeInfo = {};
            ["id", "text", "ul", "ol", "table", "image", "qr", "canvas", "svg", "columns", "headlineLevel", "style", "pageBreak", "pageOrientation", "width", "height"].forEach((key) => {
              if (node[key] !== void 0) {
                nodeInfo[key] = node[key];
              }
            });
            nodeInfo.startPosition = node.positions[0];
            nodeInfo.pageNumbers = Array.from(new Set(node.positions.map((node2) => node2.pageNumber)));
            nodeInfo.pages = pages.length;
            nodeInfo.stack = Array.isArray(node.stack);
            node.nodeInfo = nodeInfo;
          });
          for (let index = 0; index < linearNodeList.length; index++) {
            let node = linearNodeList[index];
            if (node.pageBreak !== "before" && !node.pageBreakCalculated) {
              node.pageBreakCalculated = true;
              let pageNumber = node.nodeInfo.pageNumbers[0];
              if (pageBreakBeforeFct(node.nodeInfo, {
                getFollowingNodesOnPage: () => {
                  let followingNodesOnPage = [];
                  for (let ii = index + 1, l = linearNodeList.length; ii < l; ii++) {
                    if (linearNodeList[ii].nodeInfo.pageNumbers.indexOf(pageNumber) > -1) {
                      followingNodesOnPage.push(linearNodeList[ii].nodeInfo);
                    }
                  }
                  return followingNodesOnPage;
                },
                getNodesOnNextPage: () => {
                  let nodesOnNextPage = [];
                  for (let ii = index + 1, l = linearNodeList.length; ii < l; ii++) {
                    if (linearNodeList[ii].nodeInfo.pageNumbers.indexOf(pageNumber + 1) > -1) {
                      nodesOnNextPage.push(linearNodeList[ii].nodeInfo);
                    }
                  }
                  return nodesOnNextPage;
                },
                getPreviousNodesOnPage: () => {
                  let previousNodesOnPage = [];
                  for (let ii = 0; ii < index; ii++) {
                    if (linearNodeList[ii].nodeInfo.pageNumbers.indexOf(pageNumber) > -1) {
                      previousNodesOnPage.push(linearNodeList[ii].nodeInfo);
                    }
                  }
                  return previousNodesOnPage;
                }
              })) {
                node.pageBreak = "before";
                return true;
              }
            }
          }
          return false;
        }
        this.docPreprocessor = new _DocPreprocessor.default();
        this.docMeasure = new _DocMeasure.default(pdfDocument, styleDictionary, defaultStyle, this.svgMeasure, this.tableLayouts);
        function resetXYs(result2) {
          result2.linearNodeList.forEach((node) => {
            node.resetXY();
          });
        }
        let result = this.tryLayoutDocument(docStructure, pdfDocument, styleDictionary, defaultStyle, background, header, footer, watermark);
        while (addPageBreaksIfNecessary(result.linearNodeList, result.pages)) {
          resetXYs(result);
          result = this.tryLayoutDocument(docStructure, pdfDocument, styleDictionary, defaultStyle, background, header, footer, watermark);
        }
        return result.pages;
      }
      tryLayoutDocument(docStructure, pdfDocument, styleDictionary, defaultStyle, background, header, footer, watermark) {
        const isNecessaryAddFirstPage = (docStructure2) => {
          if (docStructure2.stack && docStructure2.stack.length > 0 && docStructure2.stack[0].section) {
            return false;
          } else if (docStructure2.section) {
            return false;
          }
          return true;
        };
        this.linearNodeList = [];
        docStructure = this.docPreprocessor.preprocessDocument(docStructure);
        docStructure = this.docMeasure.measureDocument(docStructure);
        this.writer = new _PageElementWriter.default(new _DocumentContext.default());
        this.writer.context().addListener("pageAdded", (page) => {
          let backgroundGetter = background;
          if (page.customProperties["background"] || page.customProperties["background"] === null) {
            backgroundGetter = page.customProperties["background"];
          }
          this.addBackground(backgroundGetter);
        });
        if (isNecessaryAddFirstPage(docStructure)) {
          this.writer.addPage(this.pageSize, null, this.pageMargins);
        }
        this.processNode(docStructure);
        this.addHeadersAndFooters(header, footer);
        this.addWatermark(watermark, pdfDocument, defaultStyle);
        return {
          pages: this.writer.context().pages,
          linearNodeList: this.linearNodeList
        };
      }
      addBackground(background) {
        let backgroundGetter = typeof background === "function" ? background : () => background;
        let context = this.writer.context();
        let pageSize = context.getCurrentPage().pageSize;
        let pageBackground = backgroundGetter(context.page + 1, pageSize);
        if (pageBackground) {
          this.writer.beginUnbreakableBlock(pageSize.width, pageSize.height);
          pageBackground = this.docPreprocessor.preprocessBlock(pageBackground);
          this.processNode(this.docMeasure.measureBlock(pageBackground));
          this.writer.commitUnbreakableBlock(0, 0);
          context.backgroundLength[context.page] += pageBackground.positions.length;
        }
      }
      addDynamicRepeatable(nodeGetter, sizeFunction, customPropertyName) {
        let pages = this.writer.context().pages;
        for (let pageIndex = 0, l = pages.length; pageIndex < l; pageIndex++) {
          this.writer.context().page = pageIndex;
          let customProperties = this.writer.context().getCurrentPage().customProperties;
          let pageNodeGetter = nodeGetter;
          if (customProperties[customPropertyName] || customProperties[customPropertyName] === null) {
            pageNodeGetter = customProperties[customPropertyName];
          }
          if (typeof pageNodeGetter === "undefined" || pageNodeGetter === null) {
            continue;
          }
          let node = pageNodeGetter(pageIndex + 1, l, this.writer.context().pages[pageIndex].pageSize);
          if (node) {
            let sizes = sizeFunction(this.writer.context().getCurrentPage().pageSize, this.writer.context().getCurrentPage().pageMargins);
            this.writer.beginUnbreakableBlock(sizes.width, sizes.height);
            node = this.docPreprocessor.preprocessBlock(node);
            this.processNode(this.docMeasure.measureBlock(node));
            this.writer.commitUnbreakableBlock(sizes.x, sizes.y);
          }
        }
      }
      addHeadersAndFooters(header, footer) {
        const headerSizeFct = (pageSize, pageMargins) => ({
          x: 0,
          y: 0,
          width: pageSize.width,
          height: pageMargins.top
        });
        const footerSizeFct = (pageSize, pageMargins) => ({
          x: 0,
          y: pageSize.height - pageMargins.bottom,
          width: pageSize.width,
          height: pageMargins.bottom
        });
        this.addDynamicRepeatable(header, headerSizeFct, "header");
        this.addDynamicRepeatable(footer, footerSizeFct, "footer");
      }
      addWatermark(watermark, pdfDocument, defaultStyle) {
        let pages = this.writer.context().pages;
        for (let i = 0, l = pages.length; i < l; i++) {
          let pageWatermark = watermark;
          if (pages[i].customProperties["watermark"] || pages[i].customProperties["watermark"] === null) {
            pageWatermark = pages[i].customProperties["watermark"];
          }
          if (pageWatermark === void 0 || pageWatermark === null) {
            continue;
          }
          if ((0, _variableType.isString)(pageWatermark)) {
            pageWatermark = {
              "text": pageWatermark
            };
          }
          if (!pageWatermark.text) {
            continue;
          }
          pages[i].watermark = getWatermarkObject({
            ...pageWatermark
          }, pages[i].pageSize, pdfDocument, defaultStyle);
        }
        function getWatermarkObject(watermark2, pageSize, pdfDocument2, defaultStyle2) {
          watermark2.font = watermark2.font || defaultStyle2.font || "Roboto";
          watermark2.fontSize = watermark2.fontSize || "auto";
          watermark2.color = watermark2.color || "black";
          watermark2.opacity = (0, _variableType.isNumber)(watermark2.opacity) ? watermark2.opacity : 0.6;
          watermark2.bold = watermark2.bold || false;
          watermark2.italics = watermark2.italics || false;
          watermark2.angle = (0, _variableType.isValue)(watermark2.angle) ? watermark2.angle : null;
          if (watermark2.angle === null) {
            watermark2.angle = Math.atan2(pageSize.height, pageSize.width) * -180 / Math.PI;
          }
          if (watermark2.fontSize === "auto") {
            watermark2.fontSize = getWatermarkFontSize(pageSize, watermark2, pdfDocument2);
          }
          let watermarkObject = {
            text: watermark2.text,
            font: pdfDocument2.provideFont(watermark2.font, watermark2.bold, watermark2.italics),
            fontSize: watermark2.fontSize,
            color: watermark2.color,
            opacity: watermark2.opacity,
            angle: watermark2.angle
          };
          watermarkObject._size = getWatermarkSize(watermark2, pdfDocument2);
          return watermarkObject;
        }
        function getWatermarkSize(watermark2, pdfDocument2) {
          let textInlines = new _TextInlines.default(pdfDocument2);
          let styleContextStack = new _StyleContextStack.default(null, {
            font: watermark2.font,
            bold: watermark2.bold,
            italics: watermark2.italics
          });
          styleContextStack.push({
            fontSize: watermark2.fontSize
          });
          let size = textInlines.sizeOfText(watermark2.text, styleContextStack);
          let rotatedSize = textInlines.sizeOfRotatedText(watermark2.text, watermark2.angle, styleContextStack);
          return {
            size,
            rotatedSize
          };
        }
        function getWatermarkFontSize(pageSize, watermark2, pdfDocument2) {
          let textInlines = new _TextInlines.default(pdfDocument2);
          let styleContextStack = new _StyleContextStack.default(null, {
            font: watermark2.font,
            bold: watermark2.bold,
            italics: watermark2.italics
          });
          let rotatedSize;
          let a = 0;
          let b = 1e3;
          let c = (a + b) / 2;
          while (Math.abs(a - b) > 1) {
            styleContextStack.push({
              fontSize: c
            });
            rotatedSize = textInlines.sizeOfRotatedText(watermark2.text, watermark2.angle, styleContextStack);
            if (rotatedSize.width > pageSize.width) {
              b = c;
              c = (a + b) / 2;
            } else if (rotatedSize.width < pageSize.width) {
              if (rotatedSize.height > pageSize.height) {
                b = c;
                c = (a + b) / 2;
              } else {
                a = c;
                c = (a + b) / 2;
              }
            }
            styleContextStack.pop();
          }
          return c;
        }
      }
      processNode(node, isVerticalAlignmentAllowed = false) {
        const applyMargins = (callback) => {
          let margin = node._margin;
          if (node.pageBreak === "before") {
            this.writer.moveToNextPage(node.pageOrientation);
          } else if (node.pageBreak === "beforeOdd") {
            this.writer.moveToNextPage(node.pageOrientation);
            if ((this.writer.context().page + 1) % 2 === 1) {
              this.writer.moveToNextPage(node.pageOrientation);
            }
          } else if (node.pageBreak === "beforeEven") {
            this.writer.moveToNextPage(node.pageOrientation);
            if ((this.writer.context().page + 1) % 2 === 0) {
              this.writer.moveToNextPage(node.pageOrientation);
            }
          }
          const isDetachedBlock = node.relativePosition || node.absolutePosition;
          if (margin && !isDetachedBlock) {
            const availableHeight = this.writer.context().availableHeight;
            if (availableHeight - margin[1] < 0) {
              this.writer.context().moveDown(availableHeight);
              if (this.writer.context().inSnakingColumns() && !this.writer.context().isInNestedNonSnakingGroup()) {
                this.snakingAwarePageBreak(node.pageOrientation);
              } else {
                this.writer.moveToNextPage(node.pageOrientation);
              }
            } else {
              this.writer.context().moveDown(margin[1]);
            }
            this.writer.context().addMargin(margin[0], margin[2]);
          }
          callback();
          if (margin && !isDetachedBlock) {
            const availableHeight = this.writer.context().availableHeight;
            if (availableHeight - margin[3] < 0) {
              this.writer.context().moveDown(availableHeight);
              if (this.writer.context().inSnakingColumns() && !this.writer.context().isInNestedNonSnakingGroup()) {
                this.snakingAwarePageBreak(node.pageOrientation);
              } else {
                this.writer.moveToNextPage(node.pageOrientation);
              }
            } else {
              this.writer.context().moveDown(margin[3]);
            }
            this.writer.context().addMargin(-margin[0], -margin[2]);
          }
          if (node.pageBreak === "after") {
            this.writer.moveToNextPage(node.pageOrientation);
          } else if (node.pageBreak === "afterOdd") {
            this.writer.moveToNextPage(node.pageOrientation);
            if ((this.writer.context().page + 1) % 2 === 1) {
              this.writer.moveToNextPage(node.pageOrientation);
            }
          } else if (node.pageBreak === "afterEven") {
            this.writer.moveToNextPage(node.pageOrientation);
            if ((this.writer.context().page + 1) % 2 === 0) {
              this.writer.moveToNextPage(node.pageOrientation);
            }
          }
        };
        this.linearNodeList.push(node);
        decorateNode(node);
        if (this.writer.context().getCurrentPage() !== null) {
          var prevTop = this.writer.context().getCurrentPosition().top;
        }
        applyMargins(() => {
          let verticalAlignment = node.verticalAlignment;
          if (isVerticalAlignmentAllowed && verticalAlignment) {
            var verticalAlignmentBegin = this.writer.beginVerticalAlignment(verticalAlignment);
          }
          let unbreakable = node.unbreakable;
          if (unbreakable) {
            this.writer.beginUnbreakableBlock();
          }
          let absPosition = node.absolutePosition;
          if (absPosition) {
            this.writer.context().beginDetachedBlock();
            this.writer.context().moveTo(absPosition.x || 0, absPosition.y || 0);
          }
          let relPosition = node.relativePosition;
          if (relPosition) {
            this.writer.context().beginDetachedBlock();
            this.writer.context().moveToRelative(relPosition.x || 0, relPosition.y || 0);
          }
          if (node.stack) {
            this.processVerticalContainer(node);
          } else if (node.section) {
            this.processSection(node);
          } else if (node.columns) {
            this.processColumns(node);
          } else if (node.ul) {
            this.processList(false, node);
          } else if (node.ol) {
            this.processList(true, node);
          } else if (node.table) {
            this.processTable(node);
          } else if (node.text !== void 0) {
            this.processLeaf(node);
          } else if (node.toc) {
            this.processToc(node);
          } else if (node.image) {
            this.processImage(node);
          } else if (node.svg) {
            this.processSVG(node);
          } else if (node.canvas) {
            this.processCanvas(node);
          } else if (node.qr) {
            this.processQr(node);
          } else if (node.attachment) {
            this.processAttachment(node);
          } else if (!node._span) {
            throw new Error("Unrecognized document structure: ".concat((0, _node.stringifyNode)(node)));
          }
          if (absPosition || relPosition) {
            this.writer.context().endDetachedBlock();
          }
          if (unbreakable) {
            this.writer.commitUnbreakableBlock();
          }
          if (isVerticalAlignmentAllowed && verticalAlignment) {
            this.verticalAlignmentItemStack.push({
              begin: verticalAlignmentBegin,
              end: this.writer.endVerticalAlignment(verticalAlignment)
            });
          }
        });
        if (prevTop !== void 0) {
          node.__height = this.writer.context().getCurrentPosition().top - prevTop;
        }
      }
      /**
       * Helper for page breaks that respects snaking column context.
       * When in snaking columns, first tries moving to next column.
       * If no columns available, moves to next page and resets x to left margin.
       * @param {string} pageOrientation - Optional page orientation for the new page
       */
      snakingAwarePageBreak(pageOrientation) {
        let ctx = this.writer.context();
        let snakingSnapshot = ctx.getSnakingSnapshot();
        if (!snakingSnapshot) {
          return;
        }
        if (this.writer.canMoveToNextColumn()) {
          this.writer.moveToNextColumn();
          return;
        }
        this.writer.moveToNextPage(pageOrientation);
        let savedLastColumnWidth = ctx.lastColumnWidth;
        ctx.resetSnakingColumnsForNewPage();
        ctx.lastColumnWidth = savedLastColumnWidth;
      }
      // vertical container
      processVerticalContainer(node) {
        node.stack.forEach((item) => {
          this.processNode(item);
          addAll(node.positions, item.positions);
        }, this);
      }
      // section
      processSection(sectionNode) {
        let page = this.writer.context().getCurrentPage();
        if (!page || page && page.items.length) {
          if (sectionNode.pageSize === "inherit") {
            sectionNode.pageSize = page ? {
              width: page.pageSize.width,
              height: page.pageSize.height
            } : void 0;
          }
          if (sectionNode.pageOrientation === "inherit") {
            sectionNode.pageOrientation = page ? page.pageSize.orientation : void 0;
          }
          if (sectionNode.pageMargins === "inherit") {
            sectionNode.pageMargins = page ? page.pageMargins : void 0;
          }
          if (sectionNode.header === "inherit") {
            sectionNode.header = page ? page.customProperties.header : void 0;
          }
          if (sectionNode.footer === "inherit") {
            sectionNode.footer = page ? page.customProperties.footer : void 0;
          }
          if (sectionNode.background === "inherit") {
            sectionNode.background = page ? page.customProperties.background : void 0;
          }
          if (sectionNode.watermark === "inherit") {
            sectionNode.watermark = page ? page.customProperties.watermark : void 0;
          }
          if (sectionNode.header && typeof sectionNode.header !== "function" && sectionNode.header !== null) {
            sectionNode.header = (0, _tools.convertToDynamicContent)(sectionNode.header);
          }
          if (sectionNode.footer && typeof sectionNode.footer !== "function" && sectionNode.footer !== null) {
            sectionNode.footer = (0, _tools.convertToDynamicContent)(sectionNode.footer);
          }
          let customProperties = {};
          if (typeof sectionNode.header !== "undefined") {
            customProperties.header = sectionNode.header;
          }
          if (typeof sectionNode.footer !== "undefined") {
            customProperties.footer = sectionNode.footer;
          }
          if (typeof sectionNode.background !== "undefined") {
            customProperties.background = sectionNode.background;
          }
          if (typeof sectionNode.watermark !== "undefined") {
            customProperties.watermark = sectionNode.watermark;
          }
          this.writer.addPage(sectionNode.pageSize || this.pageSize, sectionNode.pageOrientation, sectionNode.pageMargins || this.pageMargins, customProperties);
        }
        this.processNode(sectionNode.section);
      }
      // columns
      processColumns(columnNode) {
        this.nestedLevel++;
        let columns = columnNode.columns;
        let availableWidth = this.writer.context().availableWidth;
        let gaps = gapArray(columnNode._gap);
        if (gaps) {
          availableWidth -= (gaps.length - 1) * columnNode._gap;
        }
        _columnCalculator.default.buildColumnWidths(columns, availableWidth);
        let result = this.processRow({
          marginX: columnNode._margin ? [columnNode._margin[0], columnNode._margin[2]] : [0, 0],
          cells: columns,
          widths: columns,
          gaps,
          snakingColumns: columnNode.snakingColumns
        });
        addAll(columnNode.positions, result.positions);
        this.nestedLevel--;
        if (this.nestedLevel === 0) {
          this.writer.context().resetMarginXTopParent();
        }
        function gapArray(gap) {
          if (!gap) {
            return null;
          }
          let gaps2 = [];
          gaps2.push(0);
          for (let i = columns.length - 1; i > 0; i--) {
            gaps2.push(gap);
          }
          return gaps2;
        }
      }
      /**
      * Searches for a cell in the same row that starts a rowspan and is positioned immediately before the current cell.
      * Alternatively, it finds a cell where the colspan initiating the rowspan extends to the cell just before the current one.
      *
      * @param {Array<object>} arr - An array representing cells in a row.
      * @param {number} i - The index of the current cell to search backward from.
      * @returns {object|null} The starting cell of the rowspan if found; otherwise, `null`.
      */
      _findStartingRowSpanCell(arr, i) {
        let requiredColspan = 1;
        for (let index = i - 1; index >= 0; index--) {
          if (!arr[index]._span) {
            if (arr[index].rowSpan > 1 && (arr[index].colSpan || 1) === requiredColspan) {
              return arr[index];
            } else {
              return null;
            }
          }
          requiredColspan++;
        }
        return null;
      }
      /**
      * Retrieves a page break description for a specified page from a list of page breaks.
      *
      * @param {Array<object>} pageBreaks - An array of page break descriptions, each containing `prevPage` properties.
      * @param {number} page - The page number to find the associated page break for.
      * @returns {object|undefined} The page break description object for the specified page if found; otherwise, `undefined`.
      */
      _getPageBreak(pageBreaks, page) {
        return pageBreaks.find((desc) => desc.prevPage === page);
      }
      _getPageBreakListBySpan(tableNode, page, rowIndex) {
        if (!tableNode || !tableNode._breaksBySpan) {
          return null;
        }
        const breaksList = tableNode._breaksBySpan.filter((desc) => desc.prevPage === page && rowIndex <= desc.rowIndexOfSpanEnd);
        let y = Number.MAX_VALUE, prevY = Number.MIN_VALUE;
        breaksList.forEach((b) => {
          prevY = Math.max(b.prevY, prevY);
          y = Math.min(b.y, y);
        });
        return {
          prevPage: page,
          prevY,
          y
        };
      }
      _findSameRowPageBreakByRowSpanData(breaksBySpan, page, rowIndex) {
        if (!breaksBySpan) {
          return null;
        }
        return breaksBySpan.find((desc) => desc.prevPage === page && rowIndex === desc.rowIndexOfSpanEnd);
      }
      _updatePageBreaksData(pageBreaks, tableNode, rowIndex) {
        Object.keys(tableNode._bottomByPage).forEach((p) => {
          const page = Number(p);
          const pageBreak = this._getPageBreak(pageBreaks, page);
          if (pageBreak) {
            pageBreak.prevY = Math.max(pageBreak.prevY, tableNode._bottomByPage[page]);
          }
          if (tableNode._breaksBySpan && tableNode._breaksBySpan.length > 0) {
            const breaksBySpanList = tableNode._breaksBySpan.filter((pb) => pb.prevPage === page && rowIndex <= pb.rowIndexOfSpanEnd);
            if (breaksBySpanList && breaksBySpanList.length > 0) {
              breaksBySpanList.forEach((b) => {
                b.prevY = Math.max(b.prevY, tableNode._bottomByPage[page]);
              });
            }
          }
        });
      }
      /**
      * Resolves the Y-coordinates for a target object by comparing two break points.
      *
      * @param {object} break1 - The first break point with `prevY` and `y` properties.
      * @param {object} break2 - The second break point with `prevY` and `y` properties.
      * @param {object} target - The target object to be updated with resolved Y-coordinates.
      * @property {number} target.prevY - Updated to the maximum `prevY` value between `break1` and `break2`.
      * @property {number} target.y - Updated to the minimum `y` value between `break1` and `break2`.
      */
      _resolveBreakY(break1, break2, target) {
        target.prevY = Math.max(break1.prevY, break2.prevY);
        target.y = Math.min(break1.y, break2.y);
      }
      _storePageBreakData(data, startsRowSpan, pageBreaks, tableNode) {
        if (!startsRowSpan) {
          let pageDesc = this._getPageBreak(pageBreaks, data.prevPage);
          let pageDescBySpan = this._getPageBreakListBySpan(tableNode, data.prevPage, data.rowIndex);
          if (!pageDesc) {
            pageDesc = {
              ...data
            };
            pageBreaks.push(pageDesc);
          }
          if (pageDescBySpan) {
            this._resolveBreakY(pageDesc, pageDescBySpan, pageDesc);
          }
          this._resolveBreakY(pageDesc, data, pageDesc);
        } else {
          const breaksBySpan = tableNode && tableNode._breaksBySpan || null;
          let pageDescBySpan = this._findSameRowPageBreakByRowSpanData(breaksBySpan, data.prevPage, data.rowIndex);
          if (!pageDescBySpan) {
            pageDescBySpan = {
              ...data,
              rowIndexOfSpanEnd: data.rowIndex + data.rowSpan - 1
            };
            if (!tableNode._breaksBySpan) {
              tableNode._breaksBySpan = [];
            }
            tableNode._breaksBySpan.push(pageDescBySpan);
          }
          pageDescBySpan.prevY = Math.max(pageDescBySpan.prevY, data.prevY);
          pageDescBySpan.y = Math.min(pageDescBySpan.y, data.y);
          let pageDesc = this._getPageBreak(pageBreaks, data.prevPage);
          if (pageDesc) {
            this._resolveBreakY(pageDesc, pageDescBySpan, pageDesc);
          }
        }
      }
      /**
      * Calculates the left offset for a column based on the specified gap values.
      *
      * @param {number} i - The index of the column for which the offset is being calculated.
      * @param {Array<number>} gaps - An array of gap values for each column.
      * @returns {number} The left offset for the column. Returns `gaps[i]` if it exists, otherwise `0`.
      */
      _colLeftOffset(i, gaps) {
        if (gaps && gaps.length > i) {
          return gaps[i];
        }
        return 0;
      }
      /**
      * Retrieves the ending cell for a row span in case it exists in a specified table column.
      *
      * @param {Array<Array<object>>} tableBody - The table body, represented as a 2D array of cell objects.
      * @param {number} rowIndex - The index of the starting row for the row span.
      * @param {object} column - The column object containing row span information.
      * @param {number} columnIndex - The index of the column within the row.
      * @returns {object|null} The cell at the end of the row span if it exists; otherwise, `null`.
      * @throws {Error} If the row span extends beyond the total row count.
      */
      _getRowSpanEndingCell(tableBody, rowIndex, column, columnIndex) {
        if (column.rowSpan && column.rowSpan > 1) {
          let endingRow = rowIndex + column.rowSpan - 1;
          if (endingRow >= tableBody.length) {
            throw new Error("Row span for column ".concat(columnIndex, " (with indexes starting from 0) exceeded row count"));
          }
          return tableBody[endingRow][columnIndex];
        }
        return null;
      }
      processRow({
        marginX = [0, 0],
        dontBreakRows = false,
        rowsWithoutPageBreak = 0,
        cells,
        widths,
        gaps,
        tableNode,
        tableBody,
        rowIndex,
        height,
        snakingColumns = false
      }) {
        const isUnbreakableRow = dontBreakRows || rowIndex <= rowsWithoutPageBreak - 1;
        let pageBreaks = [];
        let pageBreaksByRowSpan = [];
        let positions = [];
        let willBreakByHeight = false;
        let verticalAlignmentCells = {};
        widths = widths || cells;
        if (!isUnbreakableRow && height > this.writer.context().availableHeight) {
          willBreakByHeight = true;
        }
        const marginXParent = this.nestedLevel === 1 ? marginX : null;
        const _bottomByPage = tableNode ? tableNode._bottomByPage : null;
        const columnGapForGroup = gaps && gaps.length > 1 ? gaps[1] : 0;
        const columnWidthsForContext = widths.map((w) => w._calcWidth);
        this.writer.context().beginColumnGroup(marginXParent, _bottomByPage, snakingColumns, columnGapForGroup, columnWidthsForContext);
        for (let i = 0, l = cells.length; i < l; i++) {
          let cell = cells[i];
          let cellIndexBegin = i;
          const storePageBreakClosure = (data) => {
            const startsRowSpan = cell.rowSpan && cell.rowSpan > 1;
            if (startsRowSpan) {
              data.rowSpan = cell.rowSpan;
            }
            data.rowIndex = rowIndex;
            this._storePageBreakData(data, startsRowSpan, pageBreaks, tableNode);
          };
          this.writer.addListener("pageChanged", storePageBreakClosure);
          let width = widths[i]._calcWidth;
          let leftOffset = this._colLeftOffset(i, gaps);
          let startingSpanCell = this._findStartingRowSpanCell(cells, i);
          if (cell.colSpan && cell.colSpan > 1) {
            for (let j = 1; j < cell.colSpan; j++) {
              width += widths[++i]._calcWidth + gaps[i];
            }
          }
          const rowSpanRightEndingCell = this._getRowSpanEndingCell(tableBody, rowIndex, cell, i);
          const rowSpanLeftEndingCell = this._getRowSpanEndingCell(tableBody, rowIndex, cell, cellIndexBegin);
          if (rowSpanRightEndingCell) {
            cell._endingCell = rowSpanRightEndingCell;
            cell._endingCell._startingRowSpanY = cell._startingRowSpanY;
            cell._endingCell._startingRowSpanPage = cell._startingRowSpanPage;
          }
          if (rowSpanLeftEndingCell) {
            cell._leftEndingCell = rowSpanLeftEndingCell;
            cell._leftEndingCell._startingRowSpanY = cell._startingRowSpanY;
            cell._leftEndingCell._startingRowSpanPage = cell._startingRowSpanPage;
          }
          let endOfRowSpanCell = null;
          if (startingSpanCell && startingSpanCell._endingCell) {
            endOfRowSpanCell = startingSpanCell._endingCell;
            if (this.writer.transactionLevel > 0) {
              endOfRowSpanCell._isUnbreakableContext = true;
              endOfRowSpanCell._originalXOffset = this.writer.originalX;
            }
          }
          this.writer.context().beginColumn(width, leftOffset, endOfRowSpanCell);
          const skipForSnaking = snakingColumns && i > 0;
          if (!cell._span && !skipForSnaking) {
            this.processNode(cell, true);
            this.writer.context().updateBottomByPage();
            if (cell.verticalAlignment) {
              verticalAlignmentCells[cellIndexBegin] = this.verticalAlignmentItemStack.length - 1;
            }
            addAll(positions, cell.positions);
          } else if (cell._columnEndingContext) {
            let discountY = 0;
            if (dontBreakRows) {
              const ctxBeforeRowSpanLastRow = this.writer.contextStack[this.writer.contextStack.length - 1];
              const startsOnCurrentPage = typeof cell._startingRowSpanPage === "number" && cell._startingRowSpanPage === ctxBeforeRowSpanLastRow.page;
              if (startsOnCurrentPage && typeof cell._startingRowSpanY === "number") {
                discountY = ctxBeforeRowSpanLastRow.y - cell._startingRowSpanY;
              }
              discountY = Math.max(0, discountY);
            }
            let originalXOffset = 0;
            if (cell._isUnbreakableContext && !this.writer.transactionLevel) {
              originalXOffset = cell._originalXOffset;
            }
            this.writer.context().markEnding(cell, originalXOffset, discountY);
          }
          this.writer.removeListener("pageChanged", storePageBreakClosure);
        }
        let endingSpanCell = null;
        const lastColumn = cells.length > 0 ? cells[cells.length - 1] : null;
        if (lastColumn) {
          if (lastColumn._endingCell) {
            endingSpanCell = lastColumn._endingCell;
          } else if (lastColumn._span === true) {
            const startingSpanCell = this._findStartingRowSpanCell(cells, cells.length);
            if (startingSpanCell) {
              endingSpanCell = startingSpanCell._endingCell;
              if (this.writer.transactionLevel > 0) {
                endingSpanCell._isUnbreakableContext = true;
                endingSpanCell._originalXOffset = this.writer.originalX;
              }
            }
          }
        }
        if (willBreakByHeight && !isUnbreakableRow && pageBreaks.length === 0) {
          this.writer.context().moveDown(this.writer.context().availableHeight);
          if (snakingColumns) {
            this.snakingAwarePageBreak();
          } else {
            this.writer.moveToNextPage();
          }
        }
        const bottomByPage = this.writer.context().completeColumnGroup(height, endingSpanCell);
        if (tableNode) {
          tableNode._bottomByPage = bottomByPage;
          this._updatePageBreaksData(pageBreaks, tableNode, rowIndex);
        }
        let rowHeight = this.writer.context().height;
        for (let i = 0, l = cells.length; i < l; i++) {
          let cell = cells[i];
          if (!cell._span && cell.verticalAlignment) {
            let itemBegin = this.verticalAlignmentItemStack[verticalAlignmentCells[i]].begin.item;
            itemBegin.viewHeight = rowHeight;
            itemBegin.nodeHeight = cell.__height;
            itemBegin.cell = cell;
            itemBegin.bottomY = this.writer.context().y;
            itemBegin.isCellContentMultiPage = !itemBegin.cell.positions.every((item) => item.pageNumber === itemBegin.cell.positions[0].pageNumber);
            itemBegin.getViewHeight = function() {
              if (this.cell._willBreak) {
                return this.cell._bottomY - this.cell._rowTopPageY;
              }
              if (this.cell.rowSpan && this.cell.rowSpan > 1) {
                if (dontBreakRows) {
                  let rowTopPageY = this.cell._leftEndingCell._startingRowSpanY + this.cell._leftEndingCell._rowTopPageYPadding;
                  return this.cell._leftEndingCell._rowTopPageY - rowTopPageY + this.cell._leftEndingCell._bottomY;
                } else {
                  if (this.cell.positions[0].pageNumber !== this.cell._leftEndingCell._lastPageNumber) {
                    return this.bottomY - this.cell._leftEndingCell._bottomY;
                  }
                  return this.viewHeight + this.cell._leftEndingCell._bottomY - this.bottomY;
                }
              }
              return this.viewHeight;
            };
            itemBegin.getNodeHeight = function() {
              return this.nodeHeight;
            };
            let itemEnd = this.verticalAlignmentItemStack[verticalAlignmentCells[i]].end.item;
            itemEnd.isCellContentMultiPage = itemBegin.isCellContentMultiPage;
          }
        }
        return {
          pageBreaksBySpan: pageBreaksByRowSpan,
          pageBreaks,
          positions
        };
      }
      // lists
      processList(orderedList, node) {
        const addMarkerToFirstLeaf = (line) => {
          if (nextMarker) {
            let marker = nextMarker;
            nextMarker = null;
            if (marker.canvas) {
              let vector = marker.canvas[0];
              (0, _tools.offsetVector)(vector, -marker._minWidth, 0);
              this.writer.addVector(vector);
            } else if (marker._inlines) {
              let markerLine = new _Line.default(this.pageSize.width);
              markerLine.addInline(marker._inlines[0]);
              markerLine.x = -marker._minWidth;
              markerLine.y = line.getAscenderHeight() - markerLine.getAscenderHeight();
              this.writer.addLine(markerLine, true);
            }
          }
        };
        let items = orderedList ? node.ol : node.ul;
        let gapSize = node._gapSize;
        this.writer.context().addMargin(gapSize.width);
        let nextMarker;
        this.writer.addListener("lineAdded", addMarkerToFirstLeaf);
        items.forEach((item) => {
          nextMarker = item.listMarker;
          this.processNode(item);
          addAll(node.positions, item.positions);
        });
        this.writer.removeListener("lineAdded", addMarkerToFirstLeaf);
        this.writer.context().addMargin(-gapSize.width);
      }
      // tables
      processTable(tableNode) {
        this.nestedLevel++;
        let processor = new _TableProcessor.default(tableNode);
        processor.beginTable(this.writer);
        let rowHeights = tableNode.table.heights;
        let lastRowHeight = 0;
        for (let i = 0, l = tableNode.table.body.length; i < l; i++) {
          if (i > 0 && this.writer.context().inSnakingColumns()) {
            let minRowHeight = lastRowHeight > 0 ? lastRowHeight : processor.rowPaddingTop + 14 + processor.rowPaddingBottom + processor.bottomLineWidth + processor.topLineWidth;
            if (this.writer.context().availableHeight < minRowHeight) {
              this.snakingAwarePageBreak();
              if (processor.layout.hLineWhenBroken !== false && !processor.headerRows) {
                processor.drawHorizontalLine(i, this.writer);
              }
            }
          }
          let rowYBefore = this.writer.context().y;
          if (processor.dontBreakRows) {
            tableNode.table.body[i].forEach((cell) => {
              if (cell.rowSpan && cell.rowSpan > 1) {
                cell._startingRowSpanY = this.writer.context().y;
                cell._startingRowSpanPage = this.writer.context().page;
              }
            });
          }
          processor.beginRow(i, this.writer);
          let height;
          if (typeof rowHeights === "function") {
            height = rowHeights(i);
          } else if (Array.isArray(rowHeights)) {
            height = rowHeights[i];
          } else {
            height = rowHeights;
          }
          if (height === "auto") {
            height = void 0;
          }
          const pageBeforeProcessing = this.writer.context().page;
          let result = this.processRow({
            marginX: tableNode._margin ? [tableNode._margin[0], tableNode._margin[2]] : [0, 0],
            dontBreakRows: processor.dontBreakRows,
            rowsWithoutPageBreak: processor.rowsWithoutPageBreak,
            cells: tableNode.table.body[i],
            widths: tableNode.table.widths,
            gaps: tableNode._offsets.offsets,
            tableBody: tableNode.table.body,
            tableNode,
            rowIndex: i,
            height
          });
          addAll(tableNode.positions, result.positions);
          if (!result.pageBreaks || result.pageBreaks.length === 0) {
            const breaksBySpan = tableNode && tableNode._breaksBySpan || null;
            const breakBySpanData = this._findSameRowPageBreakByRowSpanData(breaksBySpan, pageBeforeProcessing, i);
            if (breakBySpanData) {
              const finalBreakBySpanData = this._getPageBreakListBySpan(tableNode, breakBySpanData.prevPage, i);
              result.pageBreaks.push(finalBreakBySpanData);
            }
          }
          processor.endRow(i, this.writer, result.pageBreaks);
          let rowYAfter = this.writer.context().y;
          if (this.writer.context().page === pageBeforeProcessing) {
            lastRowHeight = rowYAfter - rowYBefore;
          }
        }
        processor.endTable(this.writer);
        this.nestedLevel--;
        if (this.nestedLevel === 0) {
          this.writer.context().resetMarginXTopParent();
        }
      }
      // leafs (texts)
      processLeaf(node) {
        let line = this.buildNextLine(node);
        if (line && (node.tocItem || node.id)) {
          line._node = node;
        }
        let currentHeight = line ? line.getHeight() : 0;
        let maxHeight = node.maxHeight || -1;
        if (line) {
          let nodeId = (0, _node.getNodeId)(node);
          if (nodeId) {
            line.id = nodeId;
          }
        }
        if (node.outline) {
          line._outline = {
            id: node.id,
            parentId: node.outlineParentId,
            text: node.outlineText || node.text,
            expanded: node.outlineExpanded || false
          };
        } else if (Array.isArray(node.text)) {
          for (let i = 0, l = node.text.length; i < l; i++) {
            let item = node.text[i];
            if (item.outline) {
              line._outline = {
                id: item.id,
                parentId: item.outlineParentId,
                text: item.outlineText || item.text,
                expanded: item.outlineExpanded || false
              };
            }
          }
        }
        if (node._tocItemRef) {
          line._pageNodeRef = node._tocItemRef;
        }
        if (node._pageRef) {
          line._pageNodeRef = node._pageRef._nodeRef;
        }
        if (line && line.inlines && Array.isArray(line.inlines)) {
          for (let i = 0, l = line.inlines.length; i < l; i++) {
            if (line.inlines[i]._tocItemRef) {
              line.inlines[i]._pageNodeRef = line.inlines[i]._tocItemRef;
            }
            if (line.inlines[i]._pageRef) {
              line.inlines[i]._pageNodeRef = line.inlines[i]._pageRef._nodeRef;
            }
          }
        }
        while (line && (maxHeight === -1 || currentHeight < maxHeight)) {
          if (line.getHeight() > this.writer.context().availableHeight && this.writer.context().y > this.writer.context().pageMargins.top) {
            if (this.writer.context().inSnakingColumns() && !this.writer.context().isInNestedNonSnakingGroup()) {
              this.snakingAwarePageBreak(node.pageOrientation);
              if (line.inlines && line.inlines.length > 0) {
                node._inlines.unshift(...line.inlines);
              }
              line = this.buildNextLine(node);
              continue;
            } else {
              this.writer.moveToNextPage(node.pageOrientation);
            }
          }
          let positions = this.writer.addLine(line);
          node.positions.push(positions);
          line = this.buildNextLine(node);
          if (line) {
            currentHeight += line.getHeight();
          }
        }
      }
      processToc(node) {
        if (!node.toc._table && node.toc.hideEmpty === true) {
          return;
        }
        if (node.toc.title) {
          this.processNode(node.toc.title);
        }
        if (node.toc._table) {
          this.processNode(node.toc._table);
        }
      }
      buildNextLine(textNode) {
        function cloneInline(inline) {
          let newInline = inline.constructor();
          for (let key in inline) {
            newInline[key] = inline[key];
          }
          return newInline;
        }
        function findMaxFitLength(text, maxWidth, measureFn) {
          let low = 1;
          let high = text.length;
          let bestFit = 1;
          while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const part = text.substring(0, mid);
            const width = measureFn(part);
            if (width <= maxWidth) {
              bestFit = mid;
              low = mid + 1;
            } else {
              high = mid - 1;
            }
          }
          return bestFit;
        }
        if (!textNode._inlines || textNode._inlines.length === 0) {
          return null;
        }
        let line = new _Line.default(this.writer.context().availableWidth);
        const textInlines = new _TextInlines.default(null);
        let isForceContinue = false;
        while (textNode._inlines && textNode._inlines.length > 0 && (line.hasEnoughSpaceForInline(textNode._inlines[0], textNode._inlines.slice(1)) || isForceContinue)) {
          let isHardWrap = false;
          let inline = textNode._inlines.shift();
          if (!inline.noWrap && inline.text.length > 1 && inline.width > line.getAvailableWidth()) {
            let maxChars = findMaxFitLength(inline.text, line.getAvailableWidth(), (txt) => textInlines.widthOfText(txt, inline));
            if (maxChars < inline.text.length) {
              let newInline = cloneInline(inline);
              newInline.text = inline.text.substr(maxChars);
              inline.text = inline.text.substr(0, maxChars);
              newInline.width = textInlines.widthOfText(newInline.text, newInline);
              inline.width = textInlines.widthOfText(inline.text, inline);
              textNode._inlines.unshift(newInline);
              isHardWrap = true;
            }
          }
          line.addInline(inline);
          isForceContinue = inline.noNewLine && !isHardWrap;
        }
        line.lastLineInParagraph = textNode._inlines.length === 0;
        return line;
      }
      // images
      processImage(node) {
        let position = this.writer.addImage(node);
        node.positions.push(position);
      }
      processCanvas(node) {
        let positions = this.writer.addCanvas(node);
        addAll(node.positions, positions);
      }
      processSVG(node) {
        let position = this.writer.addSVG(node);
        node.positions.push(position);
      }
      processQr(node) {
        let position = this.writer.addQr(node);
        node.positions.push(position);
      }
      processAttachment(node) {
        let position = this.writer.addAttachment(node);
        node.positions.push(position);
      }
    };
    function decorateNode(node) {
      let x = node.x;
      let y = node.y;
      node.positions = [];
      if (Array.isArray(node.canvas)) {
        node.canvas.forEach((vector) => {
          let x2 = vector.x;
          let y2 = vector.y;
          let x1 = vector.x1;
          let y1 = vector.y1;
          let x22 = vector.x2;
          let y22 = vector.y2;
          vector.resetXY = () => {
            vector.x = x2;
            vector.y = y2;
            vector.x1 = x1;
            vector.y1 = y1;
            vector.x2 = x22;
            vector.y2 = y22;
          };
        });
      }
      node.resetXY = () => {
        node.x = x;
        node.y = y;
        if (Array.isArray(node.canvas)) {
          node.canvas.forEach((vector) => {
            vector.resetXY();
          });
        }
      };
    }
    var _default = exports.default = LayoutBuilder;
  }
});

export {
  require_LayoutBuilder
};
