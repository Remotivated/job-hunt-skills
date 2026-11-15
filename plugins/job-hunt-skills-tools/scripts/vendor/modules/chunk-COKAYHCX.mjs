import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  require_PageSize
} from "./chunk-2J453HR5.mjs";
import {
  require_ElementWriter
} from "./chunk-4ILCTRPY.mjs";
import {
  require_DocumentContext
} from "./chunk-VTFDEV2C.mjs";
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/PageElementWriter.js
var require_PageElementWriter = __commonJS({
  "node_modules/pdfmake/js/PageElementWriter.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var _ElementWriter = _interopRequireDefault(require_ElementWriter());
    var _PageSize = require_PageSize();
    var _DocumentContext = _interopRequireDefault(require_DocumentContext());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var PageElementWriter = class extends _ElementWriter.default {
      /**
       * @param {DocumentContext} context
       */
      constructor(context) {
        super(context);
        this.transactionLevel = 0;
        this.repeatables = [];
      }
      addLine(line, dontUpdateContextPosition, index) {
        return this._fitOnPage(() => super.addLine(line, dontUpdateContextPosition, index));
      }
      addImage(image, index) {
        return this._fitOnPage(() => super.addImage(image, index));
      }
      addCanvas(image, index) {
        return this._fitOnPage(() => super.addCanvas(image, index));
      }
      addSVG(image, index) {
        return this._fitOnPage(() => super.addSVG(image, index));
      }
      addQr(qr, index) {
        return this._fitOnPage(() => super.addQr(qr, index));
      }
      addAttachment(attachment, index) {
        return this._fitOnPage(() => super.addAttachment(attachment, index));
      }
      addVector(vector, ignoreContextX, ignoreContextY, index, forcePage) {
        return super.addVector(vector, ignoreContextX, ignoreContextY, index, forcePage);
      }
      beginClip(width, height) {
        return super.beginClip(width, height);
      }
      endClip() {
        return super.endClip();
      }
      beginVerticalAlignment(verticalAlignment) {
        return super.beginVerticalAlignment(verticalAlignment);
      }
      endVerticalAlignment(verticalAlignment) {
        return super.endVerticalAlignment(verticalAlignment);
      }
      addFragment(fragment, useBlockXOffset, useBlockYOffset, dontUpdateContextPosition) {
        return this._fitOnPage(() => super.addFragment(fragment, useBlockXOffset, useBlockYOffset, dontUpdateContextPosition));
      }
      moveToNextPage(pageOrientation) {
        let nextPage = this.context().moveToNextPage(pageOrientation);
        this.repeatables.forEach(function(rep) {
          if (rep.insertedOnPages[this.context().page] === void 0) {
            rep.insertedOnPages[this.context().page] = true;
            this.addFragment(rep, true);
          } else {
            this.context().moveDown(rep.height);
          }
        }, this);
        this.emit("pageChanged", {
          prevPage: nextPage.prevPage,
          prevY: nextPage.prevY,
          y: this.context().y
        });
      }
      addPage(pageSize, pageOrientation, pageMargin, customProperties = {}) {
        let prevPage = this.page;
        let prevY = this.y;
        this.context().addPage((0, _PageSize.normalizePageSize)(pageSize, pageOrientation), (0, _PageSize.normalizePageMargin)(pageMargin), customProperties);
        this.emit("pageChanged", {
          prevPage,
          prevY,
          y: this.context().y
        });
      }
      beginUnbreakableBlock(width, height) {
        if (this.transactionLevel++ === 0) {
          this.originalX = this.context().x;
          this.pushContext(width, height);
        }
      }
      commitUnbreakableBlock(forcedX, forcedY) {
        if (--this.transactionLevel === 0) {
          let unbreakableContext = this.context();
          this.popContext();
          let nbPages = unbreakableContext.pages.length;
          if (nbPages > 0) {
            let fragment = unbreakableContext.pages[0];
            fragment.xOffset = forcedX;
            fragment.yOffset = forcedY;
            if (nbPages > 1) {
              if (forcedX !== void 0 || forcedY !== void 0) {
                fragment.height = unbreakableContext.getCurrentPage().pageSize.height - unbreakableContext.pageMargins.top - unbreakableContext.pageMargins.bottom;
              } else {
                fragment.height = this.context().getCurrentPage().pageSize.height - this.context().pageMargins.top - this.context().pageMargins.bottom;
                for (let i = 0, l = this.repeatables.length; i < l; i++) {
                  fragment.height -= this.repeatables[i].height;
                }
              }
            } else {
              fragment.height = unbreakableContext.y;
            }
            if (forcedX !== void 0 || forcedY !== void 0) {
              super.addFragment(fragment, true, true, true);
            } else {
              this.addFragment(fragment);
            }
          }
        }
      }
      currentBlockToRepeatable() {
        let unbreakableContext = this.context();
        let rep = {
          items: []
        };
        unbreakableContext.pages[0].items.forEach((item) => {
          rep.items.push(item);
        });
        rep.xOffset = this.originalX;
        rep.height = unbreakableContext.y;
        rep.insertedOnPages = [];
        return rep;
      }
      pushToRepeatables(rep) {
        this.repeatables.push(rep);
      }
      popFromRepeatables() {
        this.repeatables.pop();
      }
      /**
       * Move to the next column in a column group (snaking columns).
       * Handles repeatables and emits columnChanged event.
       */
      moveToNextColumn() {
        let nextColumn = this.context().moveToNextColumn();
        this.repeatables.forEach(function(rep) {
          this.addFragment(rep, false);
        }, this);
        this.emit("columnChanged", {
          prevY: nextColumn.prevY,
          y: this.context().y
        });
      }
      /**
       * Check if currently in a column group that can move to next column.
       * Only returns true if snakingColumns is enabled for the column group.
       * @returns {boolean}
       */
      canMoveToNextColumn() {
        let ctx = this.context();
        let snakingSnapshot = ctx.getSnakingSnapshot();
        if (snakingSnapshot) {
          for (let i = ctx.snapshots.length - 1; i >= 0; i--) {
            let snap = ctx.snapshots[i];
            if (snap.snakingColumns) {
              break;
            }
            if (!snap.overflowed) {
              return false;
            }
          }
          let overflowCount = 0;
          for (let i = ctx.snapshots.length - 1; i >= 0; i--) {
            if (ctx.snapshots[i].overflowed) {
              overflowCount++;
            } else {
              break;
            }
          }
          if (snakingSnapshot.columnWidths && overflowCount >= snakingSnapshot.columnWidths.length - 1) {
            return false;
          }
          let currentColumnWidth = ctx.availableWidth || ctx.lastColumnWidth || 0;
          let nextColumnWidth = snakingSnapshot.columnWidths ? snakingSnapshot.columnWidths[overflowCount + 1] : currentColumnWidth;
          let nextX = ctx.x + currentColumnWidth + (snakingSnapshot.gap || 0);
          let page = ctx.getCurrentPage();
          let pageWidth = page.pageSize.width;
          let rightMargin = page.pageMargins ? page.pageMargins.right : 0;
          let parentRightMargin = ctx.marginXTopParent ? ctx.marginXTopParent[1] : 0;
          let rightBoundary = pageWidth - rightMargin - parentRightMargin;
          return nextX + nextColumnWidth <= rightBoundary + 1;
        }
        return false;
      }
      _fitOnPage(addFct) {
        let position = addFct();
        if (!position) {
          if (this.canMoveToNextColumn()) {
            this.moveToNextColumn();
            position = addFct();
          }
          if (!position) {
            let ctx = this.context();
            let snakingSnapshot = ctx.getSnakingSnapshot();
            if (snakingSnapshot) {
              if (ctx.isInNestedNonSnakingGroup()) {
                this.moveToNextPage();
              } else {
                this.moveToNextPage();
                let savedLastColumnWidth = ctx.lastColumnWidth;
                ctx.resetSnakingColumnsForNewPage();
                ctx.lastColumnWidth = savedLastColumnWidth;
              }
              position = addFct();
            } else {
              while (ctx.snapshots.length > 0 && ctx.snapshots[ctx.snapshots.length - 1].overflowed) {
                let popped = ctx.snapshots.pop();
                let prevSnapshot = ctx.snapshots[ctx.snapshots.length - 1];
                if (prevSnapshot) {
                  ctx.x = prevSnapshot.x;
                  ctx.y = prevSnapshot.y;
                  ctx.availableHeight = prevSnapshot.availableHeight;
                  ctx.availableWidth = popped.availableWidth;
                  ctx.lastColumnWidth = prevSnapshot.lastColumnWidth;
                }
              }
              this.moveToNextPage();
              position = addFct();
            }
          }
        }
        return position;
      }
    };
    var _default = exports.default = PageElementWriter;
  }
});

export {
  require_PageElementWriter
};
