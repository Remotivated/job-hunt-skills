import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/glyph/BBox.js
var BBox;
var init_BBox = __esm({
  "node_modules/fontkit/src/glyph/BBox.js"() {
    BBox = class _BBox {
      constructor(minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity) {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
      }
      /**
       * The width of the bounding box
       * @type {number}
       */
      get width() {
        return this.maxX - this.minX;
      }
      /**
       * The height of the bounding box
       * @type {number}
       */
      get height() {
        return this.maxY - this.minY;
      }
      addPoint(x, y) {
        if (Math.abs(x) !== Infinity) {
          if (x < this.minX) {
            this.minX = x;
          }
          if (x > this.maxX) {
            this.maxX = x;
          }
        }
        if (Math.abs(y) !== Infinity) {
          if (y < this.minY) {
            this.minY = y;
          }
          if (y > this.maxY) {
            this.maxY = y;
          }
        }
      }
      copy() {
        return new _BBox(this.minX, this.minY, this.maxX, this.maxY);
      }
    };
  }
});

export {
  BBox,
  init_BBox
};
