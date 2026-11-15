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
  __commonJS,
  __require
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/DocumentContext.js
var require_DocumentContext = __commonJS({
  "node_modules/pdfmake/js/DocumentContext.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var _variableType = require_variableType();
    var _events = __require("events");
    var DocumentContext = class extends _events.EventEmitter {
      constructor() {
        super();
        this.pages = [];
        this.pageMargins = void 0;
        this.x = void 0;
        this.availableWidth = void 0;
        this.availableHeight = void 0;
        this.page = -1;
        this.snapshots = [];
        this.backgroundLength = [];
      }
      beginColumnGroup(marginXTopParent, bottomByPage = {}, snakingColumns = false, columnGap = 0, columnWidths = null) {
        this.snapshots.push({
          x: this.x,
          y: this.y,
          availableHeight: this.availableHeight,
          availableWidth: this.availableWidth,
          page: this.page,
          bottomByPage: bottomByPage ? bottomByPage : {},
          bottomMost: {
            x: this.x,
            y: this.y,
            availableHeight: this.availableHeight,
            availableWidth: this.availableWidth,
            page: this.page
          },
          lastColumnWidth: this.lastColumnWidth,
          snakingColumns,
          gap: columnGap,
          columnWidths
        });
        this.lastColumnWidth = 0;
        if (marginXTopParent) {
          this.marginXTopParent = marginXTopParent;
        }
      }
      updateBottomByPage() {
        const lastSnapshot = this.snapshots[this.snapshots.length - 1];
        if (!lastSnapshot) {
          return;
        }
        const lastPage = this.page;
        let previousBottom = -Number.MIN_VALUE;
        if (lastSnapshot.bottomByPage && lastSnapshot.bottomByPage[lastPage]) {
          previousBottom = lastSnapshot.bottomByPage[lastPage];
        }
        if (lastSnapshot.bottomByPage) {
          lastSnapshot.bottomByPage[lastPage] = Math.max(previousBottom, this.y);
        }
      }
      resetMarginXTopParent() {
        this.marginXTopParent = null;
      }
      /**
       * Find the most recent (deepest) snaking column group snapshot.
       * @returns {object|null}
       */
      getSnakingSnapshot() {
        for (let i = this.snapshots.length - 1; i >= 0; i--) {
          if (this.snapshots[i].snakingColumns) {
            return this.snapshots[i];
          }
        }
        return null;
      }
      inSnakingColumns() {
        return !!this.getSnakingSnapshot();
      }
      /**
       * Check if we're inside a nested non-snaking column group (e.g., a table row)
       * within an outer snaking column group. This is used to prevent snaking-specific
       * breaks inside table cells — the table's own page break mechanism should handle
       * row breaks, and column breaks should happen between rows.
       * @returns {boolean}
       */
      isInNestedNonSnakingGroup() {
        for (let i = this.snapshots.length - 1; i >= 0; i--) {
          let snap = this.snapshots[i];
          if (snap.snakingColumns) {
            return false;
          }
          if (!snap.overflowed) {
            return true;
          }
        }
        return false;
      }
      beginColumn(width, offset, endingCell) {
        let saved = this.snapshots[this.snapshots.length - 1];
        if (saved && saved.overflowed) {
          for (let i = this.snapshots.length - 1; i >= 0; i--) {
            if (!this.snapshots[i].overflowed) {
              saved = this.snapshots[i];
              break;
            }
          }
        }
        this.calculateBottomMost(saved, endingCell);
        this.page = saved.page;
        this.x = this.x + this.lastColumnWidth + (offset || 0);
        this.y = saved.y;
        this.availableWidth = width;
        this.availableHeight = saved.availableHeight;
        this.lastColumnWidth = width;
      }
      calculateBottomMost(destContext, endingCell) {
        if (endingCell) {
          this.saveContextInEndingCell(endingCell);
        } else {
          destContext.bottomMost = bottomMostContext(this, destContext.bottomMost);
        }
      }
      markEnding(endingCell, originalXOffset, discountY) {
        this.page = endingCell._columnEndingContext.page;
        this.x = endingCell._columnEndingContext.x + originalXOffset;
        this.y = endingCell._columnEndingContext.y - discountY;
        this.availableWidth = endingCell._columnEndingContext.availableWidth;
        this.availableHeight = endingCell._columnEndingContext.availableHeight;
        this.lastColumnWidth = endingCell._columnEndingContext.lastColumnWidth;
      }
      saveContextInEndingCell(endingCell) {
        endingCell._columnEndingContext = {
          page: this.page,
          x: this.x,
          y: this.y,
          availableHeight: this.availableHeight,
          availableWidth: this.availableWidth,
          lastColumnWidth: this.lastColumnWidth
        };
      }
      completeColumnGroup(height, endingCell) {
        let saved = this.snapshots.pop();
        let maxBottomY = this.y;
        let maxBottomPage = this.page;
        let maxBottomAvailableHeight = this.availableHeight;
        let overflowed = saved.overflowed;
        while (saved && saved.overflowed) {
          let bm = bottomMostContext({
            page: maxBottomPage,
            y: maxBottomY,
            availableHeight: maxBottomAvailableHeight
          }, saved.bottomMost || {});
          maxBottomPage = bm.page;
          maxBottomY = bm.y;
          maxBottomAvailableHeight = bm.availableHeight;
          saved = this.snapshots.pop();
        }
        if (!saved) {
          return {};
        }
        if (overflowed) {
          if (maxBottomPage > saved.bottomMost.page || maxBottomPage === saved.bottomMost.page && maxBottomY > saved.bottomMost.y) {
            saved.bottomMost = {
              x: saved.x,
              y: maxBottomY,
              page: maxBottomPage,
              availableHeight: maxBottomAvailableHeight,
              availableWidth: saved.availableWidth
            };
          }
        }
        this.calculateBottomMost(saved, endingCell);
        this.x = saved.x;
        let y = saved.bottomMost.y;
        if (height) {
          if (saved.page === saved.bottomMost.page) {
            if (saved.y + height > y) {
              y = saved.y + height;
            }
          } else {
            y += height;
          }
        }
        this.y = y;
        this.page = saved.bottomMost.page;
        this.availableWidth = saved.availableWidth;
        this.availableHeight = saved.bottomMost.availableHeight;
        if (height) {
          this.availableHeight -= y - saved.bottomMost.y;
        }
        if (height && saved.bottomMost.y - saved.y < height) {
          this.height = height;
        } else {
          this.height = saved.bottomMost.y - saved.y;
        }
        this.lastColumnWidth = saved.lastColumnWidth;
        return saved.bottomByPage;
      }
      /**
       * Move to the next column in a column group (snaking columns).
       * Creates an overflowed snapshot to track that we've moved to the next column.
       * @returns {object} Position info for the new column
       */
      moveToNextColumn() {
        let prevY = this.y;
        let snakingSnapshot = this.getSnakingSnapshot();
        if (!snakingSnapshot) {
          return {
            prevY,
            y: this.y
          };
        }
        this.calculateBottomMost(snakingSnapshot, null);
        let overflowCount = 0;
        for (let i = this.snapshots.length - 1; i >= 0; i--) {
          if (this.snapshots[i].overflowed) {
            overflowCount++;
          } else {
            break;
          }
        }
        let currentColumnWidth = snakingSnapshot.columnWidths && snakingSnapshot.columnWidths[overflowCount] || this.lastColumnWidth || this.availableWidth;
        let nextColumnWidth = snakingSnapshot.columnWidths && snakingSnapshot.columnWidths[overflowCount + 1] || currentColumnWidth;
        this.lastColumnWidth = nextColumnWidth;
        let newX = this.x + (currentColumnWidth || 0) + (snakingSnapshot.gap || 0);
        let newY = snakingSnapshot.y;
        this.snapshots.push({
          x: newX,
          y: newY,
          availableHeight: snakingSnapshot.availableHeight,
          availableWidth: nextColumnWidth,
          page: this.page,
          overflowed: true,
          bottomMost: {
            x: newX,
            y: newY,
            availableHeight: snakingSnapshot.availableHeight,
            availableWidth: nextColumnWidth,
            page: this.page
          },
          lastColumnWidth: nextColumnWidth,
          snakingColumns: true,
          gap: snakingSnapshot.gap,
          columnWidths: snakingSnapshot.columnWidths
        });
        this.x = newX;
        this.y = newY;
        this.availableHeight = snakingSnapshot.availableHeight;
        this.availableWidth = nextColumnWidth;
        for (let i = this.snapshots.length - 2; i >= 0; i--) {
          let snapshot = this.snapshots[i];
          if (snapshot.overflowed || snapshot.snakingColumns) {
            break;
          }
          snapshot.x = newX;
          snapshot.y = newY;
          snapshot.page = this.page;
          snapshot.availableHeight = snakingSnapshot.availableHeight;
          if (snapshot.bottomMost) {
            snapshot.bottomMost.x = newX;
            snapshot.bottomMost.y = newY;
            snapshot.bottomMost.page = this.page;
            snapshot.bottomMost.availableHeight = snakingSnapshot.availableHeight;
          }
        }
        return {
          prevY,
          y: this.y
        };
      }
      /**
       * Reset snaking column state when moving to a new page.
       * Clears overflowed snapshots, resets X to left margin, sets width to first column,
       * and syncs all snapshots to new page coordinates.
       */
      resetSnakingColumnsForNewPage() {
        let snakingSnapshot = this.getSnakingSnapshot();
        if (!snakingSnapshot) {
          return;
        }
        let pageTopY = this.pageMargins.top;
        let pageInnerHeight = this.getCurrentPage().pageSize.height - this.pageMargins.top - this.pageMargins.bottom;
        let firstColumnWidth = snakingSnapshot.columnWidths ? snakingSnapshot.columnWidths[0] : this.lastColumnWidth || this.availableWidth;
        while (this.snapshots.length > 1 && this.snapshots[this.snapshots.length - 1].overflowed) {
          this.snapshots.pop();
        }
        if (this.marginXTopParent) {
          this.x = this.pageMargins.left + this.marginXTopParent[0];
        } else {
          this.x = this.pageMargins.left;
        }
        this.availableWidth = firstColumnWidth;
        this.lastColumnWidth = firstColumnWidth;
        for (let i = 0; i < this.snapshots.length; i++) {
          let snapshot = this.snapshots[i];
          let isSnakingSnapshot = !!snapshot.snakingColumns;
          snapshot.x = this.x;
          snapshot.y = isSnakingSnapshot ? pageTopY : this.y;
          snapshot.availableHeight = isSnakingSnapshot ? pageInnerHeight : this.availableHeight;
          snapshot.page = this.page;
          if (snapshot.bottomMost) {
            snapshot.bottomMost.x = this.x;
            snapshot.bottomMost.y = isSnakingSnapshot ? pageTopY : this.y;
            snapshot.bottomMost.availableHeight = isSnakingSnapshot ? pageInnerHeight : this.availableHeight;
            snapshot.bottomMost.page = this.page;
          }
        }
      }
      addMargin(left, right) {
        this.x += left;
        this.availableWidth -= left + (right || 0);
      }
      moveDown(offset) {
        this.y += offset;
        this.availableHeight -= offset;
        return this.availableHeight > 0;
      }
      initializePage() {
        this.y = this.pageMargins.top;
        this.availableHeight = this.getCurrentPage().pageSize.height - this.pageMargins.top - this.pageMargins.bottom;
        const {
          pageCtx,
          isSnapshot
        } = this.pageSnapshot();
        pageCtx.availableWidth = this.getCurrentPage().pageSize.width - this.pageMargins.left - this.pageMargins.right;
        if (isSnapshot && this.marginXTopParent) {
          pageCtx.availableWidth -= this.marginXTopParent[0];
          pageCtx.availableWidth -= this.marginXTopParent[1];
        }
      }
      pageSnapshot() {
        if (this.snapshots[0]) {
          return {
            pageCtx: this.snapshots[0],
            isSnapshot: true
          };
        } else {
          return {
            pageCtx: this,
            isSnapshot: false
          };
        }
      }
      moveTo(x, y) {
        if (x !== void 0 && x !== null) {
          this.x = x;
          this.availableWidth = this.getCurrentPage().pageSize.width - this.x - this.pageMargins.right;
        }
        if (y !== void 0 && y !== null) {
          this.y = y;
          this.availableHeight = this.getCurrentPage().pageSize.height - this.y - this.pageMargins.bottom;
        }
      }
      moveToRelative(x, y) {
        if (x !== void 0 && x !== null) {
          this.x = this.x + x;
        }
        if (y !== void 0 && y !== null) {
          this.y = this.y + y;
        }
      }
      beginDetachedBlock() {
        this.snapshots.push({
          x: this.x,
          y: this.y,
          availableHeight: this.availableHeight,
          availableWidth: this.availableWidth,
          page: this.page,
          lastColumnWidth: this.lastColumnWidth
        });
      }
      endDetachedBlock() {
        let saved = this.snapshots.pop();
        this.x = saved.x;
        this.y = saved.y;
        this.availableWidth = saved.availableWidth;
        this.availableHeight = saved.availableHeight;
        this.page = saved.page;
        this.lastColumnWidth = saved.lastColumnWidth;
      }
      moveToNextPage(pageOrientation2) {
        let nextPageIndex = this.page + 1;
        let prevPage = this.page;
        let prevY = this.y;
        if (this.snapshots.length > 0) {
          let lastSnapshot = this.snapshots[this.snapshots.length - 1];
          if (lastSnapshot.bottomMost && lastSnapshot.bottomMost.y) {
            prevY = Math.max(this.y, lastSnapshot.bottomMost.y);
          }
        }
        let createNewPage = nextPageIndex >= this.pages.length;
        if (createNewPage) {
          let currentAvailableWidth = this.availableWidth;
          let currentPageOrientation = this.getCurrentPage().pageSize.orientation;
          let pageSize = getPageSize(this.getCurrentPage(), pageOrientation2);
          this.addPage(pageSize, null, this.getCurrentPage().customProperties);
          if (currentPageOrientation === pageSize.orientation) {
            this.availableWidth = currentAvailableWidth;
          }
        } else {
          this.page = nextPageIndex;
          this.initializePage();
        }
        return {
          newPageCreated: createNewPage,
          prevPage,
          prevY,
          y: this.y
        };
      }
      addPage(pageSize, pageMargin = null, customProperties = {}) {
        if (pageMargin !== null) {
          this.pageMargins = pageMargin;
          this.x = pageMargin.left;
          this.availableWidth = pageSize.width - pageMargin.left - pageMargin.right;
        }
        let page = {
          items: [],
          pageSize,
          pageMargins: this.pageMargins,
          customProperties
        };
        this.pages.push(page);
        this.backgroundLength.push(0);
        this.page = this.pages.length - 1;
        this.initializePage();
        this.emit("pageAdded", page);
        return page;
      }
      getCurrentPage() {
        if (this.page < 0 || this.page >= this.pages.length) {
          return null;
        }
        return this.pages[this.page];
      }
      getCurrentPosition() {
        let pageSize = this.getCurrentPage().pageSize;
        let innerHeight = pageSize.height - this.pageMargins.top - this.pageMargins.bottom;
        let innerWidth = pageSize.width - this.pageMargins.left - this.pageMargins.right;
        return {
          pageNumber: this.page + 1,
          pageOrientation: pageSize.orientation,
          pageInnerHeight: innerHeight,
          pageInnerWidth: innerWidth,
          left: this.x,
          top: this.y,
          verticalRatio: (this.y - this.pageMargins.top) / innerHeight,
          horizontalRatio: (this.x - this.pageMargins.left) / innerWidth
        };
      }
    };
    function pageOrientation(pageOrientationString, currentPageOrientation) {
      if (pageOrientationString === void 0) {
        return currentPageOrientation;
      } else if ((0, _variableType.isString)(pageOrientationString) && pageOrientationString.toLowerCase() === "landscape") {
        return "landscape";
      } else {
        return "portrait";
      }
    }
    var getPageSize = (currentPage, newPageOrientation) => {
      newPageOrientation = pageOrientation(newPageOrientation, currentPage.pageSize.orientation);
      if (newPageOrientation !== currentPage.pageSize.orientation) {
        return {
          orientation: newPageOrientation,
          width: currentPage.pageSize.height,
          height: currentPage.pageSize.width
        };
      } else {
        return {
          orientation: currentPage.pageSize.orientation,
          width: currentPage.pageSize.width,
          height: currentPage.pageSize.height
        };
      }
    };
    function bottomMostContext(c1, c2) {
      let r;
      if (c1.page > c2.page) {
        r = c1;
      } else if (c2.page > c1.page) {
        r = c2;
      } else {
        r = c1.y > c2.y ? c1 : c2;
      }
      return {
        page: r.page,
        x: r.x,
        y: r.y,
        availableHeight: r.availableHeight,
        availableWidth: r.availableWidth
      };
    }
    var _default = exports.default = DocumentContext;
  }
});

export {
  require_DocumentContext
};
