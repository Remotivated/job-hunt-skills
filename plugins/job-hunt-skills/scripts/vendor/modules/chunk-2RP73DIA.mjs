import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  require_base
} from "./chunk-BFOML5MD.mjs";
import {
  require_OutputDocumentServer
} from "./chunk-6SSAVDBG.mjs";
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/index.js
var require_js = __commonJS({
  "node_modules/pdfmake/js/index.js"(exports, module) {
    var pdfmakeBase = require_base().default;
    var OutputDocumentServer = require_OutputDocumentServer().default;
    var pdfmake = class extends pdfmakeBase {
      constructor() {
        super();
      }
      /**
       * @param {(path: string) => boolean} callback
       */
      setLocalAccessPolicy(callback) {
        if (callback !== void 0 && typeof callback !== "function") {
          throw new Error("Parameter 'callback' has an invalid type. Function or undefined expected.");
        }
        this.localAccessPolicy = callback;
      }
      _transformToDocument(doc) {
        return new OutputDocumentServer(doc);
      }
    };
    module.exports = new pdfmake();
  }
});

export {
  require_js
};
