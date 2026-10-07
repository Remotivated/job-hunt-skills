import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/tableLayouts.js
var require_tableLayouts = __commonJS({
  "node_modules/pdfmake/js/tableLayouts.js"(exports) {
    exports.__esModule = true;
    exports.tableLayouts = exports.defaultTableLayout = void 0;
    var tableLayouts = exports.tableLayouts = {
      noBorders: {
        hLineWidth(i) {
          return 0;
        },
        vLineWidth(i) {
          return 0;
        },
        paddingLeft(i) {
          return i && 4 || 0;
        },
        paddingRight(i, node) {
          return i < node.table.widths.length - 1 ? 4 : 0;
        }
      },
      headerLineOnly: {
        hLineWidth(i, node) {
          if (i === 0 || i === node.table.body.length) {
            return 0;
          }
          return i === node.table.headerRows ? 2 : 0;
        },
        vLineWidth(i) {
          return 0;
        },
        paddingLeft(i) {
          return i === 0 ? 0 : 8;
        },
        paddingRight(i, node) {
          return i === node.table.widths.length - 1 ? 0 : 8;
        }
      },
      lightHorizontalLines: {
        hLineWidth(i, node) {
          if (i === 0 || i === node.table.body.length) {
            return 0;
          }
          return i === node.table.headerRows ? 2 : 1;
        },
        vLineWidth(i) {
          return 0;
        },
        hLineColor(i) {
          return i === 1 ? "black" : "#aaa";
        },
        paddingLeft(i) {
          return i === 0 ? 0 : 8;
        },
        paddingRight(i, node) {
          return i === node.table.widths.length - 1 ? 0 : 8;
        }
      }
    };
    var defaultTableLayout = exports.defaultTableLayout = {
      hLineWidth(i, node) {
        return 1;
      },
      vLineWidth(i, node) {
        return 1;
      },
      hLineColor(i, node) {
        return "black";
      },
      vLineColor(i, node) {
        return "black";
      },
      hLineStyle(i, node) {
        return null;
      },
      vLineStyle(i, node) {
        return null;
      },
      paddingLeft(i, node) {
        return 4;
      },
      paddingRight(i, node) {
        return 4;
      },
      paddingTop(i, node) {
        return 2;
      },
      paddingBottom(i, node) {
        return 2;
      },
      fillColor(i, node) {
        return null;
      },
      fillOpacity(i, node) {
        return 1;
      },
      defaultBorder: true
    };
  }
});

export {
  require_tableLayouts
};
