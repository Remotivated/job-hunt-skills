import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  require_StyleContextStack
} from "./chunk-HC5FQQCL.mjs";
import {
  require_variableType
} from "./chunk-WLP4UAZF.mjs";
import {
  require_main
} from "./chunk-LTK5372D.mjs";
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/TextBreaker.js
var require_TextBreaker = __commonJS({
  "node_modules/pdfmake/js/TextBreaker.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var _linebreak = _interopRequireDefault(require_main());
    var _variableType = require_variableType();
    var _StyleContextStack = _interopRequireDefault(require_StyleContextStack());
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var splitWords = (text, noWrap, breakAll = false) => {
      let words = [];
      if (text === void 0 || text === null) {
        text = "";
      } else {
        text = String(text);
      }
      if (noWrap) {
        words.push({
          text
        });
        return words;
      }
      if (breakAll) {
        return text.split("").map((c) => {
          if (c.match(/^\n$|^\r$/)) {
            return {
              text: "",
              lineEnd: true
            };
          }
          return {
            text: c
          };
        });
      }
      if (text.length === 0) {
        words.push({
          text: ""
        });
        return words;
      }
      let breaker = new _linebreak.default(text);
      let last = 0;
      let bk;
      while (bk = breaker.nextBreak()) {
        let word = text.slice(last, bk.position);
        if (bk.required || word.match(/\r?\n$|\r$/)) {
          word = word.replace(/\r?\n$|\r$/, "");
          words.push({
            text: word,
            lineEnd: true
          });
        } else {
          words.push({
            text: word
          });
        }
        last = bk.position;
      }
      return words;
    };
    var getFirstWord = (words, noWrap) => {
      let word = words[0];
      if (word === void 0) {
        return null;
      }
      if (noWrap) {
        let tmpWords = splitWords(word.text, false);
        if (tmpWords[0] === void 0) {
          return null;
        }
        word = tmpWords[0];
      }
      return word.text;
    };
    var getLastWord = (words, noWrap) => {
      let word = words[words.length - 1];
      if (word === void 0) {
        return null;
      }
      if (word.lineEnd) {
        return null;
      }
      if (noWrap) {
        let tmpWords = splitWords(word.text, false);
        if (tmpWords[tmpWords.length - 1] === void 0) {
          return null;
        }
        word = tmpWords[tmpWords.length - 1];
      }
      return word.text;
    };
    var TextBreaker = class {
      /**
       * @param {string|Array} texts
       * @param {StyleContextStack} styleContextStack
       * @returns {Array}
       */
      getBreaks(texts, styleContextStack) {
        let results = [];
        if (!Array.isArray(texts)) {
          texts = [texts];
        }
        let lastWord = null;
        for (let i = 0, l = texts.length; i < l; i++) {
          let item = texts[i];
          let style = null;
          let words;
          let breakAll = _StyleContextStack.default.getStyleProperty(item || {}, styleContextStack, "wordBreak", "normal") === "break-all";
          let noWrap = _StyleContextStack.default.getStyleProperty(item || {}, styleContextStack, "noWrap", false);
          if ((0, _variableType.isObject)(item)) {
            if (item._textRef && item._textRef._textNodeRef.text) {
              item.text = item._textRef._textNodeRef.text;
            }
            words = splitWords(item.text, noWrap, breakAll);
            style = _StyleContextStack.default.copyStyle(item);
          } else {
            words = splitWords(item, noWrap, breakAll);
          }
          if (lastWord && words.length) {
            let firstWord = getFirstWord(words, noWrap);
            let wrapWords = splitWords(lastWord + firstWord, false);
            if (wrapWords.length === 1) {
              results[results.length - 1].noNewLine = true;
            }
          }
          for (let i2 = 0, l2 = words.length; i2 < l2; i2++) {
            let result = {
              text: words[i2].text
            };
            if (words[i2].lineEnd) {
              result.lineEnd = true;
            }
            _StyleContextStack.default.copyStyle(style, result);
            results.push(result);
          }
          lastWord = null;
          if (i + 1 < l) {
            lastWord = getLastWord(words, noWrap);
          }
        }
        return results;
      }
    };
    var _default = exports.default = TextBreaker;
  }
});

export {
  require_TextBreaker
};
