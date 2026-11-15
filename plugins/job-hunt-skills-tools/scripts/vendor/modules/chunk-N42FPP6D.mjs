import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __esm,
  __export
} from "./chunk-FDWSCWK2.mjs";

// scripts/vendor-stubs/url-resolver.mjs
var url_resolver_exports = {};
__export(url_resolver_exports, {
  default: () => URLResolver
});
var URLResolver;
var init_url_resolver = __esm({
  "scripts/vendor-stubs/url-resolver.mjs"() {
    URLResolver = class {
      setUrlAccessPolicy() {
      }
      resolve(url) {
        if (/^https?:\/\//i.test(String(url))) {
          return Promise.reject(new Error("Remote resources are not supported by the document exporter: ".concat(url)));
        }
        return Promise.resolve();
      }
      resolved() {
        return Promise.resolve();
      }
    };
  }
});

export {
  URLResolver,
  url_resolver_exports,
  init_url_resolver
};
