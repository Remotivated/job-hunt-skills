import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  TTFFont,
  init_TTFFont
} from "./chunk-UULUL7OE.mjs";
import {
  init_restructure
} from "./chunk-YFRH6662.mjs";
import {
  VersionedStruct
} from "./chunk-DCBC6YOO.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  DecodeStream
} from "./chunk-32NVCR7Y.mjs";
import {
  asciiDecoder,
  init_utils
} from "./chunk-YOYKROTC.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/TrueTypeCollection.js
var TTCHeader, TrueTypeCollection;
var init_TrueTypeCollection = __esm({
  "node_modules/fontkit/src/TrueTypeCollection.js"() {
    init_restructure();
    init_TTFFont();
    init_utils();
    TTCHeader = new VersionedStruct(uint32, {
      65536: {
        numFonts: uint32,
        offsets: new ArrayT(uint32, "numFonts")
      },
      131072: {
        numFonts: uint32,
        offsets: new ArrayT(uint32, "numFonts"),
        dsigTag: uint32,
        dsigLength: uint32,
        dsigOffset: uint32
      }
    });
    TrueTypeCollection = class {
      type = "TTC";
      static probe(buffer) {
        return asciiDecoder.decode(buffer.slice(0, 4)) === "ttcf";
      }
      constructor(stream) {
        this.stream = stream;
        if (stream.readString(4) !== "ttcf") {
          throw new Error("Not a TrueType collection");
        }
        this.header = TTCHeader.decode(stream);
      }
      getFont(name) {
        for (let offset of this.header.offsets) {
          let stream = new DecodeStream(this.stream.buffer);
          stream.pos = offset;
          let font = new TTFFont(stream);
          if (font.postscriptName === name || font.postscriptName instanceof Uint8Array && name instanceof Uint8Array && font.postscriptName.every((v, i) => name[i] === v)) {
            return font;
          }
        }
        return null;
      }
      get fonts() {
        let fonts = [];
        for (let offset of this.header.offsets) {
          let stream = new DecodeStream(this.stream.buffer);
          stream.pos = offset;
          fonts.push(new TTFFont(stream));
        }
        return fonts;
      }
    };
  }
});

export {
  TrueTypeCollection,
  init_TrueTypeCollection
};
