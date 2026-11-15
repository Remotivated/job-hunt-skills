import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  require_OutputDocument
} from "./chunk-EKH6KFFQ.mjs";
import {
  __commonJS,
  __require
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/OutputDocumentServer.js
var require_OutputDocumentServer = __commonJS({
  "node_modules/pdfmake/js/OutputDocumentServer.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var _OutputDocument = _interopRequireDefault(require_OutputDocument());
    var _fs = _interopRequireDefault(__require("fs"));
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var OutputDocumentServer = class extends _OutputDocument.default {
      /**
       * @param {string} filename
       * @returns {Promise}
       */
      async write(filename) {
        const stream = await this.getStream();
        const writeStream = _fs.default.createWriteStream(filename);
        const streamEnded = new Promise((resolve, reject) => {
          stream.on("end", resolve);
          stream.on("error", reject);
        });
        const writeClosed = new Promise((resolve, reject) => {
          writeStream.on("close", resolve);
          writeStream.on("error", reject);
        });
        stream.pipe(writeStream);
        stream.end();
        await Promise.all([streamEnded, writeClosed]);
      }
    };
    var _default = exports.default = OutputDocumentServer;
  }
});

export {
  require_OutputDocumentServer
};
