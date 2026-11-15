import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/decorators.js
function cache(target, key, descriptor) {
  if (descriptor.get) {
    let get = descriptor.get;
    descriptor.get = function() {
      let value = get.call(this);
      Object.defineProperty(this, key, { value });
      return value;
    };
  } else if (typeof descriptor.value === "function") {
    let fn = descriptor.value;
    return {
      get() {
        let cache2 = /* @__PURE__ */ new Map();
        function memoized(...args) {
          let key2 = args.length > 0 ? args[0] : "value";
          if (cache2.has(key2)) {
            return cache2.get(key2);
          }
          let result = fn.apply(this, args);
          cache2.set(key2, result);
          return result;
        }
        ;
        Object.defineProperty(this, key, { value: memoized });
        return memoized;
      }
    };
  }
}
var init_decorators = __esm({
  "node_modules/fontkit/src/decorators.js"() {
  }
});

export {
  cache,
  init_decorators
};
