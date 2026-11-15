import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/virtual-fs.js
var require_virtual_fs = __commonJS({
  "node_modules/pdfmake/js/virtual-fs.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var normalizeFilename = (filename) => {
      if (filename.indexOf(__dirname) === 0) {
        filename = filename.substring(__dirname.length);
      }
      if (filename.indexOf("/") === 0) {
        filename = filename.substring(1);
      }
      return filename;
    };
    var VirtualFileSystem = class {
      constructor() {
        this.storage = {};
      }
      /**
       * @param {string} filename
       * @returns {boolean}
       */
      existsSync(filename) {
        const normalizedFilename = normalizeFilename(filename);
        return typeof this.storage[normalizedFilename] !== "undefined";
      }
      /**
       * @param {string} filename
       * @param {?string|?object} options
       * @returns {string|Buffer}
       */
      readFileSync(filename, options) {
        const normalizedFilename = normalizeFilename(filename);
        const encoding = typeof options === "object" ? options.encoding : options;
        if (!this.existsSync(normalizedFilename)) {
          throw new Error("File '".concat(normalizedFilename, "' not found in virtual file system"));
        }
        const buffer = this.storage[normalizedFilename];
        if (encoding) {
          return buffer.toString(encoding);
        }
        return buffer;
      }
      /**
       * @param {string} filename
       * @param {string|Buffer} content
       * @param {?string|?object} options
       */
      writeFileSync(filename, content, options) {
        const normalizedFilename = normalizeFilename(filename);
        const encoding = typeof options === "object" ? options.encoding : options;
        if (!content && !options) {
          throw new Error("No content");
        }
        this.storage[normalizedFilename] = encoding || typeof content === "string" ? new Buffer(content, encoding) : content;
      }
    };
    var _default = exports.default = new VirtualFileSystem();
  }
});

export {
  require_virtual_fs
};
