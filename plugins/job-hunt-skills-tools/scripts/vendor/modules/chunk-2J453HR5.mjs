import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  require_standardPageSizes
} from "./chunk-4XWUM42K.mjs";
import {
  require_variableType
} from "./chunk-WLP4UAZF.mjs";
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/PageSize.js
var require_PageSize = __commonJS({
  "node_modules/pdfmake/js/PageSize.js"(exports) {
    exports.__esModule = true;
    exports.normalizePageMargin = normalizePageMargin;
    exports.normalizePageSize = normalizePageSize;
    var _standardPageSizes = _interopRequireDefault(require_standardPageSizes());
    var _variableType = require_variableType();
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function normalizePageSize(pageSize, pageOrientation) {
      function isNeedSwapPageSizes(pageOrientation2) {
        if ((0, _variableType.isString)(pageOrientation2)) {
          pageOrientation2 = pageOrientation2.toLowerCase();
          return pageOrientation2 === "portrait" && size.width > size.height || pageOrientation2 === "landscape" && size.width < size.height;
        }
        return false;
      }
      function pageSizeToWidthAndHeight(pageSize2) {
        if ((0, _variableType.isString)(pageSize2)) {
          let size2 = _standardPageSizes.default[pageSize2.toUpperCase()];
          if (!size2) {
            throw new Error("Page size ".concat(pageSize2, " not recognized"));
          }
          return {
            width: size2[0],
            height: size2[1]
          };
        }
        return pageSize2;
      }
      if (pageSize && pageSize.height === "auto") {
        pageSize.height = Infinity;
      }
      let size = pageSizeToWidthAndHeight(pageSize || "A4");
      if (isNeedSwapPageSizes(pageOrientation)) {
        size = {
          width: size.height,
          height: size.width
        };
      }
      size.orientation = size.width > size.height ? "landscape" : "portrait";
      return size;
    }
    function normalizePageMargin(margin) {
      if ((0, _variableType.isNumber)(margin)) {
        margin = {
          left: margin,
          right: margin,
          top: margin,
          bottom: margin
        };
      } else if (Array.isArray(margin)) {
        if (margin.length === 2) {
          margin = {
            left: margin[0],
            top: margin[1],
            right: margin[0],
            bottom: margin[1]
          };
        } else if (margin.length === 4) {
          margin = {
            left: margin[0],
            top: margin[1],
            right: margin[2],
            bottom: margin[3]
          };
        } else {
          throw new Error("Invalid pageMargins definition");
        }
      }
      return margin;
    }
  }
});

export {
  require_PageSize
};
