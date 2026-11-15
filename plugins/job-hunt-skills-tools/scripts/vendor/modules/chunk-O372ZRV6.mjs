import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  DecodeStream,
  init_DecodeStream
} from "./chunk-32NVCR7Y.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/restructure/src/EncodeStream.js
function stringToUtf16(string, swap) {
  let buf = new Uint16Array(string.length);
  for (let i = 0; i < string.length; i++) {
    let code = string.charCodeAt(i);
    if (swap) {
      code = code >> 8 | (code & 255) << 8;
    }
    buf[i] = code;
  }
  return new Uint8Array(buf.buffer);
}
function stringToAscii(string) {
  let buf = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    buf[i] = string.charCodeAt(i);
  }
  return buf;
}
var textEncoder, isBigEndian, EncodeStream;
var init_EncodeStream = __esm({
  "node_modules/restructure/src/EncodeStream.js"() {
    init_DecodeStream();
    textEncoder = new TextEncoder();
    isBigEndian = new Uint8Array(new Uint16Array([4660]).buffer)[0] == 18;
    EncodeStream = class {
      constructor(buffer) {
        this.buffer = buffer;
        this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
        this.pos = 0;
      }
      writeBuffer(buffer) {
        this.buffer.set(buffer, this.pos);
        this.pos += buffer.length;
      }
      writeString(string, encoding = "ascii") {
        let buf;
        switch (encoding) {
          case "utf16le":
          case "utf16-le":
          case "ucs2":
            buf = stringToUtf16(string, isBigEndian);
            break;
          case "utf16be":
          case "utf16-be":
            buf = stringToUtf16(string, !isBigEndian);
            break;
          case "utf8":
            buf = textEncoder.encode(string);
            break;
          case "ascii":
            buf = stringToAscii(string);
            break;
          default:
            throw new Error("Unsupported encoding: ".concat(encoding));
        }
        this.writeBuffer(buf);
      }
      writeUInt24BE(val) {
        this.buffer[this.pos++] = val >>> 16 & 255;
        this.buffer[this.pos++] = val >>> 8 & 255;
        this.buffer[this.pos++] = val & 255;
      }
      writeUInt24LE(val) {
        this.buffer[this.pos++] = val & 255;
        this.buffer[this.pos++] = val >>> 8 & 255;
        this.buffer[this.pos++] = val >>> 16 & 255;
      }
      writeInt24BE(val) {
        if (val >= 0) {
          this.writeUInt24BE(val);
        } else {
          this.writeUInt24BE(val + 16777215 + 1);
        }
      }
      writeInt24LE(val) {
        if (val >= 0) {
          this.writeUInt24LE(val);
        } else {
          this.writeUInt24LE(val + 16777215 + 1);
        }
      }
      fill(val, length) {
        if (length < this.buffer.length) {
          this.buffer.fill(val, this.pos, this.pos + length);
          this.pos += length;
        } else {
          const buf = new Uint8Array(length);
          buf.fill(val);
          this.writeBuffer(buf);
        }
      }
    };
    for (let key of Object.getOwnPropertyNames(DataView.prototype)) {
      if (key.slice(0, 3) === "set") {
        let type = key.slice(3).replace("Ui", "UI");
        if (type === "Float32") {
          type = "Float";
        } else if (type === "Float64") {
          type = "Double";
        }
        let bytes = DecodeStream.TYPES[type];
        EncodeStream.prototype["write" + type + (bytes === 1 ? "" : "BE")] = function(value) {
          this.view[key](this.pos, value, false);
          this.pos += bytes;
        };
        if (bytes !== 1) {
          EncodeStream.prototype["write" + type + "LE"] = function(value) {
            this.view[key](this.pos, value, true);
            this.pos += bytes;
          };
        }
      }
    }
  }
});

export {
  EncodeStream,
  init_EncodeStream
};
