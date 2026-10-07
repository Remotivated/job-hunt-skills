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
  Struct
} from "./chunk-2FAS3ON4.mjs";
import {
  Pointer
} from "./chunk-ETHVAYUP.mjs";
import {
  Reserved
} from "./chunk-TSASLJV5.mjs";
import {
  StringT
} from "./chunk-CJLFWYXH.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  BufferT
} from "./chunk-FXNCBV2B.mjs";
import {
  int16,
  uint16,
  uint24,
  uint32,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  DecodeStream
} from "./chunk-32NVCR7Y.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/DFont.js
var DFontName, DFontData, Ref, Type, TypeList, DFontMap, DFontHeader, DFont;
var init_DFont = __esm({
  "node_modules/fontkit/src/DFont.js"() {
    init_restructure();
    init_TTFFont();
    DFontName = new StringT(uint8);
    DFontData = new Struct({
      len: uint32,
      buf: new BufferT("len")
    });
    Ref = new Struct({
      id: uint16,
      nameOffset: int16,
      attr: uint8,
      dataOffset: uint24,
      handle: uint32
    });
    Type = new Struct({
      name: new StringT(4),
      maxTypeIndex: uint16,
      refList: new Pointer(uint16, new ArrayT(Ref, (t) => t.maxTypeIndex + 1), { type: "parent" })
    });
    TypeList = new Struct({
      length: uint16,
      types: new ArrayT(Type, (t) => t.length + 1)
    });
    DFontMap = new Struct({
      reserved: new Reserved(uint8, 24),
      typeList: new Pointer(uint16, TypeList),
      nameListOffset: new Pointer(uint16, "void")
    });
    DFontHeader = new Struct({
      dataOffset: uint32,
      map: new Pointer(uint32, DFontMap),
      dataLength: uint32,
      mapLength: uint32
    });
    DFont = class {
      type = "DFont";
      static probe(buffer) {
        let stream = new DecodeStream(buffer);
        try {
          var header = DFontHeader.decode(stream);
        } catch (e) {
          return false;
        }
        for (let type of header.map.typeList.types) {
          if (type.name === "sfnt") {
            return true;
          }
        }
        return false;
      }
      constructor(stream) {
        this.stream = stream;
        this.header = DFontHeader.decode(this.stream);
        for (let type of this.header.map.typeList.types) {
          for (let ref of type.refList) {
            if (ref.nameOffset >= 0) {
              this.stream.pos = ref.nameOffset + this.header.map.nameListOffset;
              ref.name = DFontName.decode(this.stream);
            } else {
              ref.name = null;
            }
          }
          if (type.name === "sfnt") {
            this.sfnt = type;
          }
        }
      }
      getFont(name) {
        if (!this.sfnt) {
          return null;
        }
        for (let ref of this.sfnt.refList) {
          let pos = this.header.dataOffset + ref.dataOffset + 4;
          let stream = new DecodeStream(this.stream.buffer.slice(pos));
          let font = new TTFFont(stream);
          if (font.postscriptName === name || font.postscriptName instanceof Uint8Array && name instanceof Uint8Array && font.postscriptName.every((v, i) => name[i] === v)) {
            return font;
          }
        }
        return null;
      }
      get fonts() {
        let fonts = [];
        for (let ref of this.sfnt.refList) {
          let pos = this.header.dataOffset + ref.dataOffset + 4;
          let stream = new DecodeStream(this.stream.buffer.slice(pos));
          fonts.push(new TTFFont(stream));
        }
        return fonts;
      }
    };
  }
});

export {
  DFont,
  init_DFont
};
