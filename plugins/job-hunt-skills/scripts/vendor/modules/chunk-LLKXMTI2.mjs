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
  uint16,
  uint32
} from "./chunk-TXWX2CMZ.mjs";
import {
  __esm
} from "./chunk-FDWSCWK2.mjs";

// node_modules/fontkit/src/tables/DSIG.js
var Signature, SignatureBlock, DSIG_default;
var init_DSIG = __esm({
  "node_modules/fontkit/src/tables/DSIG.js"() {
    init_restructure();
    Signature = new Struct({
      format: uint32,
      length: uint32,
      offset: uint32
    });
    SignatureBlock = new Struct({
      reserved: new Reserved(uint16, 2),
      cbSignature: uint32,
      // Length (in bytes) of the PKCS#7 packet in pbSignature
      signature: new BufferT("cbSignature")
    });
    DSIG_default = new Struct({
      ulVersion: uint32,
      // Version number of the DSIG table (0x00000001)
      usNumSigs: uint16,
      // Number of signatures in the table
      usFlag: uint16,
      // Permission flags
      signatures: new ArrayT(Signature, "usNumSigs"),
      signatureBlocks: new ArrayT(SignatureBlock, "usNumSigs")
    });
  }
});

export {
  DSIG_default,
  init_DSIG
};
