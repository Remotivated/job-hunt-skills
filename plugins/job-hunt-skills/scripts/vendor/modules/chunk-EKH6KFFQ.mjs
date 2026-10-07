import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/OutputDocument.js
var require_OutputDocument = __commonJS({
  "node_modules/pdfmake/js/OutputDocument.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var OutputDocument = class {
      /**
       * @param {Promise<object>} pdfDocumentPromise
       */
      constructor(pdfDocumentPromise) {
        this.bufferSize = 1073741824;
        this.pdfDocumentPromise = pdfDocumentPromise;
        this.bufferPromise = null;
      }
      /**
       * @returns {Promise<object>}
       */
      getStream() {
        return this.pdfDocumentPromise;
      }
      /**
       * @returns {Promise<Buffer>}
       */
      getBuffer() {
        const getBufferInternal = async () => {
          const stream = await this.getStream();
          return new Promise((resolve) => {
            let chunks = [];
            stream.on("readable", () => {
              let chunk;
              while ((chunk = stream.read(this.bufferSize)) !== null) {
                chunks.push(chunk);
              }
            });
            stream.on("end", () => {
              resolve(Buffer.concat(chunks));
            });
            stream.end();
          });
        };
        if (this.bufferPromise === null) {
          this.bufferPromise = getBufferInternal();
        }
        return this.bufferPromise;
      }
      /**
       * @returns {Promise<string>}
       */
      async getBase64() {
        const buffer = await this.getBuffer();
        return buffer.toString("base64");
      }
      /**
       * @returns {Promise<string>}
       */
      async getDataUrl() {
        const data = await this.getBase64();
        return "data:application/pdf;base64," + data;
      }
    };
    var _default = exports.default = OutputDocument;
  }
});

export {
  require_OutputDocument
};
