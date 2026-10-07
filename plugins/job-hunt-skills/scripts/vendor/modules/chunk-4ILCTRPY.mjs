import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
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
  __commonJS,
  __require
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/ElementWriter.js
var require_ElementWriter = __commonJS({
  "node_modules/pdfmake/js/ElementWriter.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var _variableType = require_variableType();
    var _tools = require_tools();
    var _DocumentContext = _interopRequireDefault(require_DocumentContext());
    var _events = __require("events");
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var ElementWriter = class extends _events.EventEmitter {
      /**
       * @param {DocumentContext} context
       */
      constructor(context) {
        super();
        this._context = context;
        this.contextStack = [];
      }
      /**
       * @returns {DocumentContext}
       */
      context() {
        return this._context;
      }
      addLine(line, dontUpdateContextPosition, index) {
        let height = line.getHeight();
        let context = this.context();
        let page = context.getCurrentPage();
        let position = this.getCurrentPositionOnPage();
        if (context.availableHeight < height || !page) {
          return false;
        }
        line.x = context.x + (line.x || 0);
        line.y = context.y + (line.y || 0);
        this.alignLine(line);
        addPageItem(page, {
          type: "line",
          item: line
        }, index);
        this.emit("lineAdded", line);
        if (!dontUpdateContextPosition) {
          context.moveDown(height);
        }
        return position;
      }
      alignLine(line) {
        let width = this.context().availableWidth;
        let lineWidth = line.getWidth();
        let alignment = line.inlines && line.inlines.length > 0 && line.inlines[0].alignment;
        let offset = 0;
        switch (alignment) {
          case "right":
            offset = width - lineWidth;
            break;
          case "center":
            offset = (width - lineWidth) / 2;
            break;
        }
        if (offset) {
          line.x = (line.x || 0) + offset;
        }
        if (alignment === "justify" && !line.newLineForced && !line.lastLineInParagraph && line.inlines.length > 1) {
          let additionalSpacing = (width - lineWidth) / (line.inlines.length - 1);
          for (let i = 1, l = line.inlines.length; i < l; i++) {
            offset = i * additionalSpacing;
            line.inlines[i].x += offset;
            line.inlines[i].justifyShift = additionalSpacing;
          }
        }
      }
      addImage(image, index) {
        let context = this.context();
        let page = context.getCurrentPage();
        let position = this.getCurrentPositionOnPage();
        if (!page || image.absolutePosition === void 0 && context.availableHeight < image._height && page.items.length > 0) {
          return false;
        }
        if (image._x === void 0) {
          image._x = image.x || 0;
        }
        image.x = context.x + image._x;
        image.y = context.y;
        this.alignImage(image);
        addPageItem(page, {
          type: "image",
          item: image
        }, index);
        context.moveDown(image._height);
        return position;
      }
      addCanvas(node, index) {
        let context = this.context();
        let page = context.getCurrentPage();
        let positions = [];
        let height = node._minHeight;
        if (!page || node.absolutePosition === void 0 && context.availableHeight < height) {
          return false;
        }
        this.alignCanvas(node);
        node.canvas.forEach(function(vector) {
          let position = this.addVector(vector, false, false, index);
          positions.push(position);
          if (index !== void 0) {
            index++;
          }
        }, this);
        context.moveDown(height);
        return positions;
      }
      addSVG(image, index) {
        let context = this.context();
        let page = context.getCurrentPage();
        let position = this.getCurrentPositionOnPage();
        if (!page || image.absolutePosition === void 0 && context.availableHeight < image._height && page.items.length > 0) {
          return false;
        }
        if (image._x === void 0) {
          image._x = image.x || 0;
        }
        image.x = context.x + image._x;
        image.y = context.y;
        this.alignImage(image);
        addPageItem(page, {
          type: "svg",
          item: image
        }, index);
        context.moveDown(image._height);
        return position;
      }
      addQr(qr, index) {
        let context = this.context();
        let page = context.getCurrentPage();
        let position = this.getCurrentPositionOnPage();
        if (!page || qr.absolutePosition === void 0 && context.availableHeight < qr._height) {
          return false;
        }
        if (qr._x === void 0) {
          qr._x = qr.x || 0;
        }
        qr.x = context.x + qr._x;
        qr.y = context.y;
        this.alignImage(qr);
        for (let i = 0, l = qr._canvas.length; i < l; i++) {
          let vector = qr._canvas[i];
          vector.x += qr.x;
          vector.y += qr.y;
          this.addVector(vector, true, true, index);
        }
        context.moveDown(qr._height);
        return position;
      }
      addAttachment(attachment, index) {
        let context = this.context();
        let page = context.getCurrentPage();
        let position = this.getCurrentPositionOnPage();
        if (!page || attachment.absolutePosition === void 0 && context.availableHeight < attachment._height && page.items.length > 0) {
          return false;
        }
        if (attachment._x === void 0) {
          attachment._x = attachment.x || 0;
        }
        attachment.x = context.x + attachment._x;
        attachment.y = context.y;
        addPageItem(page, {
          type: "attachment",
          item: attachment
        }, index);
        context.moveDown(attachment._height);
        return position;
      }
      alignImage(image) {
        let width = this.context().availableWidth;
        let imageWidth = image._minWidth;
        let offset = 0;
        switch (image._alignment) {
          case "right":
            offset = width - imageWidth;
            break;
          case "center":
            offset = (width - imageWidth) / 2;
            break;
        }
        if (offset) {
          image.x = (image.x || 0) + offset;
        }
      }
      alignCanvas(node) {
        let width = this.context().availableWidth;
        let canvasWidth = node._minWidth;
        let offset = 0;
        switch (node._alignment) {
          case "right":
            offset = width - canvasWidth;
            break;
          case "center":
            offset = (width - canvasWidth) / 2;
            break;
        }
        if (offset) {
          node.canvas.forEach((vector) => {
            (0, _tools.offsetVector)(vector, offset, 0);
          });
        }
      }
      addVector(vector, ignoreContextX, ignoreContextY, index, forcePage) {
        let context = this.context();
        let page = context.getCurrentPage();
        if ((0, _variableType.isNumber)(forcePage)) {
          page = context.pages[forcePage];
        }
        let position = this.getCurrentPositionOnPage();
        if (page) {
          (0, _tools.offsetVector)(vector, ignoreContextX ? 0 : context.x, ignoreContextY ? 0 : context.y);
          addPageItem(page, {
            type: "vector",
            item: vector
          }, index);
          return position;
        }
      }
      beginClip(width, height) {
        let ctx = this.context();
        let page = ctx.getCurrentPage();
        page.items.push({
          type: "beginClip",
          item: {
            x: ctx.x,
            y: ctx.y,
            width,
            height
          }
        });
        return true;
      }
      endClip() {
        let ctx = this.context();
        let page = ctx.getCurrentPage();
        page.items.push({
          type: "endClip"
        });
        return true;
      }
      beginVerticalAlignment(verticalAlignment) {
        let page = this.context().getCurrentPage();
        let item = {
          type: "beginVerticalAlignment",
          item: {
            verticalAlignment
          }
        };
        page.items.push(item);
        return item;
      }
      endVerticalAlignment(verticalAlignment) {
        let page = this.context().getCurrentPage();
        let item = {
          type: "endVerticalAlignment",
          item: {
            verticalAlignment
          }
        };
        page.items.push(item);
        return item;
      }
      addFragment(block, useBlockXOffset, useBlockYOffset, dontUpdateContextPosition) {
        let ctx = this.context();
        let page = ctx.getCurrentPage();
        if (!useBlockXOffset && block.height > ctx.availableHeight) {
          return false;
        }
        block.items.forEach((item) => {
          switch (item.type) {
            case "line":
              var l = item.item.clone();
              if (l._node) {
                l._node.positions[0].pageNumber = ctx.page + 1;
              }
              l.x = (l.x || 0) + (useBlockXOffset ? block.xOffset || 0 : ctx.x);
              l.y = (l.y || 0) + (useBlockYOffset ? block.yOffset || 0 : ctx.y);
              page.items.push({
                type: "line",
                item: l
              });
              break;
            case "vector":
              var v = (0, _tools.pack)(item.item);
              (0, _tools.offsetVector)(v, useBlockXOffset ? block.xOffset || 0 : ctx.x, useBlockYOffset ? block.yOffset || 0 : ctx.y);
              if (v._isFillColorFromUnbreakable) {
                delete v._isFillColorFromUnbreakable;
                const endOfBackgroundItemsIndex = ctx.backgroundLength[ctx.page];
                page.items.splice(endOfBackgroundItemsIndex, 0, {
                  type: "vector",
                  item: v
                });
              } else {
                page.items.push({
                  type: "vector",
                  item: v
                });
              }
              break;
            case "image":
            case "svg":
            case "beginClip":
            case "endClip":
            case "beginVerticalAlignment":
            case "endVerticalAlignment":
              var img = (0, _tools.pack)(item.item);
              img.x = (img.x || 0) + (useBlockXOffset ? block.xOffset || 0 : ctx.x);
              img.y = (img.y || 0) + (useBlockYOffset ? block.yOffset || 0 : ctx.y);
              page.items.push({
                type: item.type,
                item: img
              });
              break;
          }
        });
        if (!dontUpdateContextPosition) {
          ctx.moveDown(block.height);
        }
        return true;
      }
      /**
       * Pushes the provided context onto the stack or creates a new one
       *
       * pushContext(context) - pushes the provided context and makes it current
       * pushContext(width, height) - creates and pushes a new context with the specified width and height
       * pushContext() - creates a new context for unbreakable blocks (with current availableWidth and full-page-height)
       *
       * @param {DocumentContext|number} contextOrWidth
       * @param {number} height
       */
      pushContext(contextOrWidth, height) {
        if (contextOrWidth === void 0) {
          height = this.context().getCurrentPage().height - this.context().pageMargins.top - this.context().pageMargins.bottom;
          contextOrWidth = this.context().availableWidth;
        }
        if ((0, _variableType.isNumber)(contextOrWidth)) {
          let width = contextOrWidth;
          contextOrWidth = new _DocumentContext.default();
          contextOrWidth.addPage({
            width,
            height
          }, {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          });
        }
        this.contextStack.push(this.context());
        this._context = contextOrWidth;
      }
      popContext() {
        this._context = this.contextStack.pop();
      }
      getCurrentPositionOnPage() {
        return (this.contextStack[0] || this.context()).getCurrentPosition();
      }
    };
    function addPageItem(page, item, index) {
      if (index === null || index === void 0 || index < 0 || index > page.items.length) {
        page.items.push(item);
      } else {
        page.items.splice(index, 0, item);
      }
    }
    var _default = exports.default = ElementWriter;
  }
});

export {
  require_ElementWriter
};
