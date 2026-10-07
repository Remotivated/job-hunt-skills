import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  require_pdfkit
} from "./chunk-3C72HI3A.mjs";
import {
  require_variableType
} from "./chunk-WLP4UAZF.mjs";
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/PDFDocument.js
var require_PDFDocument = __commonJS({
  "node_modules/pdfmake/js/PDFDocument.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var _pdfkit = _interopRequireDefault(require_pdfkit());
    var _variableType = require_variableType();
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var typeName = (bold, italics) => {
      let type = "normal";
      if (bold && italics) {
        type = "bolditalics";
      } else if (bold) {
        type = "bold";
      } else if (italics) {
        type = "italics";
      }
      return type;
    };
    var PDFDocument = class extends _pdfkit.default {
      constructor(fonts = {}, images = {}, patterns = {}, attachments = {}, options = {}, virtualfs = null, localAccessPolicy = void 0) {
        super(options);
        this.fonts = {};
        this.fontCache = {};
        for (let font in fonts) {
          if (fonts.hasOwnProperty(font)) {
            let fontDef = fonts[font];
            this.fonts[font] = {
              normal: fontDef.normal,
              bold: fontDef.bold,
              italics: fontDef.italics,
              bolditalics: fontDef.bolditalics
            };
          }
        }
        this.patterns = {};
        for (let pattern in patterns) {
          if (patterns.hasOwnProperty(pattern)) {
            let patternDef = patterns[pattern];
            this.patterns[pattern] = this.pattern(patternDef.boundingBox, patternDef.xStep, patternDef.yStep, patternDef.pattern, patternDef.colored);
          }
        }
        this.images = images;
        this.attachments = attachments;
        this.virtualfs = virtualfs;
        this.localAccessPolicy = localAccessPolicy;
      }
      getFontType(bold, italics) {
        return typeName(bold, italics);
      }
      getFontFile(familyName, bold, italics) {
        let type = this.getFontType(bold, italics);
        if (!this.fonts[familyName] || !this.fonts[familyName][type]) {
          return null;
        }
        return this.fonts[familyName][type];
      }
      provideFont(familyName, bold, italics) {
        let type = this.getFontType(bold, italics);
        if (this.getFontFile(familyName, bold, italics) === null) {
          throw new Error("Font '".concat(familyName, "' in style '").concat(type, "' is not defined in the font section of the document definition."));
        }
        this.fontCache[familyName] = this.fontCache[familyName] || {};
        if (!this.fontCache[familyName][type]) {
          let def = this.fonts[familyName][type];
          if (!Array.isArray(def)) {
            def = [def];
          }
          if (this.virtualfs && this.virtualfs.existsSync(def[0])) {
            def[0] = this.virtualfs.readFileSync(def[0]);
          } else {
            this.validateLocalFile(def[0]);
          }
          this.fontCache[familyName][type] = this.font(...def)._font;
        }
        return this.fontCache[familyName][type];
      }
      provideImage(src) {
        const realImageSrc = (src2) => {
          let image2 = this.images[src2];
          if (!image2) {
            return src2;
          }
          if (this.virtualfs && this.virtualfs.existsSync(image2)) {
            return this.virtualfs.readFileSync(image2);
          }
          let index = image2.indexOf("base64,");
          if (index < 0) {
            return this.images[src2];
          }
          return Buffer.from(image2.substring(index + 7), "base64");
        };
        if (this._imageRegistry[src]) {
          return this._imageRegistry[src];
        }
        let image;
        let imageSrc = realImageSrc(src);
        this.validateLocalFile(imageSrc);
        try {
          image = this.openImage(imageSrc);
          if (!image) {
            throw new Error("No image");
          }
        } catch (error) {
          throw new Error("Invalid image: ".concat(error.toString(), "\nImages dictionary should contain dataURL entries (or local file paths in node.js)"), {
            cause: error
          });
        }
        image.embed(this);
        this._imageRegistry[src] = image;
        return image;
      }
      /**
       * @param {Array} color pdfmake format: [<pattern name>, <color>]
       * @returns {Array} pdfkit format: [<pattern object>, <color>]
       */
      providePattern(color) {
        if (Array.isArray(color) && color.length === 2) {
          return [this.patterns[color[0]], color[1]];
        }
        return null;
      }
      provideAttachment(src) {
        const checkRequired = (obj) => {
          if (!obj) {
            throw new Error("No attachment");
          }
          if (!obj.src) {
            throw new Error('The "src" key is required for attachments');
          }
          return obj;
        };
        if (typeof src === "object") {
          return checkRequired(src);
        }
        let attachment = checkRequired(this.attachments[src]);
        if (this.virtualfs && this.virtualfs.existsSync(attachment.src)) {
          return this.virtualfs.readFileSync(attachment.src);
        }
        this.validateLocalFile(attachment.src);
        return attachment;
      }
      resolveColor(color, defaultColor) {
        color = color || defaultColor;
        if (typeof this._normalizeColor === "function") {
          if ((0, _variableType.isString)(color) && this._normalizeColor(color) === null) {
            return defaultColor;
          }
        }
        return color;
      }
      setOpenActionAsPrint() {
        let printActionRef = this.ref({
          Type: "Action",
          S: "Named",
          N: "Print"
        });
        this._root.data.OpenAction = printActionRef;
        printActionRef.end();
      }
      file(src, options = {}) {
        this.validateLocalFile(src);
        return super.file(src, options);
      }
      validateLocalFile(path) {
        if (typeof this.localAccessPolicy === "undefined") {
          return;
        }
        if (!(0, _variableType.isString)(path)) {
          return;
        }
        if (/^data:/.test(path)) {
          return;
        }
        if (this.localAccessPolicy(path) !== true) {
          throw new Error("Access to local file denied by resource access policy: ".concat(path));
        }
      }
    };
    var _default = exports.default = PDFDocument;
  }
});

export {
  require_PDFDocument
};
