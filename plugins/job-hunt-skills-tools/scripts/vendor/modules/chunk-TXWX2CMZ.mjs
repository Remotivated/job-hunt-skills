import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  Base,
  init_Base
} from "./chunk-FIR6EFTM.mjs";
import {
  DecodeStream,
  init_DecodeStream
} from "./chunk-32NVCR7Y.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/restructure/src/Number.js
var NumberT, uint8, uint16be, uint16, uint16le, uint24be, uint24, uint24le, uint32be, uint32, uint32le, int8, int16be, int16, int16le, int24be, int24, int24le, int32be, int32, int32le, floatbe, float, floatle, doublebe, double, doublele, Fixed, fixed16be, fixed16, fixed16le, fixed32be, fixed32, fixed32le;
var init_Number = __esm({
  "node_modules/restructure/src/Number.js"() {
    init_DecodeStream();
    init_Base();
    NumberT = class extends Base {
      constructor(type, endian = "BE") {
        super();
        this.type = type;
        this.endian = endian;
        this.fn = this.type;
        if (this.type[this.type.length - 1] !== "8") {
          this.fn += this.endian;
        }
      }
      size() {
        return DecodeStream.TYPES[this.type];
      }
      decode(stream) {
        return stream["read".concat(this.fn)]();
      }
      encode(stream, val) {
        return stream["write".concat(this.fn)](val);
      }
    };
    uint8 = new NumberT("UInt8");
    uint16be = new NumberT("UInt16", "BE");
    uint16 = uint16be;
    uint16le = new NumberT("UInt16", "LE");
    uint24be = new NumberT("UInt24", "BE");
    uint24 = uint24be;
    uint24le = new NumberT("UInt24", "LE");
    uint32be = new NumberT("UInt32", "BE");
    uint32 = uint32be;
    uint32le = new NumberT("UInt32", "LE");
    int8 = new NumberT("Int8");
    int16be = new NumberT("Int16", "BE");
    int16 = int16be;
    int16le = new NumberT("Int16", "LE");
    int24be = new NumberT("Int24", "BE");
    int24 = int24be;
    int24le = new NumberT("Int24", "LE");
    int32be = new NumberT("Int32", "BE");
    int32 = int32be;
    int32le = new NumberT("Int32", "LE");
    floatbe = new NumberT("Float", "BE");
    float = floatbe;
    floatle = new NumberT("Float", "LE");
    doublebe = new NumberT("Double", "BE");
    double = doublebe;
    doublele = new NumberT("Double", "LE");
    Fixed = class extends NumberT {
      constructor(size, endian, fracBits = size >> 1) {
        super("Int".concat(size), endian);
        this._point = 1 << fracBits;
      }
      decode(stream) {
        return super.decode(stream) / this._point;
      }
      encode(stream, val) {
        return super.encode(stream, val * this._point | 0);
      }
    };
    fixed16be = new Fixed(16, "BE");
    fixed16 = fixed16be;
    fixed16le = new Fixed(16, "LE");
    fixed32be = new Fixed(32, "BE");
    fixed32 = fixed32be;
    fixed32le = new Fixed(32, "LE");
  }
});

export {
  NumberT,
  uint8,
  uint16be,
  uint16,
  uint16le,
  uint24be,
  uint24,
  uint24le,
  uint32be,
  uint32,
  uint32le,
  int8,
  int16be,
  int16,
  int16le,
  int24be,
  int24,
  int24le,
  int32be,
  int32,
  int32le,
  floatbe,
  float,
  floatle,
  doublebe,
  double,
  doublele,
  Fixed,
  fixed16be,
  fixed16,
  fixed16le,
  fixed32be,
  fixed32,
  fixed32le,
  init_Number
};
