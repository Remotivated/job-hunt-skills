import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  require_variableType
} from "./chunk-WLP4UAZF.mjs";
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/StyleContextStack.js
var require_StyleContextStack = __commonJS({
  "node_modules/pdfmake/js/StyleContextStack.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var _variableType = require_variableType();
    var StyleContextStack = class _StyleContextStack {
      /**
       * @param {object} styleDictionary named styles dictionary
       * @param {object} defaultStyle optional default style definition
       */
      constructor(styleDictionary, defaultStyle = {}) {
        this.styleDictionary = styleDictionary;
        this.defaultStyle = defaultStyle;
        this.styleOverrides = [];
      }
      /**
       * Creates cloned version of current stack
       *
       * @returns {StyleContextStack} current stack snapshot
       */
      clone() {
        let stack = new _StyleContextStack(this.styleDictionary, this.defaultStyle);
        this.styleOverrides.forEach((item) => {
          stack.styleOverrides.push(item);
        });
        return stack;
      }
      /**
       * Pushes style-name or style-overrides-object onto the stack for future evaluation
       *
       * @param {string|object} styleNameOrOverride style-name (referring to styleDictionary) or
       *                                            a new dictionary defining overriding properties
       */
      push(styleNameOrOverride) {
        this.styleOverrides.push(styleNameOrOverride);
      }
      /**
       * Removes last style-name or style-overrides-object from the stack
       *
       * @param {number} howMany optional number of elements to be popped (if not specified,
       *                         one element will be removed from the stack)
       */
      pop(howMany = 1) {
        while (howMany-- > 0) {
          this.styleOverrides.pop();
        }
      }
      /**
       * Creates a set of named styles or/and a style-overrides-object based on the item,
       * pushes those elements onto the stack for future evaluation and returns the number
       * of elements pushed, so they can be easily popped then.
       *
       * @param {object} item - an object with optional style property and/or style overrides
       * @returns {number} the number of items pushed onto the stack
       */
      autopush(item) {
        if ((0, _variableType.isString)(item)) {
          return 0;
        }
        if (typeof item.section !== "undefined") {
          return 0;
        }
        let styleNames = [];
        if (item.style) {
          if (Array.isArray(item.style)) {
            styleNames = item.style;
          } else {
            styleNames = [item.style];
          }
        }
        for (let i = 0, l = styleNames.length; i < l; i++) {
          this.push(styleNames[i]);
        }
        this.push(item);
        return styleNames.length + 1;
      }
      /**
       * Automatically pushes elements onto the stack, using autopush based on item,
       * executes callback and then pops elements back. Returns value returned by callback
       *
       * @param {object} item - an object with optional style property and/or style overrides
       * @param {Function} callback to be called between autopush and pop
       * @returns {object} value returned by callback
       */
      auto(item, callback) {
        let pushedItems = this.autopush(item);
        let result = callback();
        if (pushedItems > 0) {
          this.pop(pushedItems);
        }
        return result;
      }
      /**
       * Evaluates stack and returns value of a named property
       *
       * @param {string} property - property name
       * @returns {?any} property value or null if not found
       */
      getProperty(property) {
        const getStylePropertyFromStyle = (styleName, property2, visited = /* @__PURE__ */ new Set()) => {
          if (visited.has(styleName)) {
            return void 0;
          }
          visited.add(styleName);
          const style = this.styleDictionary[styleName];
          if (!style) {
            return void 0;
          }
          if ((0, _variableType.isValue)(style[property2])) {
            return style[property2];
          }
          if (style.extends) {
            let parents = Array.isArray(style.extends) ? style.extends : [style.extends];
            for (let i = parents.length - 1; i >= 0; i--) {
              let value = getStylePropertyFromStyle(parents[i], property2, visited);
              if ((0, _variableType.isValue)(value)) {
                return value;
              }
            }
          }
          return void 0;
        };
        if (this.styleOverrides) {
          for (let i = this.styleOverrides.length - 1; i >= 0; i--) {
            let item = this.styleOverrides[i];
            if ((0, _variableType.isString)(item)) {
              let value = getStylePropertyFromStyle(item, property);
              if ((0, _variableType.isValue)(value)) {
                return value;
              }
            } else if ((0, _variableType.isValue)(item[property])) {
              return item[property];
            }
          }
        }
        return this.defaultStyle && this.defaultStyle[property];
      }
      /**
       * @param {object} item
       * @param {StyleContextStack} styleContextStack
       * @param {string} property
       * @param {any} defaultValue
       * @returns {any}
       */
      static getStyleProperty(item, styleContextStack, property, defaultValue) {
        let value;
        if ((0, _variableType.isValue)(item[property])) {
          return item[property];
        }
        if (!styleContextStack) {
          return defaultValue;
        }
        styleContextStack.auto(item, () => {
          value = styleContextStack.getProperty(property);
        });
        return (0, _variableType.isValue)(value) ? value : defaultValue;
      }
      /**
       * @param {object} source
       * @param {object} destination
       * @returns {object}
       */
      static copyStyle(source = {}, destination = {}) {
        for (let key in source) {
          if (key != "text" && source.hasOwnProperty(key)) {
            destination[key] = source[key];
          }
        }
        return destination;
      }
    };
    var _default = exports.default = StyleContextStack;
  }
});

export {
  require_StyleContextStack
};
