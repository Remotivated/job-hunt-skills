import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  require_virtual_fs
} from "./chunk-KVGUF47D.mjs";
import {
  require_URLResolver
} from "./chunk-K5IRNB7C.mjs";
import {
  require_Printer
} from "./chunk-VSZ3OKNP.mjs";
import {
  require_tools
} from "./chunk-HGHQZUV7.mjs";
import {
  require_variableType
} from "./chunk-WLP4UAZF.mjs";
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/base.js
var require_base = __commonJS({
  "node_modules/pdfmake/js/base.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var _Printer = _interopRequireDefault(require_Printer());
    var _virtualFs = _interopRequireDefault(require_virtual_fs());
    var _tools = require_tools();
    var _variableType = require_variableType();
    var _URLResolver = _interopRequireDefault(require_URLResolver());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var pdfmake = class {
      constructor() {
        this.virtualfs = _virtualFs.default;
        this.urlAccessPolicy = void 0;
        this.localAccessPolicy = void 0;
      }
      /**
       * @param {object} docDefinition
       * @param {?object} options
       * @returns {object}
       */
      createPdf(docDefinition, options = {}) {
        if (!(0, _variableType.isObject)(docDefinition)) {
          throw new Error("Parameter 'docDefinition' has an invalid type. Object expected.");
        }
        if (!(0, _variableType.isObject)(options)) {
          throw new Error("Parameter 'options' has an invalid type. Object expected.");
        }
        options.progressCallback = this.progressCallback;
        options.tableLayouts = this.tableLayouts;
        const isServer = typeof process !== "undefined" && process?.versions?.node;
        if (typeof this.urlAccessPolicy === "undefined" && isServer) {
          console.warn("No URL access policy defined. Consider using setUrlAccessPolicy() to restrict external resource downloads.");
        }
        if (typeof this.localAccessPolicy === "undefined" && isServer) {
          console.warn("No local access policy defined. Consider using setLocalAccessPolicy() to restrict local file system access.");
        }
        let urlResolver = new _URLResolver.default(this.virtualfs);
        urlResolver.setUrlAccessPolicy(this.urlAccessPolicy);
        let printer = new _Printer.default(this.fonts, this.virtualfs, urlResolver, this.localAccessPolicy);
        const pdfDocumentPromise = printer.createPdfKitDocument(docDefinition, options);
        return this._transformToDocument(pdfDocumentPromise);
      }
      /**
       * @param {(url: string) => boolean} callback
       */
      setUrlAccessPolicy(callback) {
        if (callback !== void 0 && typeof callback !== "function") {
          throw new Error("Parameter 'callback' has an invalid type. Function or undefined expected.");
        }
        this.urlAccessPolicy = callback;
      }
      setProgressCallback(callback) {
        this.progressCallback = callback;
      }
      addTableLayouts(tableLayouts) {
        this.tableLayouts = (0, _tools.pack)(this.tableLayouts, tableLayouts);
      }
      setTableLayouts(tableLayouts) {
        this.tableLayouts = tableLayouts;
      }
      clearTableLayouts() {
        this.tableLayouts = {};
      }
      addFonts(fonts) {
        this.fonts = (0, _tools.pack)(this.fonts, fonts);
      }
      setFonts(fonts) {
        this.fonts = fonts;
      }
      clearFonts() {
        this.fonts = {};
      }
      _transformToDocument(doc) {
        return doc;
      }
    };
    var _default = exports.default = pdfmake;
  }
});

export {
  require_base
};
