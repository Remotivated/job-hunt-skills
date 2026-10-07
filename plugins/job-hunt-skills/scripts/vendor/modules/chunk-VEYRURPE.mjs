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

// node_modules/pdfmake/js/helpers/node.js
var require_node = __commonJS({
  "node_modules/pdfmake/js/helpers/node.js"(exports) {
    exports.__esModule = true;
    exports.getNodeId = getNodeId;
    exports.getNodeMargin = getNodeMargin;
    exports.stringifyNode = stringifyNode;
    var _variableType = require_variableType();
    function fontStringify(key, val) {
      if (key === "font") {
        return "font";
      }
      return val;
    }
    function stringifyNode(node) {
      return JSON.stringify(node, fontStringify);
    }
    function getNodeId(node) {
      if (node.id) {
        return node.id;
      }
      if (Array.isArray(node.text)) {
        for (let n of node.text) {
          let nodeId = getNodeId(n);
          if (nodeId) {
            return nodeId;
          }
        }
      }
      return null;
    }
    function getNodeMargin(node, styleStack) {
      function processSingleMargins(node2, currentMargin, defaultMargin = 0) {
        if (node2.marginLeft !== void 0 || node2.marginTop !== void 0 || node2.marginRight !== void 0 || node2.marginBottom !== void 0) {
          return [node2.marginLeft ?? currentMargin[0] ?? defaultMargin, node2.marginTop ?? currentMargin[1] ?? defaultMargin, node2.marginRight ?? currentMargin[2] ?? defaultMargin, node2.marginBottom ?? currentMargin[3] ?? defaultMargin];
        }
        return currentMargin;
      }
      function flattenStyleArray(styleArray, styleStack2, visited = /* @__PURE__ */ new Set()) {
        styleArray = Array.isArray(styleArray) ? styleArray : [styleArray];
        if (!styleArray.every((item) => (0, _variableType.isString)(item))) {
          return {};
        }
        let flattenedStyles = {};
        for (let index = 0; index < styleArray.length; index++) {
          let styleName = styleArray[index];
          let style = styleStack2.styleDictionary[styleName];
          if (style === void 0) {
            continue;
          }
          if (visited.has(styleName)) {
            continue;
          }
          if (style.extends !== void 0) {
            flattenedStyles = {
              ...flattenedStyles,
              ...flattenStyleArray(style.extends, styleStack2, /* @__PURE__ */ new Set([...visited, styleName]))
            };
          }
          if (style.margin !== void 0) {
            flattenedStyles = {
              margin: convertMargin(style.margin)
            };
            continue;
          }
          flattenedStyles = {
            margin: processSingleMargins(style, flattenedStyles.margin ?? {}, void 0)
          };
        }
        return flattenedStyles;
      }
      function convertMargin(margin2) {
        if ((0, _variableType.isNumber)(margin2)) {
          margin2 = [margin2, margin2, margin2, margin2];
        } else if (Array.isArray(margin2)) {
          if (margin2.length === 2) {
            margin2 = [margin2[0], margin2[1], margin2[0], margin2[1]];
          }
        }
        return margin2;
      }
      let margin = [void 0, void 0, void 0, void 0];
      if (node.style) {
        let styleArray = Array.isArray(node.style) ? node.style : [node.style];
        let flattenedStyleArray = flattenStyleArray(styleArray, styleStack);
        if (flattenedStyleArray) {
          margin = processSingleMargins(flattenedStyleArray, margin);
        }
        if (flattenedStyleArray.margin) {
          margin = convertMargin(flattenedStyleArray.margin);
        }
      }
      margin = processSingleMargins(node, margin);
      if (node.margin !== void 0) {
        margin = convertMargin(node.margin);
      }
      if (margin[0] === void 0 && margin[1] === void 0 && margin[2] === void 0 && margin[3] === void 0) {
        return null;
      }
      return margin;
    }
  }
});

export {
  require_node
};
