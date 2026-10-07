import { createRequire as __vendorCreateRequire } from "node:module";
import { fileURLToPath as __vendorFileURLToPath } from "node:url";
import { dirname as __vendorDirname } from "node:path";
const require = __vendorCreateRequire(import.meta.url);
const __filename = __vendorFileURLToPath(import.meta.url);
const __dirname = __vendorDirname(__filename);
import {
  init_restructure
} from "./chunk-YFRH6662.mjs";
import {
  VersionedStruct
} from "./chunk-DCBC6YOO.mjs";
import {
  Struct
} from "./chunk-2FAS3ON4.mjs";
import {
  Reserved
} from "./chunk-TSASLJV5.mjs";
import {
  ArrayT
} from "./chunk-KM4TAG6K.mjs";
import {
  BufferT
} from "./chunk-FXNCBV2B.mjs";
import {
  int8,
  uint16,
  uint32,
  uint8
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/EBDT.js
var BigMetrics, SmallMetrics, EBDTComponent, ByteAligned, BitAligned, glyph;
var init_EBDT = __esm({
  "node_modules/fontkit/src/tables/EBDT.js"() {
    init_restructure();
    BigMetrics = new Struct({
      height: uint8,
      width: uint8,
      horiBearingX: int8,
      horiBearingY: int8,
      horiAdvance: uint8,
      vertBearingX: int8,
      vertBearingY: int8,
      vertAdvance: uint8
    });
    SmallMetrics = new Struct({
      height: uint8,
      width: uint8,
      bearingX: int8,
      bearingY: int8,
      advance: uint8
    });
    EBDTComponent = new Struct({
      glyph: uint16,
      xOffset: int8,
      yOffset: int8
    });
    ByteAligned = class {
    };
    BitAligned = class {
    };
    glyph = new VersionedStruct("version", {
      1: {
        metrics: SmallMetrics,
        data: ByteAligned
      },
      2: {
        metrics: SmallMetrics,
        data: BitAligned
      },
      // format 3 is deprecated
      // format 4 is not supported by Microsoft
      5: {
        data: BitAligned
      },
      6: {
        metrics: BigMetrics,
        data: ByteAligned
      },
      7: {
        metrics: BigMetrics,
        data: BitAligned
      },
      8: {
        metrics: SmallMetrics,
        pad: new Reserved(uint8),
        numComponents: uint16,
        components: new ArrayT(EBDTComponent, "numComponents")
      },
      9: {
        metrics: BigMetrics,
        pad: new Reserved(uint8),
        numComponents: uint16,
        components: new ArrayT(EBDTComponent, "numComponents")
      },
      17: {
        metrics: SmallMetrics,
        dataLen: uint32,
        data: new BufferT("dataLen")
      },
      18: {
        metrics: BigMetrics,
        dataLen: uint32,
        data: new BufferT("dataLen")
      },
      19: {
        dataLen: uint32,
        data: new BufferT("dataLen")
      }
    });
  }
});

export {
  BigMetrics,
  SmallMetrics,
  glyph,
  init_EBDT
};
