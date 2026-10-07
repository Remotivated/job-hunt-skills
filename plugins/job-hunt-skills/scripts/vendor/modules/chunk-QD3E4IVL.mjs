import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  require_node
} from "./chunk-VEYRURPE.mjs";
import {
  require_variableType
} from "./chunk-WLP4UAZF.mjs";
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/DocPreprocessor.js
var require_DocPreprocessor = __commonJS({
  "node_modules/pdfmake/js/DocPreprocessor.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var _variableType = require_variableType();
    var _node = require_node();
    var convertValueToString = (value) => {
      if ((0, _variableType.isString)(value)) {
        return value.replace(/\t/g, "    ");
      } else if ((0, _variableType.isNumber)(value) || typeof value === "boolean") {
        return value.toString();
      } else if (!(0, _variableType.isValue)(value) || (0, _variableType.isEmptyObject)(value)) {
        return "";
      }
      return value;
    };
    var DocPreprocessor = class {
      preprocessDocument(docStructure) {
        this.parentNode = null;
        this.tocs = [];
        this.nodeReferences = [];
        return this.preprocessNode(docStructure, true);
      }
      preprocessBlock(node) {
        this.parentNode = null;
        this.tocs = [];
        this.nodeReferences = [];
        return this.preprocessNode(node);
      }
      preprocessNode(node, isSectionAllowed = false) {
        if (Array.isArray(node)) {
          node = {
            stack: node
          };
        } else if ((0, _variableType.isString)(node) || (0, _variableType.isNumber)(node) || typeof node === "boolean" || !(0, _variableType.isValue)(node) || (0, _variableType.isEmptyObject)(node)) {
          node = {
            text: convertValueToString(node)
          };
        } else if ("text" in node) {
          node.text = convertValueToString(node.text);
        }
        if (node.section) {
          if (!isSectionAllowed) {
            throw new Error("Incorrect document structure, section node is only allowed at the root level of document structure: ".concat((0, _node.stringifyNode)(node)));
          }
          return this.preprocessSection(node);
        } else if (node.columns) {
          return this.preprocessColumns(node);
        } else if (node.stack) {
          return this.preprocessVerticalContainer(node, isSectionAllowed);
        } else if (node.ul) {
          return this.preprocessList(node);
        } else if (node.ol) {
          return this.preprocessList(node);
        } else if (node.table) {
          return this.preprocessTable(node);
        } else if (node.text !== void 0) {
          return this.preprocessText(node);
        } else if (node.toc) {
          return this.preprocessToc(node);
        } else if (node.image) {
          return this.preprocessImage(node);
        } else if (node.svg) {
          return this.preprocessSVG(node);
        } else if (node.canvas) {
          return this.preprocessCanvas(node);
        } else if (node.qr) {
          return this.preprocessQr(node);
        } else if (node.attachment) {
          return this.preprocessAttachment(node);
        } else if (node.pageReference || node.textReference) {
          return this.preprocessText(node);
        } else {
          throw new Error("Unrecognized document structure: ".concat((0, _node.stringifyNode)(node)));
        }
      }
      preprocessSection(node) {
        node.section = this.preprocessNode(node.section);
        return node;
      }
      preprocessColumns(node) {
        let columns = node.columns;
        for (let i = 0, l = columns.length; i < l; i++) {
          columns[i] = this.preprocessNode(columns[i]);
        }
        return node;
      }
      preprocessVerticalContainer(node, isSectionAllowed) {
        let items = node.stack;
        for (let i = 0, l = items.length; i < l; i++) {
          items[i] = this.preprocessNode(items[i], isSectionAllowed);
        }
        return node;
      }
      preprocessList(node) {
        let items = node.ul || node.ol;
        for (let i = 0, l = items.length; i < l; i++) {
          items[i] = this.preprocessNode(items[i]);
        }
        return node;
      }
      preprocessTable(node) {
        let col;
        let row;
        let cols;
        let rows;
        for (col = 0, cols = node.table.body[0].length; col < cols; col++) {
          for (row = 0, rows = node.table.body.length; row < rows; row++) {
            let rowData = node.table.body[row];
            let data = rowData[col];
            if (data !== void 0) {
              if (data === null) {
                data = "";
              }
              if (!data._span) {
                rowData[col] = this.preprocessNode(data);
              }
            }
          }
        }
        return node;
      }
      preprocessText(node) {
        if (node.tocItem) {
          if (!Array.isArray(node.tocItem)) {
            node.tocItem = [node.tocItem];
          }
          for (let i = 0, l = node.tocItem.length; i < l; i++) {
            if (!(0, _variableType.isString)(node.tocItem[i])) {
              node.tocItem[i] = "_default_";
            }
            let tocItemId = node.tocItem[i];
            if (!this.tocs[tocItemId]) {
              this.tocs[tocItemId] = {
                toc: {
                  _items: [],
                  _pseudo: true
                }
              };
            }
            if (!node.id) {
              node.id = "toc-".concat(tocItemId, "-").concat(this.tocs[tocItemId].toc._items.length);
            }
            let tocItemRef = {
              _nodeRef: this._getNodeForNodeRef(node),
              _textNodeRef: node
            };
            this.tocs[tocItemId].toc._items.push(tocItemRef);
          }
        }
        if (node.id) {
          if (this.nodeReferences[node.id]) {
            if (!this.nodeReferences[node.id]._pseudo) {
              throw new Error("Node id '".concat(node.id, "' already exists"));
            }
            this.nodeReferences[node.id]._nodeRef = this._getNodeForNodeRef(node);
            this.nodeReferences[node.id]._textNodeRef = node;
            this.nodeReferences[node.id]._pseudo = false;
          } else {
            this.nodeReferences[node.id] = {
              _nodeRef: this._getNodeForNodeRef(node),
              _textNodeRef: node
            };
          }
        }
        if (node.pageReference) {
          if (!this.nodeReferences[node.pageReference]) {
            this.nodeReferences[node.pageReference] = {
              _nodeRef: {},
              _textNodeRef: {},
              _pseudo: true
            };
          }
          node.text = "00000";
          node.linkToDestination = node.pageReference;
          node._pageRef = this.nodeReferences[node.pageReference];
        }
        if (node.textReference) {
          if (!this.nodeReferences[node.textReference]) {
            this.nodeReferences[node.textReference] = {
              _nodeRef: {},
              _pseudo: true
            };
          }
          node.text = "";
          node.linkToDestination = node.textReference;
          node._textRef = this.nodeReferences[node.textReference];
        }
        if (node.text && node.text.text) {
          node.text = [this.preprocessNode(node.text)];
        } else if (Array.isArray(node.text)) {
          let isSetParentNode = false;
          if (this.parentNode === null) {
            this.parentNode = node;
            isSetParentNode = true;
          }
          for (let i = 0, l = node.text.length; i < l; i++) {
            node.text[i] = this.preprocessNode(node.text[i]);
          }
          if (isSetParentNode) {
            this.parentNode = null;
          }
        }
        return node;
      }
      preprocessToc(node) {
        if (!node.toc.id) {
          node.toc.id = "_default_";
        }
        node.toc.title = node.toc.title ? this.preprocessNode(node.toc.title) : null;
        node.toc._items = [];
        if (this.tocs[node.toc.id]) {
          if (!this.tocs[node.toc.id].toc._pseudo) {
            throw new Error("TOC '".concat(node.toc.id, "' already exists"));
          }
          node.toc._items = this.tocs[node.toc.id].toc._items;
        }
        this.tocs[node.toc.id] = node;
        return node;
      }
      preprocessImage(node) {
        if (node.image.type !== void 0 && node.image.data !== void 0 && node.image.type === "Buffer" && Array.isArray(node.image.data)) {
          node.image = Buffer.from(node.image.data);
        }
        return node;
      }
      preprocessCanvas(node) {
        return node;
      }
      preprocessSVG(node) {
        return node;
      }
      preprocessQr(node) {
        return node;
      }
      preprocessAttachment(node) {
        return node;
      }
      _getNodeForNodeRef(node) {
        if (this.parentNode) {
          return this.parentNode;
        }
        return node;
      }
    };
    var _default = exports.default = DocPreprocessor;
  }
});

export {
  require_DocPreprocessor
};
