import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/helpers/variableType.js
var require_variableType = __commonJS({
  "node_modules/pdfmake/js/helpers/variableType.js"(exports) {
    exports.__esModule = true;
    exports.isEmptyObject = isEmptyObject;
    exports.isNumber = isNumber;
    exports.isObject = isObject;
    exports.isPositiveInteger = isPositiveInteger;
    exports.isString = isString;
    exports.isValue = isValue;
    function isString(variable) {
      return typeof variable === "string" || variable instanceof String;
    }
    function isNumber(variable) {
      return (typeof variable === "number" || variable instanceof Number) && !Number.isNaN(variable);
    }
    function isPositiveInteger(variable) {
      if (!isNumber(variable) || !Number.isInteger(variable) || variable <= 0) {
        return false;
      }
      return true;
    }
    function isObject(variable) {
      return variable !== null && !Array.isArray(variable) && !isString(variable) && !isNumber(variable) && typeof variable === "object";
    }
    function isEmptyObject(variable) {
      return isObject(variable) && Object.keys(variable).length === 0;
    }
    function isValue(variable) {
      return variable !== void 0 && variable !== null;
    }
  }
});

export {
  require_variableType
};
