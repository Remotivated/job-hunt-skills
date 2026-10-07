import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  init_utils,
  resolveLength
} from "./chunk-5AJOID3U.mjs";
import {
  NumberT,
  init_Number
} from "./chunk-TXWX2CMZ.mjs";
import {
  Base,
  init_Base
} from "./chunk-FIR6EFTM.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/restructure/src/String.js
function encodingWidth(encoding) {
  switch (encoding) {
    case "ascii":
    case "utf8":
      return 1;
    case "utf16le":
    case "utf16-le":
    case "utf-16be":
    case "utf-16le":
    case "utf16be":
    case "utf16-be":
    case "ucs2":
      return 2;
    default:
      return 1;
  }
}
function byteLength(string, encoding) {
  switch (encoding) {
    case "ascii":
      return string.length;
    case "utf8":
      let len = 0;
      for (let i = 0; i < string.length; i++) {
        let c = string.charCodeAt(i);
        if (c >= 55296 && c <= 56319 && i < string.length - 1) {
          let c2 = string.charCodeAt(++i);
          if ((c2 & 64512) === 56320) {
            c = ((c & 1023) << 10) + (c2 & 1023) + 65536;
          } else {
            i--;
          }
        }
        if ((c & 4294967168) === 0) {
          len++;
        } else if ((c & 4294965248) === 0) {
          len += 2;
        } else if ((c & 4294901760) === 0) {
          len += 3;
        } else if ((c & 4292870144) === 0) {
          len += 4;
        }
      }
      return len;
    case "utf16le":
    case "utf16-le":
    case "utf16be":
    case "utf16-be":
    case "ucs2":
      return string.length * 2;
    default:
      throw new Error("Unknown encoding " + encoding);
  }
}
var StringT;
var init_String = __esm({
  "node_modules/restructure/src/String.js"() {
    init_Base();
    init_Number();
    init_utils();
    StringT = class extends Base {
      constructor(length, encoding = "ascii") {
        super();
        this.length = length;
        this.encoding = encoding;
      }
      decode(stream, parent) {
        let length, pos;
        let { encoding } = this;
        if (typeof encoding === "function") {
          encoding = encoding.call(parent, parent) || "ascii";
        }
        let width = encodingWidth(encoding);
        if (this.length != null) {
          length = resolveLength(this.length, stream, parent);
        } else {
          let buffer;
          ({ buffer, length, pos } = stream);
          while (pos < length - width + 1 && (buffer[pos] !== 0 || width === 2 && buffer[pos + 1] !== 0)) {
            pos += width;
          }
          length = pos - stream.pos;
        }
        const string = stream.readString(length, encoding);
        if (this.length == null && stream.pos < stream.length) {
          stream.pos += width;
        }
        return string;
      }
      size(val, parent) {
        if (val === void 0 || val === null) {
          return resolveLength(this.length, null, parent);
        }
        let { encoding } = this;
        if (typeof encoding === "function") {
          encoding = encoding.call(parent != null ? parent.val : void 0, parent != null ? parent.val : void 0) || "ascii";
        }
        if (encoding === "utf16be") {
          encoding = "utf16le";
        }
        let size = byteLength(val, encoding);
        if (this.length instanceof NumberT) {
          size += this.length.size();
        }
        if (this.length == null) {
          size += encodingWidth(encoding);
        }
        return size;
      }
      encode(stream, val, parent) {
        let { encoding } = this;
        if (typeof encoding === "function") {
          encoding = encoding.call(parent != null ? parent.val : void 0, parent != null ? parent.val : void 0) || "ascii";
        }
        if (this.length instanceof NumberT) {
          this.length.encode(stream, byteLength(val, encoding));
        }
        stream.writeString(val, encoding);
        if (this.length == null) {
          return encodingWidth(encoding) == 2 ? stream.writeUInt16LE(0) : stream.writeUInt8(0);
        }
      }
    };
  }
});

export {
  StringT,
  init_String
};
