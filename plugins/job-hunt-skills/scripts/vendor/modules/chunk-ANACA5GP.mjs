import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  WOFFDirectory_default,
  init_WOFFDirectory
} from "./chunk-GHNXQI74.mjs";
import {
  TTFFont,
  init_TTFFont
} from "./chunk-UULUL7OE.mjs";
import {
  require_tiny_inflate
} from "./chunk-FOS76R7N.mjs";
import {
  init_restructure
} from "./chunk-YFRH6662.mjs";
import {
  DecodeStream
} from "./chunk-32NVCR7Y.mjs";
import {
  asciiDecoder,
  init_utils
} from "./chunk-YOYKROTC.mjs";
import {
  __esm,
  __toESM
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/WOFFFont.js
var import_tiny_inflate, WOFFFont;
var init_WOFFFont = __esm({
  "node_modules/fontkit/src/WOFFFont.js"() {
    init_TTFFont();
    init_WOFFDirectory();
    import_tiny_inflate = __toESM(require_tiny_inflate(), 1);
    init_restructure();
    init_utils();
    WOFFFont = class extends TTFFont {
      type = "WOFF";
      static probe(buffer) {
        return asciiDecoder.decode(buffer.slice(0, 4)) === "wOFF";
      }
      _decodeDirectory() {
        this.directory = WOFFDirectory_default.decode(this.stream, { _startOffset: 0 });
      }
      _getTableStream(tag) {
        let table = this.directory.tables[tag];
        if (table) {
          this.stream.pos = table.offset;
          if (table.compLength < table.length) {
            this.stream.pos += 2;
            let outBuffer = new Uint8Array(table.length);
            let buf = (0, import_tiny_inflate.default)(this.stream.readBuffer(table.compLength - 2), outBuffer);
            return new DecodeStream(buf);
          } else {
            return this.stream;
          }
        }
        return null;
      }
    };
  }
});

export {
  WOFFFont,
  init_WOFFFont
};
