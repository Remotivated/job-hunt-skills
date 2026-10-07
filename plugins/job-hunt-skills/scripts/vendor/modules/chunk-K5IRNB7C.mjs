import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __commonJS
} from "./chunk-FDWSCWK2.mjs";

// node_modules/pdfmake/js/URLResolver.js
var require_URLResolver = __commonJS({
  "node_modules/pdfmake/js/URLResolver.js"(exports) {
    exports.__esModule = true;
    exports.default = void 0;
    var MAX_REDIRECTS = 30;
    async function fetchUrl(url, headers = {}, urlAccessPolicy) {
      for (let i = 0; i <= MAX_REDIRECTS; i++) {
        if (typeof urlAccessPolicy !== "undefined" && urlAccessPolicy(url) !== true) {
          throw new Error("Access to URL denied by resource access policy: ".concat(url));
        }
        try {
          let response = await fetch(url, {
            headers,
            redirect: "manual"
          });
          if (response.status >= 300 && response.status < 400) {
            let location = response.headers.get("location");
            if (!location) {
              throw new Error("Redirect response missing Location header");
            }
            url = new URL(location, url).href;
            continue;
          }
          if (response.type === "opaqueredirect") {
            response = await fetch(url, {
              headers
            });
          }
          if (!response.ok) {
            throw new Error("Failed to fetch (status code: ".concat(response.status, ")"));
          }
          return response;
        } catch (error) {
          throw new Error('Network request failed (url: "'.concat(url, '", error: ').concat(error.message, ")"), {
            cause: error
          });
        }
      }
      throw new Error('Network request failed (url: "'.concat(url, '", error: Too many redirects)'));
    }
    var URLResolver = class {
      constructor(fs) {
        this.fs = fs;
        this.resolving = {};
        this.urlAccessPolicy = void 0;
      }
      /**
       * @param {(url: string) => boolean} callback
       */
      setUrlAccessPolicy(callback) {
        this.urlAccessPolicy = callback;
      }
      resolve(url, headers = {}) {
        const resolveUrlInternal = async () => {
          if (url.toLowerCase().startsWith("https://") || url.toLowerCase().startsWith("http://")) {
            if (this.fs.existsSync(url)) {
              return;
            }
            const response = await fetchUrl(url, headers, this.urlAccessPolicy);
            if (response.redirected) {
              if (typeof this.urlAccessPolicy !== "undefined" && this.urlAccessPolicy(response.url) !== true) {
                throw new Error("Access to URL denied by resource access policy: ".concat(response.url));
              }
            }
            const buffer = await response.arrayBuffer();
            this.fs.writeFileSync(url, buffer);
          }
        };
        if (!this.resolving[url]) {
          this.resolving[url] = resolveUrlInternal();
        }
        return this.resolving[url];
      }
      resolved() {
        return Promise.all(Object.values(this.resolving));
      }
    };
    var _default = exports.default = URLResolver;
  }
});

export {
  require_URLResolver
};
