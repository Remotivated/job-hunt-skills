import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/helpers/tools.js
var require_tools = __commonJS({
  "node_modules/pdfmake/js/helpers/tools.js"(exports) {
    exports.__esModule = true;
    exports.convertToDynamicContent = convertToDynamicContent;
    exports.offsetVector = offsetVector;
    exports.pack = pack;
    function pack(...args) {
      let result = {};
      for (let i = 0, l = args.length; i < l; i++) {
        let obj = args[i];
        if (obj) {
          for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
              result[key] = obj[key];
            }
          }
        }
      }
      return result;
    }
    function offsetVector(vector, x, y) {
      switch (vector.type) {
        case "ellipse":
        case "rect":
          vector.x += x;
          vector.y += y;
          break;
        case "line":
          vector.x1 += x;
          vector.x2 += x;
          vector.y1 += y;
          vector.y2 += y;
          break;
        case "polyline":
          for (let i = 0, l = vector.points.length; i < l; i++) {
            vector.points[i].x += x;
            vector.points[i].y += y;
          }
          break;
      }
    }
    function convertToDynamicContent(staticContent) {
      return () => (
        // copy to new object
        JSON.parse(JSON.stringify(staticContent))
      );
    }
  }
});

export {
  require_tools
};
