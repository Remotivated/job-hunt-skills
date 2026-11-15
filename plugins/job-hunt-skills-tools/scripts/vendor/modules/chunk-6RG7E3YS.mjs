import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  require_TextBreaker
} from "./chunk-MOSTJ2SC.mjs";
import {
  require_StyleContextStack
} from "./chunk-HC5FQQCL.mjs";
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/TextInlines.js
var require_TextInlines = __commonJS({
  "node_modules/pdfmake/js/TextInlines.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var _TextBreaker = _interopRequireDefault(require_TextBreaker());
    var _StyleContextStack = _interopRequireDefault(require_StyleContextStack());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var LEADING = /^(\s)+/g;
    var TRAILING = /(\s)+$/g;
    var flattenTextArray = (array) => {
      function flatten(array2) {
        return array2.reduce((prev, cur) => {
          let current = Array.isArray(cur.text) ? flatten(cur.text) : cur;
          let more = [].concat(current).some(Array.isArray);
          return prev.concat(more ? flatten(current) : current);
        }, []);
      }
      if (!Array.isArray(array)) {
        array = [array];
      }
      array = flatten(array);
      return array;
    };
    var TextInlines = class {
      /**
       * @param {object} pdfDocument object is instance of PDFDocument
       */
      constructor(pdfDocument) {
        this.pdfDocument = pdfDocument;
      }
      /**
       * Converts an array of strings (or inline-definition-objects) into a collection
       * of inlines and calculated minWidth/maxWidth and their min/max widths
       *
       * @param {Array|object} textArray an array of inline-definition-objects (or strings)
       * @param {StyleContextStack} styleContextStack current style stack
       * @returns {object} collection of inlines, minWidth, maxWidth
       */
      buildInlines(textArray, styleContextStack) {
        const getTrimmedWidth = (item) => {
          return Math.max(0, item.width - item.leadingCut - item.trailingCut);
        };
        let minWidth = 0;
        let maxWidth = 0;
        let currentLineWidth;
        let flattenedTextArray = flattenTextArray(textArray);
        const textBreaker = new _TextBreaker.default();
        let brokenText = textBreaker.getBreaks(flattenedTextArray, styleContextStack);
        let measuredText = this.measure(brokenText, styleContextStack);
        measuredText.forEach((inline) => {
          minWidth = Math.max(minWidth, getTrimmedWidth(inline));
          if (!currentLineWidth) {
            currentLineWidth = {
              width: 0,
              leadingCut: inline.leadingCut,
              trailingCut: 0
            };
          }
          currentLineWidth.width += inline.width;
          currentLineWidth.trailingCut = inline.trailingCut;
          maxWidth = Math.max(maxWidth, getTrimmedWidth(currentLineWidth));
          if (inline.lineEnd) {
            currentLineWidth = null;
          }
        });
        if (_StyleContextStack.default.getStyleProperty({}, styleContextStack, "noWrap", false)) {
          minWidth = maxWidth;
        }
        return {
          items: measuredText,
          minWidth,
          maxWidth
        };
      }
      measure(array, styleContextStack) {
        if (array.length) {
          let leadingIndent = _StyleContextStack.default.getStyleProperty(array[0], styleContextStack, "leadingIndent", 0);
          if (leadingIndent) {
            array[0].leadingCut = -leadingIndent;
            array[0].leadingIndent = leadingIndent;
          }
        }
        array.forEach((item) => {
          let font = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "font", "Roboto");
          let bold = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "bold", false);
          let italics = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "italics", false);
          item.font = this.pdfDocument.provideFont(font, bold, italics);
          item.alignment = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "alignment", "left");
          item.fontSize = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "fontSize", 12);
          item.fontFeatures = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "fontFeatures", null);
          item.characterSpacing = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "characterSpacing", 0);
          item.color = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "color", "black");
          item.decoration = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "decoration", null);
          item.decorationColor = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "decorationColor", null);
          item.decorationStyle = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "decorationStyle", null);
          item.decorationThickness = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "decorationThickness", null);
          item.background = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "background", null);
          item.link = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "link", null);
          item.linkToPage = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "linkToPage", null);
          item.linkToDestination = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "linkToDestination", null);
          item.noWrap = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "noWrap", null);
          item.opacity = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "opacity", 1);
          item.sup = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "sup", false);
          item.sub = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "sub", false);
          if (item.sup || item.sub) {
            item.fontSize *= 0.58;
          }
          let lineHeight = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "lineHeight", 1);
          item.width = this.widthOfText(item.text, item);
          item.height = item.font.lineHeight(item.fontSize) * lineHeight;
          if (!item.leadingCut) {
            item.leadingCut = 0;
          }
          let preserveLeadingSpaces = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "preserveLeadingSpaces", false);
          if (!preserveLeadingSpaces) {
            let leadingSpaces = item.text.match(LEADING);
            if (leadingSpaces) {
              item.leadingCut += this.widthOfText(leadingSpaces[0], item);
            }
          }
          item.trailingCut = 0;
          let preserveTrailingSpaces = _StyleContextStack.default.getStyleProperty(item, styleContextStack, "preserveTrailingSpaces", false);
          if (!preserveTrailingSpaces) {
            let trailingSpaces = item.text.match(TRAILING);
            if (trailingSpaces) {
              item.trailingCut = this.widthOfText(trailingSpaces[0], item);
            }
          }
        }, this);
        return array;
      }
      /**
       * Width of text
       *
       * @param {string} text
       * @param {object} inline
       * @returns {number}
       */
      widthOfText(text, inline) {
        return inline.font.widthOfString(text, inline.fontSize, inline.fontFeatures) + (inline.characterSpacing || 0) * (text.length - 1);
      }
      /**
       * Returns size of the specified string (without breaking it) using the current style
       *
       * @param {string} text text to be measured
       * @param {object} styleContextStack current style stack
       * @returns {object} size of the specified string
       */
      sizeOfText(text, styleContextStack) {
        let fontName = _StyleContextStack.default.getStyleProperty({}, styleContextStack, "font", "Roboto");
        let fontSize = _StyleContextStack.default.getStyleProperty({}, styleContextStack, "fontSize", 12);
        let fontFeatures = _StyleContextStack.default.getStyleProperty({}, styleContextStack, "fontFeatures", null);
        let bold = _StyleContextStack.default.getStyleProperty({}, styleContextStack, "bold", false);
        let italics = _StyleContextStack.default.getStyleProperty({}, styleContextStack, "italics", false);
        let lineHeight = _StyleContextStack.default.getStyleProperty({}, styleContextStack, "lineHeight", 1);
        let characterSpacing = _StyleContextStack.default.getStyleProperty({}, styleContextStack, "characterSpacing", 0);
        let font = this.pdfDocument.provideFont(fontName, bold, italics);
        return {
          width: this.widthOfText(text, {
            font,
            fontSize,
            characterSpacing,
            fontFeatures
          }),
          height: font.lineHeight(fontSize) * lineHeight,
          fontSize,
          lineHeight,
          ascender: font.ascender / 1e3 * fontSize,
          descender: font.descender / 1e3 * fontSize
        };
      }
      /**
       * Returns size of the specified rotated string (without breaking it) using the current style
       *
       * @param {string} text text to be measured
       * @param {number} angle
       * @param {object} styleContextStack current style stack
       * @returns {object} size of the specified string
       */
      sizeOfRotatedText(text, angle, styleContextStack) {
        let angleRad = angle * Math.PI / -180;
        let size = this.sizeOfText(text, styleContextStack);
        return {
          width: Math.abs(size.height * Math.sin(angleRad)) + Math.abs(size.width * Math.cos(angleRad)),
          height: Math.abs(size.width * Math.sin(angleRad)) + Math.abs(size.height * Math.cos(angleRad))
        };
      }
    };
    var _default = exports.default = TextInlines;
  }
});

export {
  require_TextInlines
};
